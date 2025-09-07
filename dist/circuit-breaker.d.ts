/**
 * Circuit breaker implementation for API resilience
 */
/** Circuit breaker configuration */
export interface CircuitBreakerOptions {
    failureThreshold?: number;
    resetTimeout?: number;
    requestTimeout?: number;
    openStateTimeout?: number;
    monitorInterval?: number;
}
/** Circuit breaker state */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
/** Qwen API circuit breaker configuration */
export declare const QWEN_API_CIRCUIT_OPTIONS: Required<CircuitBreakerOptions>;
/**
 * Circuit breaker for API resilience
 */
export declare class CircuitBreaker<TArgs, TResult> {
    private readonly func;
    private state;
    private failureCount;
    private lastError;
    private lastStateChange;
    private nextAttempt;
    private readonly options;
    private readonly monitorInterval;
    constructor(func: (args: TArgs) => Promise<TResult>, options?: CircuitBreakerOptions);
    /**
     * Execute a function through the circuit breaker
     */
    execute(args: TArgs): Promise<TResult>;
    /**
     * Get current circuit state
     */
    getState(): {
        state: CircuitState;
        failureCount: number;
        lastError: string | null;
        lastStateChange: number;
        nextAttempt: number;
    };
    /**
     * Reset the circuit breaker
     */
    private reset;
    /**
     * Monitor circuit state and auto-reset if needed
     */
    private monitor;
    /**
     * Execute function with timeout
     */
    private withTimeout;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/**
 * Error thrown when circuit is open
 */
export declare class CircuitOpenError extends Error {
    constructor(message?: string);
}
//# sourceMappingURL=circuit-breaker.d.ts.map