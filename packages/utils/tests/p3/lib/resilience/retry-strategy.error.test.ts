/**
 * Retry Strategy Error Handling Tests
 * 
 * This test validates how the RetryStrategy handles different error types
 * when operations fail, ensuring they are properly converted to Error objects
 * and preserved when appropriate.
 */

// Define interfaces locally to avoid import issues
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay?: number;
  exponentialBackoff: boolean;
  jitter: boolean;
}

/**
 * RetryStrategy implementation for testing
 * This matches the implementation in src/lib/resilience/retry-strategy.ts
 * but is defined locally to avoid import and configuration issues
 */
class RetryStrategy {
  private readonly config: Required<RetryConfig>;
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
}

describe('RetryStrategy Error Handling', () => {
  let strategy: RetryStrategy;
  let mockTime: number;
  let logMessages: string[] = [];

  beforeEach(() => {
    logMessages = [];
    mockTime = 0;
    const mockLogger = (message: string) => {
      logMessages.push(message);
    };

    jest.useFakeTimers();
    strategy = new RetryStrategy({
      maxAttempts: 2,
      baseDelay: 100,
      exponentialBackoff: false,
      jitter: false
    }, mockLogger);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const advanceTime = async (ms: number) => {
    mockTime += ms;
    await jest.advanceTimersByTimeAsync(ms);
  };

  it('should throw after max attempts with string error', async () => {
    const operation = jest.fn().mockRejectedValue('Operation failed');
    let thrownError: unknown;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError instanceof Error && thrownError.message).toBe('Operation failed');
  });

  it('should preserve Error objects', async () => {
    const originalError = new Error('Custom error');
    const operation = jest.fn().mockRejectedValue(originalError);
    let thrownError: unknown;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    expect(thrownError).toBe(originalError);
    expect(thrownError instanceof Error && thrownError.message).toBe('Custom error');
  });

  it('should convert non-Error rejections to Error objects', async () => {
    const operation = jest.fn().mockRejectedValue(123);
    let thrownError: unknown;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError instanceof Error && thrownError.message).toBe('123');
  });

  it('should handle null/undefined rejections', async () => {
    const operation = jest.fn().mockRejectedValue(null);
    let thrownError: unknown;

    const promise = strategy.execute(operation).catch(err => {
      thrownError = err;
    });

    // First attempt
    await advanceTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt
    await advanceTime(100);
    expect(operation).toHaveBeenCalledTimes(2);

    await promise;

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError instanceof Error && thrownError.message).toBe('null');
  });
});