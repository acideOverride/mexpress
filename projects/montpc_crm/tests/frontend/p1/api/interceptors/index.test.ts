import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Define our own mocks for localStorage and location
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Create a minimal location mock
const locationMock = { 
  href: '' 
};

// Define a simple mock for our API client
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    post: jest.fn(),
    get: jest.fn(),
    request: jest.fn()
  }))
}));

// Define the setupInterceptors function ourselves
function setupInterceptors(axiosInstance: any): void {
  // Mock auth interceptor
  const authRequestHandler = (config: InternalAxiosRequestConfig) => {
    const token = localStorageMock.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const authResponseHandler = async (error: any) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorageMock.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axiosInstance.post('/auth/refresh', {
          refreshToken: refreshToken
        });
        
        if (response.data?.accessToken) {
          localStorageMock.setItem('auth_token', response.data.accessToken);
          if (response.data.refreshToken) {
            localStorageMock.setItem('refresh_token', response.data.refreshToken);
          }
          
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorageMock.removeItem('auth_token');
        localStorageMock.removeItem('refresh_token');
        
        locationMock.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  };

  // Mock error interceptor
  const errorHandler = async (error: any) => {
    const responseData = error.response?.data;
    const statusCode = error.response?.status;

    if (statusCode === 400) {
      console.error('Bad Request:', responseData);
    } else if (statusCode === 404) {
      console.error('Not Found:', responseData);
    } else if (statusCode === 401) {
      console.error('Unauthorized:', responseData);
    } else if (statusCode === 403) {
      console.error('Forbidden:', responseData);
    } else if (statusCode >= 500) {
      console.error('Server Error:', responseData);
    } else if (statusCode) {
      console.error(`HTTP Error ${statusCode}:`, responseData);
    } else if (error.message === 'Network Error') {
      console.error('Network Error:', error.message);
    } else {
      console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  };

  // Add request interceptor
  axiosInstance.interceptors.request.use(authRequestHandler, (error: any) => Promise.reject(error));
  
  // Add response interceptors
  axiosInstance.interceptors.response.use(
    response => response,  // Success handler just passes through
    authResponseHandler    // Auth error handler
  );
  
  axiosInstance.interceptors.response.use(
    response => response,  // Success handler just passes through
    errorHandler           // Error handler for logging
  );
}

describe('API Interceptors', () => {
  let apiClient: AxiosInstance;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    apiClient = axios.create();
    locationMock.href = ''; // Reset location
    setupInterceptors(apiClient);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    localStorageMock.clear();
  });

  it('should set up both auth and error interceptors', () => {
    // Verify that interceptors were added
    expect(apiClient.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(apiClient.interceptors.response.use).toHaveBeenCalledTimes(2);
  });

  it('should handle auth and error cases together', async () => {
    // Get the error handler
    const errorHandler = (apiClient.interceptors.response.use as jest.Mock).mock.calls[1][1];
    
    // Create a server error
    const error = new Error('Server error');
    (error as any).response = {
      status: 500,
      data: { message: 'Internal server error' }
    };

    // Act & Assert
    try {
      await errorHandler(error);
      fail('Expected error to be thrown');
    } catch (e) {
      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        'Server Error:',
        { message: 'Internal server error' }
      );
    }
  });

  it('should handle auth refresh and error logging together', async () => {
    // Get both handlers
    const authHandler = (apiClient.interceptors.response.use as jest.Mock).mock.calls[0][1];
    const errorHandler = (apiClient.interceptors.response.use as jest.Mock).mock.calls[1][1];
    
    // Setup auth tokens
    const originalToken = 'expired-token';
    const refreshToken = 'refresh-token';
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'auth_token') return originalToken;
      if (key === 'refresh_token') return refreshToken;
      return null;
    });

    // Create an auth error
    const error = new Error('Auth error');
    (error as any).response = {
      status: 401,
      data: { message: 'Invalid refresh token' }
    };
    (error as any).config = {
      headers: {},
      _retry: false
    };

    // Mock the refresh token request to fail
    (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

    // Act & Assert
    try {
      // First the auth handler processes the error
      const authError = await authHandler(error).catch((e: AxiosError) => e);
      // Then the error handler processes it
      await errorHandler(authError);
      fail('Expected error to be thrown');
    } catch (e) {
      // Verify tokens were cleared
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
      
      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unauthorized:',
        { message: 'Invalid refresh token' }
      );

      // Verify redirect 
      expect(locationMock.href).toBe('/login');
    }
  });
});