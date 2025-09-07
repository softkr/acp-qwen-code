/**
 * Structured logging with different verbosity levels
 */

import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';

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

/** Default logger configuration */
const DEFAULT_CONFIG: Required<LoggerConfig> = {
  level: process.env.ACP_DEBUG === 'true' ? 'debug' : 'info',
  file: process.env.ACP_LOG_FILE || '',
  maxBufferSize: 1000,
  prettyPrint: true,
};

/** Log level priorities */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Structured logger with buffer and file output support
 */
export class Logger {
  private readonly config: Required<LoggerConfig>;
  private readonly component: string;
  private readonly buffer: LogEntry[] = [];
  private fileStream: Writable | null = null;

  constructor(component: string, config: LoggerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.component = component;

    // Initialize file stream if path provided
    if (this.config.file) {
      const dir = path.dirname(this.config.file);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      this.fileStream = fs.createWriteStream(this.config.file, { flags: 'a' });
    }

    // Write startup message
    this.info('Logger initialized', {
      level: this.config.level,
      file: this.config.file || 'none',
      maxBufferSize: this.config.maxBufferSize,
    });
  }

  /**
   * Write startup message
   */
  writeStartupMessage(): void {
    this.info('=== ACP Bridge Log Start ===');
    this.info('Debug mode:', { enabled: process.env.ACP_DEBUG === 'true' });
    this.info('Log level:', { level: this.config.level });
    this.info('Log file:', { path: this.config.file || 'none' });
    this.info('========================');
  }

  /** Log debug message */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  /** Log info message */
  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  /** Log warning message */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  /** Log error message */
  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }

  /**
   * Write log entry
   */
  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    // Check if level should be logged
    if (LOG_LEVELS[level] < LOG_LEVELS[this.config.level]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      data,
    };

    // Add to buffer with size limit
    this.buffer.push(entry);
    if (this.buffer.length > this.config.maxBufferSize) {
      this.buffer.shift();
    }

    // Write to console
    this.writeToConsole(entry);

    // Write to file if configured
    if (this.fileStream) {
      this.writeToFile(entry);
    }
  }

  /**
   * Write entry to console with color
   */
  private writeToConsole(entry: LogEntry): void {
    const color = this.getColorForLevel(entry.level);
    const reset = '\x1b[0m';

    let line: string;
    if (this.config.prettyPrint) {
      line = `[${entry.timestamp}] ${color}${entry.level.toUpperCase()}${reset} [${entry.component}] ${entry.message}`;
      if (entry.data) {
        line += '\\n' + JSON.stringify(entry.data, null, 2);
      }
    } else {
      line = JSON.stringify({
        ...entry,
        data: entry.data || {},
      });
    }

    // Log to appropriate console method
    const method = entry.level === 'error' ? 'error' : 'log';
    console[method](line);
  }

  /**
   * Write entry to file
   */
  private writeToFile(entry: LogEntry): void {
    if (!this.fileStream) return;

    const line = JSON.stringify({
      ...entry,
      data: entry.data || {},
    }) + '\\n';

    this.fileStream.write(line, 'utf8');
  }

  /**
   * Get ANSI color code for log level
   */
  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return '\x1b[90m'; // Gray
      case 'info':
        return '\x1b[32m'; // Green
      case 'warn':
        return '\x1b[33m'; // Yellow
      case 'error':
        return '\x1b[31m'; // Red
      default:
        return '\x1b[0m'; // Reset
    }
  }

  /**
   * Get buffered log entries
   */
  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.buffer.length = 0;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.fileStream) {
      this.fileStream.end();
    }
  }
}

/** Create logger instance */
export function createLogger(component: string, config: LoggerConfig = {}): Logger {
  return new Logger(component, config);
}
