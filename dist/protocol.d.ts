/**
 * Protocol definitions and interfaces for ACP implementation (aligned with Zed ACP)
 */
import * as schema from './schema.js';
/** Base interface for ACP client */
export interface Client {
    sessionUpdate(params: schema.SessionNotification): Promise<void>;
    requestPermission(params: schema.RequestPermissionRequest): Promise<schema.RequestPermissionResponse>;
    readTextFile(params: schema.ReadTextFileRequest): Promise<schema.ReadTextFileResponse>;
    writeTextFile(params: schema.WriteTextFileRequest): Promise<schema.WriteTextFileResponse>;
}
/** Base interface for ACP agent */
export interface Agent {
    initialize(params: schema.InitializeRequest): Promise<schema.InitializeResponse>;
    authenticate(params: schema.AuthenticateRequest): Promise<void>;
    newSession(params: schema.NewSessionRequest): Promise<schema.NewSessionResponse>;
    loadSession?(params: schema.LoadSessionRequest): Promise<void>;
    prompt(params: schema.PromptRequest): Promise<void>;
    cancel(params: schema.CancelNotification): Promise<void>;
}
/** Base request error class */
export declare class RequestError extends Error {
    code: number;
    data?: {
        details?: string;
    };
    constructor(code: number, message: string, details?: string);
    static parseError(details?: string): RequestError;
    static invalidRequest(details?: string): RequestError;
    static methodNotFound(method?: string): RequestError;
    static invalidParams(details?: string): RequestError;
    static internalError(details?: string): RequestError;
    static authRequired(details?: string): RequestError;
}
/** Async function for handling ACP requests */
type AsyncMethodHandler = (method: string, params: unknown) => Promise<unknown>;
/** JSON-RPC error response type */
export type ErrorResponse = {
    code: number;
    message: string;
    data?: unknown;
};
/** Class for handling ACP protocol connections */
export declare class Connection {
    #private;
    constructor(handler: AsyncMethodHandler, peerInput: WritableStream<Uint8Array>, peerOutput: ReadableStream<Uint8Array>);
    /** Send a request to the peer */
    sendRequest<T>(method: string, params?: unknown): Promise<T>;
    /** Send a notification to the peer */
    sendNotification(method: string, params?: unknown): Promise<void>;
}
/** Class for handling the agent side of the ACP protocol */
export declare class AgentSideConnection {
    #private;
    constructor(toAgent: (client: Client) => Agent, input: WritableStream<Uint8Array>, output: ReadableStream<Uint8Array>);
    /** Stream content updates back to the client */
    sessionUpdate(params: schema.SessionNotification): Promise<void>;
    /** Request permissions from the client */
    requestPermission(params: schema.RequestPermissionRequest): Promise<schema.RequestPermissionResponse>;
    /** Read text file from the client */
    readTextFile(params: schema.ReadTextFileRequest): Promise<schema.ReadTextFileResponse>;
    /** Write text file via the client */
    writeTextFile(params: schema.WriteTextFileRequest): Promise<schema.WriteTextFileResponse>;
}
export {};
//# sourceMappingURL=protocol.d.ts.map