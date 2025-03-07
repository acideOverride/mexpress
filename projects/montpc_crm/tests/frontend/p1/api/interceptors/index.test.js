const { setupInterceptors } = require('./index.js.fixed');
const axios = require('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    },
    post: jest.fn(),
    get: jest.fn(),
    request: jest.fn()
  }))
}));

describe('API Interceptors', () => {
  let apiClient;
  let consoleSpy;
  let originalLocation;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    apiClient = axios.create();
    setupInterceptors(apiClient);

    // Save original location and mock it
    originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '' };
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    localStorageMock.clear();
    // Restore original location
    window.location = originalLocation;
  });

  it('should set up both auth and error interceptors', () => {
    // Verify that interceptors were added
    expect(apiClient.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(apiClient.interceptors.response.use).toHaveBeenCalledTimes(2);
  });

  it('should handle auth and error cases together', async () => {
    // Get the error handler
    const errorHandler = apiClient.interceptors.response.use.mock.calls[1][1];
    
    // Create a server error
    const error = new Error('Server error');
    error.response = {
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
    const authHandler = apiClient.interceptors.response.use.mock.calls[0][1];
    const errorHandler = apiClient.interceptors.response.use.mock.calls[1][1];
    
    // Setup auth tokens
    const originalToken = 'expired-token';
    const refreshToken = 'refresh-token';
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'auth_token') return originalToken;
      if (key === 'refresh_token') return refreshToken;
      return null;
    });

    // Create an auth error
    const error = new Error('Auth error');
    error.response = {
      status: 401,
      data: { message: 'Invalid refresh token' }
    };
    error.config = {
      headers: {},
      _retry: false
    };

    // Mock the refresh token request to fail
    apiClient.post.mockRejectedValueOnce(error);

    // Act & Assert
    try {
      // First the auth handler processes the error
      const authError = await authHandler(error).catch(e => e);
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
      expect(window.location.href).toBe('/login');
    }
  });
});