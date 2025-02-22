import axios, { AxiosInstance, AxiosError } from 'axios';
import { RateLimiter } from '../utils/rateLimiter';

export interface RingoverConfig {
  baseUrl: string;
  apiKey: string;
  teamId: string;
  axiosInstance?: AxiosInstance;
}

export interface RingoverCall {
  id: string;
  callerNumber: string;
  recipientNumber: string;
  durationSeconds: number;
  status: string;
  timestamp: Date;
  recordingUrl: string;
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
  private rateLimiter: RateLimiter;
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

    // Initialize rate limiter (100 requests per minute)
    this.rateLimiter = new RateLimiter(100, 60000);

    // If using a provided instance, set default headers
    if (config.axiosInstance) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
      this.client.defaults.headers.common['Content-Type'] = 'application/json';
      this.client.defaults.headers.common['X-Team-Id'] = config.teamId;
    }
  }

  /**
   * Get recent calls
   */
  async getRecentCalls(): Promise<RingoverCall[]> {
    await this.rateLimiter.acquire();
    try {
      const response = await this.client.get('/calls');
      return this.mapCalls(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get call by ID
   */
  async getCallById(id: string): Promise<RingoverCall> {
    await this.rateLimiter.acquire();
    try {
      const response = await this.client.get(`/calls/${id}`);
      return this.mapCall(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new customer
   */
  async createCustomer(customer: Omit<RingoverCustomer, 'id'>): Promise<RingoverCustomer> {
    await this.rateLimiter.acquire();
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
    await this.rateLimiter.acquire();
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
    await this.rateLimiter.acquire();
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
    await this.rateLimiter.acquire();
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

  /**
   * Map API call to internal format
   */
  private mapCall(data: any): RingoverCall {
    return {
      id: data.id,
      callerNumber: data.caller,
      recipientNumber: data.recipient,
      durationSeconds: data.duration,
      status: data.status,
      timestamp: new Date(data.timestamp),
      recordingUrl: data.recording_url
    };
  }

  /**
   * Map array of API calls to internal format
   */
  private mapCalls(data: any[]): RingoverCall[] {
    return data.map(call => this.mapCall(call));
  }
}