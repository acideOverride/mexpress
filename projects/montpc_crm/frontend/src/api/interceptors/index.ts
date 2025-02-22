import { AxiosInstance } from 'axios';
import { setupAuthInterceptor } from './auth';
import { setupErrorInterceptor } from './error';

/**
 * Sets up all API interceptors for the given axios instance
 * @param apiClient The axios instance to set up interceptors for
 */
export const setupInterceptors = (apiClient: AxiosInstance): void => {
  // Setup auth interceptor first to handle token management
  setupAuthInterceptor(apiClient);
  
  // Setup error interceptor to handle all error cases
  setupErrorInterceptor(apiClient);
};

// Export individual interceptors for flexibility
export { setupAuthInterceptor } from './auth';
export { setupErrorInterceptor } from './error';