import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // This should come from environment config in production
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 seconds - increased for development
  withCredentials: false // CORS setting
});

// Log all requests for debugging
apiClient.interceptors.request.use(request => {
  console.log('Starting API Request:', request.method, request.url);
  console.log('Request data:', request.data);
  return request;
});

// Setup auth and error interceptors
setupInterceptors(apiClient);

export default apiClient;