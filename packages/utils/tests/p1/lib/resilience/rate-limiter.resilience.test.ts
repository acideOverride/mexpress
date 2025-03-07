import { RateLimiter } from '../../../../src/lib/resilience/rate-limiter';
import { RedisClient } from '../../../../src/lib/redis/__mocks__/client';
import { jest } from '@jest/globals';

// Ensure any pending operations are completed
const waitForAsyncOperations = () => new Promise(resolve => setTimeout(resolve, 100));

describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;
    let mockRedis: RedisClient;

    beforeEach(() => {
        mockRedis = new RedisClient();
        rateLimiter = new RateLimiter(mockRedis);
    });

    afterEach(async () => {
        mockRedis._reset();
        jest.restoreAllMocks();
        await waitForAsyncOperations();
    });
    
    afterAll(async () => {
        await waitForAsyncOperations();
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
            await rateLimiter.middleware({ limit, window })(req as any, res as any, next);

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
            await rateLimiter.middleware({ limit, window })(req as any, res as any, next);

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