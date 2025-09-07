/**
 * Structured logging with different verbosity levels
 */
/** Log level type */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/** Log entry format */
interface LogEntry {
    timestamp: string;
    level: LogLevel;
    component: string;
    message: string;
    data?: Record<string, unknown>;
}
/** Logger configuration */
interface LoggerConfig {
    level?: LogLevel;
    file?: string;
    maxBufferSize?: number;
    prettyPrint?: boolean;
}
/**
 * Structured logger with buffer and file output support
 */
export declare class Logger {
    private readonly config;
    private readonly component;
    private readonly buffer;
    private fileStream;
    constructor(component: string, config?: LoggerConfig);
    /**
     * Write startup message
     */
    writeStartupMessage(): void;
    /** Log debug message */
    debug(message: string, data?: Record<string, unknown>): void;
    /** Log info message */
    info(message: string, data?: Record<string, unknown>): void;
    /** Log warning message */
    warn(message: string, data?: Record<string, unknown>): void;
    /** Log error message */
    error(message: string, data?: Record<string, unknown>): void;
    /**
     * Write log entry
     */
    private log;
    /**
     * Write entry to console with color
     */
    private writeToConsole;
    /**
     * Write entry to file
     */
    private writeToFile;
    /**
     * Get ANSI color code for log level
     */
    private getColorForLevel;
    /**
     * Get buffered log entries
     */
    getBuffer(): LogEntry[];
    /**
     * Clear log buffer
     */
    clearBuffer(): void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/** Create logger instance */
export declare function createLogger(component: string, config?: LoggerConfig): Logger;
export {};
//# sourceMappingURL=logger.d.ts.map