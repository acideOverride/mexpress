/**
 * Ringover Service implementation for tests
 * 
 * @file ringover.service.ts
 * @BRQ MEXP-2025-031-API Ringover Customer Management
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface RingoverConfig {
  baseUrl: string;
  apiKey: string;
  teamId: string;
  axiosInstance?: AxiosInstance;
}

export interface RingoverCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hiboutikId?: string;
}

export class RingoverService {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor(config: RingoverConfig) {
    this.client = config.axiosInstance || axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Team-Id': config.teamId
      }
    });

    // If using a provided instance, set default headers
    if (config.axiosInstance) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
      this.client.defaults.headers.common['Content-Type'] = 'application/json';
      this.client.defaults.headers.common['X-Team-Id'] = config.teamId;
    }
  }

  /**
   * Create a new customer
   */
  async createCustomer(customer: Omit<RingoverCustomer, 'id'>): Promise<RingoverCustomer> {
    try {
      const response = await this.client.post('/customers', customer);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<RingoverCustomer> {
    try {
      const response = await this.client.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update customer
   */
  async updateCustomer(id: string, customer: Omit<RingoverCustomer, 'id'>): Promise<RingoverCustomer> {
    try {
      const response = await this.client.put(`/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer by phone number
   */
  async getCustomerByPhone(phone: string): Promise<RingoverCustomer | null> {
    try {
      const response = await this.client.get('/customers/search', {
        params: { phone }
      });
      const customers = response.data;
      return customers.length > 0 ? customers[0] : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): Error {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Network or connection errors
      if (!axiosError.response) {
        return new Error('Network error');
      }

      // Handle specific HTTP status codes
      switch (axiosError.response.status) {
        case 401:
          return new Error('Authentication failed');
        case 404:
          return new Error('Customer not found');
        case 429:
          return new Error('Rate limit exceeded');
        case 500:
        case 502:
        case 503:
          return new Error('Server error');
        default:
          return new Error(`API error: ${axiosError.response.status}`);
      }
    }
    
    // Handle non-Axios errors
    return error instanceof Error ? error : new Error('Unknown error');
  }
}