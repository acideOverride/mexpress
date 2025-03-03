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

describe('API Client Edge Cases Tests', () => {
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

  it('should handle HTTP error status codes properly', async () => {
    // Create error responses for different HTTP status codes
    const error400 = {
      response: {
        data: { error: 'Bad Request' },
        status: 400,
        statusText: 'Bad Request',
        headers: { 'content-type': 'application/json' }
      }
    };
    
    const error404 = {
      response: {
        data: { error: 'Not Found' },
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json' }
      }
    };
    
    const error500 = {
      response: {
        data: { error: 'Internal Server Error' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'content-type': 'application/json' }
      }
    };
    
    // Mock the axios methods to return different errors
    mockAxiosInstance.get
      .mockRejectedValueOnce(error400)
      .mockRejectedValueOnce(error404)
      .mockRejectedValueOnce(error500);
    
    // Test 400 Bad Request
    await expect(apiClient.get('/test-400')).rejects.toMatchObject({
      data: { error: 'Bad Request' },
      status: 400
    });
    
    // Test 404 Not Found
    await expect(apiClient.get('/test-404')).rejects.toMatchObject({
      data: { error: 'Not Found' },
      status: 404
    });
    
    // Test 500 Internal Server Error
    await expect(apiClient.get('/test-500')).rejects.toMatchObject({
      data: { error: 'Internal Server Error' },
      status: 500
    });
    
    // Verify that the API client made exactly one attempt for each error
    // (since we're not retrying non-timeout errors)
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
  });

  it('should handle malformed JSON responses', async () => {
    // Mock a successful response but with invalid JSON in the data
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: '{"invalid": "json", missing: "quotes"}',
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' }
    });
    
    // The response should be returned as-is without attempting to parse the JSON
    const response = await apiClient.get('/test-malformed-json');
    
    // Verify we got back the raw string
    expect(response.data).toBe('{"invalid": "json", missing: "quotes"}');
    expect(response.status).toBe(200);
  });

  it('should handle network errors that are not timeouts', async () => {
    // Create a network error that is not a timeout
    const networkError = new Error('Network Error: Connection refused');
    
    // Mock the axios get method to fail with network error
    mockAxiosInstance.get.mockRejectedValue(networkError);
    
    // The request should fail with the network error
    await expect(apiClient.get('/test-network-error')).rejects.toThrow('Network Error: Connection refused');
    
    // Verify that the API client made only one attempt (since it's not a timeout)
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
  });

  it('should handle empty response bodies', async () => {
    // Mock a successful response but with empty data
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: '',
      status: 204,
      statusText: 'No Content',
      headers: { 'content-type': 'text/plain' }
    });
    
    // The response should be handled gracefully
    const response = await apiClient.get('/test-empty-response');
    
    // Verify we got the empty response
    expect(response.data).toBe('');
    expect(response.status).toBe(204);
  });

  it('should handle unexpected content types', async () => {
    // Mock a successful response but with unexpected content type
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: '<html><body>Hello World</body></html>',
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/html' }
    });
    
    // The response should be returned as-is
    const response = await apiClient.get('/test-html-response');
    
    // Verify we got the HTML content
    expect(response.data).toBe('<html><body>Hello World</body></html>');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/html');
  });
});