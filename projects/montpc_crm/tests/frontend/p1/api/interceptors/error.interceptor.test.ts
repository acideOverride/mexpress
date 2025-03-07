import { setupErrorInterceptor } from './error';
import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  InternalAxiosRequestConfig, 
  AxiosError,
  AxiosHeaders 
} from 'axios';

interface MockInterceptor<T> {
  use(onFulfilled?: ((value: T) => T | Promise<T>) | null, onRejected?: ((error: any) => any) | null): number;
  handlers: Array<{
    fulfilled: ((value: T) => T | Promise<T>) | null;
    rejected: ((error: any) => any) | null;
  }>;
}

type ResponseHandler = (response: AxiosResponse) => AxiosResponse;
type ErrorHandler = (error: any) => Promise<any>;

describe('ErrorInterceptor', () => {
  let apiClient: AxiosInstance & {
    interceptors: {
      response: MockInterceptor<AxiosResponse>;
    };
  };
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Create mock axios instance
    apiClient = {
      ...axios.create(),
      interceptors: {
        response: {
          use: jest.fn((fulfilled, rejected) => {
            (apiClient.interceptors.response.handlers ??= []).push({ fulfilled, rejected });
            return (apiClient.interceptors.response.handlers.length - 1);
          }),
          handlers: []
        }
      }
    } as any;
    
    setupErrorInterceptor(apiClient);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should pass through successful responses', async () => {
    // Arrange
    const successResponse = { data: { success: true } };
    const handler = apiClient.interceptors.response.handlers[0].fulfilled as ResponseHandler;

    // Act
    const result = await handler(successResponse as AxiosResponse);

    // Assert
    expect(result).toBe(successResponse);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should handle 400 Bad Request errors', async () => {
    // Arrange
    const error = new AxiosError(
      'Bad Request',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        data: { message: 'Invalid input' }
      } as AxiosResponse
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;

    // Act & Assert
    await expect(handler(error)).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Bad Request:', { message: 'Invalid input' });
  });

  it('should handle 404 Not Found errors', async () => {
    // Arrange
    const error = new AxiosError(
      'Not Found',
      'ERR_NOT_FOUND',
      undefined,
      undefined,
      {
        status: 404,
        data: { message: 'Resource not found' }
      } as AxiosResponse
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;

    // Act & Assert
    await expect(handler(error)).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Not Found:', { message: 'Resource not found' });
  });

  it('should handle 500 Server errors', async () => {
    // Arrange
    const error = new AxiosError(
      'Server Error',
      'ERR_SERVER_ERROR',
      undefined,
      undefined,
      {
        status: 500,
        data: { message: 'Internal server error' }
      } as AxiosResponse
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;

    // Act & Assert
    await expect(handler(error)).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Server Error:', { message: 'Internal server error' });
  });

  it('should handle network errors', async () => {
    // Arrange
    const error = new AxiosError(
      'Network Error',
      'ERR_NETWORK',
      undefined,
      undefined,
      undefined
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;

    // Act & Assert
    await expect(handler(error)).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Network Error:', 'Network Error');
  });

  it('should handle unknown error status codes', async () => {
    // Arrange
    const error = new AxiosError(
      "I'm a teapot",
      'ERR_TEAPOT',
      undefined,
      undefined,
      {
        status: 418,
        data: { message: "I'm a teapot" }
      } as AxiosResponse
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected as ErrorHandler;

    // Act & Assert
    await expect(handler(error)).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('HTTP Error 418:', { message: "I'm a teapot" });
  });
});