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
            const child = spawn(executable, [...command, ...this.config.args], {
                env: { ...process.env, ...this.config.env },
            });
            let stdout = '';
            let stderr = '';
            // Handle output
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            // Handle completion
            child.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                }
                else {
                    reject(new Error(`Command failed with code ${code}: ${stderr}`));
                }
            });
            child.on('error', (error) => {
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
    async startChat(options = {}) {
        if (this.currentProcess) {
            throw new Error('Chat session already in progress');
        }
        const args = ['chat'];
        if (options.model) {
            args.push('--model', options.model);
        }
        const child = spawn(this.config.executable, [...args, ...this.config.args], {
            env: { ...process.env, ...this.config.env },
        });
        this.currentProcess = child;
        // Handle process events
        child.stdout.on('data', (data) => {
            this.emit('message', data.toString());
        });
        child.stderr.on('data', (data) => {
            this.emit('error', new Error(data.toString()));
        });
        child.on('close', (code) => {
            this.emit('end', code);
            this.currentProcess = null;
        });
        child.on('error', (error) => {
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
        this.currentProcess.stdin?.write(message + '\n');
    }
    /**
     * End chat session
     */
    async endChat() {
        if (this.currentProcess) {
            this.currentProcess.stdin?.end();
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