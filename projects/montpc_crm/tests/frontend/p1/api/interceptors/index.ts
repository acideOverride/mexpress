/**
 * API interceptor setup module
 */

import { AxiosInstance } from 'axios';
import { setupAuthInterceptor } from './auth';
import { setupErrorInterceptor } from './error';

/**
 * Setup all API interceptors
 * @param axiosInstance - The axios instance to configure
 */
export function setupInterceptors(axiosInstance: AxiosInstance): void {
  // Setup auth interceptor first
  setupAuthInterceptor(axiosInstance);
  
  // Setup error interceptor last so it can handle auth errors too
  setupErrorInterceptor(axiosInstance);
}