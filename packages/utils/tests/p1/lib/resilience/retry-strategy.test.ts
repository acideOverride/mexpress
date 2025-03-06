// @ts-ignore
const { RetryStrategy } = require('./test-utils.js');

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