import { setupAuthInterceptor } from '../auth';
import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  InternalAxiosRequestConfig, 
  AxiosHeaders
} from 'axios';
import { localStorageMock } from '../../../setupTests';

interface MockInterceptor<T> {
  use(onFulfilled?: ((value: T) => T | Promise<T>) | null, onRejected?: ((error: any) => any) | null): number;
  handlers: Array<{
    fulfilled: ((value: T) => T | Promise<T>) | null;
    rejected: ((error: any) => any) | null;
  }>;
}

type RequestHandler = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
type ResponseHandler = (response: AxiosResponse) => AxiosResponse;
type ErrorHandler = (error: any) => Promise<any>;

describe('AuthInterceptor', () => {
  let apiClient: AxiosInstance & {
    interceptors: {
      request: MockInterceptor<InternalAxiosRequestConfig>;
      response: MockInterceptor<AxiosResponse>;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock axios instance
    apiClient = {
      ...axios.create(),
      interceptors: {
        request: {
          use: jest.fn((fulfilled) => {
            (apiClient.interceptors.request.handlers ??= []).push({ fulfilled, rejected: null });
            return (apiClient.interceptors.request.handlers.length - 1);
          }),
          handlers: []
        },
        response: {
          use: jest.fn((fulfilled, rejected) => {
            (apiClient.interceptors.response.handlers ??= []).push({ fulfilled, rejected });
            return (apiClient.interceptors.response.handlers.length - 1);
          }),
          handlers: []
        }
      },
      post: jest.fn(),
      get: jest.fn(),
      request: jest.fn()
    } as any;
    
    setupAuthInterceptor(apiClient);
  });

  describe('request interceptor', () => {
    it('should add auth token to request headers when token exists', () => {
      // Arrange
      const token = 'test-token';
      localStorageMock.getItem.mockReturnValue(token);
      const headers = new AxiosHeaders();
      const config: InternalAxiosRequestConfig = { headers };

      // Act
      const handler = apiClient.interceptors.request.handlers[0].fulfilled as RequestHandler;
      const result = handler(config);

      // Assert
      expect(result.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });

    it('should not add auth token when token does not exist', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null);
      const headers = new AxiosHeaders();
      const config: InternalAxiosRequestConfig = { headers };

      // Act
      const handler = apiClient.interceptors.request.handlers[0].fulfilled as RequestHandler;
      const result = handler(config);

      // Assert
      expect(result.headers.get('Authorization')).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('should attempt token refresh on 401 error', async () => {
      // Arrange
      const originalToken = 'expired-token';
      const refreshToken = 'refresh-token';
      const newToken = 'new-token';

      localStorageMock.getItem
        .mockImplementation((key: string) => {
          if (key === 'auth_token') return originalToken;
          if (key === 'refresh_token') return refreshToken;
          return null;
        });

      const mockError = {
        config: { 
          headers: new AxiosHeaders(),
          _retry: false
        },
        response: { status: 401 }
      };

      // Mock successful token refresh
      const mockRefreshResponse = { data: { data: { token: newToken } } };
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockRefreshResponse);

      // Mock successful retry of original request
      const mockRetryResponse = { data: { success: true } };
      (apiClient.request as jest.Mock).mockResolvedValueOnce(mockRetryResponse);

      // Act
      const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;
      const result = await handler(mockError);

      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', newToken);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken });
      expect(result).toEqual(mockRetryResponse);
    });

    it('should clear tokens and redirect to login on refresh token failure', async () => {
      // Arrange
      const originalToken = 'expired-token';
      const refreshToken = 'invalid-refresh-token';

      localStorageMock.getItem
        .mockImplementation((key: string) => {
          if (key === 'auth_token') return originalToken;
          if (key === 'refresh_token') return refreshToken;
          return null;
        });

      const mockError = {
        config: { 
          headers: new AxiosHeaders(),
          _retry: false
        },
        response: { status: 401 }
      };

      // Mock failed token refresh
      (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));

      // Mock window.location
      const locationMock = { href: '' };
      Object.defineProperty(window, 'location', {
        value: locationMock,
        writable: true
      });

      // Act & Assert
      const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;
      try {
        await handler(mockError);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
        expect(locationMock.href).toBe('/login');
      }
    });
  });
});