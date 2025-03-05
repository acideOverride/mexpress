import { ref, Ref } from 'vue';

/**
 * API request options
 */
export interface ApiRequestOptions {
  /** Base URL for API requests */
  baseUrl?: string;
  
  /** Request headers */
  headers?: Record<string, string>;
  
  /** Request body */
  body?: any;
  
  /** URL parameters */
  params?: Record<string, string>;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Whether to include credentials */
  withCredentials?: boolean;
}

/**
 * API response including metadata
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data: T;
  
  /** Response status code */
  status: number;
  
  /** Response headers */
  headers: Record<string, string>;
  
  /** Error message (if any) */
  error?: string;
}

/**
 * Composable for handling API requests
 * @param defaultOptions Default options for all requests
 * @returns Object with API request methods and state
 */
export function useApiClient(defaultOptions: ApiRequestOptions = {}) {
  const loading = ref(false);
  const error: Ref<Error | null> = ref(null);
  
  // Default options
  const options: ApiRequestOptions = {
    baseUrl: '/api',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 30000,
    withCredentials: true,
    ...defaultOptions
  };
  
  /**
   * Build URL with parameters
   * @param url Base URL
   * @param params URL parameters
   * @returns URL with query parameters
   */
  const buildUrl = (url: string, params?: Record<string, string>): string => {
    // Add base URL if URL is relative
    const fullUrl = url.startsWith('http') ? url : `${options.baseUrl}${url}`;
    
    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      return `${fullUrl}?${queryParams.toString()}`;
    }
    
    return fullUrl;
  };
  
  /**
   * Make HTTP request
   * @param method HTTP method
   * @param url Request URL
   * @param requestOptions Request options
   * @returns Promise resolving to response data
   */
  const request = async <T = any>(
    method: string,
    url: string,
    requestOptions: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    loading.value = true;
    error.value = null;
    
    // Merge default and request-specific options
    const mergedOptions: ApiRequestOptions = {
      ...options,
      ...requestOptions,
      headers: {
        ...options.headers,
        ...requestOptions.headers
      }
    };
    
    // Build fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: mergedOptions.headers as HeadersInit,
      credentials: mergedOptions.withCredentials ? 'include' : 'same-origin'
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && mergedOptions.body) {
      fetchOptions.body = typeof mergedOptions.body === 'string'
        ? mergedOptions.body
        : JSON.stringify(mergedOptions.body);
    }
    
    // Create abort controller for timeout
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;
    
    // Setup timeout if specified
    let timeoutId: number | undefined;
    if (mergedOptions.timeout) {
      timeoutId = window.setTimeout(() => controller.abort(), mergedOptions.timeout);
    }
    
    try {
      // Make request
      const fullUrl = buildUrl(url, mergedOptions.params);
      const response = await fetch(fullUrl, fetchOptions);
      
      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      
      // Parse response body based on content type
      let data: any = null;
      const contentType = response.headers.get('Content-Type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        // Binary data
        data = await response.blob();
      }
      
      // Return formatted response
      return {
        data,
        status: response.status,
        headers: responseHeaders,
        error: !response.ok ? response.statusText : undefined
      };
    } catch (err) {
      // Handle request errors
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value = err as Error;
      
      return {
        data: null,
        status: 0,
        headers: {},
        error: errorMessage
      };
    } finally {
      // Clean up
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      loading.value = false;
    }
  };
  
  // Define HTTP method helpers
  const get = <T = any>(url: string, options?: ApiRequestOptions) => 
    request<T>('GET', url, options);
  
  const post = <T = any>(url: string, body?: any, options?: ApiRequestOptions) => 
    request<T>('POST', url, { ...options, body });
  
  const put = <T = any>(url: string, body?: any, options?: ApiRequestOptions) => 
    request<T>('PUT', url, { ...options, body });
  
  const del = <T = any>(url: string, options?: ApiRequestOptions) => 
    request<T>('DELETE', url, options);
  
  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del
  };
}