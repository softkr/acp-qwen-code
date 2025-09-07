/**
 * Protocol definitions and interfaces for ACP implementation (aligned with Zed ACP)
 */
import { z } from 'zod';
import * as schema from './schema.js';
/** Base request error class */
export class RequestError extends Error {
    code;
    data;
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.name = 'RequestError';
        if (details) {
            this.data = { details };
        }
    }
    static parseError(details) {
        return new RequestError(-32700, 'Parse error', details);
    }
    static invalidRequest(details) {
        return new RequestError(-32600, 'Invalid request', details);
    }
    static methodNotFound(method) {
        return new RequestError(-32601, `Method not found: ${method || 'unknown'}`, method);
    }
    static invalidParams(details) {
        return new RequestError(-32602, 'Invalid params', details);
    }
    static internalError(details) {
        return new RequestError(-32603, 'Internal error', details);
    }
    static authRequired(details) {
        return new RequestError(-32000, 'Authentication required', details);
    }
}
/** Class for handling ACP protocol connections */
export class Connection {
    #pendingResponses = new Map();
    #nextRequestId = 0;
    #handler;
    #peerInput;
    #writeQueue = Promise.resolve();
    #textEncoder;
    constructor(handler, peerInput, peerOutput) {
        this.#handler = handler;
        this.#peerInput = peerInput;
        this.#textEncoder = new TextEncoder();
        this.#receive(peerOutput);
    }
    /** Process incoming messages */
    async #receive(output) {
        let content = '';
        const decoder = new TextDecoder();
        for await (const chunk of output) {
            content += decoder.decode(chunk, { stream: true });
            const lines = content.split('\\n');
            content = lines.pop() || '';
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    const message = JSON.parse(trimmedLine);
                    await this.#processMessage(message);
                }
            }
        }
    }
    /** Process a single message */
    async #processMessage(message) {
        try {
            if ('method' in message && 'id' in message) {
                // Handle request
                const response = await this.#tryCallHandler(message.method, message.params);
                await this.#sendMessage({
                    jsonrpc: '2.0',
                    id: message.id,
                    ...response,
                });
            }
            else if ('id' in message) {
                // Handle response
                const pendingResponse = this.#pendingResponses.get(message.id);
                if (pendingResponse) {
                    this.#pendingResponses.delete(message.id);
                    if ('error' in message) {
                        pendingResponse.reject(message.error);
                    }
                    else {
                        pendingResponse.resolve(message.result);
                    }
                }
            }
            else if ('method' in message) {
                // Handle notification
                await this.#tryCallHandler(message.method, message.params);
            }
        }
        catch (error) {
            console.error('[Protocol] Error processing message:', error);
            // Don't re-throw - we want to continue processing messages
        }
    }
    /** Try to call the handler with error handling */
    async #tryCallHandler(method, params) {
        try {
            const result = await this.#handler(method, params);
            return { result };
        }
        catch (error) {
            if (error instanceof RequestError) {
                return {
                    error: {
                        code: error.code,
                        message: error.message,
                        data: error.data,
                    },
                };
            }
            if (error instanceof z.ZodError) {
                return {
                    error: {
                        code: -32602,
                        message: 'Invalid params',
                        data: error.format(),
                    },
                };
            }
            console.error('[Protocol] Unhandled error:', error);
            return {
                error: {
                    code: -32603,
                    message: error instanceof Error ? error.message : String(error),
                },
            };
        }
    }
    /** Send a message to the peer */
    async #sendMessage(message) {
        const line = JSON.stringify(message) + '\\n';
        const chunk = this.#textEncoder.encode(line);
        this.#writeQueue = this.#writeQueue.then(async () => {
            const writer = this.#peerInput.getWriter();
            try {
                await writer.write(chunk);
            }
            finally {
                writer.releaseLock();
            }
        });
        await this.#writeQueue;
    }
    /** Send a request to the peer */
    async sendRequest(method, params) {
        const id = this.#nextRequestId++;
        const message = {
            jsonrpc: '2.0',
            id,
            method,
            params,
        };
        return new Promise((resolve, reject) => {
            this.#pendingResponses.set(id, { resolve, reject });
            this.#sendMessage(message).catch(reject);
        });
    }
    /** Send a notification to the peer */
    async sendNotification(method, params) {
        const message = {
            jsonrpc: '2.0',
            method,
            params,
        };
        await this.#sendMessage(message);
    }
}
/** Class for handling the agent side of the ACP protocol */
export class AgentSideConnection {
    constructor(toAgent, input, output) {
        const agent = toAgent(this);
        const handler = async (method, params) => {
            switch (method) {
                case schema.AGENT_METHODS.initialize: {
                    const validatedParams = schema.initializeRequestSchema.parse(params);
                    return agent.initialize(validatedParams);
                }
                case schema.AGENT_METHODS.session_new: {
                    const validatedParams = schema.newSessionRequestSchema.parse(params);
                    return agent.newSession(validatedParams);
                }
                case schema.AGENT_METHODS.session_load: {
                    if (!agent.loadSession) {
                        throw RequestError.methodNotFound();
                    }
                    const validatedParams = schema.loadSessionRequestSchema.parse(params);
                    return agent.loadSession(validatedParams);
                }
                case schema.AGENT_METHODS.authenticate: {
                    const validatedParams = schema.authenticateRequestSchema.parse(params);
                    return agent.authenticate(validatedParams);
                }
                case schema.AGENT_METHODS.session_prompt: {
                    const validatedParams = schema.promptRequestSchema.parse(params);
                    return agent.prompt(validatedParams);
                }
                case schema.AGENT_METHODS.session_cancel: {
                    const validatedParams = schema.cancelNotificationSchema.parse(params);
                    return agent.cancel(validatedParams);
                }
                default:
                    throw RequestError.methodNotFound(method);
            }
        };
        this.#connection = new Connection(handler, input, output);
    }
    #connection;
    /** Stream content updates back to the client */
    async sessionUpdate(params) {
        await this.#connection.sendNotification(schema.CLIENT_METHODS.session_update, params);
    }
    /** Request permissions from the client */
    async requestPermission(params) {
        return await this.#connection.sendRequest(schema.CLIENT_METHODS.session_request_permission, params);
    }
    /** Read text file from the client */
    async readTextFile(params) {
        return await this.#connection.sendRequest(schema.CLIENT_METHODS.fs_read_text_file, params);
    }
    /** Write text file via the client */
    async writeTextFile(params) {
        return await this.#connection.sendRequest(schema.CLIENT_METHODS.fs_write_text_file, params);
    }
}
//# sourceMappingURL=protocol.js.map