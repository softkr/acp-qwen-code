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

const DEFAULT_CONFIG: ContextMonitorConfig = {
  maxTokens: 200000, // 200k token limit
  warnAtPercentage: 80,
  criticalAtPercentage: 95,
  estimatedTokensPerChar: 0.4, // Rough estimate for English text
};

/** Monitor and manage conversation context/tokens */
export class ContextMonitor extends EventEmitter {
  private readonly config: Required<ContextMonitorConfig>;
  private contextWindows: Map<string, ContextWindow> = new Map();

  constructor(config: ContextMonitorConfig = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config } as Required<ContextMonitorConfig>;
  }

  /** Create a new context window for a session */
  createContextWindow(sessionId: string): ContextWindow {
    const window: ContextWindow = {
      maxTokens: this.config.maxTokens,
      currentTokens: 0,
      messages: [],
      toolCalls: [],
    };
    this.contextWindows.set(sessionId, window);
    return window;
  }

  /** Get a context window for a session */
  getContextWindow(sessionId: string): ContextWindow | undefined {
    return this.contextWindows.get(sessionId);
  }

  /** Update context window with new messages */
  updateContext(
    sessionId: string,
    messages: QwenMessage[],
  ): void {
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
  addMessage(sessionId: string, message: QwenMessage): void {
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
  getTokenPercentage(sessionId: string): number {
    const window = this.getContextWindow(sessionId);
    if (!window) {
      return 0;
    }

    return (window.currentTokens / window.maxTokens) * 100;
  }

  /** Check if context is near limits */
  private checkThresholds(sessionId: string, totalTokens: number): void {
    const window = this.getContextWindow(sessionId);
    if (!window) return;

    const percentage = (totalTokens / window.maxTokens) * 100;

    if (percentage >= this.config.criticalAtPercentage) {
      this.emit('contextCritical', 
        'Context window critically full - cleanup required',
        totalTokens,
        window.maxTokens
      );
    } else if (percentage >= this.config.warnAtPercentage) {
      this.emit('contextWarning',
        'Context window filling up - consider cleanup',
        totalTokens,
        window.maxTokens
      );
    }
  }

  /** Clean up old messages to reduce context size */
  cleanupContext(sessionId: string, targetPercentage: number = 50): void {
    const window = this.getContextWindow(sessionId);
    if (!window) return;

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
  removeContextWindow(sessionId: string): void {
    this.contextWindows.delete(sessionId);
  }

  /** Roughly estimate tokens for a message */
  private estimateTokens(message: QwenMessage): number {
    let total = 0;

    // Count message content
    total += Math.ceil(
      message.content.length * this.config.estimatedTokensPerChar
    );

    // Count tool calls if any
    if (message.toolCalls) {
      for (const call of message.toolCalls) {
        total += Math.ceil(
          call.name.length * this.config.estimatedTokensPerChar
        );
        total += Math.ceil(
          JSON.stringify(call.arguments).length * this.config.estimatedTokensPerChar
        );
        if (call.result) {
          total += Math.ceil(
            call.result.length * this.config.estimatedTokensPerChar
          );
        }
      }
    }

    // Add overhead for message structure
    total += 4; // Rough overhead per message

    return total;
  }
}
