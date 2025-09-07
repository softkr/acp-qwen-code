/**
 * Qwen API client implementation
 */
import { QwenConfig, QwenMessage } from './types.js';
export declare class QwenClient {
    private readonly config;
    private readonly client;
    private abortController;
    constructor(config: Partial<QwenConfig>);
    /**
     * Send a chat completion request to the Qwen API
     */
    chatCompletion(messages: QwenMessage[], functions?: Record<string, unknown>[]): AsyncGenerator<QwenMessage, void, unknown>;
    /**
     * Cancel any ongoing request
     */
    cancel(): void;
    /**
     * Check if the client has valid authentication
     */
    checkAuth(): Promise<boolean>;
}
//# sourceMappingURL=qwen-client.d.ts.map