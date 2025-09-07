/**
 * Qwen ACP Agent implementation
 */

import { randomUUID } from 'crypto';
import type { Client } from './protocol.js';
import * as schema from './schema.js';
import { QwenCliWrapper } from './cli-wrapper.js';
import { createLogger } from './logger.js';
import { ContextMonitor } from './context-monitor.js';
import { RequestError } from './protocol.js';
import { getGlobalErrorHandler } from './error-handler.js';
import { getGlobalPerformanceMonitor } from './performance-monitor.js';

export interface AgentSession {
  id: string;
  cliWrapper: QwenCliWrapper;
  contextMonitor: ContextMonitor;
  permissionMode: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
  // Enhanced ACP features
  currentPlan?: {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    error?: string;
  }[];
  activeFiles?: Set<string>;
  thoughtStreaming?: boolean;
  createdAt: number;
  lastActivityAt: number;
  turnCount: number;
  operationContext?: Map<string, {
    toolName: string;
    operationType: 'read' | 'write' | 'execute' | 'search' | 'other';
    affectedFiles?: string[];
    complexity: 'simple' | 'moderate' | 'complex';
  }>;
  mcpServers?: schema.McpServer[];
}

interface AgentConfig {
  debug?: boolean;
  configPath?: string;
}

export class QwenAgent {
  private sessions: Map<string, AgentSession> = new Map();
  private logger = createLogger('QwenAgent');
  private config: AgentConfig;

  // Enhanced ACP capabilities
  private readonly enhancedCapabilities = {
    audio: false,
    embeddedContext: true,
    image: true,
    plans: true,
    thoughtStreaming: true,
  };

  // Performance constants
  private static readonly PROMPT_COMPLEXITY_THRESHOLD = 200;
  private static readonly MAX_ACTIVE_FILES_PER_SESSION = 100;
  private static readonly PLAN_UPDATE_DEBOUNCE = 500; // ms
  private static readonly THOUGHT_STREAM_ENABLED = true;

  constructor(
    private client: Client,
    config: AgentConfig = {},
  ) {
    this.config = config;

    // Initialize global handlers
    getGlobalErrorHandler();
    getGlobalPerformanceMonitor();

    // Log startup configuration
    this.logStartupConfiguration();
  }

  /**
   * Log startup configuration
   */
  private logStartupConfiguration(): void {
    this.logger.info('=== Qwen ACP Bridge Configuration ===');
    this.logger.info(`Permission Mode: ${process.env.ACP_PERMISSION_MODE || 'default'}`);
    this.logger.info(`Debug Mode: ${this.config.debug ? 'enabled' : 'disabled'}`);
    this.logger.info(`Context Monitoring: active (200k token limit)`);
    this.logger.info('=====================================');
  }

  /**
   * Initialize agent
   */
  async initialize(params: schema.InitializeRequest): Promise<schema.InitializeResponse> {
    this.logger.info('Initializing agent', params);

    // Check Qwen CLI setup
    const cli = new QwenCliWrapper();
    const isSetup = await cli.checkSetup();
    if (!isSetup) {
      throw RequestError.authRequired('Qwen CLI not found or not properly set up');
    }

    return {
      protocolVersion: schema.PROTOCOL_VERSION,
      authMethods: [
        {
          id: 'browser',
          name: 'Authenticate with Browser',
          description: 'Uses browser-based authentication for Qwen CLI',
        },
      ],
      agentCapabilities: {
        loadSession: false,
        promptCapabilities: {
          audio: false,
          image: false,
          embeddedContext: true,
        },
      },
    };
  }

  /**
   * Authenticate with Qwen
   */
  async authenticate(params: schema.AuthenticateRequest): Promise<void> {
    this.logger.info('Authenticating', params);

    if (params.methodId !== 'browser') {
      throw RequestError.invalidParams('Only browser authentication is supported');
    }

    // We don't need to do anything here since CLI handles auth
    return;
  }

