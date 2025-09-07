/**
 * Configuration management for ACP bridge
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { z } from 'zod';
/** Config schema */
const configSchema = z.object({
    qwen: z.object({
        executable: z.string().optional(),
        defaultModel: z.string().optional(),
        configPath: z.string().optional(),
    }),
    acp: z.object({
        permissionMode: z.enum(['default', 'acceptEdits', 'bypassPermissions', 'plan']).optional(),
        maxTurns: z.number().int().min(0).optional(),
        debug: z.boolean().optional(),
        logFile: z.string().optional(),
    }),
});
const DEFAULT_CONFIG = {
    qwen: {
        executable: 'qwen',
    },
    acp: {
        permissionMode: 'default',
        maxTurns: 100,
        debug: false,
    },
};
export class ConfigManager {
    config;
    configPath;
    constructor(configPath) {
        this.configPath = configPath || this.getDefaultConfigPath();
        this.config = DEFAULT_CONFIG;
    }
    /**
     * Get default config path
     */
    getDefaultConfigPath() {
        const configDir = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
        return path.join(configDir, 'acp-qwen', 'config.json');
    }
    /**
     * Load configuration
     */
    async load() {
        try {
            // Try to read config file
            const content = await fs.readFile(this.configPath, 'utf-8');
            const data = JSON.parse(content);
            // Validate and merge with defaults
            const validated = configSchema.parse(data);
            this.config = {
                ...DEFAULT_CONFIG,
                ...validated,
                qwen: {
                    ...DEFAULT_CONFIG.qwen,
                    ...validated.qwen,
                },
                acp: {
                    ...DEFAULT_CONFIG.acp,
                    ...validated.acp,
                },
            };
            return this.config;
        }
        catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
                // Config file doesn't exist - use defaults
                return this.config;
            }
            throw error;
        }
    }
    /**
     * Save configuration
     */
    async save() {
        // Ensure config directory exists
        const configDir = path.dirname(this.configPath);
        await fs.mkdir(configDir, { recursive: true });
        // Write config file
        await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
    }
    /**
     * Get configuration value
     */
    get(key) {
        return this.config[key];
    }
    /**
     * Set configuration value
     */
    async set(key, value) {
        this.config[key] = value;
        await this.save();
    }
    /**
     * Get Qwen configuration
     */
    getQwenConfig() {
        return this.config.qwen;
    }
    /**
     * Set Qwen configuration
     */
    async setQwenConfig(config) {
        this.config.qwen = {
            ...this.config.qwen,
            ...config,
        };
        await this.save();
    }
    /**
     * Get ACP configuration
     */
    getACPConfig() {
        return this.config.acp;
    }
    /**
     * Set ACP configuration
     */
    async setACPConfig(config) {
        this.config.acp = {
            ...this.config.acp,
            ...config,
        };
        await this.save();
    }
    /**
     * Reset configuration to defaults
     */
    async reset() {
        this.config = DEFAULT_CONFIG;
        await this.save();
    }
    /**
     * Get config file path
     */
    getConfigPath() {
        return this.configPath;
    }
}
//# sourceMappingURL=config.js.map