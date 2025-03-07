import axios from 'axios';
import { setupAuthInterceptor } from '../../../../../frontend/src/api/interceptors/auth';

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

// Mock localStorage
jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});

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