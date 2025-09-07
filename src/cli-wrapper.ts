/**
 * Wrapper for Qwen CLI integration
 */

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { EventEmitter } from 'events';
import * as pty from 'node-pty';
import { AnsiCleaner } from './ansi-cleaner.js';
import { createLogger } from './logger.js';

export interface QwenCliConfig {
  executable?: string;
  cliPath?: string;
  args?: string[];
  env?: Record<string, string>;
}

const DEFAULT_CONFIG: Required<QwenCliConfig> = {
  executable: 'qwen',
  cliPath: '',
  args: [],
  env: {},
};

export class QwenCliWrapper extends EventEmitter {
  private config: Required<QwenCliConfig>;
  private logger = createLogger('QwenCliWrapper');
  private currentProcess: pty.IPty | null = null;
  private responseBuffer = '';

  /**
   * Clean terminal output by removing ANSI codes and filtering unwanted content
   */
  private cleanOutput(data: string): string {
    return AnsiCleaner.extractContent(data);
  }

  constructor(config: QwenCliConfig = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Execute Qwen CLI command
   */
  async executeCommand(
    command: string[],
    options: { timeout?: number; stdin?: string } = {},
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const { timeout = 30000 } = options;
      
      // Prepare command
      const executable = this.config.cliPath
        ? `${this.config.cliPath}/${this.config.executable}`
        : this.config.executable;

      // Start process
      const child = spawn(executable, [...command, ...this.config.args], {
        env: { ...process.env, ...this.config.env },
      });

      let stdout = '';
      let stderr = '';

      // Handle output
      child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      // Handle completion
      child.on('close', (code: number) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error: Error) => {
        reject(error);
      });

      // Handle timeout
      const timer = setTimeout(() => {
        child.kill();
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);

      // Clean up on completion
      child.on('close', () => {
        clearTimeout(timer);
      });

      // Write to stdin if provided
      if (options.stdin) {
        child.stdin.write(options.stdin);
        child.stdin.end();
      }
    });
  }

  /**
   * Start chat session
   */
  async startChat(options: { model?: string } = {}): Promise<void> {
    if (this.currentProcess) {
      throw new Error('Chat session already in progress');
    }

    const args: string[] = [];
    if (options.model) {
      args.push('--model', options.model);
    }

    const ptyProcess = pty.spawn(this.config.executable, [...args, ...this.config.args], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.cwd(),
      env: { 
        ...process.env, 
        ...this.config.env,
        PYTHONUNBUFFERED: '1',
        NODE_NO_READLINE: '1'
      }
    });

    this.currentProcess = ptyProcess;
    this.logger.debug('CLI pty process started', { pid: ptyProcess.pid });

    // Handle process events
    ptyProcess.onData((data: string) => {
      this.logger.debug('CLI pty raw data received', { 
        raw: data.substring(0, 200) + '...',
        length: data.length 
      });
      
      // Add to buffer for processing
      this.responseBuffer += data;
      
      // Auto-respond to common prompts before cleaning
      if (data.includes('Do you want to connect') || data.includes('VS Code')) {
        this.logger.debug('Auto-responding to VS Code connection prompt');
        ptyProcess.write('2\n'); // Select "No (esc)" option
        return; // Skip processing this prompt data
      }
      
      // Clean the output
      const cleaned = this.cleanOutput(data);
      
      if (cleaned.length > 0) {
        this.logger.debug('CLI pty cleaned data', { cleaned });
        this.emit('message', cleaned);
      }
    });

    ptyProcess.onExit(({ exitCode, signal }) => {
      this.logger.info('CLI pty process ended', { exitCode, signal });
      this.emit('end', exitCode);
      this.currentProcess = null;
    });
  }

  /**
   * Send message to chat session
   */
  async sendMessage(message: string): Promise<void> {
    if (!this.currentProcess) {
      throw new Error('No active chat session');
    }

    this.logger.debug('Sending message to CLI pty process', { message: message.substring(0, 100) + '...' });
    
    this.currentProcess.write(message + '\n');
    this.logger.debug('Message written to CLI pty');
  }

  /**
   * End chat session
   */
  async endChat(): Promise<void> {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
  }

  /**
   * Check if CLI is installed and authenticated
   */
  async checkSetup(): Promise<boolean> {
    try {
      const { stdout } = await this.executeCommand(['--version']);
      return stdout.trim().length > 0;
    } catch (error) {
      this.logger.error('Failed to check CLI setup:', error as Record<string, unknown>);
      return false;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
  }
}
