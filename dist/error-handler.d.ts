/**
 * Centralized error handling (minimal) compatible with agent usage
 */
export interface ErrorContext {
    sessionId?: string;
    operation?: string;
    metadata?: Record<string, unknown>;
}
export declare class ACPError extends Error {
    readonly code: string;
    readonly context: ErrorContext;
    readonly isRecoverable: boolean;
    constructor(message: string, code?: string, context?: ErrorContext, isRecoverable?: boolean);
}
declare class ErrorHandler {
    private logger;
    constructor();
    handle(error: Error | ACPError, context?: ErrorContext): ACPError;
}
export declare function getGlobalErrorHandler(): ErrorHandler;
export {};
//# sourceMappingURL=error-handler.d.ts.map