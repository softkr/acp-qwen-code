/**
 * Monitor and manage system resources
 */
import * as os from 'os';
/** Default warning thresholds */
const DEFAULT_WARNINGS = {
    heapUsedPercentage: 80,
    heapTotalPercentage: 85,
    rssPercentage: 75,
    loadAvgFactor: 2,
};
/** Resource manager class */
export class ResourceManager {
    warningThresholds;
    statsBuffer = [];
    maxBufferSize = 100;
    warningCallbacks = [];
    constructor(warningThresholds) {
        this.warningThresholds = { ...DEFAULT_WARNINGS, ...warningThresholds };
    }
    /**
     * Get current resource usage
     */
    getCurrentStats() {
        const memory = process.memoryUsage();
        const loadAvg = os.loadavg();
        const uptime = process.uptime();
        // Calculate CPU usage (rough estimate)
        const cpuUsage = (loadAvg[0] / os.cpus().length) * 100;
        const stats = {
            memory,
            cpu: {
                usage: cpuUsage,
                loadAvg,
            },
            uptime,
        };
        // Buffer stats for tracking
        this.statsBuffer.push(stats);
        if (this.statsBuffer.length > this.maxBufferSize) {
            this.statsBuffer.shift();
        }
        return stats;
    }
    /**
     * Register warning callback
     */
    onWarning(callback) {
        this.warningCallbacks.push(callback);
    }
    /**
     * Check resource thresholds
     */
    checkThresholds() {
        const stats = this.getCurrentStats();
        // Check heap usage
        const heapUsedPercentage = (stats.memory.heapUsed / stats.memory.heapTotal) * 100;
        if (heapUsedPercentage >= this.warningThresholds.heapUsedPercentage) {
            this.emitWarning('heap_used', heapUsedPercentage);
        }
        // Check heap total vs system memory
        const heapTotalPercentage = (stats.memory.heapTotal / stats.memory.rss) * 100;
        if (heapTotalPercentage >= this.warningThresholds.heapTotalPercentage) {
            this.emitWarning('heap_total', heapTotalPercentage);
        }
        // Check RSS usage
        const totalMemory = os.totalmem();
        const rssPercentage = (stats.memory.rss / totalMemory) * 100;
        if (rssPercentage >= this.warningThresholds.rssPercentage) {
            this.emitWarning('rss', rssPercentage);
        }
        // Check load average
        const cpuCount = os.cpus().length;
        const loadFactor = stats.cpu.loadAvg[0] / cpuCount;
        if (loadFactor >= this.warningThresholds.loadAvgFactor) {
            this.emitWarning('load_average', loadFactor);
        }
    }
    /**
     * Emit warning to all registered callbacks
     */
    emitWarning(type, value) {
        for (const callback of this.warningCallbacks) {
            try {
                callback(type, value);
            }
            catch (error) {
                console.error('Error in warning callback:', error);
            }
        }
    }
    /**
     * Get resource usage history
     */
    getHistory() {
        return [...this.statsBuffer];
    }
    /**
     * Get current resource usage as percentages
     */
    getUsagePercentages() {
        const stats = this.getCurrentStats();
        const totalMemory = os.totalmem();
        const cpuCount = os.cpus().length;
        return {
            heapUsed: (stats.memory.heapUsed / stats.memory.heapTotal) * 100,
            heapTotal: (stats.memory.heapTotal / totalMemory) * 100,
            rss: (stats.memory.rss / totalMemory) * 100,
            cpu: (stats.cpu.loadAvg[0] / cpuCount) * 100,
        };
    }
    /**
     * Clean up old stats
     */
    cleanup() {
        this.statsBuffer = [];
    }
}
/** Global resource manager instance */
export const globalResourceManager = new ResourceManager();
/**
 * Create error handler for resource-related errors
 */
export function handleResourceError(error) {
    const stats = globalResourceManager.getCurrentStats();
    console.error('Resource error:', error.message, {
        memory: stats.memory,
        cpu: stats.cpu,
        uptime: stats.uptime,
    });
}
/**
 * Handle process termination
 */
function cleanup() {
    globalResourceManager.cleanup();
}
process.on('exit', cleanup);
process.on('SIGINT', () => {
    cleanup();
    process.exit();
});
//# sourceMappingURL=resource-manager.js.map