  /**
   * Create new session
   */
  async newSession(params: schema.NewSessionRequest): Promise<schema.NewSessionResponse> {
    this.logger.info('Creating new session', params);

    const sessionId = randomUUID();
    const cli = new QwenCliWrapper({
      env: {
        PWD: params.cwd,
      },
    });

    // Start chat session
    await cli.startChat();

    // Handle chat output
    cli.on('message', (content: string) => {
      this.handleChatOutput(sessionId, content);
    });

    cli.on('error', (error: Error) => {
      this.handleChatError(sessionId, error);
    });

    // Create session
    const session: AgentSession = {
      id: sessionId,
      cliWrapper: cli,
      contextMonitor: new ContextMonitor(),
      permissionMode: process.env.ACP_PERMISSION_MODE as any || 'default',
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      turnCount: 0,
    };

    // Initialize context window for this session
    session.contextMonitor.createContextWindow(sessionId);

    this.sessions.set(sessionId, session);

    return { sessionId };
  }

  /**
   * Process prompt
   */
  async prompt(params: schema.PromptRequest): Promise<void> {
    this.logger.info('Processing prompt', { sessionId: params.sessionId });

    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }

    // Update session state
    session.lastActivityAt = Date.now();
    session.turnCount++;

    // Analyze prompt complexity
    // Convert content blocks to text (use text blocks only for now)
    const promptText = params.prompt
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n')
      .trim();
    const complexity = this.analyzePromptComplexity(promptText);

    // Stream user message chunk to client for visibility
    await this.client.sessionUpdate({
      sessionId: params.sessionId,
      update: {
        sessionUpdate: 'user_message_chunk',
        content: { type: 'text', text: promptText },
      },
    });

    // Send thought stream for complex operations
    if (session.thoughtStreaming && complexity.isComplex) {
      await this.sendAgentThought(params.sessionId, `Analyzing request: ${complexity.summary}`);
    }

    // Generate execution plan if needed
    if (complexity.needsPlan) {
      await this.generateAndSendPlan(params.sessionId, complexity);
    }

