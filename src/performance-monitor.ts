/**
 * Track performance metrics for operations
 */

/** Operation metric types */
type MetricCategory =
  | 'api'
  | 'file'
  | 'tool'
  | 'permission'
  | 'session'
  | 'prompt';

/** Operation timing details */
interface OperationTiming {
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
}

/** Operation metrics record */
interface OperationMetrics {
  category: MetricCategory;
  name: string;
  timing: OperationTiming;
  data?: Record<string, unknown>;
}

/** Performance warning callback */
type PerformanceWarningCallback = (
  category: MetricCategory,
  name: string,
  timing: OperationTiming,
) => void;

/** Time tracking function type */
type AsyncOperation<T> = () => Promise<T>;
type SyncOperation<T> = () => T;

/** Performance monitor configuration */
interface PerformanceConfig {
  enabled?: boolean;
  slowOperationThreshold?: number;
  maxOperations?: number;
  warningCallback?: PerformanceWarningCallback;
}

const DEFAULT_CONFIG: Required<PerformanceConfig> = {
  enabled: true,
  slowOperationThreshold: 1000, // 1 second
  maxOperations: 1000,
  warningCallback: (category, name, timing) => {
    console.warn(
      `[Performance] Slow ${category} operation: ${name} took ${timing.duration}ms`,
    );
  },
};

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private readonly config: Required<PerformanceConfig>;
  private operations: OperationMetrics[] = [];
  private currentOperation?: OperationMetrics;

  constructor(config: PerformanceConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Track async operation performance
   */
  async trackAsync<T>(
    category: MetricCategory,
    name: string,
    operation: AsyncOperation<T>,
    data?: Record<string, unknown>,
  ): Promise<T> {
    if (!this.config.enabled) {
      return operation();
    }

    const timing: OperationTiming = {
      startTime: Date.now(),
      success: false,
    };

    const metrics: OperationMetrics = {
      category,
      name,
      timing,
      data,
    };

    this.currentOperation = metrics;

    try {
      const result = await operation();
      timing.success = true;
      return result;
    } catch (error) {
      timing.success = false;
      timing.error = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      timing.endTime = Date.now();
      timing.duration = timing.endTime - timing.startTime;

      // Check if operation was slow
      if (
        timing.duration >= this.config.slowOperationThreshold &&
        this.config.warningCallback
      ) {
        this.config.warningCallback(category, name, timing);
      }

      // Add to operation history
      this.operations.push(metrics);

      // Trim history if needed
      if (this.operations.length > this.config.maxOperations) {
        this.operations = this.operations.slice(-this.config.maxOperations);
      }

      this.currentOperation = undefined;
    }
  }

  /**
   * Track synchronous operation performance
   */
  track<T>(
    category: MetricCategory,
    name: string,
    operation: SyncOperation<T>,
    data?: Record<string, unknown>,
  ): T {
    if (!this.config.enabled) {
      return operation();
    }

    const timing: OperationTiming = {
      startTime: Date.now(),
      success: false,
    };

    const metrics: OperationMetrics = {
      category,
      name,
      timing,
      data,
    };

    this.currentOperation = metrics;

    try {
      const result = operation();
      timing.success = true;
      return result;
    } catch (error) {
      timing.success = false;
      timing.error = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      timing.endTime = Date.now();
      timing.duration = timing.endTime - timing.startTime;

      // Check if operation was slow
      if (
        timing.duration >= this.config.slowOperationThreshold &&
        this.config.warningCallback
      ) {
        this.config.warningCallback(category, name, timing);
      }

      // Add to operation history
      this.operations.push(metrics);

      // Trim history if needed
      if (this.operations.length > this.config.maxOperations) {
        this.operations = this.operations.slice(-this.config.maxOperations);
      }

      this.currentOperation = undefined;
    }
  }

  /**
   * Get recent operation metrics
   */
  getMetrics(
    category?: MetricCategory,
    limit?: number,
  ): OperationMetrics[] {
    let metrics = [...this.operations];

    if (category) {
      metrics = metrics.filter((m) => m.category === category);
    }

    if (limit) {
      metrics = metrics.slice(-limit);
    }

    return metrics;
  }

  /**
   * Get current operation metrics
   */
  getCurrentOperation(): OperationMetrics | undefined {
    return this.currentOperation;
  }

  /**
   * Get average operation duration by category
   */
  getAverageDuration(category: MetricCategory): number {
    const metrics = this.getMetrics(category);
    if (metrics.length === 0) return 0;

    const totalDuration = metrics.reduce(
      (total, m) => total + (m.timing.duration || 0),
      0,
    );

    return totalDuration / metrics.length;
  }

  /**
   * Get success rate by category
   */
  getSuccessRate(category: MetricCategory): number {
    const metrics = this.getMetrics(category);
    if (metrics.length === 0) return 0;

    const successCount = metrics.filter((m) => m.timing.success).length;
    return (successCount / metrics.length) * 100;
  }

  /**
   * Clear performance metrics
   */
  clearMetrics(): void {
    this.operations = [];
  }
}

/** Global performance monitor instance */
export const globalPerformanceMonitor = new PerformanceMonitor();

/** Decorator for tracking async method performance */
export function trackPerformance(
  category: MetricCategory,
  name: string,
  data?: Record<string, unknown>,
) {
  return function (
    _target: unknown,
    _key: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      return globalPerformanceMonitor.trackAsync(
        category,
        name,
        () => originalMethod.apply(this, args),
        data,
      );
    };

    return descriptor;
  };
}

/** Higher-order function for tracking performance */
export async function withPerformanceTracking<T>(
  category: MetricCategory,
  name: string,
  operation: AsyncOperation<T>,
  data?: Record<string, unknown>,
): Promise<T> {
  return globalPerformanceMonitor.trackAsync(category, name, operation, data);
}

/** Get global monitor instance */
export function getGlobalPerformanceMonitor(): PerformanceMonitor {
  return globalPerformanceMonitor;
}
