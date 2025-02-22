import axios, { AxiosInstance } from 'axios';
import { setupAuthInterceptor } from './interceptors/auth';
import { setupErrorInterceptor } from './interceptors/error';

// API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create API client instance
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Setup interceptors
setupAuthInterceptor(apiClient);
setupErrorInterceptor(apiClient);

export default apiClient;