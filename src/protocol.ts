/**
 * Protocol definitions and interfaces for ACP implementation (aligned with Zed ACP)
 */

import { z } from 'zod';
import * as schema from './schema.js';

/** Base interface for ACP client */
export interface Client {
  sessionUpdate(params: schema.SessionNotification): Promise<void>;
  requestPermission(
    params: schema.RequestPermissionRequest,
  ): Promise<schema.RequestPermissionResponse>;
  readTextFile(
    params: schema.ReadTextFileRequest,
  ): Promise<schema.ReadTextFileResponse>;
  writeTextFile(
    params: schema.WriteTextFileRequest,
  ): Promise<schema.WriteTextFileResponse>;
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
export class RequestError extends Error {
  data?: { details?: string };

  constructor(
    public code: number,
    message: string,
    details?: string,
  ) {
    super(message);
    this.name = 'RequestError';
    if (details) {
      this.data = { details };
    }
  }

  static parseError(details?: string): RequestError {
    return new RequestError(-32700, 'Parse error', details);
  }

  static invalidRequest(details?: string): RequestError {
    return new RequestError(-32600, 'Invalid request', details);
  }

  static methodNotFound(method?: string): RequestError {
    return new RequestError(-32601, `Method not found: ${method || 'unknown'}`, method);
  }

  static invalidParams(details?: string): RequestError {
    return new RequestError(-32602, 'Invalid params', details);
  }

  static internalError(details?: string): RequestError {
    return new RequestError(-32603, 'Internal error', details);
  }

  static authRequired(details?: string): RequestError {
    return new RequestError(-32000, 'Authentication required', details);
  }
}

/** Async function for handling ACP requests */
type AsyncMethodHandler = (method: string, params: unknown) => Promise<unknown>;

/** JSON-RPC compatible message types */
type AnyMessage = AnyRequest | AnyResponse | AnyNotification;

type AnyRequest = {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: unknown;
};

type AnyResponse = {
  jsonrpc: '2.0';
  id: string | number;
} & Result<unknown>;

type AnyNotification = {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
};

/** JSON-RPC result type */
type Result<T> =
  | {
      result: T;
    }
  | {
      error: ErrorResponse;
    };

/** JSON-RPC error response type */
export type ErrorResponse = {
  code: number;
  message: string;
  data?: unknown;
};

/** Response for pending requests */
type PendingResponse<T = unknown> = {
  resolve: (response: T) => void;
  reject: (error: ErrorResponse) => void;
};

/** Class for handling ACP protocol connections */
export class Connection {
  #pendingResponses: Map<string | number, PendingResponse> = new Map();
  #nextRequestId: number = 0;
  #handler: AsyncMethodHandler;
  #peerInput: WritableStream<Uint8Array>;
  #writeQueue: Promise<void> = Promise.resolve();
  #textEncoder: TextEncoder;

  constructor(
    handler: AsyncMethodHandler,
    peerInput: WritableStream<Uint8Array>,
    peerOutput: ReadableStream<Uint8Array>,
  ) {
    this.#handler = handler;
    this.#peerInput = peerInput;
    this.#textEncoder = new TextEncoder();
    this.#receive(peerOutput);
  }

  /** Process incoming messages */
  async #receive(output: ReadableStream<Uint8Array>): Promise<void> {
    let content = '';
    const decoder = new TextDecoder();
    const reader = output.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          content += decoder.decode(value, { stream: true });
          const lines = content.split('\n');
          content = lines.pop() || '';
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            try {
              const message = JSON.parse(trimmedLine);
              await this.#processMessage(message);
            } catch (err) {
              console.error('[Protocol] Failed to parse message line:', trimmedLine, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('[Protocol] Receive loop error:', err);
    } finally {
      reader.releaseLock();
    }
  }

  /** Process a single message */
  async #processMessage(message: AnyMessage): Promise<void> {
    try {
      if ('method' in message && 'id' in message) {
        // Handle request
        const response = await this.#tryCallHandler(message.method, message.params);
        await this.#sendMessage({
          jsonrpc: '2.0',
          id: message.id,
          ...response,
        });
      } else if ('id' in message) {
        // Handle response
        const pendingResponse = this.#pendingResponses.get(message.id);
        if (pendingResponse) {
          this.#pendingResponses.delete(message.id);
          if ('error' in message) {
            pendingResponse.reject(message.error);
          } else {
            pendingResponse.resolve(message.result);
          }
        }
      } else if ('method' in message) {
        // Handle notification
        await this.#tryCallHandler(message.method, message.params);
      }
    } catch (error) {
      console.error('[Protocol] Error processing message:', error);
      // Don't re-throw - we want to continue processing messages
    }
  }

  /** Try to call the handler with error handling */
  async #tryCallHandler(
    method: string,
    params: unknown,
  ): Promise<Result<unknown>> {
    try {
      const result = await this.#handler(method, params);
      return { result };
    } catch (error) {
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
  async #sendMessage(message: AnyMessage): Promise<void> {
    const line = JSON.stringify(message) + '\\n';
    const chunk = this.#textEncoder.encode(line);

    this.#writeQueue = this.#writeQueue.then(async () => {
      const writer = this.#peerInput.getWriter();
      try {
        await writer.write(chunk);
      } finally {
        writer.releaseLock();
      }
    });

    await this.#writeQueue;
  }

  /** Send a request to the peer */
  async sendRequest<T>(method: string, params?: unknown): Promise<T> {
    const id = this.#nextRequestId++;
    const message: AnyRequest = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise<T>((resolve, reject) => {
      this.#pendingResponses.set(id, { 
        resolve: resolve as (response: unknown) => void, 
        reject 
      });
      this.#sendMessage(message).catch(reject);
    });
  }

  /** Send a notification to the peer */
  async sendNotification(method: string, params?: unknown): Promise<void> {
    const message: AnyNotification = {
      jsonrpc: '2.0',
      method,
      params,
    };
    await this.#sendMessage(message);
  }
}

/** Class for handling the agent side of the ACP protocol */
export class AgentSideConnection {
  constructor(
    toAgent: (client: Client) => Agent,
    input: WritableStream<Uint8Array>,
    output: ReadableStream<Uint8Array>,
  ) {
    const agent = toAgent(this);
    const handler = async (method: string, params: unknown): Promise<unknown> => {
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

  #connection: Connection;

  /** Stream content updates back to the client */
  async sessionUpdate(params: schema.SessionNotification): Promise<void> {
    await this.#connection.sendNotification(
      schema.CLIENT_METHODS.session_update,
      params,
    );
  }

  /** Request permissions from the client */
  async requestPermission(
    params: schema.RequestPermissionRequest,
  ): Promise<schema.RequestPermissionResponse> {
    return await this.#connection.sendRequest(
      schema.CLIENT_METHODS.session_request_permission,
      params,
    );
  }

  /** Read text file from the client */
  async readTextFile(
    params: schema.ReadTextFileRequest,
  ): Promise<schema.ReadTextFileResponse> {
    return await this.#connection.sendRequest(
      schema.CLIENT_METHODS.fs_read_text_file,
      params,
    );
  }

  /** Write text file via the client */
  async writeTextFile(
    params: schema.WriteTextFileRequest,
  ): Promise<schema.WriteTextFileResponse> {
    return await this.#connection.sendRequest(
      schema.CLIENT_METHODS.fs_write_text_file,
      params,
    );
  }
}
