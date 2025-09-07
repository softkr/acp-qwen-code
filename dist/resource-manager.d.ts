/** Resource statistics type */
interface ResourceStats {
    memory: NodeJS.MemoryUsage;
    cpu: {
        usage: number;
        loadAvg: number[];
    };
    uptime: number;
}
/** Resource warning thresholds */
interface ResourceWarnings {
    heapUsedPercentage: number;
    heapTotalPercentage: number;
    rssPercentage: number;
    loadAvgFactor: number;
}
/** Resource manager class */
export declare class ResourceManager {
    private warningThresholds;
    private statsBuffer;
    private readonly maxBufferSize;
    private warningCallbacks;
    constructor(warningThresholds?: Partial<ResourceWarnings>);
    /**
     * Get current resource usage
     */
    getCurrentStats(): ResourceStats;
    /**
     * Register warning callback
     */
    onWarning(callback: (type: string, value: number) => void): void;
    /**
     * Check resource thresholds
     */
    checkThresholds(): void;
    /**
     * Emit warning to all registered callbacks
     */
    private emitWarning;
    /**
     * Get resource usage history
     */
    getHistory(): ResourceStats[];
    /**
     * Get current resource usage as percentages
     */
    getUsagePercentages(): {
        heapUsed: number;
        heapTotal: number;
        rss: number;
        cpu: number;
    };
    /**
     * Clean up old stats
     */
    cleanup(): void;
}
/** Global resource manager instance */
export declare const globalResourceManager: ResourceManager;
/**
 * Create error handler for resource-related errors
 */
export declare function handleResourceError(error: Error): void;
export {};
//# sourceMappingURL=resource-manager.d.ts.map