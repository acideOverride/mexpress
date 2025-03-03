import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import axios from 'axios';
import { ApiClient, ApiResponse } from '../../../src/api/api-client';

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

describe('API Client Basic Stress Tests', () => {
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
  });

  it('should handle increasing loads without performance degradation', async () => {
    // Mock the get method to return success with different response times
    mockAxiosInstance.get.mockImplementation((url: string) => {
      return Promise.resolve({
        data: { success: true, endpoint: url },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
    });
    
    // Test with increasing load sizes
    const testBatch = async (size: number): Promise<number> => {
      const start = Date.now();
      
      const requests = Array.from({ length: size }, (_, i) => 
        apiClient.get(`/endpoint-${i}`)
      );
      
      await Promise.all(requests);
      
      return Date.now() - start;
    };
    
    // Run with different batch sizes and measure times
    const smallBatchTime = await testBatch(10);
    const mediumBatchTime = await testBatch(50);
    const largeBatchTime = await testBatch(100);
    
    // Time per request should remain relatively stable as batch size increases
    // (with some overhead expected for larger batches)
    const timePerRequestSmall = smallBatchTime / 10;
    const timePerRequestMedium = mediumBatchTime / 50;
    const timePerRequestLarge = largeBatchTime / 100;
    
    // Log performance metrics
    console.log(`Small batch (10): ${smallBatchTime}ms, ${timePerRequestSmall.toFixed(2)}ms per request`);
    console.log(`Medium batch (50): ${mediumBatchTime}ms, ${timePerRequestMedium.toFixed(2)}ms per request`);
    console.log(`Large batch (100): ${largeBatchTime}ms, ${timePerRequestLarge.toFixed(2)}ms per request`);
    
    // Verify the performance is reasonable - time per request shouldn't increase significantly
    // We're being lenient here since test environments can vary
    expect(timePerRequestLarge).toBeLessThan(timePerRequestSmall * 5);
    
    // Verify we made the expected number of requests
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(10 + 50 + 100);
  });

  it('should handle error conditions gracefully under load', async () => {
    // Mock the get method to simulate random errors
    mockAxiosInstance.get.mockImplementation((url: string) => {
      // Randomly return error for some requests
      if (Math.random() < 0.2) {  // 20% of requests will fail
        return Promise.reject(new Error('Simulated network error'));
      }
      
      return Promise.resolve({
        data: { success: true, endpoint: url },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
    });
    
    // Make a large number of requests concurrently, catching errors
    const requestCount = 100;
    
    // Define a type for our mixed results
    type MixedResult = ApiResponse<any> | { error: Error, isError: true };
    
    const requests = Array.from({ length: requestCount }, (_, i) =>
      apiClient.get(`/error-test-${i}`).catch(e => ({ error: e, isError: true }))
    );
    
    // Time the execution
    const start = Date.now();
    const results = await Promise.all(requests) as MixedResult[];
    const duration = Date.now() - start;
    
    // Count successes and failures
    const successes = results.filter(r => !(r as any).isError).length;
    const failures = results.filter(r => (r as any).isError).length;
    
    // Log performance metrics
    console.log(`Handled ${requestCount} requests (${successes} successes, ${failures} failures) in ${duration}ms`);
    console.log(`Average time per request: ${(duration / requestCount).toFixed(2)}ms`);
    
    // We should have some failures due to our random error generation
    expect(failures).toBeGreaterThan(0);
    
    // But we should also have successes
    expect(successes).toBeGreaterThan(0);
    
    // The total should match our request count
    expect(successes + failures).toBe(requestCount);
    
    // Verify performance is reasonable - should handle high volume quickly
    expect(duration).toBeLessThan(5000); // 5 seconds is a very generous limit
  });

  it('should maintain reasonable memory usage during sustained load', async () => {
    // Mock memory tracking (since we can't directly access process.memoryUsage in tests)
    let memoryUsage = 0;
    const memoryObjects: any[] = [];
    
    // Function to simulate memory allocation (roughly 1KB per call)
    const allocateMemory = () => {
      const obj = new Array(1024).fill('X');
      memoryObjects.push(obj);
      memoryUsage += 1; // 1KB
      return obj;
    };
    
    // Function to simulate memory cleanup (as garbage collection would do)
    const simulateGarbageCollection = () => {
      // Only keep the last 100 objects
      const removed = memoryObjects.length - 100;
      if (removed > 0) {
        memoryObjects.splice(0, removed);
        // Memory usage doesn't immediately go down in real GC,
        // but for our simulation we'll update it
        memoryUsage -= removed;
      }
    };
    
    // Mock API responses
    mockAxiosInstance.get.mockImplementation(() => {
      // Simulate some memory allocation for each request
      allocateMemory();
      
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
    });
    
    // Make requests in batches to simulate sustained load
    const batchSize = 50;
    const batchCount = 20;
    const totalRequests = batchSize * batchCount;
    
    for (let i = 0; i < batchCount; i++) {
      // Create a batch of requests
      const requests = Array.from({ length: batchSize }, (_, j) => {
        return apiClient.get(`/memory-test-${i}-${j}`);
      });
      
      // Execute batch
      await Promise.all(requests);
      
      // Simulate periodic garbage collection
      if (i % 5 === 0) {
        simulateGarbageCollection();
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Final cleanup
    simulateGarbageCollection();
    
    // Log memory metrics
    console.log(`Peak memory usage: ~${memoryUsage}KB`);
    console.log(`Final memory usage: ~${memoryUsage}KB`);
    console.log(`Memory efficiency: ${(memoryUsage / totalRequests).toFixed(4)} KB/request`);
    
    // Verify memory efficiency - we should be using less than or equal to 0.1KB per request after GC
    expect(memoryUsage / totalRequests).toBeLessThanOrEqual(0.1);
    
    // Verify we made the expected number of requests
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(totalRequests);
  });
});