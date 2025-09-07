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
export const QWEN_API_CIRCUIT_OPTIONS: Required<CircuitBreakerOptions> = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  requestTimeout: 30000, // 30 seconds
  openStateTimeout: 300000, // 5 minutes
  monitorInterval: 5000, // 5 seconds
};

/**
 * Circuit breaker for API resilience
 */
export class CircuitBreaker<TArgs, TResult> {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastError: Error | null = null;
  private lastStateChange = Date.now();
  private nextAttempt = Date.now();
  private readonly options: Required<CircuitBreakerOptions>;
  private readonly monitorInterval: NodeJS.Timer;

  constructor(
    private readonly func: (args: TArgs) => Promise<TResult>,
    options: CircuitBreakerOptions = {},
  ) {
    this.options = { ...QWEN_API_CIRCUIT_OPTIONS, ...options };

    // Start monitoring
    this.monitorInterval = setInterval(
      () => this.monitor(),
      this.options.monitorInterval,
    );
  }

  /**
   * Execute a function through the circuit breaker
   */
  async execute(args: TArgs): Promise<TResult> {
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
    } catch (error) {
      // Track failure
      this.failureCount++;
      this.lastError = error as Error;

      // Check if we need to open the circuit
      if (
        this.failureCount >= this.options.failureThreshold ||
        this.state === 'HALF_OPEN'
      ) {
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
  getState(): {
    state: CircuitState;
    failureCount: number;
    lastError: string | null;
    lastStateChange: number;
    nextAttempt: number;
  } {
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
  private reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastError = null;
    this.lastStateChange = Date.now();
    this.nextAttempt = Date.now();
  }

  /**
   * Monitor circuit state and auto-reset if needed
   */
  private monitor(): void {
    // Check if circuit has been open long enough
    if (
      this.state === 'OPEN' &&
      Date.now() - this.lastStateChange >= this.options.resetTimeout
    ) {
      // Allow a retry
      this.nextAttempt = Date.now();
    }

    // Reset if half-open too long
    if (
      this.state === 'HALF_OPEN' &&
      Date.now() - this.lastStateChange >= this.options.resetTimeout
    ) {
      this.reset();
    }
  }

  /**
   * Execute function with timeout
   */
  private async withTimeout(args: TArgs): Promise<TResult> {
    if (!this.options.requestTimeout) {
      return await this.func(args);
    }

    return await new Promise<TResult>((resolve, reject) => {
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
  destroy(): void {
    clearInterval(this.monitorInterval);
  }
}

/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
  constructor(message?: string) {
    super(
      message
        ? `Circuit is OPEN: ${message}`
        : 'Circuit is OPEN',
    );
    Object.setPrototypeOf(this, CircuitOpenError.prototype);
  }
}
