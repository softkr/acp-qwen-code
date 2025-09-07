/**
 * Context monitoring and token management for conversations
 */
import { EventEmitter } from 'events';
import { QwenMessage, ContextWindow } from './types.js';
/** Context monitoring configuration */
interface ContextMonitorConfig {
    maxTokens?: number;
    warnAtPercentage?: number;
    criticalAtPercentage?: number;
    estimatedTokensPerChar?: number;
}
/** Listener for context monitoring events */
export interface ContextMonitorListener {
    onContextUpdate?(currentTokens: number, maxTokens: number): void;
    onContextWarning?(message: string, currentTokens: number, maxTokens: number): void;
    onContextCritical?(message: string, currentTokens: number, maxTokens: number): void;
}
/** Monitor and manage conversation context/tokens */
export declare class ContextMonitor extends EventEmitter {
    private readonly config;
    private contextWindows;
    constructor(config?: ContextMonitorConfig);
    /** Create a new context window for a session */
    createContextWindow(sessionId: string): ContextWindow;
    /** Get a context window for a session */
    getContextWindow(sessionId: string): ContextWindow | undefined;
    /** Update context window with new messages */
    updateContext(sessionId: string, messages: QwenMessage[]): void;
    /** Add a single message to the context */
    addMessage(sessionId: string, message: QwenMessage): void;
    /** Get percentage of token limit used */
    getTokenPercentage(sessionId: string): number;
    /** Check if context is near limits */
    private checkThresholds;
    /** Clean up old messages to reduce context size */
    cleanupContext(sessionId: string, targetPercentage?: number): void;
    /** Remove a context window */
    removeContextWindow(sessionId: string): void;
    /** Roughly estimate tokens for a message */
    private estimateTokens;
}
export {};
//# sourceMappingURL=context-monitor.d.ts.map