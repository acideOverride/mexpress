import { AxiosInstance } from 'axios';

// Simple test-specific implementation that works with our test mocks
export const setupAuthInterceptor = (apiClient: AxiosInstance) => {
  // Request interceptor - simplified for test compatibility
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      // Test-friendly direct usage of headers.set
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  // Response interceptor - handles 401 errors and token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await apiClient.post('/auth/refresh', { refreshToken });
          const newToken = response.data.data.token;
          
          localStorage.setItem('auth_token', newToken);
          originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          
          return apiClient.request(originalRequest);
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }
      
      return Promise.reject(error);
    }
  );
};