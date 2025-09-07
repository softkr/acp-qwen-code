/**
 * Monitor and manage system resources
 */

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

/** Default warning thresholds */
const DEFAULT_WARNINGS: ResourceWarnings = {
  heapUsedPercentage: 80,
  heapTotalPercentage: 85,
  rssPercentage: 75,
  loadAvgFactor: 2,
};

/** Resource manager class */
export class ResourceManager {
  private warningThresholds: ResourceWarnings;
  private statsBuffer: ResourceStats[] = [];
  private readonly maxBufferSize = 100;
  private warningCallbacks: ((type: string, value: number) => void)[] = [];

  constructor(warningThresholds?: Partial<ResourceWarnings>) {
    this.warningThresholds = { ...DEFAULT_WARNINGS, ...warningThresholds };
  }

  /**
   * Get current resource usage
   */
  getCurrentStats(): ResourceStats {
    const memory = process.memoryUsage();
    const loadAvg = process.loadavg();
    const uptime = process.uptime();

    // Calculate CPU usage (rough estimate)
    const cpuUsage = loadAvg[0] / require('os').cpus().length * 100;

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
  onWarning(callback: (type: string, value: number) => void): void {
    this.warningCallbacks.push(callback);
  }

  /**
   * Check resource thresholds
   */
  checkThresholds(): void {
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
    const totalMemory = require('os').totalmem();
    const rssPercentage = (stats.memory.rss / totalMemory) * 100;
    if (rssPercentage >= this.warningThresholds.rssPercentage) {
      this.emitWarning('rss', rssPercentage);
    }

    // Check load average
    const cpuCount = require('os').cpus().length;
    const loadFactor = stats.cpu.loadAvg[0] / cpuCount;
    if (loadFactor >= this.warningThresholds.loadAvgFactor) {
      this.emitWarning('load_average', loadFactor);
    }
  }

  /**
   * Emit warning to all registered callbacks
   */
  private emitWarning(type: string, value: number): void {
    for (const callback of this.warningCallbacks) {
      try {
        callback(type, value);
      } catch (error) {
        console.error('Error in warning callback:', error);
      }
    }
  }

  /**
   * Get resource usage history
   */
  getHistory(): ResourceStats[] {
    return [...this.statsBuffer];
  }

  /**
   * Get current resource usage as percentages
   */
  getUsagePercentages(): {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    cpu: number;
  } {
    const stats = this.getCurrentStats();
    const totalMemory = require('os').totalmem();
    const cpuCount = require('os').cpus().length;

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
  cleanup(): void {
    this.statsBuffer = [];
  }
}

/** Global resource manager instance */
export const globalResourceManager = new ResourceManager();

/**
 * Create error handler for resource-related errors
 */
export function handleResourceError(error: Error): void {
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
function cleanup(): void {
  globalResourceManager.cleanup();
}

process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit();
});
