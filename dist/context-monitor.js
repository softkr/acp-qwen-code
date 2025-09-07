/**
 * Context monitoring and token management for conversations
 */
import { EventEmitter } from 'events';
const DEFAULT_CONFIG = {
    maxTokens: 200000, // 200k token limit
    warnAtPercentage: 80,
    criticalAtPercentage: 95,
    estimatedTokensPerChar: 0.4, // Rough estimate for English text
};
/** Monitor and manage conversation context/tokens */
export class ContextMonitor extends EventEmitter {
    config;
    contextWindows = new Map();
    constructor(config = {}) {
        super();
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /** Create a new context window for a session */
    createContextWindow(sessionId) {
        const window = {
            maxTokens: this.config.maxTokens,
            currentTokens: 0,
            messages: [],
            toolCalls: [],
        };
        this.contextWindows.set(sessionId, window);
        return window;
    }
    /** Get a context window for a session */
    getContextWindow(sessionId) {
        return this.contextWindows.get(sessionId);
    }
    /** Update context window with new messages */
    updateContext(sessionId, messages) {
        const window = this.getContextWindow(sessionId);
        if (!window) {
            throw new Error(`No context window found for session ${sessionId}`);
        }
        // Reset token count
        let totalTokens = 0;
        // Add messages and estimate tokens
        for (const message of messages) {
            totalTokens += this.estimateTokens(message);
        }
        // Update window
        window.messages = messages;
        window.currentTokens = totalTokens;
        // Emit update event
        this.emit('contextUpdate', totalTokens, window.maxTokens);
        // Check warning thresholds
        this.checkThresholds(sessionId, totalTokens);
    }
    /** Add a single message to the context */
    addMessage(sessionId, message) {
        const window = this.getContextWindow(sessionId);
        if (!window) {
            throw new Error(`No context window found for session ${sessionId}`);
        }
        // Add message
        window.messages.push(message);
        // Update token count
        const totalTokens = window.currentTokens + this.estimateTokens(message);
        window.currentTokens = totalTokens;
        // Emit update event
        this.emit('contextUpdate', totalTokens, window.maxTokens);
        // Check warning thresholds
        this.checkThresholds(sessionId, totalTokens);
    }
    /** Get percentage of token limit used */
    getTokenPercentage(sessionId) {
        const window = this.getContextWindow(sessionId);
        if (!window) {
            return 0;
        }
        return (window.currentTokens / window.maxTokens) * 100;
    }
    /** Check if context is near limits */
    checkThresholds(sessionId, totalTokens) {
        const window = this.getContextWindow(sessionId);
        if (!window)
            return;
        const percentage = (totalTokens / window.maxTokens) * 100;
        if (percentage >= this.config.criticalAtPercentage) {
            this.emit('contextCritical', 'Context window critically full - cleanup required', totalTokens, window.maxTokens);
        }
        else if (percentage >= this.config.warnAtPercentage) {
            this.emit('contextWarning', 'Context window filling up - consider cleanup', totalTokens, window.maxTokens);
        }
    }
    /** Clean up old messages to reduce context size */
    cleanupContext(sessionId, targetPercentage = 50) {
        const window = this.getContextWindow(sessionId);
        if (!window)
            return;
        const targetTokens = Math.floor((window.maxTokens * targetPercentage) / 100);
        let currentTokens = window.currentTokens;
        // Remove oldest messages until we're under target
        while (currentTokens > targetTokens && window.messages.length > 0) {
            const message = window.messages.shift();
            if (message) {
                currentTokens -= this.estimateTokens(message);
            }
        }
        // Update window
        window.currentTokens = currentTokens;
        this.emit('contextUpdate', currentTokens, window.maxTokens);
    }
    /** Remove a context window */
    removeContextWindow(sessionId) {
        this.contextWindows.delete(sessionId);
    }
    /** Roughly estimate tokens for a message */
    estimateTokens(message) {
        let total = 0;
        // Count message content
        total += Math.ceil(message.content.length * this.config.estimatedTokensPerChar);
        // Count tool calls if any
        if (message.toolCalls) {
            for (const call of message.toolCalls) {
                total += Math.ceil(call.name.length * this.config.estimatedTokensPerChar);
                total += Math.ceil(JSON.stringify(call.arguments).length * this.config.estimatedTokensPerChar);
                if (call.result) {
                    total += Math.ceil(call.result.length * this.config.estimatedTokensPerChar);
                }
            }
        }
        // Add overhead for message structure
        total += 4; // Rough overhead per message
        return total;
    }
}
//# sourceMappingURL=context-monitor.js.map