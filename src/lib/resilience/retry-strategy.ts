export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBackoff: boolean;
  jitter: boolean;
}

export class RetryStrategy {
  private readonly config: RetryConfig;
  private readonly logger: (message: string) => void;

  constructor(
    config: Partial<RetryConfig> = {},
    logger: (message: string) => void = () => {}
  ) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 10000,
      exponentialBackoff: config.exponentialBackoff !== undefined ? config.exponentialBackoff : true,
      jitter: config.jitter !== undefined ? config.jitter : true
    };
    this.logger = logger;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown = null;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        this.logger(`[RetryStrategy] Attempt ${attempt}/${this.config.maxAttempts}`);
        return await operation();
      } catch (error) {
        this.logger(`[RetryStrategy] Error on attempt ${attempt}: ${error}`);
        lastError = error;
        
        if (attempt < this.config.maxAttempts) {
          const delayMs = this.calculateDelay(attempt);
          this.logger(`[RetryStrategy] Waiting ${delayMs}ms before next attempt`);
          await this.delay(attempt);
        }
      }
    }

    // If we've exhausted all attempts, throw the last error
    this.logger(`[RetryStrategy] All attempts exhausted, throwing error: ${lastError}`);
    
    if (lastError instanceof Error) {
      // Preserve original Error objects
      throw lastError;
    } else if (lastError === null || lastError === undefined) {
      // Handle null/undefined explicitly
      throw new Error(String(lastError));
    } else if (typeof lastError === 'string') {
      // Convert strings to Error objects
      throw new Error(lastError);
    } else {
      // Convert any other type to string and wrap in Error
      throw new Error(String(lastError));
    }
  }

  private calculateDelay(attempt: number): number {
    let delay = this.config.exponentialBackoff
      ? Math.min(this.config.baseDelay * Math.pow(2, attempt - 1), this.config.maxDelay)
      : this.config.baseDelay;

    if (this.config.jitter) {
      // Add random jitter between 0-100% of the delay
      delay = delay * (1 + Math.random());
    }

    return Math.min(delay, this.config.maxDelay);
  }

  private async delay(attempt: number): Promise<void> {
    const delayMs = this.calculateDelay(attempt);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  getMetrics(): RetryConfig & {
    currentAttempt?: number;
    lastDelay?: number;
  } {
    return {
      maxAttempts: this.config.maxAttempts,
      baseDelay: this.config.baseDelay,
      maxDelay: this.config.maxDelay,
      exponentialBackoff: this.config.exponentialBackoff,
      jitter: this.config.jitter
    };
  }
}