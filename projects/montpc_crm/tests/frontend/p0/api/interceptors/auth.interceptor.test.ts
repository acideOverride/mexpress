import axios from 'axios';
import { setupAuthInterceptor } from '../../../../../frontend/src/api/interceptors/auth';

// Set up the test environment for browser APIs
beforeAll(() => {
  // Mock localStorage if it doesn't exist in test environment
  if (!global.localStorage) {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
  }
});

// Simple mock implementation
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    }
  }))
}));

describe('Auth Interceptor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should setup request interceptor when initialized', () => {
    // Arrange
    const apiClient = axios.create();
    
    // Act
    setupAuthInterceptor(apiClient);
    
    // Assert
    expect(apiClient.interceptors.request.use).toHaveBeenCalled();
  });
  
  it('should setup response interceptor when initialized', () => {
    // Arrange
    const apiClient = axios.create();
    
    // Act
    setupAuthInterceptor(apiClient);
    
    // Assert
    expect(apiClient.interceptors.response.use).toHaveBeenCalled();
  });
});