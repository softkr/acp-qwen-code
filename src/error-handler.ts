/**
 * Centralized error handling (minimal) compatible with agent usage
 */

import { createLogger } from './logger.js';

export interface ErrorContext {
  sessionId?: string;
  operation?: string;
  metadata?: Record<string, unknown>;
}

export class ACPError extends Error {
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly isRecoverable: boolean;

  constructor(message: string, code = 'UNKNOWN_ERROR', context: ErrorContext = {}, isRecoverable = false) {
    super(message);
    this.name = 'ACPError';
    this.code = code;
    this.context = context;
    this.isRecoverable = isRecoverable;
  }
}

class ErrorHandler {
  private logger = createLogger('ErrorHandler');

  constructor() {
    process.on('unhandledRejection', (reason, promise) => {
      const err = reason instanceof Error ? reason : new Error(String(reason));
      this.logger.error('Unhandled rejection', { reason: err.message, promise: String(promise) });
    });
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    });
  }

  handle(error: Error | ACPError, context: ErrorContext = {}): ACPError {
    const acpError = error instanceof ACPError ? error : new ACPError(error.message, 'WRAPPED_ERROR', context);
    this.logger.error(acpError.message, { code: acpError.code, context: acpError.context, stack: acpError.stack });
    return acpError;
  }
}

let globalHandler: ErrorHandler | null = null;

export function getGlobalErrorHandler(): ErrorHandler {
  if (!globalHandler) globalHandler = new ErrorHandler();
  return globalHandler;
}

