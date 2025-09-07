/**
 * Diagnostic system for ACP bridge setup and troubleshooting
 */
/** Issue severity */
export type IssueSeverity = 'info' | 'warning' | 'error';
/** Issue code */
export type IssueCode = 'NODE_VERSION' | 'QWEN_CLI_NOT_FOUND' | 'QWEN_CLI_AUTH' | 'FILE_PERMISSIONS' | 'MEMORY_LOW' | 'CPU_HIGH' | 'NOT_TTY' | 'ENVIRONMENT_VARS';
/** Diagnostic issue */
export interface DiagnosticIssue {
    code: IssueCode;
    level: IssueSeverity;
    message: string;
    solution?: string;
    data?: Record<string, unknown>;
}
/** Platform info */
export interface PlatformInfo {
    platform: string;
    arch: string;
    nodeVersion: string;
    cpuModel: string;
    cpuCount: number;
    totalMemory: number;
    freeMemory: number;
}
/** Qwen CLI configuration */
export interface QwenInfo {
    available: boolean;
    authenticated: boolean;
    version?: string;
    defaultModel?: string;
    configPath?: string;
}
/** Resource metrics */
export interface SystemMetrics {
    memory: {
        heapUsed: number;
        heapTotal: number;
        rss: number;
    };
    cpu: {
        usage: number;
        loadAvg: number[];
    };
    uptime: number;
}
/** Diagnostic report */
export interface DiagnosticReport {
    compatible: boolean;
    score: number;
    platform: PlatformInfo;
    qwen: QwenInfo;
    issues: DiagnosticIssue[];
    metrics: SystemMetrics;
}
/** Diagnostic system class */
export declare class DiagnosticSystem {
    /**
     * Generate diagnostic report
     */
    static generateReport(): Promise<DiagnosticReport>;
    /**
     * Get platform information
     */
    private static getPlatformInfo;
    /**
     * Get system metrics
     */
    static getSystemMetrics(): SystemMetrics;
    /**
     * Check API configuration and connectivity
     */
    private static checkQwenCli;
    /**
     * Run command and return result
     */
    private static runCommand;
    /**
     * Check environment variables
     */
    private static checkEnvironmentVariables;
    /**
     * Check file system access
     */
    private static checkFileSystemAccess;
    /**
     * Check system resources
     */
    private static checkSystemResources;
    /**
     * Calculate compatibility score
     */
    private static calculateScore;
    /**
     * Format diagnostic report for display
     */
    static formatReport(report: DiagnosticReport): string;
    /**
     * Format issue severity for display
     */
    private static formatIssueSeverity;
}
//# sourceMappingURL=diagnostics.d.ts.map