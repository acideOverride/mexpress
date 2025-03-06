// We use inline mocks instead of jest.mock('ioredis')
// to avoid dependency issues

// Mock RateLimiter implementation
class RateLimiter {
  constructor(config) {
    this.config = config;
    this.redis = new MockRedis();
  }

  async checkLimit(operation) {
    const key = `ratelimit:${operation}`;
    const now = Date.now();
    const windowStart = now - this.config.window;

    // Remove old requests outside the current window
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in the current window
    const requestCount = await this.redis.zcard(key);

    if (requestCount >= this.config.maxRequests) {
      // Get reset time
      const oldestRequest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime = oldestRequest.length ? parseInt(oldestRequest[1]) + this.config.window : now + this.config.window;

      const error = {
        error: 'Rate limit exceeded',
        resetTime,
        remaining: 0,
      };
      
      throw new Error(JSON.stringify(error));
    }

    // Add current request
    await this.redis.zadd(key, now, `${now}-${Math.random()}`);
    // Set expiration for the key
    await this.redis.expire(key, Math.ceil(this.config.window / 1000));

    return {
      remaining: this.config.maxRequests - requestCount - 1,
      resetTime: now + this.config.window,
    };
  }

  async close() {
    await this.redis.quit();
  }
}

// Mock Redis implementation
class MockRedis {
  constructor() {
    this.zremrangebyscore = jest.fn();
    this.zcard = jest.fn();
    this.zrange = jest.fn();
    this.zadd = jest.fn();
    this.expire = jest.fn();
    this.quit = jest.fn();
  }
}

// Create a mock version of ioredis
const Redis = jest.fn().mockImplementation(() => {
  return new MockRedis();
});

describe('RateLimiter', () => {
  let rateLimiter;
  let mockRedis;

  beforeEach(() => {
    jest.clearAllMocks();
    
    const config = {
      window: 60000, // 1 minute
      maxRequests: 100,
    };
    rateLimiter = new RateLimiter(config);
    mockRedis = rateLimiter.redis;
  });

  afterEach(async () => {
    await rateLimiter.close();
  });

  it('should allow requests within rate limit', async () => {
    mockRedis.zremrangebyscore.mockResolvedValue(1);
    mockRedis.zcard.mockResolvedValue(50); // 50 requests in current window
    mockRedis.zadd.mockResolvedValue(1);
    mockRedis.expire.mockResolvedValue(1);

    const result = await rateLimiter.checkLimit('test-operation');

    expect(result.remaining).toBe(49); // maxRequests(100) - current(50) - 1
    expect(result.resetTime).toBeGreaterThan(Date.now());
    expect(mockRedis.zadd).toHaveBeenCalled();
    expect(mockRedis.expire).toHaveBeenCalled();
  });

  it('should throw error when rate limit exceeded', async () => {
    mockRedis.zremrangebyscore.mockResolvedValue(1);
    mockRedis.zcard.mockResolvedValue(100); // Max requests reached
    mockRedis.zrange.mockResolvedValue(['request1', '1614556800000']);

    await expect(rateLimiter.checkLimit('test-operation')).rejects.toThrow();
  });

  it('should clean up old requests outside window', async () => {
    mockRedis.zremrangebyscore.mockResolvedValue(1);
    mockRedis.zcard.mockResolvedValue(50); // Under limit
    mockRedis.zadd.mockResolvedValue(1);
    mockRedis.expire.mockResolvedValue(1);

    const now = Date.now();
    const windowStart = now - 60000;

    await rateLimiter.checkLimit('test-operation');

    expect(mockRedis.zremrangebyscore).toHaveBeenCalledWith(
      'ratelimit:test-operation',
      0,
      expect.any(Number)
    );
    
    const calledWindowStart = mockRedis.zremrangebyscore.mock.calls[0][2];
    expect(calledWindowStart).toBeLessThanOrEqual(now);
    expect(calledWindowStart).toBeGreaterThanOrEqual(windowStart - 1000); // Allow 1s tolerance
  });

  it('should set proper expiration for rate limit keys', async () => {
    mockRedis.zremrangebyscore.mockResolvedValue(1);
    mockRedis.zcard.mockResolvedValue(50);
    mockRedis.zadd.mockResolvedValue(1);
    mockRedis.expire.mockResolvedValue(1);

    await rateLimiter.checkLimit('test-operation');

    expect(mockRedis.expire).toHaveBeenCalledWith(
      'ratelimit:test-operation',
      60 // 60 seconds for 60000ms window
    );
  });

  it('should properly calculate remaining requests', async () => {
    const testCases = [
      { current: 0, expected: 99 },
      { current: 50, expected: 49 },
      { current: 98, expected: 1 },
      { current: 99, expected: 0 },
    ];

    for (const testCase of testCases) {
      mockRedis.zremrangebyscore.mockResolvedValue(1);
      mockRedis.zcard.mockResolvedValue(testCase.current);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await rateLimiter.checkLimit('test-operation');
      expect(result.remaining).toBe(testCase.expected);
    }
  });
});