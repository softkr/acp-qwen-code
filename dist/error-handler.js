/**
 * Centralized error handling (minimal) compatible with agent usage
 */
import { createLogger } from './logger.js';
export class ACPError extends Error {
    code;
    context;
    isRecoverable;
    constructor(message, code = 'UNKNOWN_ERROR', context = {}, isRecoverable = false) {
        super(message);
        this.name = 'ACPError';
        this.code = code;
        this.context = context;
        this.isRecoverable = isRecoverable;
    }
}
class ErrorHandler {
    logger = createLogger('ErrorHandler');
    constructor() {
        process.on('unhandledRejection', (reason, promise) => {
            const err = reason instanceof Error ? reason : new Error(String(reason));
            this.logger.error('Unhandled rejection', { reason: err.message, promise: String(promise) });
        });
        process.on('uncaughtException', (error) => {
            this.logger.error('Uncaught exception', { error: error.message, stack: error.stack });
        });
    }
    handle(error, context = {}) {
        const acpError = error instanceof ACPError ? error : new ACPError(error.message, 'WRAPPED_ERROR', context);
        this.logger.error(acpError.message, { code: acpError.code, context: acpError.context, stack: acpError.stack });
        return acpError;
    }
}
let globalHandler = null;
export function getGlobalErrorHandler() {
    if (!globalHandler)
        globalHandler = new ErrorHandler();
    return globalHandler;
}
//# sourceMappingURL=error-handler.js.map