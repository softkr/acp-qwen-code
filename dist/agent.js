/**
 * Qwen ACP Agent implementation
 */
import { randomUUID } from 'crypto';
import * as schema from './schema.js';
import { QwenCliWrapper } from './cli-wrapper.js';
import { createLogger } from './logger.js';
import { ContextMonitor } from './context-monitor.js';
import { RequestError } from './protocol.js';
import { getGlobalErrorHandler } from './error-handler.js';
import { getGlobalPerformanceMonitor } from './performance-monitor.js';
export class QwenAgent {
    client;
    sessions = new Map();
    logger = createLogger('QwenAgent');
    config;
    // Enhanced ACP capabilities
    enhancedCapabilities = {
        audio: false,
        embeddedContext: true,
        image: true,
        plans: true,
        thoughtStreaming: true,
    };
    // Performance constants
    static PROMPT_COMPLEXITY_THRESHOLD = 200;
    static MAX_ACTIVE_FILES_PER_SESSION = 100;
    static PLAN_UPDATE_DEBOUNCE = 500; // ms
    static THOUGHT_STREAM_ENABLED = true;
    constructor(client, config = {}) {
        this.client = client;
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
    logStartupConfiguration() {
        this.logger.info('=== Qwen ACP Bridge Configuration ===');
        this.logger.info(`Permission Mode: ${process.env.ACP_PERMISSION_MODE || 'default'}`);
        this.logger.info(`Debug Mode: ${this.config.debug ? 'enabled' : 'disabled'}`);
        this.logger.info(`Context Monitoring: active (200k token limit)`);
        this.logger.info('=====================================');
    }
    /**
     * Initialize agent
     */
    async initialize(params) {
        this.logger.info('Initializing agent', params);
        // Best-effort check of Qwen CLI, but never fail initialize handshake
        try {
            const cli = new QwenCliWrapper();
            const isSetup = await cli.checkSetup();
            if (!isSetup) {
                this.logger.warn('Qwen CLI not found or not authenticated; authentication may be required before starting a session');
            }
        }
        catch (e) {
            this.logger.warn('Failed to probe Qwen CLI during initialize');
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
    async authenticate(params) {
        this.logger.info('Authenticating', params);
        if (params.methodId !== 'browser') {
            throw RequestError.invalidParams('Only browser authentication is supported');
        }
        // Trigger Qwen CLI browser-based login
        const cli = new QwenCliWrapper();
        try {
            await cli.executeCommand(['auth', 'login']);
            this.logger.info('Qwen CLI authentication completed');
        }
        catch (error) {
            this.logger.error('Qwen CLI authentication failed', { error: String(error) });
            throw RequestError.authRequired('Authentication failed');
        }
    }
    /**
     * Create new session
     */
    async newSession(params) {
        this.logger.info('Creating new session', params);
        const sessionId = randomUUID();
        const cli = new QwenCliWrapper({
            env: {
                PWD: params.cwd,
            },
        });
        // Start chat session
        await cli.startChat();
        this.logger.info('Chat session started for session', { sessionId });
        // Handle chat output
        cli.on('message', (content) => {
            this.logger.debug('Received message from CLI', { sessionId, content: content.substring(0, 100) + '...' });
            this.handleChatOutput(sessionId, content);
        });
        cli.on('error', (error) => {
            this.logger.error('CLI error', { sessionId, error: error.message });
            this.handleChatError(sessionId, error);
        });
        cli.on('end', (code) => {
            this.logger.info('CLI process ended', { sessionId, code });
        });
        // Create session
        const session = {
            id: sessionId,
            cliWrapper: cli,
            contextMonitor: new ContextMonitor(),
            permissionMode: process.env.ACP_PERMISSION_MODE || 'default',
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
    async prompt(params) {
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
            this.logger.info('Sending message to CLI', { sessionId: params.sessionId, message: promptText });
            await session.cliWrapper.sendMessage(promptText);
            this.logger.info('Message sent to CLI successfully', { sessionId: params.sessionId });
            // Return successful completion
            return { stopReason: 'end_turn' };
        }
        catch (error) {
            this.logger.error('Error processing prompt:', error);
            // Return error completion
            return { stopReason: 'cancelled' };
        }
    }
    /**
     * Analyze prompt complexity
     */
    analyzePromptComplexity(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        // Complex operation indicators
        const complexKeywords = ['implement', 'create', 'build', 'refactor', 'restructure', 'migrate', 'optimize'];
        const multiStepIndicators = ['first', 'then', 'next', 'after', 'finally', 'step', 'phase'];
        const hasComplexKeywords = complexKeywords.some(kw => lowerPrompt.includes(kw));
        const hasMultiStepIndicators = multiStepIndicators.some(ind => lowerPrompt.includes(ind));
        const isLongPrompt = prompt.length > QwenAgent.PROMPT_COMPLEXITY_THRESHOLD;
        const isComplex = hasComplexKeywords || hasMultiStepIndicators || isLongPrompt;
        const needsPlan = isComplex && (hasMultiStepIndicators ||
            isLongPrompt ||
            complexKeywords.filter(kw => lowerPrompt.includes(kw)).length > 1);
        let estimatedSteps = 1;
        if (hasMultiStepIndicators)
            estimatedSteps += 2;
        if (hasComplexKeywords)
            estimatedSteps += 1;
        if (isLongPrompt)
            estimatedSteps += 1;
        const summary = this.generatePromptSummary(prompt, isComplex);
        return { isComplex, needsPlan, summary, estimatedSteps };
    }
    /**
     * Generate prompt summary
     */
    generatePromptSummary(prompt, isComplex) {
        if (!isComplex)
            return "Processing simple request";
        const words = prompt.split(/\s+/);
        if (words.length <= 15)
            return prompt;
        const firstSentence = prompt.split(/[.!?]/)[0];
        return firstSentence.length <= 100 ? firstSentence : firstSentence.substring(0, 97) + '...';
    }
    /**
     * Generate and send execution plan
     */
    async generateAndSendPlan(sessionId, complexity) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
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
        }
        else {
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
    async sendPlanUpdate(sessionId, entries) {
        if (!entries)
            return;
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
    async sendAgentThought(sessionId, thought) {
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
    async cancel(params) {
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
    async handleChatOutput(sessionId, content) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        // Update context
        session.contextMonitor.addMessage(sessionId, {
            role: 'assistant',
            content,
        });
        // Update plan status if needed
        if (session.currentPlan) {
            const completionIndicators = content.toLowerCase().match(/(completed|finished|done|ready|implemented|fixed)/g);
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
    async handleChatError(sessionId, error) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
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
    async updatePlanProgress(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session?.currentPlan)
            return;
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
    destroy() {
        for (const session of this.sessions.values()) {
            session.cliWrapper.destroy();
        }
        this.sessions.clear();
    }
}
//# sourceMappingURL=agent.js.map