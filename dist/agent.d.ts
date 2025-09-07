/**
 * Qwen ACP Agent implementation
 */
import type { Client } from './protocol.js';
import * as schema from './schema.js';
import { QwenCliWrapper } from './cli-wrapper.js';
import { ContextMonitor } from './context-monitor.js';
export interface AgentSession {
    id: string;
    cliWrapper: QwenCliWrapper;
    contextMonitor: ContextMonitor;
    permissionMode: 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
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
export declare class QwenAgent {
    private client;
    private sessions;
    private logger;
    private config;
    private readonly enhancedCapabilities;
    private static readonly PROMPT_COMPLEXITY_THRESHOLD;
    private static readonly MAX_ACTIVE_FILES_PER_SESSION;
    private static readonly PLAN_UPDATE_DEBOUNCE;
    private static readonly THOUGHT_STREAM_ENABLED;
    constructor(client: Client, config?: AgentConfig);
    /**
     * Log startup configuration
     */
    private logStartupConfiguration;
    /**
     * Initialize agent
     */
    initialize(params: schema.InitializeRequest): Promise<schema.InitializeResponse>;
    /**
     * Authenticate with Qwen
     */
    authenticate(params: schema.AuthenticateRequest): Promise<void>;
    /**
     * Create new session
     */
    newSession(params: schema.NewSessionRequest): Promise<schema.NewSessionResponse>;
    /**
     * Process prompt
     */
    prompt(params: schema.PromptRequest): Promise<schema.PromptResponse>;
    /**
     * Analyze prompt complexity
     */
    private analyzePromptComplexity;
    /**
     * Generate prompt summary
     */
    private generatePromptSummary;
    /**
     * Generate and send execution plan
     */
    private generateAndSendPlan;
    /**
     * Send plan update to client
     */
    private sendPlanUpdate;
    /**
     * Send agent thought
     */
    private sendAgentThought;
    /**
     * Cancel request
     */
    cancel(params: schema.CancelNotification): Promise<void>;
    /**
     * Handle chat output
     */
    private handleChatOutput;
    /**
     * Handle chat error
     */
    private handleChatError;
    /**
     * Update plan progress based on completion
     */
    private updatePlanProgress;
    /**
     * Clean up resources
     */
    destroy(): void;
}
export {};
//# sourceMappingURL=agent.d.ts.map