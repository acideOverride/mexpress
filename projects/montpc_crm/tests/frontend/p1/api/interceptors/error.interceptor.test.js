/**
 * Tests for error interceptor
 * 
 * @BRQ MEXP-2025-007-BE
 */

const { setupErrorInterceptor } = require('./error');

// Create mock AxiosError class
class AxiosError extends Error {
  constructor(message, code, config, request, response) {
    super(message);
    this.message = message;
    this.code = code;
    this.config = config;
    this.request = request;
    this.response = response;
    this.isAxiosError = true;
  }
}

describe('ErrorInterceptor', () => {
  let apiClient;
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create mock axios instance
    apiClient = {
      interceptors: {
        response: {
          use: jest.fn((fulfilled, rejected) => {
            apiClient.interceptors.response.handlers = apiClient.interceptors.response.handlers || [];
            apiClient.interceptors.response.handlers.push({ fulfilled, rejected });
            return (apiClient.interceptors.response.handlers.length - 1);
          }),
          handlers: []
        }
      }
    };
    
    setupErrorInterceptor(apiClient);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should pass through successful responses', async () => {
    // Arrange
    const successResponse = { data: { success: true } };
    const handler = apiClient.interceptors.response.handlers[0].fulfilled;

    // Act
    const result = handler(successResponse);

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
      }
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected;

    // Act & Assert
    await expect(handler(error)).rejects.toEqual(error);
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
      }
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected;

    // Act & Assert
    await expect(handler(error)).rejects.toEqual(error);
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
      }
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected;

    // Act & Assert
    await expect(handler(error)).rejects.toEqual(error);
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

    const handler = apiClient.interceptors.response.handlers[0].rejected;

    // Act & Assert
    await expect(handler(error)).rejects.toEqual(error);
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
      }
    );

    const handler = apiClient.interceptors.response.handlers[0].rejected;

    // Act & Assert
    await expect(handler(error)).rejects.toEqual(error);
    expect(consoleSpy).toHaveBeenCalledWith('HTTP Error 418:', { message: "I'm a teapot" });
  });
});