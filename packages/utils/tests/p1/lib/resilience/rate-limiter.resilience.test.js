// Mock Redux client implementation
class RedisClient {
    constructor() {
        this.storage = new Map();
        this.ttls = new Map();
    }

    async incr(key) {
        const current = parseInt(this.storage.get(key) || '0', 10);
        const newValue = current + 1;
        this.storage.set(key, newValue.toString());
        return newValue;
    }

    async expire(key, seconds) {
        if (!this.storage.has(key)) {
            return false;
        }
        this.ttls.set(key, {
            expiry: Date.now() + (seconds * 1000)
        });
        return true;
    }

    async ttl(key) {
        if (!this.storage.has(key)) {
            return -2;
        }
        const ttl = this.ttls.get(key);
        if (!ttl) {
            return -1;
        }
        const remaining = Math.ceil((ttl.expiry - Date.now()) / 1000);
        return remaining > 0 ? remaining : -2;
    }

    // Helper methods for testing
    _reset() {
        this.storage.clear();
        this.ttls.clear();
    }
}

// RateLimiter implementation
class RateLimiter {
    constructor(redis) {
        this.redis = redis;
    }

    async isAllowed(key, limit, window) {
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
                error: error
            };
        }
    }

    middleware(options) {
        const { limit, window, keyPrefix = '' } = options;

        return async (req, res, next) => {
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

describe('RateLimiter', () => {
    let rateLimiter;
    let mockRedis;

    beforeEach(() => {
        mockRedis = new RedisClient();
        rateLimiter = new RateLimiter(mockRedis);
    });

    afterEach(() => {
        mockRedis._reset();
        jest.restoreAllMocks();
    });

    describe('isAllowed', () => {
        it('should allow request when under limit', async () => {
            // Arrange
            const key = 'test-endpoint';
            const limit = 10;
            const window = 60; // 60 seconds
            
            const incrSpy = jest.spyOn(mockRedis, 'incr').mockResolvedValue(5);
            const expireSpy = jest.spyOn(mockRedis, 'expire').mockResolvedValue(true);

            // Act
            const result = await rateLimiter.isAllowed(key, limit, window);

            // Assert
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(5);
            expect(result.resetTime).toBeDefined();
            expect(incrSpy).toHaveBeenCalledWith(`rate_limit:${key}`);
            expect(expireSpy).toHaveBeenCalledWith(`rate_limit:${key}`, window);
        });

        it('should deny request when over limit', async () => {
            // Arrange
            const key = 'test-endpoint';
            const limit = 10;
            const window = 60;
            
            const incrSpy = jest.spyOn(mockRedis, 'incr').mockResolvedValue(11);
            const ttlSpy = jest.spyOn(mockRedis, 'ttl').mockResolvedValue(30);

            // Act
            const result = await rateLimiter.isAllowed(key, limit, window);

            // Assert
            expect(result.allowed).toBe(false);
            expect(result.remaining).toBe(0);
            expect(result.resetTime).toBeDefined();
            expect(result.retryAfter).toBe(30);
            expect(incrSpy).toHaveBeenCalledWith(`rate_limit:${key}`);
            expect(ttlSpy).toHaveBeenCalledWith(`rate_limit:${key}`);
        });

        it('should handle Redis errors gracefully', async () => {
            // Arrange
            const key = 'test-endpoint';
            const limit = 10;
            const window = 60;
            
            const incrSpy = jest.spyOn(mockRedis, 'incr').mockRejectedValue(new Error('Redis error'));

            // Act
            const result = await rateLimiter.isAllowed(key, limit, window);

            // Assert
            expect(result.allowed).toBe(true); // Fail open
            expect(result.remaining).toBe(limit);
            expect(result.resetTime).toBeDefined();
            expect(result.error).toBeDefined();
            expect(incrSpy).toHaveBeenCalledWith(`rate_limit:${key}`);
        });
    });

    describe('middleware', () => {
        it('should add rate limit headers to response', async () => {
            // Arrange
            const req = { ip: '127.0.0.1', path: '/api/test' };
            const res = {
                setHeader: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const limit = 10;
            const window = 60;

            const incrSpy = jest.spyOn(mockRedis, 'incr').mockResolvedValue(5);
            const expireSpy = jest.spyOn(mockRedis, 'expire').mockResolvedValue(true);

            // Act
            await rateLimiter.middleware({ limit, window })(req, res, next);

            // Assert
            expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', limit);
            expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 5);
            expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
            expect(next).toHaveBeenCalled();
            expect(incrSpy).toHaveBeenCalled();
            expect(expireSpy).toHaveBeenCalled();
        });

        it('should return 429 when rate limit exceeded', async () => {
            // Arrange
            const req = { ip: '127.0.0.1', path: '/api/test' };
            const res = {
                setHeader: jest.fn(),
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const limit = 10;
            const window = 60;

            const incrSpy = jest.spyOn(mockRedis, 'incr').mockResolvedValue(11);
            const ttlSpy = jest.spyOn(mockRedis, 'ttl').mockResolvedValue(30);

            // Act
            await rateLimiter.middleware({ limit, window })(req, res, next);

            // Assert
            expect(res.status).toHaveBeenCalledWith(429);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded',
                retryAfter: 30
            });
            expect(next).not.toHaveBeenCalled();
            expect(incrSpy).toHaveBeenCalled();
            expect(ttlSpy).toHaveBeenCalled();
        });
    });
});