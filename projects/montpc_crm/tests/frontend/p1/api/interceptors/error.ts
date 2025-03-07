/**
 * Error interceptor implementation
 */
import { AxiosInstance } from 'axios';

/**
 * Setup error interceptor for Axios
 * @param axiosInstance - The axios instance to add the interceptor to
 */
export function setupErrorInterceptor(axiosInstance: AxiosInstance): void {
  axiosInstance.interceptors.response.use(
    // For successful responses, just pass through
    response => response,
    
    // For errors, log and format them appropriately
    async error => {
      // Get response data if it exists
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      // Log based on error type
      if (statusCode === 400) {
        console.error('Bad Request:', responseData);
      } else if (statusCode === 404) {
        console.error('Not Found:', responseData);
      } else if (statusCode === 401) {
        console.error('Unauthorized:', responseData);
      } else if (statusCode === 403) {
        console.error('Forbidden:', responseData);
      } else if (statusCode >= 500) {
        console.error('Server Error:', responseData);
      } else if (statusCode) {
        console.error(`HTTP Error ${statusCode}:`, responseData);
      } else if (error.message === 'Network Error') {
        console.error('Network Error:', error.message);
      } else {
        console.error('API Error:', error.message);
      }

      // Re-throw the error to be handled by the calling code
      return Promise.reject(error);
    }
  );
}