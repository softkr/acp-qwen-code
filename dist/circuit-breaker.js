/**
 * Circuit breaker implementation for API resilience
 */
/** Qwen API circuit breaker configuration */
export const QWEN_API_CIRCUIT_OPTIONS = {
    failureThreshold: 5,
    resetTimeout: 60000, // 1 minute
    requestTimeout: 30000, // 30 seconds
    openStateTimeout: 300000, // 5 minutes
    monitorInterval: 5000, // 5 seconds
};
/**
 * Circuit breaker for API resilience
 */
export class CircuitBreaker {
    func;
    state = 'CLOSED';
    failureCount = 0;
    lastError = null;
    lastStateChange = Date.now();
    nextAttempt = Date.now();
    options;
    monitorInterval;
    constructor(func, options = {}) {
        this.func = func;
        this.options = { ...QWEN_API_CIRCUIT_OPTIONS, ...options };
        // Start monitoring
        this.monitorInterval = setInterval(() => this.monitor(), this.options.monitorInterval);
    }
    /**
     * Execute a function through the circuit breaker
     */
    async execute(args) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                throw new CircuitOpenError(this.lastError?.message);
            }
            this.state = 'HALF_OPEN';
            this.lastStateChange = Date.now();
        }
        try {
            // Wrap in timeout if specified
            const result = await this.withTimeout(args);
            // Success - reset circuit
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            return result;
        }
        catch (error) {
            // Track failure
            this.failureCount++;
            this.lastError = error;
            // Check if we need to open the circuit
            if (this.failureCount >= this.options.failureThreshold ||
                this.state === 'HALF_OPEN') {
                this.state = 'OPEN';
                this.lastStateChange = Date.now();
                this.nextAttempt = Date.now() + this.options.openStateTimeout;
                throw new CircuitOpenError(error instanceof Error ? error.message : String(error));
            }
            throw error;
        }
    }
    /**
     * Get current circuit state
     */
    getState() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            lastError: this.lastError?.message || null,
            lastStateChange: this.lastStateChange,
            nextAttempt: this.nextAttempt,
        };
    }
    /**
     * Reset the circuit breaker
     */
    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastError = null;
        this.lastStateChange = Date.now();
        this.nextAttempt = Date.now();
    }
    /**
     * Monitor circuit state and auto-reset if needed
     */
    monitor() {
        // Check if circuit has been open long enough
        if (this.state === 'OPEN' &&
            Date.now() - this.lastStateChange >= this.options.resetTimeout) {
            // Allow a retry
            this.nextAttempt = Date.now();
        }
        // Reset if half-open too long
        if (this.state === 'HALF_OPEN' &&
            Date.now() - this.lastStateChange >= this.options.resetTimeout) {
            this.reset();
        }
    }
    /**
     * Execute function with timeout
     */
    async withTimeout(args) {
        if (!this.options.requestTimeout) {
            return await this.func(args);
        }
        return await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Request timed out after ${this.options.requestTimeout}ms`));
            }, this.options.requestTimeout);
            this.func(args)
                .then((result) => {
                clearTimeout(timeout);
                resolve(result);
            })
                .catch((error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
    /**
     * Clean up resources
     */
    destroy() {
        clearInterval(this.monitorInterval);
    }
}
/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
    constructor(message) {
        super(message
            ? `Circuit is OPEN: ${message}`
            : 'Circuit is OPEN');
        Object.setPrototypeOf(this, CircuitOpenError.prototype);
    }
}
//# sourceMappingURL=circuit-breaker.js.map