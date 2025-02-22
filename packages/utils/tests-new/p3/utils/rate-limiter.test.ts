import { RateLimiter, RateLimitConfig } from '../rate-limiter';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;
  const mockRedis = {
    zremrangebyscore: jest.fn(),
    zcard: jest.fn(),
    zrange: jest.fn(),
    zadd: jest.fn(),
    expire: jest.fn(),
    quit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Fix the type casting for Redis mock
    (Redis as unknown as jest.Mock).mockImplementation(() => mockRedis);
    
    const config: RateLimitConfig = {
      window: 60000, // 1 minute
      maxRequests: 100,
    };
    rateLimiter = new RateLimiter(config);
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