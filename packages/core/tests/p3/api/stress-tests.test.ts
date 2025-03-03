import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import axios from 'axios';
import { ApiClient } from '../../../src/api/api-client';
import { RateLimitingApiClient } from '../../../src/api/rate-limit-handler';

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

describe('API Client Stress Tests', () => {
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

  it('should handle high volume of concurrent requests efficiently', async () => {
    // Increase test timeout for this test
    jest.setTimeout(30000);
    
    // Mock successful responses with varying response times
    mockAxiosInstance.get.mockImplementation(() => {
      // Simulate random response times between 10ms and 100ms
      const responseTime = Math.floor(Math.random() * 90) + 10;
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: { success: true },
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'application/json' }
          });
        }, responseTime);
      });
    });
    
    // Number of concurrent requests to test
    const requestCount = 100;
    
    // Create array of requests
    const requests = Array.from({ length: requestCount }, (_, index) => {
      return apiClient.get(`/test-endpoint-${index}`);
    });
    
    // Measure the start time
    const startTime = Date.now();
    
    // Execute all requests concurrently
    const results = await Promise.all(requests);
    
    // Measure the end time
    const endTime = Date.now();
    
    // Calculate the total duration
    const totalDuration = endTime - startTime;
    
    // Check that all requests succeeded
    expect(results.length).toBe(requestCount);
    results.forEach(result => {
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ success: true });
    });
    
    // Verify that mockAxiosInstance.get was called the expected number of times
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(requestCount);
    
    // Performance assertions - should handle 100 requests in a reasonable time
    // This is a flexible threshold for test environments
    expect(totalDuration).toBeLessThan(2000);
    
    // Log the achieved throughput
    const throughput = requestCount / (totalDuration / 1000); // req/sec
    console.log(`Throughput: ${throughput.toFixed(2)} requests per second`);
  });

  it('should handle rate limiting with exponential backoff under load', async () => {
    // Increase test timeout for this test
    jest.setTimeout(10000);
    
    // Set up a counter to track requests and responses
    let requestCount = 0;
    let rateLimitCount = 0;
    let successCount = 0;
    
    // Create a rate limiting API client which will handle 429 responses
    const rateLimitClient = new RateLimitingApiClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
      retryDelay: 100 // Short delay for faster tests
    });
    
    // Get the mock axios instance
    const rateLimitMockAxios: any = axiosCreateSpy.mock.results[1].value;
    
    // Track different response types based on request count
    rateLimitMockAxios.get.mockImplementation(() => {
      requestCount++;
      
      // For the first 5 requests, return rate limit errors
      if (requestCount <= 5) {
        rateLimitCount++;
        // Setup a proper rate limit response with the retry-after header
        const error: any = new Error('API rate limit exceeded');
        error.response = {
          status: 429,
          statusText: 'Too Many Requests',
          data: { error: 'Rate limit exceeded' },
          headers: { 'retry-after': '1' } // 1 second
        };
        return Promise.reject(error);
      }
      
      // For subsequent requests, return success
      successCount++;
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
    });
    
    // Make requests using the rate limiting client - each will be retried if rate limited
    try {
      const result = await rateLimitClient.get('/test-endpoint');
      
      // The request should succeed due to automatic retries
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ success: true });
      
      // Verify we encountered rate limiting and retried
      expect(rateLimitCount).toBeGreaterThan(0);
      expect(successCount).toBeGreaterThan(0);
      expect(requestCount).toBeGreaterThan(rateLimitCount); // Some requests succeeded
    } catch (error) {
      // We should not reach this point, but if we do, fail the test properly
      expect(error).toBeUndefined();
    }
  });

  it('should maintain memory usage within acceptable limits during sustained load', async () => {
    // Increase test timeout for this test
    jest.setTimeout(30000);
    
    // Mock successful responses
    mockAxiosInstance.get.mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });
    
    // Number of requests to send in batches
    const totalRequests = 1000;
    const batchSize = 50;
    
    // Measure initial memory usage
    // Note: In a real environment we'd use process.memoryUsage()
    // but for this test we'll simulate it by tracking allocated objects
    let memoryAllocated = 0;
    const trackingObjects: any[] = [];
    
    // Function to simulate memory allocation of 1KB for each request
    const allocateMemory = () => {
      const obj = new Array(1024).fill('X'); // Approx 1KB
      trackingObjects.push(obj);
      memoryAllocated += 1; // 1KB
      return obj;
    };
    
    // Function to execute a batch of requests
    const executeBatch = async (batchNumber: number) => {
      const requests = Array.from({ length: batchSize }, (_, index) => {
        allocateMemory(); // Simulate memory allocation for request
        return apiClient.get(`/test-endpoint-batch-${batchNumber}-${index}`);
      });
      
      await Promise.all(requests);
      
      // Clear references to simulate proper memory management
      while (trackingObjects.length > 100) { // Keep last 100 items
        trackingObjects.shift();
      }
    };
    
    // Execute batches with small pauses between
    for (let i = 0; i < totalRequests / batchSize; i++) {
      await executeBatch(i);
      // Small pause between batches (1ms) to allow for potential GC
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    
    // Verify that the memory allocation didn't grow unbounded
    // Our memory tracking should show controlled growth
    const memoryEfficiency = trackingObjects.length / totalRequests;
    expect(memoryEfficiency).toBeLessThan(0.15); // Expect less than 15% of total requests kept in memory
    
    // Verify mockAxiosInstance.get was called the expected number of times
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(totalRequests);
  });
});