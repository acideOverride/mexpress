import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import axios from 'axios';
import { SimplifiedRateLimiter } from '../../../src/api/simplified-rate-limiter';

// Mock axios module
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      defaults: { timeout: 5000 },
    })),
  };
});

describe('SimplifiedRateLimiter Tests', () => {
  let rateLimiter: SimplifiedRateLimiter;
  let mockAxiosInstance: any;
  const axiosCreateSpy = axios.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a new rate limiter for testing
    rateLimiter = new SimplifiedRateLimiter({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      maxRequestsPerSecond: 5
    });
    
    // Get the mock axios instance
    mockAxiosInstance = axiosCreateSpy.mock.results[0].value;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle rate limiting with retry logic', async () => {
    // Mock the axios get method to return a rate limit error first, then succeed
    mockAxiosInstance.get
      .mockRejectedValueOnce({
        response: {
          status: 429,
          statusText: 'Too Many Requests',
          data: { error: 'Rate limit exceeded' },
          headers: { 'retry-after': '0.1' } // 100ms retry after
        }
      })
      .mockResolvedValueOnce({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
    
    // Set up a spy on setTimeout to verify rate limiting behavior
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    
    // Make a request with the rate limiter
    const result = await rateLimiter.get('/test-endpoint');
    
    // Verify that setTimeout was called (for rate limiting)
    expect(setTimeoutSpy).toHaveBeenCalled();
    
    // Verify that two requests were made (initial + retry)
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    
    // Verify that the result has the expected structure
    expect(result).toEqual({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });
  });
});