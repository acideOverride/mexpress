/**
 * Tests for API interceptors setup
 * 
 * @BRQ MEXP-2025-007-BE
 */

const { setupInterceptors } = require('./index');

// Mock the auth and error interceptors
jest.mock('./auth', () => ({
  setupAuthInterceptor: jest.fn()
}));

jest.mock('./error', () => ({
  setupErrorInterceptor: jest.fn()
}));

// Import the mocked modules
const { setupAuthInterceptor } = require('./auth');
const { setupErrorInterceptor } = require('./error');

describe('API Interceptors', () => {
  let apiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock axios instance
    apiClient = {
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };
  });

  it('should set up both auth and error interceptors', () => {
    // Act
    setupInterceptors(apiClient);
    
    // Assert
    expect(setupAuthInterceptor).toHaveBeenCalledWith(apiClient);
    expect(setupErrorInterceptor).toHaveBeenCalledWith(apiClient);
  });

  it('should set up auth interceptor first, then error interceptor', () => {
    // Create call tracking array
    const callOrder = [];
    
    // Override mocks to track call order
    setupAuthInterceptor.mockImplementation(() => {
      callOrder.push('auth');
    });
    
    setupErrorInterceptor.mockImplementation(() => {
      callOrder.push('error');
    });
    
    // Act
    setupInterceptors(apiClient);
    
    // Assert
    expect(callOrder).toEqual(['auth', 'error']);
    expect(setupAuthInterceptor).toHaveBeenCalledTimes(1);
    expect(setupErrorInterceptor).toHaveBeenCalledTimes(1);
  });
  
  it('should pass the same axios instance to both interceptors', () => {
    // Act
    setupInterceptors(apiClient);
    
    // Assert
    expect(setupAuthInterceptor).toHaveBeenCalledWith(apiClient);
    expect(setupErrorInterceptor).toHaveBeenCalledWith(apiClient);
  });
});