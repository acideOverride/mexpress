/**
 * Base API Service
 * Configures and exports the HTTP client for API requests
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// API Configuration
const API_CONFIG: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Only try to access localStorage in a browser environment
    if (isBrowser && config.headers) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only run browser-specific code in a browser environment
    if (isBrowser) {
      // Handle 401 Unauthorized
      if (error.response && error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (error.response && error.response.status === 403) {
        console.error('Access forbidden');
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API service class
class ApiService {
  // Get request
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Post request
  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Put request
  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Patch request
  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Delete request
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  // Error handling
  private static handleError(error: any): never {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with an error status
      errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }
    
    console.error('API Error:', errorMessage);
    throw new Error(errorMessage);
  }
}

export default ApiService;