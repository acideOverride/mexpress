/**
 * Auth interceptor implementation
 */
import { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from 'axios';

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

interface RequestWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
  headers: any;
}

/**
 * Setup auth interceptor for Axios
 * @param axiosInstance - The axios instance to add the interceptor to
 */
export function setupAuthInterceptor(axiosInstance: AxiosInstance): void {
  // Add request interceptor to add the token to outgoing requests
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    // For successful responses, just pass through
    response => response,
    
    // For errors, check if we need to refresh the token
    async (error: AxiosError) => {
      const originalRequest = error.config as RequestWithRetry | undefined;
      
      // If we get a 401 unauthorized error and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // Mark that we've tried refreshing
        originalRequest._retry = true;
        
        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          // Call the token refresh endpoint
          const response = await axiosInstance.post<TokenResponse>('/auth/refresh', {
            refreshToken: refreshToken
          });
          
          // If refresh was successful, store the new tokens
          if (response.data?.accessToken) {
            localStorage.setItem('auth_token', response.data.accessToken);
            if (response.data.refreshToken) {
              localStorage.setItem('refresh_token', response.data.refreshToken);
            }
            
            // Update the Authorization header with new token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            
            // Retry the original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // If token refresh fails, log the user out
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          
          // Redirect to login page
          global.location.href = '/login';
          
          return Promise.reject(refreshError);
        }
      }
      
      // If it's not a 401 or we already tried refreshing, just pass on the error
      return Promise.reject(error);
    }
  );
}