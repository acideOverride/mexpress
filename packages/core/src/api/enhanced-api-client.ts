import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Enhanced API client options
 */
export interface EnhancedApiClientOptions {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  validateStatus?: (status: number) => boolean;
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Enhanced API client with improved error handling and retry logic
 * Fixes for:
 * - P0: External API unavailability with better timeout handling
 * - P2: Response format changes with improved error handling
 */
export class EnhancedApiClient {
  private axiosInstance: AxiosInstance;
  private retries: number;
  private retryDelay: number;
  private responseFormatAdapter?: (response: any) => any;

  /**
   * Create a new Enhanced API Client
   */
  constructor(options: EnhancedApiClientOptions) {
    const { 
      baseURL, 
      timeout = 5000, 
      retries = 3, 
      retryDelay = 1000,
      headers = {},
      validateStatus
    } = options;
    
    this.retries = retries;
    this.retryDelay = retryDelay;
    
    // Create axios instance with defaults
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      validateStatus,
      // Ensure we don't try to parse invalid JSON
      transformResponse: [
        (data: any) => {
          if (typeof data !== 'string') return data;
          
          try {
            return JSON.parse(data);
          } catch (e) {
            // Return the original string if parsing fails
            return data;
          }
        }
      ]
    });
  }

  /**
   * Set a response format adapter for API schema compatibility
   */
  setResponseFormatAdapter(adapter: (response: any) => any): void {
    this.responseFormatAdapter = adapter;
  }

  /**
   * Performs a GET request with retry logic
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.get<T>(url, config));
  }

  /**
   * Performs a POST request with retry logic
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.post<T>(url, data, config));
  }

  /**
   * Performs a PUT request with retry logic
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.put<T>(url, data, config));
  }

  /**
   * Performs a DELETE request with retry logic
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(() => this.axiosInstance.delete<T>(url, config));
  }

  /**
   * Executes a request with improved retry logic
   * Enhanced with better error handling and backoff
   */
  private async executeRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<ApiResponse<T>> {
    let lastError: Error = new Error('Request failed');
    let attempt = 0;

    while (attempt <= this.retries) {
      try {
        // Try to execute the request
        const response = await requestFn();
        
        // Apply response format adapter if configured
        let data = response.data;
        if (this.responseFormatAdapter) {
          data = this.responseFormatAdapter(data);
        }
        
        // Return successful response
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers as Record<string, string>,
        };
      } catch (error: unknown) {
        // Cast error to Error or create a new Error if it's not
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Get detailed error information
        const axiosError = error as any;
        
        // If this is an HTTP error response (not a network error)
        if (axiosError.response) {
          const response = axiosError.response;
          
          // Create an enhanced error object with all relevant details
          const apiError: any = new Error(`API Error: ${response.status} ${response.statusText}`);
          apiError.status = response.status;
          apiError.statusText = response.statusText;
          apiError.data = response.data;
          apiError.headers = response.headers;
          apiError.request = axiosError.request;
          
          // Non-retryable HTTP status errors
          if (response.status >= 400 && response.status !== 429) {
            throw apiError;
          }
          
          // Handle rate limiting (429) with special retry logic
          if (response.status === 429) {
            const retryAfter = parseInt(response.headers['retry-after'] || '1', 10);
            const retryDelay = retryAfter * 1000;
            
            // Wait for the specified delay
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            
            // Increment attempt and continue
            attempt++;
            continue;
          }
        }
        
        // Check if we should retry network errors
        const isRetryableError =
          lastError.message.includes('timeout') ||
          lastError.message.includes('Network Error') ||
          axiosError.code === 'ECONNABORTED' ||
          axiosError.code === 'ECONNRESET' ||
          axiosError.code === 'ENOTFOUND';
        
        // Don't retry if it's not a retryable error or we've exhausted retries
        if (!isRetryableError || attempt >= this.retries) {
          break;
        }
        
        // Calculate delay with improved exponential backoff and jitter
        const baseDelay = this.retryDelay * Math.pow(2, attempt);
        const jitter = baseDelay * (0.5 + Math.random() * 0.5);
        const delay = Math.min(jitter, 30000); // Max 30 seconds
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increment attempt counter
        attempt++;
      }
    }

    // If we get here, all retries failed
    throw lastError;
  }

  /**
   * Set global request timeout
   */
  setTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }

  /**
   * Set number of retry attempts
   */
  setRetries(retries: number): void {
    this.retries = retries;
  }

  /**
   * Set base delay between retries
   */
  setRetryDelay(delay: number): void {
    this.retryDelay = delay;
  }

  /**
   * Get the underlying axios instance for advanced configuration
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export the original ApiClient type for backwards compatibility
export { ApiClient } from './api-client';