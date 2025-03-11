import { AxiosInstance } from 'axios';

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Log successful responses
      console.log('API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      // Handle errors
      if (error.response) {
        // The request was made and the server responded with an error status
        console.error('API Error Response:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('API Error Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
}