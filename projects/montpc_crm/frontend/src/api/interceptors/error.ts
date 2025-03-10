import { AxiosInstance, AxiosError } from 'axios';

export const setupErrorInterceptor = (apiClient: AxiosInstance) => {
  apiClient.interceptors.response.use(
    // Success handler - pass through
    (response) => response,
    
    // Error handler
    (error: AxiosError) => {
      // Create a custom error object with a user-friendly message
      let userFriendlyError: Error;
      
      // Handle response errors
      if (error.response) {
        const { status, data } = error.response;
        const serverMessage = typeof data === 'object' && data.message ? data.message : null;

        switch (status) {
          case 400:
            console.error('Bad Request:', data);
            userFriendlyError = new Error(serverMessage || 'Invalid form data. Please check your input and try again.');
            break;
          case 401:
            console.error('Unauthorized:', data);
            userFriendlyError = new Error(serverMessage || 'You need to log in to access this feature.');
            break;
          case 403:
            console.error('Forbidden:', data);
            userFriendlyError = new Error(serverMessage || 'You don\'t have permission to perform this action.');
            break;
          case 404:
            console.error('Not Found:', data);
            userFriendlyError = new Error(serverMessage || 'The requested resource was not found.');
            break;
          case 409:
            console.error('Conflict:', data);
            userFriendlyError = new Error(serverMessage || 'This resource already exists or conflicts with another.');
            break;
          case 500:
            console.error('Server Error:', data);
            userFriendlyError = new Error(serverMessage || 'A server error occurred. Please try again later.');
            break;
          default:
            console.error(`HTTP Error ${status}:`, data);
            userFriendlyError = new Error(serverMessage || `An error occurred (${status}). Please try again.`);
        }
      }
      // Handle network errors
      else if (error.code === 'ECONNABORTED') {
        console.error('Timeout Error:', error.message);
        userFriendlyError = new Error('The request timed out. Please check your connection and try again.');
      }
      else if (!error.response && error.message) {
        console.error('Network Error:', error.message);
        userFriendlyError = new Error('Unable to connect to the server. Please check your internet connection.');
      }
      // Handle other errors
      else {
        console.error('Request Error:', error.message || 'Unknown error');
        userFriendlyError = new Error('An unexpected error occurred. Please try again.');
      }

      return Promise.reject(userFriendlyError);
    }
  );
};