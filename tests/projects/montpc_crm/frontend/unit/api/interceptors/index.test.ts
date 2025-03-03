import { setupInterceptors } from '../index';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { localStorageMock } from '../../../setupTests';

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
  let apiClient: AxiosInstance;
  let consoleSpy: jest.SpyInstance;
  let originalLocation: Location;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    apiClient = axios.create();
    setupInterceptors(apiClient);

    // Save original location and mock it
    originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as Location;
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
      expect(window.location.href).toBe('/login');
    }
  });
});