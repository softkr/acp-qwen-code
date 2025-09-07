/**
 * Configuration management for ACP bridge
 */
import { z } from 'zod';
/** Config schema */
declare const configSchema: z.ZodObject<{
    qwen: z.ZodObject<{
        executable: z.ZodOptional<z.ZodString>;
        defaultModel: z.ZodOptional<z.ZodString>;
        configPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    acp: z.ZodObject<{
        permissionMode: z.ZodOptional<z.ZodEnum<{
            default: "default";
            plan: "plan";
            acceptEdits: "acceptEdits";
            bypassPermissions: "bypassPermissions";
        }>>;
        maxTurns: z.ZodOptional<z.ZodNumber>;
        debug: z.ZodOptional<z.ZodBoolean>;
        logFile: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
type Config = z.infer<typeof configSchema>;
export declare class ConfigManager {
    private config;
    private configPath;
    constructor(configPath?: string);
    /**
     * Get default config path
     */
    private getDefaultConfigPath;
    /**
     * Load configuration
     */
    load(): Promise<Config>;
    /**
     * Save configuration
     */
    save(): Promise<void>;
    /**
     * Get configuration value
     */
    get<K extends keyof Config>(key: K): Config[K];
    /**
     * Set configuration value
     */
    set<K extends keyof Config>(key: K, value: Config[K]): Promise<void>;
    /**
     * Get Qwen configuration
     */
    getQwenConfig(): Config['qwen'];
    /**
     * Set Qwen configuration
     */
    setQwenConfig(config: Partial<Config['qwen']>): Promise<void>;
    /**
     * Get ACP configuration
     */
    getACPConfig(): Config['acp'];
    /**
     * Set ACP configuration
     */
    setACPConfig(config: Partial<Config['acp']>): Promise<void>;
    /**
     * Reset configuration to defaults
     */
    reset(): Promise<void>;
    /**
     * Get config file path
     */
    getConfigPath(): string;
}
export {};
//# sourceMappingURL=config.d.ts.map