/**
 * Qwen API client implementation
 */
import axios, { AxiosError } from 'axios';
import { RequestError } from './protocol.js';
/** Default configuration for Qwen API */
const DEFAULT_CONFIG = {
    apiBaseUrl: 'https://api.qwen.ai/v1',
    model: 'qwen-max',
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    maxRetries: 3,
    timeout: 30000,
};
export class QwenClient {
    config;
    client;
    abortController = null;
    constructor(config) {
        // Ensure API key is provided
        if (!config.apiKey) {
            throw new Error('API key is required');
        }
        // Merge with defaults
        this.config = {
            ...DEFAULT_CONFIG,
            ...config,
        };
        // Initialize HTTP client
        this.client = axios.create({
            baseURL: this.config.apiBaseUrl,
            timeout: this.config.timeout,
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Send a chat completion request to the Qwen API
     */
    async *chatCompletion(messages, functions) {
        // Create abort controller for cancellation
        this.abortController = new AbortController();
        try {
            const response = await this.client.post('/chat/completions', {
                model: this.config.model,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                })),
                functions: functions,
                stream: true,
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
                top_p: this.config.topP,
                presence_penalty: this.config.presencePenalty,
                frequency_penalty: this.config.frequencyPenalty,
            }, {
                signal: this.abortController.signal,
                responseType: 'stream',
            });
            const reader = response.data;
            const decoder = new TextDecoder();
            let buffer = '';
            for await (const chunk of reader) {
                buffer += decoder.decode(chunk, { stream: true });
                const lines = buffer.split('\\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine || trimmedLine === 'data: [DONE]')
                        continue;
                    try {
                        const data = JSON.parse(trimmedLine.replace(/^data: /, ''));
                        const response = data;
                        for (const choice of response.choices) {
                            if (choice.delta?.content || choice.delta?.function_call) {
                                yield {
                                    role: (choice.delta.role || 'assistant'),
                                    content: choice.delta.content || '',
                                    ...(choice.delta.function_call && {
                                        toolCalls: [{
                                                name: choice.delta.function_call.name,
                                                arguments: JSON.parse(choice.delta.function_call.arguments),
                                            }],
                                    }),
                                };
                            }
                        }
                    }
                    catch (error) {
                        console.error('Error parsing Qwen API response:', error);
                        throw RequestError.internalError('Failed to parse Qwen API response');
                    }
                }
            }
        }
        catch (error) {
            if (error instanceof AxiosError) {
                if (error.code === 'ERR_CANCELED') {
                    // Request was cancelled
                    return;
                }
                const status = error.response?.status;
                const data = error.response?.data;
                if (status === 401) {
                    throw RequestError.authRequired('Invalid API key or authentication failed');
                }
                else if (status === 429) {
                    throw RequestError.internalError('Rate limit exceeded. Please try again later.');
                }
                else if (status === 500) {
                    throw RequestError.internalError('Qwen API server error. Please try again later.');
                }
                throw RequestError.internalError(`Qwen API error: ${data?.error?.message || error.message}`);
            }
            throw RequestError.internalError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
        finally {
            this.abortController = null;
        }
    }
    /**
     * Cancel any ongoing request
     */
    cancel() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
    /**
     * Check if the client has valid authentication
     */
    async checkAuth() {
        try {
            await this.client.get('/models');
            return true;
        }
        catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                return false;
            }
            throw error;
        }
    }
}
//# sourceMappingURL=qwen-client.js.map