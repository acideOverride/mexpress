import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import axios from 'axios';
import { ApiClient } from '../../../src/api/api-client';

// Mock axios module
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      defaults: { timeout: 5000 },
    })),
  };
});

describe('API Client Retry Logic Tests', () => {
  let apiClient: ApiClient;
  let mockAxiosInstance: any;
  const axiosCreateSpy = axios.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a new API client with custom options for testing
    apiClient = new ApiClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      retryDelay: 100 // Short delay for faster tests
    });
    
    // Get the mock axios instance created by the API client
    mockAxiosInstance = axiosCreateSpy.mock.results[0].value;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should respect configured retry count setting', async () => {
    // Increase test timeout for this test
    jest.setTimeout(30000);
    // Use fake timers
    jest.useFakeTimers();
    
    // Create an error that simulates a connection timeout
    const timeoutError = new Error('timeout of 5000ms exceeded') as any;
    timeoutError.code = 'ECONNABORTED';
    
    // Mock the axios get method to always fail with timeout error
    mockAxiosInstance.get.mockRejectedValue(timeoutError);

    // Configure different retry counts and test
    const testRetryCount = async (retryCount: number): Promise<number> => {
      // Reset mocks
      mockAxiosInstance.get.mockClear();
      
      // Set the retry count on the API client
      apiClient.setRetries(retryCount);
      
      // Start the API request that will fail
      const requestPromise = apiClient.get('/test-endpoint').catch(() => null);
      
      // Advance through all timeouts and retries
      for (let i = 0; i <= retryCount; i++) {
        // Advance past timeout
        jest.advanceTimersByTime(5000);
        await Promise.resolve();
        
        // If not the last attempt, advance past retry delay
        if (i < retryCount) {
          const backoffTime = 100 * Math.pow(2, i) * 1.5;
          jest.advanceTimersByTime(backoffTime);
          await Promise.resolve();
        }
      }
      
      // Make sure all timers are complete
      jest.runAllTimers();
      
      // Wait for promise to settle
      await requestPromise;
      
      // Return the number of attempts made
      return mockAxiosInstance.get.mock.calls.length;
    };
    
    // Test with 0 retries (1 attempt total)
    expect(await testRetryCount(0)).toBe(1);
    
    // Test with 1 retry (2 attempts total)
    expect(await testRetryCount(1)).toBe(2);
    
    // Test with 3 retries (4 attempts total)
    expect(await testRetryCount(3)).toBe(4);
    
    // Test with 5 retries (6 attempts total)
    expect(await testRetryCount(5)).toBe(6);
  });

  it('should not retry on non-timeout errors by default', async () => {
    // Use fake timers
    jest.useFakeTimers();
    
    // Create a non-timeout error
    const nonTimeoutError = new Error('API returned 500 error');
    
    // Mock the axios get method to fail with a non-timeout error
    mockAxiosInstance.get.mockRejectedValue(nonTimeoutError);

    // Start the API request that should fail without retries
    const requestPromise = apiClient.get('/test-endpoint').catch(() => null);
    
    // Advance past initial timeout and any potential retries
    jest.advanceTimersByTime(20000);
    await Promise.resolve();
    jest.runAllTimers();
    
    // Wait for promise to settle
    await requestPromise;
    
    // Should only have tried once without retrying
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
  });

  it('should use exponential backoff delay between retries', async () => {
    // Use fake timers to track delay times
    jest.useFakeTimers();
    
    // Create timeout error
    const timeoutError = new Error('timeout of 5000ms exceeded') as any;
    timeoutError.code = 'ECONNABORTED';
    
    // Mock the axios get method to always fail with timeout error
    mockAxiosInstance.get.mockRejectedValue(timeoutError);
    
    // Set a specific retry delay for predictable testing
    const baseRetryDelay = 100;
    apiClient.setRetryDelay(baseRetryDelay);
    
    // Start the API request
    const requestPromise = apiClient.get('/test-endpoint').catch(() => null);
    
    // Keep track of when each retry happens
    const retryTimes: number[] = [];
    let currentTime = 0;
    
    // Track 3 retries plus initial attempt
    for (let i = 0; i < 4; i++) {
      // If not the first attempt, we should wait for the backoff delay
      if (i > 0) {
        // Calculate the expected backoff time
        const expectedDelay = baseRetryDelay * Math.pow(2, i - 1);
        const minDelay = expectedDelay * 0.5; // With jitter can be 50% of expected
        const maxDelay = expectedDelay * 1.5; // With jitter can be 150% of expected
        
        // Find the actual time by advancing until the next API call is made
        let delayFound = false;
        
        // Try advancing time in small increments to find when the retry happens
        for (let time = 10; time <= maxDelay * 2; time += 10) {
          jest.advanceTimersByTime(10);
          await Promise.resolve();
          
          if (mockAxiosInstance.get.mock.calls.length > i) {
            // A retry happened
            currentTime += time;
            retryTimes.push(time);
            delayFound = true;
            break;
          }
        }
        
        // If we didn't find the retry within expected time, advance more drastically
        if (!delayFound) {
          jest.advanceTimersByTime(maxDelay * 2);
          await Promise.resolve();
          currentTime += maxDelay * 2;
          retryTimes.push(maxDelay * 2);
        }
      }
      
      // Advance past timeout for this attempt
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
      currentTime += 5000;
    }
    
    // Complete all pending timers
    jest.runAllTimers();
    await requestPromise;
    
    // Verify we got the expected number of attempts
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4);
    
    // Verify retry delays follow exponential pattern
    // (We don't test exact values due to jitter, but the pattern should increase)
    if (retryTimes.length >= 3) {
      expect(retryTimes[1]).toBeGreaterThan(retryTimes[0]);
      expect(retryTimes[2]).toBeGreaterThan(retryTimes[1]);
    }
  });
});