/**
 * Wrapper for Qwen CLI integration
 */
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { createLogger } from './logger.js';
const DEFAULT_CONFIG = {
    executable: 'qwen',
    cliPath: '',
    args: [],
    env: {},
};
export class QwenCliWrapper extends EventEmitter {
    config;
    logger = createLogger('QwenCliWrapper');
    currentProcess = null;
    constructor(config = {}) {
        super();
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Execute Qwen CLI command
     */
    async executeCommand(command, options = {}) {
        return new Promise((resolve, reject) => {
            const { timeout = 30000 } = options;
            // Prepare command
            const executable = this.config.cliPath
                ? `${this.config.cliPath}/${this.config.executable}`
                : this.config.executable;
            // Start process
            const process = spawn(executable, [...command, ...this.config.args], {
                env: { ...process.env, ...this.config.env },
            });
            let stdout = '';
            let stderr = '';
            // Handle output
            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            // Handle completion
            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                }
                else {
                    reject(new Error(`Command failed with code ${code}: ${stderr}`));
                }
            });
            process.on('error', (error) => {
                reject(error);
            });
            // Handle timeout
            const timer = setTimeout(() => {
                process.kill();
                reject(new Error(`Command timed out after ${timeout}ms`));
            }, timeout);
            // Clean up on completion
            process.on('close', () => {
                clearTimeout(timer);
            });
            // Write to stdin if provided
            if (options.stdin) {
                process.stdin.write(options.stdin);
                process.stdin.end();
            }
        });
    }
    /**
     * Start chat session
     */
    async startChat(options = {}) {
        if (this.currentProcess) {
            throw new Error('Chat session already in progress');
        }
        const args = ['chat'];
        if (options.model) {
            args.push('--model', options.model);
        }
        const process = spawn(this.config.executable, [...args, ...this.config.args], {
            env: { ...process.env, ...this.config.env },
        });
        this.currentProcess = process;
        // Handle process events
        process.stdout.on('data', (data) => {
            this.emit('message', data.toString());
        });
        process.stderr.on('data', (data) => {
            this.emit('error', new Error(data.toString()));
        });
        process.on('close', (code) => {
            this.emit('end', code);
            this.currentProcess = null;
        });
        process.on('error', (error) => {
            this.emit('error', error);
            this.currentProcess = null;
        });
    }
    /**
     * Send message to chat session
     */
    async sendMessage(message) {
        if (!this.currentProcess) {
            throw new Error('No active chat session');
        }
        this.currentProcess.stdin.write(message + '\\n');
    }
    /**
     * End chat session
     */
    async endChat() {
        if (this.currentProcess) {
            this.currentProcess.stdin.end();
            this.currentProcess = null;
        }
    }
    /**
     * Check if CLI is installed and authenticated
     */
    async checkSetup() {
        try {
            const { stdout } = await this.executeCommand(['--version']);
            return stdout.trim().length > 0;
        }
        catch (error) {
            this.logger.error('Failed to check CLI setup:', error);
            return false;
        }
    }
    /**
     * Clean up resources
     */
    destroy() {
        if (this.currentProcess) {
            this.currentProcess.kill();
            this.currentProcess = null;
        }
    }
}
//# sourceMappingURL=cli-wrapper.js.map