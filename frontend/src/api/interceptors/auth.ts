import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosHeaders } from 'axios';

interface RequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const setupAuthInterceptor = (apiClient: AxiosInstance) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      
      return config;
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    // Success handler
    (response: AxiosResponse) => response,
    
    // Error handler
    async (error: AxiosError) => {
      const originalRequest = error.config as RequestConfig;
      
      if (!originalRequest || !error.response) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized errors
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await apiClient.post<{ data: { token: string } }>('/auth/refresh', { refreshToken });
          const { token } = response.data.data;
          
          // Store new token
          localStorage.setItem('auth_token', token);
          
          // Update the authorization header
          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
          
          // Retry the original request
          return apiClient.request(originalRequest);
        } catch (refreshError) {
          // Clear tokens on refresh failure
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          
          // Redirect to login
          window.location.href = '/login';
          
          // Let the error interceptor handle the error logging
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};