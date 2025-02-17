import { RedisClient } from '../redis/client';
import { Request, Response, NextFunction } from 'express';

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
    error?: Error;
}

interface RateLimitOptions {
    limit: number;
    window: number;
    keyPrefix?: string;
}

/**
 * Rate limiter implementation using Redis for distributed rate limiting
 */
export class RateLimiter {
    constructor(private readonly redis: RedisClient) {}

    /**
     * Check if a request is allowed based on rate limiting rules
     * @param key - Unique identifier for the rate limit bucket
     * @param limit - Maximum number of requests allowed
     * @param window - Time window in seconds
     */
    async isAllowed(key: string, limit: number, window: number): Promise<RateLimitResult> {
        const redisKey = `rate_limit:${key}`;
        const now = Math.floor(Date.now() / 1000);
        const resetTime = now + window;

        try {
            // Increment counter and set expiry
            const count = await this.redis.incr(redisKey);
            if (count === 1) {
                await this.redis.expire(redisKey, window);
            }

            // Check if limit exceeded
            if (count > limit) {
                const ttl = await this.redis.ttl(redisKey);
                return {
                    allowed: false,
                    remaining: 0,
                    resetTime,
                    retryAfter: ttl > 0 ? ttl : window
                };
            }

            // Set expiry again to ensure it exists
            await this.redis.expire(redisKey, window);

            return {
                allowed: true,
                remaining: limit - count,
                resetTime
            };
        } catch (error) {
            // Fail open on Redis errors
            return {
                allowed: true,
                remaining: limit,
                resetTime,
                error: error as Error
            };
        }
    }

    /**
     * Express middleware for rate limiting
     * @param options - Rate limiting options
     */
    middleware(options: RateLimitOptions) {
        const { limit, window, keyPrefix = '' } = options;

        return async (req: Request, res: Response, next: NextFunction) => {
            const key = `${keyPrefix}${req.ip}:${req.path}`;
            const result = await this.isAllowed(key, limit, window);

            // Set rate limit headers
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', result.remaining);
            res.setHeader('X-RateLimit-Reset', result.resetTime);

            if (!result.allowed) {
                res.setHeader('Retry-After', result.retryAfter || window);
                return res.status(429).json({
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded',
                    retryAfter: result.retryAfter
                });
            }

            if (result.error) {
                // Log Redis errors but allow request
                console.error('Rate limiter error:', result.error);
            }

            next();
        };
    }
}