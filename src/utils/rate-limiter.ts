import Redis from 'ioredis';

export interface RateLimitConfig {
  window: number;        // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
}

export interface RateLimitInfo {
  remaining: number;     // Remaining requests in current window
  resetTime: number;     // Time when the window resets
}

export class RateLimiter {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async checkLimit(operation: string): Promise<RateLimitInfo> {
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

  async close(): Promise<void> {
    await this.redis.quit();
  }
}