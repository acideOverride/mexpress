import axios, { AxiosInstance, AxiosError } from 'axios';
import { RateLimiter } from '../utils/rateLimiter';

export interface HiboutikConfig {
  baseUrl: string;
  username: string;
  apiKey: string;
  storeId: string;
  axiosInstance?: AxiosInstance; // Optional axios instance for testing
}

export interface HiboutikCustomer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class HiboutikService {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor(config: HiboutikConfig) {
    this.client = config.axiosInstance || axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.username}:${config.apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'X-Store-Id': config.storeId
      }
    });

    // Initialize rate limiter (100 requests per minute)
    this.rateLimiter = new RateLimiter(100, 60000);

    // If using a provided instance, set default headers
    if (config.axiosInstance) {
      this.client.defaults.headers.common['Authorization'] = 
        `Basic ${Buffer.from(`${config.username}:${config.apiKey}`).toString('base64')}`;
      this.client.defaults.headers.common['Content-Type'] = 'application/json';
      this.client.defaults.headers.common['X-Store-Id'] = config.storeId;
    }
  }

  /**
   * Get all customers
   */
  async getCustomers(): Promise<HiboutikCustomer[]> {
    await this.rateLimiter.acquire();
    try {
      const response = await this.client.get('/customers');
      return this.mapCustomers(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<HiboutikCustomer> {
    await this.rateLimiter.acquire();
    try {
      const response = await this.client.get(`/customers/${id}`);
      return this.mapCustomer(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(customer: HiboutikCustomer): Promise<HiboutikCustomer> {
    await this.rateLimiter.acquire();
    try {
      const response = await this.client.post('/customers', this.mapCustomerToApi(customer));
      return this.mapCustomer(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing customer
   */
  async updateCustomer(id: string, customer: HiboutikCustomer): Promise<HiboutikCustomer> {
    await this.rateLimiter.acquire();
    try {
      const response = await this.client.put(`/customers/${id}`, this.mapCustomerToApi(customer));
      return this.mapCustomer(response.data);
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

  /**
   * Map API customer to internal format
   */
  private mapCustomer(data: any): HiboutikCustomer {
    return {
      id: data.id?.toString(),
      firstName: data.firstname || data.firstName,
      lastName: data.lastname || data.lastName,
      email: data.email,
      phone: data.phone
    };
  }

  /**
   * Map array of API customers to internal format
   */
  private mapCustomers(data: any[]): HiboutikCustomer[] {
    return data.map(customer => this.mapCustomer(customer));
  }

  /**
   * Map internal customer to API format
   */
  private mapCustomerToApi(customer: HiboutikCustomer): any {
    return {
      firstname: customer.firstName,
      lastname: customer.lastName,
      email: customer.email,
      phone: customer.phone
    };
  }
}