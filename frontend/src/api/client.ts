import axios from 'axios';
import { setupInterceptors } from './interceptors';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // This should come from environment config in production
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

// Setup auth and error interceptors
setupInterceptors(apiClient);

export default apiClient;