    try {
      // Send prompt to CLI
      await session.cliWrapper.sendMessage(promptText);
    } catch (error) {
      this.logger.error('Error processing prompt:', error);
      throw error;
    }
  }

  /**
   * Analyze prompt complexity
   */
  private analyzePromptComplexity(prompt: string): {
    isComplex: boolean;
    needsPlan: boolean;
    summary: string;
    estimatedSteps: number;
  } {
    const lowerPrompt = prompt.toLowerCase();
    
    // Complex operation indicators
    const complexKeywords = ['implement', 'create', 'build', 'refactor', 'restructure', 'migrate', 'optimize'];
    const multiStepIndicators = ['first', 'then', 'next', 'after', 'finally', 'step', 'phase'];
    
    const hasComplexKeywords = complexKeywords.some(kw => lowerPrompt.includes(kw));
    const hasMultiStepIndicators = multiStepIndicators.some(ind => lowerPrompt.includes(ind));
    const isLongPrompt = prompt.length > QwenAgent.PROMPT_COMPLEXITY_THRESHOLD;
    
    const isComplex = hasComplexKeywords || hasMultiStepIndicators || isLongPrompt;
    const needsPlan = isComplex && (
      hasMultiStepIndicators || 
      isLongPrompt || 
      complexKeywords.filter(kw => lowerPrompt.includes(kw)).length > 1
    );
    
    let estimatedSteps = 1;
    if (hasMultiStepIndicators) estimatedSteps += 2;
    if (hasComplexKeywords) estimatedSteps += 1;
    if (isLongPrompt) estimatedSteps += 1;
    
    const summary = this.generatePromptSummary(prompt, isComplex);
    
    return { isComplex, needsPlan, summary, estimatedSteps };
  }

  /**
   * Generate prompt summary
   */
  private generatePromptSummary(prompt: string, isComplex: boolean): string {
    if (!isComplex) return "Processing simple request";
    
    const words = prompt.split(/\s+/);
    if (words.length <= 15) return prompt;
    
    const firstSentence = prompt.split(/[.!?]/)[0];
    return firstSentence.length <= 100 ? firstSentence : firstSentence.substring(0, 97) + '...';
  }

  /**
   * Generate and send execution plan
   */
  private async generateAndSendPlan(
    sessionId: string, 
    complexity: { summary: string; estimatedSteps: number }
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const plan = [];
    
    if (complexity.estimatedSteps >= 3) {
      plan.push({
        title: "Analyze requirements and approach",
        description: complexity.summary,
        status: "in_progress"
      });
      plan.push({
        title: "Execute main implementation",
        description: "Process and execute the required changes",
        status: "pending"
      });
      plan.push({
        title: "Validate and finalize changes",
        description: "Verify and complete the implementation",
        status: "pending"
      });
    } else {
      plan.push({
        title: complexity.summary,
        description: "Process the request",
        status: "in_progress"
      });
    }
    
    session.currentPlan = plan;
    await this.sendPlanUpdate(sessionId, plan);
  }

  /**
   * Send plan update to client
   */
  private async sendPlanUpdate(
    sessionId: string,
    entries: AgentSession['currentPlan']
  ): Promise<void> {
    if (!entries) return;

    await this.client.sessionUpdate({
      sessionId,
      update: {
        sessionUpdate: "plan",
        entries: entries.map(entry => ({
          content: `${entry.title}: ${entry.description}`,
          priority: 'medium',
          status: entry.status === 'failed' ? 'pending' : entry.status,
        }))
      }
    });
  }

  /**
   * Send agent thought
   */
  private async sendAgentThought(sessionId: string, thought: string): Promise<void> {
    await this.client.sessionUpdate({
      sessionId,
      update: {
        sessionUpdate: "agent_thought_chunk",
        content: { type: "text", text: thought }
      }
    });
  }

  /**
   * Cancel request
   */
  async cancel(params: schema.CancelNotification): Promise<void> {
    this.logger.info('Cancelling request', params);

    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }

    // End chat session
    await session.cliWrapper.endChat();
  }

  /**
   * Handle chat output
   */
  private async handleChatOutput(sessionId: string, content: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Update context
    session.contextMonitor.addMessage(sessionId, {
      role: 'assistant',
      content,
    });

    // Update plan status if needed
    if (session.currentPlan) {
      const completionIndicators = content.toLowerCase().match(
        /(completed|finished|done|ready|implemented|fixed)/g
      );
      if (completionIndicators && completionIndicators.length > 0) {
        await this.updatePlanProgress(sessionId);
      }
    }

    // Send update to client
    await this.client.sessionUpdate({
      sessionId,
      update: {
        sessionUpdate: "agent_message_chunk",
        content: { type: "text", text: content }
      }
    });
  }

  /**
   * Handle chat error
   */
  private async handleChatError(sessionId: string, error: Error): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Update plan if exists
    if (session.currentPlan) {
      const currentStep = session.currentPlan.find(step => step.status === 'in_progress');
      if (currentStep) {
        currentStep.status = 'failed';
        currentStep.error = error.message;
        await this.sendPlanUpdate(sessionId, session.currentPlan);
      }
    }

    // Send error as agent message chunk
    await this.client.sessionUpdate({
      sessionId,
      update: {
        sessionUpdate: "agent_message_chunk",
        content: { type: 'text', text: `[Error] ${error.message}` },
      },
    });
  }

  /**
   * Update plan progress based on completion
   */
  private async updatePlanProgress(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session?.currentPlan) return;

    // Find current in-progress step
    const currentStep = session.currentPlan.find(step => step.status === 'in_progress');
    if (currentStep) {
      // Mark current step as completed
      currentStep.status = 'completed';

      // Find next pending step
      const nextStep = session.currentPlan.find(step => step.status === 'pending');
      if (nextStep) {
        nextStep.status = 'in_progress';
      }

      // Send updated plan
      await this.sendPlanUpdate(sessionId, session.currentPlan);
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    for (const session of this.sessions.values()) {
      session.cliWrapper.destroy();
    }
    this.sessions.clear();
  }
}
