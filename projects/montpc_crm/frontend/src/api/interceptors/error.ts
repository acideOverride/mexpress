import { AxiosInstance, AxiosError } from 'axios';

export const setupErrorInterceptor = (apiClient: AxiosInstance) => {
  apiClient.interceptors.response.use(
    // Success handler - pass through
    (response) => response,
    
    // Error handler
    (error: AxiosError) => {
      // Handle response errors
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            console.error('Bad Request:', data);
            break;
          case 401:
            console.error('Unauthorized:', data);
            break;
          case 403:
            console.error('Forbidden:', data);
            break;
          case 404:
            console.error('Not Found:', data);
            break;
          case 500:
            console.error('Server Error:', data);
            break;
          default:
            console.error(`HTTP Error ${status}:`, data);
        }
      }
      // Handle network errors
      else if (!error.response && error.message) {
        console.error('Network Error:', error.message);
      }
      // Handle other errors
      else {
        console.error('Request Error:', error.message || 'Unknown error');
      }

      return Promise.reject(error);
    }
  );
};