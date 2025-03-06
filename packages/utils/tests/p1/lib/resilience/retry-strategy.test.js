const path = require('path');
const fs = require('fs');

// A simple mock of the RetryStrategy class
class RetryStrategy {
  constructor(config = {}, logger = () => {}) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 10000,
      exponentialBackoff: config.exponentialBackoff !== undefined ? config.exponentialBackoff : true,
      jitter: config.jitter !== undefined ? config.jitter : true
    };
    this.logger = logger;
  }

  async execute(operation) {
    let lastError = null;
    
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

    throw lastError || new Error('Unknown error');
  }

  calculateDelay(attempt) {
    let delay = this.config.exponentialBackoff
      ? Math.min(this.config.baseDelay * Math.pow(2, attempt - 1), this.config.maxDelay)
      : this.config.baseDelay;

    if (this.config.jitter) {
      delay = delay * (1 + Math.random());
    }

    return Math.min(delay, this.config.maxDelay);
  }

  async delay(attempt) {
    const delayMs = this.calculateDelay(attempt);
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  getMetrics() {
    return {
      maxAttempts: this.config.maxAttempts,
      baseDelay: this.config.baseDelay,
      maxDelay: this.config.maxDelay,
      exponentialBackoff: this.config.exponentialBackoff,
      jitter: this.config.jitter
    };
  }
}

describe('RetryStrategy', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should succeed on first attempt if operation succeeds', async () => {
    const strategy = new RetryStrategy();
    const operation = jest.fn().mockResolvedValue('success');

    const result = await strategy.execute(operation);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry until success', async () => {
    const strategy = new RetryStrategy({
      maxAttempts: 3,
      baseDelay: 100,
      exponentialBackoff: false,
      jitter: false
    });

    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('Attempt 1'))
      .mockRejectedValueOnce(new Error('Attempt 2'))
      .mockResolvedValueOnce('success');

    const promise = strategy.execute(operation);
    
    // First attempt fails
    await jest.advanceTimersByTimeAsync(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt fails
    await jest.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt succeeds
    await jest.advanceTimersByTimeAsync(100);
    const result = await promise;

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff', async () => {
    const strategy = new RetryStrategy({
      maxAttempts: 3,
      baseDelay: 100,
      exponentialBackoff: true,
      jitter: false
    });

    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('Attempt 1'))
      .mockRejectedValueOnce(new Error('Attempt 2'))
      .mockResolvedValueOnce('success');

    const promise = strategy.execute(operation);
    
    // First attempt fails
    await jest.advanceTimersByTimeAsync(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt fails (delay: 100 * 2^0 = 100ms)
    await jest.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt succeeds (delay: 100 * 2^1 = 200ms)
    await jest.advanceTimersByTimeAsync(200);
    const result = await promise;

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should respect max delay', async () => {
    const strategy = new RetryStrategy({
      maxAttempts: 3,
      baseDelay: 100,
      maxDelay: 150,
      exponentialBackoff: true,
      jitter: false
    });

    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('Attempt 1'))
      .mockRejectedValueOnce(new Error('Attempt 2'))
      .mockResolvedValueOnce('success');

    const promise = strategy.execute(operation);
    
    // First attempt fails
    await jest.advanceTimersByTimeAsync(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt fails (delay: min(100 * 2^0, 150) = 100ms)
    await jest.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt succeeds (delay: min(100 * 2^1, 150) = 150ms)
    await jest.advanceTimersByTimeAsync(150);
    const result = await promise;

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should provide accurate metrics', () => {
    const config = {
      maxAttempts: 3,
      baseDelay: 100,
      maxDelay: 1000,
      exponentialBackoff: true,
      jitter: false
    };

    const strategy = new RetryStrategy(config);
    const metrics = strategy.getMetrics();

    expect(metrics).toEqual(config);
  });
});