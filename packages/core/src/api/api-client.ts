import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientOptions {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private retries: number;
  private retryDelay: number;

  constructor(options: ApiClientOptions) {
    const { baseURL, timeout = 5000, retries = 3, retryDelay = 1000 } = options;
    
    this.retries = retries;
    this.retryDelay = retryDelay;
    
    this.axiosInstance = axios.create({
      baseURL,
      timeout, // Default timeout of 5 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
   * Executes a request with retry logic
   * This implements exponential backoff with jitter for retry attempts
   */
  private async executeRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<ApiResponse<T>> {
    let lastError: Error = new Error('Request failed');
    let attempt = 0;

    while (attempt <= this.retries) {
      try {
        const response = await requestFn();
        
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers as Record<string, string>,
        };
      } catch (error: unknown) {
        // Cast error to Error or create a new Error if it's not
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // If this is an HTTP error response (not a network error)
        if ((error as any).response) {
          const response = (error as any).response;
          
          // Return the error response with status code and data
          const apiError: any = new Error(`API Error: ${response.status} ${response.statusText}`);
          apiError.status = response.status;
          apiError.statusText = response.statusText;
          apiError.data = response.data;
          apiError.headers = response.headers;
          
          throw apiError;
        }
        
        // Check if we should retry
        const isTimeoutError =
          lastError.message.includes('timeout') ||
          (lastError as any).code === 'ECONNABORTED';
        
        // Don't retry if it's not a timeout/connection error or we've exhausted retries
        if (!isTimeoutError || attempt >= this.retries) {
          break;
        }
        
        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          this.retryDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5),
          30000 // Max 30 seconds
        );
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
        
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
}