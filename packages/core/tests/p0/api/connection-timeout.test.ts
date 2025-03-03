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

describe('API Client Connection Timeout Tests', () => {
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

  it('should handle connection timeout and retry with exponential backoff', async () => {
    // Increase test timeout for this test
    jest.setTimeout(30000);
    // Use fake timers to speed up testing of timeouts
    jest.useFakeTimers();
    
    // Create an error that simulates a connection timeout
    const timeoutError = new Error('timeout of 5000ms exceeded') as any;
    timeoutError.code = 'ECONNABORTED';
    
    // Mock the axios get method to fail with timeout error the first two times,
    // then succeed on the third try
    mockAxiosInstance.get
      .mockRejectedValueOnce(timeoutError) // First attempt - fail
      .mockRejectedValueOnce(timeoutError) // Second attempt - fail
      .mockResolvedValueOnce({  // Third attempt - succeed
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
    // Start the API request - but don't await it yet
    const requestPromise = apiClient.get('/test-endpoint');

    // We need to advance timers and handle promises carefully
    // Fast-forward past first timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve(); // Let rejected promises settle

    // Fast-forward past first retry delay
    jest.advanceTimersByTime(100);
    await Promise.resolve(); // Let any pending promises settle

    // Fast-forward past second timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve(); // Let rejected promises settle

    // Fast-forward past second retry delay (with exponential backoff)
    jest.advanceTimersByTime(200);
    await Promise.resolve(); // Let any pending promises settle

    // Fast-forward past third timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve(); // Let any pending promises settle

    // Make sure all timers are complete
    jest.runAllTimers();

    // Now await the result
    const result = await requestPromise;
    
    // Check that the API client made three attempts
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
    
    // Check that it returned the successful response
    expect(result).toEqual({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });
  });

  it('should eventually fail after maximum retries', async () => {
    // Increase test timeout for this test
    jest.setTimeout(30000);
    // Use fake timers
    jest.useFakeTimers();
    
    // Create an error that simulates a connection timeout
    const timeoutError = new Error('timeout of 5000ms exceeded') as any;
    timeoutError.code = 'ECONNABORTED';
    
    // Mock the axios get method to always fail with timeout error
    mockAxiosInstance.get.mockRejectedValue(timeoutError);

    // Start the API request that should eventually fail
    const requestPromise = apiClient.get('/test-endpoint');
    
    // We need to handle timeouts and retries separately
    // First timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve(); // Let rejected promises settle
    
    // First retry delay
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    
    // Second timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    // Second retry delay with backoff
    jest.advanceTimersByTime(200);
    await Promise.resolve();
    
    // Third timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    // Third retry delay with backoff
    jest.advanceTimersByTime(400);
    await Promise.resolve();
    
    // Fourth (final) timeout
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    
    // Make sure all timers are complete
    jest.runAllTimers();
    
    // The request should eventually fail with the timeout error
    await expect(requestPromise).rejects.toThrow('timeout of 5000ms exceeded');
    
    // Check that the API client made exactly 4 attempts (initial + 3 retries)
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4);
  });

  it('should complete requests within the timeout period when API is responsive', async () => {
    // Mock a successful API response
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });

    // Get the start time
    const startTime = Date.now();
    
    // Make the API request
    await apiClient.get('/test-endpoint');
    
    // Get the end time
    const endTime = Date.now();
    
    // Calculate the duration
    const duration = endTime - startTime;
    
    // Verify that the request was made exactly once (no retries needed)
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    
    // Ensure the operation completes well within the 5000ms timeout
    // In practice this will be very fast as we're using mocks
    expect(duration).toBeLessThan(5000);
  });
});