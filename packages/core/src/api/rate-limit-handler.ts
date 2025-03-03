import { ApiClient, ApiResponse, ApiClientOptions } from './api-client';
import { TokenBucket } from './token-bucket';

/**
 * RateLimitingApiClient configuration
 */
export interface RateLimitingApiClientOptions extends ApiClientOptions {
  /**
   * Maximum requests per second (default: 5)
   */
  maxRequestsPerSecond?: number;
  
  /**
   * Maximum concurrent requests (default: 10)
   */
  maxConcurrentRequests?: number;
  
  /**
   * Whether to track rate limits per endpoint (default: true)
   */
  trackPerEndpoint?: boolean;
}

/**
 * Extended API client that automatically handles rate limiting
 * using token bucket algorithm and respecting retry-after headers
 */
export class RateLimitingApiClient extends ApiClient {
  private globalBucket: TokenBucket;
  private endpointBuckets: Map<string, TokenBucket> = new Map();
  private activeRequests: number = 0;
  private maxConcurrentRequests: number;
  private trackPerEndpoint: boolean;
  private requestQueue: Array<() => Promise<void>> = [];
  private processingQueue: boolean = false;

  constructor(options: RateLimitingApiClientOptions) {
    super(options);
    
    const { 
      maxRequestsPerSecond = 5,
      maxConcurrentRequests = 10,
      trackPerEndpoint = true
    } = options;
    
    // Initialize the global token bucket
    this.globalBucket = new TokenBucket(maxRequestsPerSecond, maxRequestsPerSecond);
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.trackPerEndpoint = trackPerEndpoint;
  }

  /**
   * Process the request queue when slots are available
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.requestQueue.length === 0) {
      return;
    }
    
    this.processingQueue = true;
    
    try {
      // Keep processing until the queue is empty
      while (this.requestQueue.length > 0) {
        // If we're at max concurrent requests, wait for some to finish
        if (this.activeRequests >= this.maxConcurrentRequests) {
          await new Promise(resolve => setTimeout(resolve, 50));
          continue;
        }
        
        // Get and execute the next request
        const nextRequest = this.requestQueue.shift();
        if (nextRequest) {
          // Don't await - we want to execute concurrently up to the limit
          nextRequest();
        }
      }
    } finally {
      this.processingQueue = false;
    }
  }

  /**
   * Get a token bucket for a specific endpoint
   */
  private getEndpointBucket(endpoint: string): TokenBucket {
    if (!this.trackPerEndpoint) {
      return this.globalBucket;
    }
    
    // Extract the base endpoint path without query params
    const basePath = endpoint.split('?')[0];
    
    // Create a new bucket if one doesn't exist for this endpoint
    if (!this.endpointBuckets.has(basePath)) {
      // Start with a more conservative rate for new endpoints
      this.endpointBuckets.set(basePath, new TokenBucket(3, 3));
    }
    
    return this.endpointBuckets.get(basePath)!;
  }

  /**
   * Wait for rate limit tokens to be available
   */
  private async waitForRateLimit(endpoint: string): Promise<void> {
    // Wait for the global rate limit
    await this.globalBucket.consume(1);
    
    // Also wait for the endpoint-specific rate limit if tracking per endpoint
    if (this.trackPerEndpoint) {
      const endpointBucket = this.getEndpointBucket(endpoint);
      await endpointBucket.consume(1);
    }
  }

  /**
   * Execute a request with rate limiting and concurrency control
   */
  private async executeWithRateLimit<T>(
    endpoint: string,
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    // If we're at max concurrent requests, queue this request
    if (this.activeRequests >= this.maxConcurrentRequests) {
      return new Promise<ApiResponse<T>>((resolve, reject) => {
        this.requestQueue.push(async () => {
          try {
            const result = await this.executeWithRateLimit(endpoint, requestFn);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        
        // Start processing the queue
        this.processQueue();
      });
    }
    
    // Wait for rate limit tokens to be available
    await this.waitForRateLimit(endpoint);
    
    // Track active requests
    this.activeRequests++;
    
    try {
      // Execute the request
      return await requestFn();
    } catch (error: any) {
      // Handle rate limiting errors
      if ((error.status === 429) || (error.response && error.response.status === 429)) {
        // Get retry delay from header or use default
        const headers = error.response ? error.response.headers : error.headers;
        const retryAfter = parseInt(headers['retry-after'] || '1', 10) * 1000;
        
        // Reduce rate limit for this endpoint if tracking per endpoint
        if (this.trackPerEndpoint) {
          const bucket = this.getEndpointBucket(endpoint);
          // Adjust the refill rate based on the retry-after header
          // We can adjust the token bucket implementation to support this better
        }
        
        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        
        // Retry the request
        return await this.executeWithRateLimit(endpoint, requestFn);
      }
      
      // Rethrow other errors
      throw error;
    } finally {
      // Decrement active requests counter
      this.activeRequests--;
      
      // Process any queued requests
      this.processQueue();
    }
  }

  /**
   * Overrides the get method to handle rate limiting
   */
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRateLimit<T>(url, () => super.get<T>(url, config));
  }

  /**
   * Overrides the post method to handle rate limiting
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRateLimit<T>(url, () => super.post<T>(url, data, config));
  }

  /**
   * Overrides the put method to handle rate limiting
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRateLimit<T>(url, () => super.put<T>(url, data, config));
  }

  /**
   * Overrides the delete method to handle rate limiting
   */
  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRateLimit<T>(url, () => super.delete<T>(url, config));
  }
}