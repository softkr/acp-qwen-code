/**
 * Wrapper for Qwen CLI integration
 */
import { EventEmitter } from 'events';
export interface QwenCliConfig {
    executable?: string;
    cliPath?: string;
    args?: string[];
    env?: Record<string, string>;
}
export declare class QwenCliWrapper extends EventEmitter {
    private config;
    private logger;
    private currentProcess;
    private responseBuffer;
    /**
     * Clean terminal output by removing ANSI codes and filtering unwanted content
     */
    private cleanOutput;
    constructor(config?: QwenCliConfig);
    /**
     * Execute Qwen CLI command
     */
    executeCommand(command: string[], options?: {
        timeout?: number;
        stdin?: string;
    }): Promise<{
        stdout: string;
        stderr: string;
    }>;
    /**
     * Start chat session
     */
    startChat(options?: {
        model?: string;
    }): Promise<void>;
    /**
     * Send message to chat session
     */
    sendMessage(message: string): Promise<void>;
    /**
     * End chat session
     */
    endChat(): Promise<void>;
    /**
     * Check if CLI is installed and authenticated
     */
    checkSetup(): Promise<boolean>;
    /**
     * Clean up resources
     */
    destroy(): void;
}
//# sourceMappingURL=cli-wrapper.d.ts.map