/**
 * Track performance metrics for operations
 */
/** Operation metric types */
type MetricCategory = 'api' | 'file' | 'tool' | 'permission' | 'session' | 'prompt';
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
type PerformanceWarningCallback = (category: MetricCategory, name: string, timing: OperationTiming) => void;
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
/**
 * Performance monitor class
 */
export declare class PerformanceMonitor {
    private readonly config;
    private operations;
    private currentOperation?;
    constructor(config?: PerformanceConfig);
    /**
     * Track async operation performance
     */
    trackAsync<T>(category: MetricCategory, name: string, operation: AsyncOperation<T>, data?: Record<string, unknown>): Promise<T>;
    /**
     * Track synchronous operation performance
     */
    track<T>(category: MetricCategory, name: string, operation: SyncOperation<T>, data?: Record<string, unknown>): T;
    /**
     * Get recent operation metrics
     */
    getMetrics(category?: MetricCategory, limit?: number): OperationMetrics[];
    /**
     * Get current operation metrics
     */
    getCurrentOperation(): OperationMetrics | undefined;
    /**
     * Get average operation duration by category
     */
    getAverageDuration(category: MetricCategory): number;
    /**
     * Get success rate by category
     */
    getSuccessRate(category: MetricCategory): number;
    /**
     * Clear performance metrics
     */
    clearMetrics(): void;
}
/** Global performance monitor instance */
export declare const globalPerformanceMonitor: PerformanceMonitor;
/** Decorator for tracking async method performance */
export declare function trackPerformance(category: MetricCategory, name: string, data?: Record<string, unknown>): (_target: unknown, _key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/** Higher-order function for tracking performance */
export declare function withPerformanceTracking<T>(category: MetricCategory, name: string, operation: AsyncOperation<T>, data?: Record<string, unknown>): Promise<T>;
/** Get global monitor instance */
export declare function getGlobalPerformanceMonitor(): PerformanceMonitor;
export {};
//# sourceMappingURL=performance-monitor.d.ts.map