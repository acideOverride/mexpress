/**
 * Simplified rate limiter implementation for testing
 * Handles rate limiting with token bucket algorithm
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuration options for the rate limiting client
 */
export interface RateLimiterOptions {
  baseURL: string;
  timeout?: number;
  maxRequestsPerSecond?: number;
  retryDelay?: number;
}

/**
 * Response structure returned by the client
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * A simplified rate limiter for testing
 */
export class SimplifiedRateLimiter {
  private axiosInstance: AxiosInstance;
  private maxRequestsPerSecond: number;
  private retryDelay: number;
  private tokenBucket: { tokens: number; lastRefill: number };

  constructor(options: RateLimiterOptions) {
    const { 
      baseURL, 
      timeout = 5000, 
      maxRequestsPerSecond = 5,
      retryDelay = 1000 
    } = options;

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.maxRequestsPerSecond = maxRequestsPerSecond;
    this.retryDelay = retryDelay;
    this.tokenBucket = {
      tokens: maxRequestsPerSecond,
      lastRefill: Date.now()
    };
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.tokenBucket.lastRefill) / 1000;
    
    if (elapsedSeconds > 0) {
      // Add tokens based on time elapsed
      const newTokens = elapsedSeconds * this.maxRequestsPerSecond;
      
      // Update token count (don't exceed max)
      this.tokenBucket.tokens = Math.min(
        this.maxRequestsPerSecond,
        this.tokenBucket.tokens + newTokens
      );
      
      this.tokenBucket.lastRefill = now;
    }
  }

  /**
   * Wait for rate limit if needed
   */
  private async waitForRateLimit(): Promise<void> {
    // Refill tokens first
    this.refillTokens();
    
    // If we have a token, consume it and continue
    if (this.tokenBucket.tokens >= 1) {
      this.tokenBucket.tokens -= 1;
      return;
    }
    
    // Otherwise, calculate wait time
    const waitTime = (1 / this.maxRequestsPerSecond) * 1000;
    
    // Wait for the calculated time
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Try again (recursively)
    return this.waitForRateLimit();
  }

  /**
   * Perform a GET request with rate limiting
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    // Wait for rate limit
    await this.waitForRateLimit();
    
    try {
      // Perform the request
      const response = await this.axiosInstance.get<T>(url, config);
      
      // Return formatted response
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
      };
    } catch (error: any) {
      // Handle rate limit errors
      if (error.response && error.response.status === 429) {
        // Get retry delay from header or use default
        const retryAfter = error.response.headers['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : this.retryDelay;
        
        // Wait for specified delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the request
        return this.get<T>(url, config);
      }
      
      // Re-throw other errors
      throw error;
    }
  }
}