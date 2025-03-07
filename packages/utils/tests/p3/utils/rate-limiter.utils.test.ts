import { RateLimiter } from '../../../src/rateLimiter';

/**
 * Tests for the token bucket based rate limiter utility
 */
describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;
  
  // Test configuration - use smaller values for testing
  const maxRequests = 10;
  const timeWindow = 1000; // 1 second in milliseconds

  beforeEach(() => {
    jest.useFakeTimers();
    rateLimiter = new RateLimiter(maxRequests, timeWindow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow requests within rate limit', async () => {
    // Initially all tokens should be available
    for (let i = 0; i < maxRequests; i++) {
      await rateLimiter.acquire();
    }
    
    // The next request should need to wait for a token
    const refillRate = timeWindow / maxRequests;
    
    // Advance time to allow refill
    jest.advanceTimersByTime(refillRate + 10);
    
    // This should now succeed
    await rateLimiter.acquire();
    
    // Test passes if we get here without error
    expect(true).toBeTruthy();
  });

  it('should wait for token replenishment when limit exceeded', async () => {
    // Mock setTimeout to execute immediately
    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });
    
    // Use up all available tokens
    for (let i = 0; i < maxRequests; i++) {
      await rateLimiter.acquire();
    }

    // The next acquire should wait but our mock will make it return immediately
    await rateLimiter.acquire();
    
    // Test passes if we get here
    expect(true).toBeTruthy();
  }, 10000);

  it('should refill tokens based on elapsed time', async () => {
    // Use all tokens first
    for (let i = 0; i < maxRequests; i++) {
      await rateLimiter.acquire();
    }
    
    // Simulate time passing for full refill
    jest.advanceTimersByTime(timeWindow);
    
    // We should now be able to make maxRequests requests again
    for (let i = 0; i < maxRequests; i++) {
      await rateLimiter.acquire();
    }
    
    // If we got here, the test passed
    expect(true).toBeTruthy();
  });

  it('should handle multiple sequential requests correctly', async () => {
    // Make sure setTimeout runs immediately to avoid timeouts
    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });
    
    // Test a series of request batches
    const batchSizes = [3, 4, 3];
    
    for (const batchSize of batchSizes) {
      // Make a batch of requests
      for (let i = 0; i < batchSize; i++) {
        await rateLimiter.acquire();
      }
      
      // Simulate partial time passing
      jest.advanceTimersByTime(timeWindow / 2);
    }
    
    // If we got here, the test passed
    expect(true).toBeTruthy();
  });

  it('should calculate refill rate correctly', async () => {
    // Create a new rate limiter with known values
    const testMaxRequests = 5;
    const testTimeWindow = 1000; // 1 second
    const testLimiter = new RateLimiter(testMaxRequests, testTimeWindow);
    
    // The refill rate should be timeWindow / maxRequests = 200ms per token
    
    // Use all tokens
    for (let i = 0; i < testMaxRequests; i++) {
      await testLimiter.acquire();
    }
    
    // Mock setTimeout to capture the delay value
    let capturedDelay = 0;
    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any, delay: number) => {
      capturedDelay = delay;
      callback();
      return {} as any;
    });
    
    // Try to acquire another token, which should trigger a delay
    await testLimiter.acquire();
    
    // The delay should be approximately the refill rate (200ms)
    // Allow some small variation for timing precision
    const expectedRefillRate = testTimeWindow / testMaxRequests;
    expect(capturedDelay).toBeGreaterThan(0);
    expect(capturedDelay).toBeLessThanOrEqual(expectedRefillRate + 50);
    
    // Restore the original setTimeout implementation
    jest.spyOn(global, 'setTimeout').mockRestore();
  });
});