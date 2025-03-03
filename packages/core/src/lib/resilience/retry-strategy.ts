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
    try {
      return await operation();
    } catch (error) {
      throw error;
    }
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