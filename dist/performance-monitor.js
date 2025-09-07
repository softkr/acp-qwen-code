/**
 * Track performance metrics for operations
 */
const DEFAULT_CONFIG = {
    enabled: true,
    slowOperationThreshold: 1000, // 1 second
    maxOperations: 1000,
    warningCallback: (category, name, timing) => {
        console.warn(`[Performance] Slow ${category} operation: ${name} took ${timing.duration}ms`);
    },
};
/**
 * Performance monitor class
 */
export class PerformanceMonitor {
    config;
    operations = [];
    currentOperation;
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    /**
     * Track async operation performance
     */
    async trackAsync(category, name, operation, data) {
        if (!this.config.enabled) {
            return operation();
        }
        const timing = {
            startTime: Date.now(),
            success: false,
        };
        const metrics = {
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
        }
        catch (error) {
            timing.success = false;
            timing.error = error instanceof Error ? error.message : String(error);
            throw error;
        }
        finally {
            timing.endTime = Date.now();
            timing.duration = timing.endTime - timing.startTime;
            // Check if operation was slow
            if (timing.duration >= this.config.slowOperationThreshold &&
                this.config.warningCallback) {
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
    track(category, name, operation, data) {
        if (!this.config.enabled) {
            return operation();
        }
        const timing = {
            startTime: Date.now(),
            success: false,
        };
        const metrics = {
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
        }
        catch (error) {
            timing.success = false;
            timing.error = error instanceof Error ? error.message : String(error);
            throw error;
        }
        finally {
            timing.endTime = Date.now();
            timing.duration = timing.endTime - timing.startTime;
            // Check if operation was slow
            if (timing.duration >= this.config.slowOperationThreshold &&
                this.config.warningCallback) {
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
    getMetrics(category, limit) {
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
    getCurrentOperation() {
        return this.currentOperation;
    }
    /**
     * Get average operation duration by category
     */
    getAverageDuration(category) {
        const metrics = this.getMetrics(category);
        if (metrics.length === 0)
            return 0;
        const totalDuration = metrics.reduce((total, m) => total + (m.timing.duration || 0), 0);
        return totalDuration / metrics.length;
    }
    /**
     * Get success rate by category
     */
    getSuccessRate(category) {
        const metrics = this.getMetrics(category);
        if (metrics.length === 0)
            return 0;
        const successCount = metrics.filter((m) => m.timing.success).length;
        return (successCount / metrics.length) * 100;
    }
    /**
     * Clear performance metrics
     */
    clearMetrics() {
        this.operations = [];
    }
}
/** Global performance monitor instance */
export const globalPerformanceMonitor = new PerformanceMonitor();
/** Decorator for tracking async method performance */
export function trackPerformance(category, name, data) {
    return function (_target, _key, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return globalPerformanceMonitor.trackAsync(category, name, () => originalMethod.apply(this, args), data);
        };
        return descriptor;
    };
}
/** Higher-order function for tracking performance */
export async function withPerformanceTracking(category, name, operation, data) {
    return globalPerformanceMonitor.trackAsync(category, name, operation, data);
}
/** Get global monitor instance */
export function getGlobalPerformanceMonitor() {
    return globalPerformanceMonitor;
}
//# sourceMappingURL=performance-monitor.js.map