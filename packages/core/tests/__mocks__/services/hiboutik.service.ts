import { jest } from '@jest/globals';

export interface HiboutikConfig {
  baseUrl: string;
  apiKey: string;
  accountId: string;
  axiosInstance?: any;
}

export interface HiboutikCustomer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
}

export class HiboutikService {
  private client: any;
  private rateLimiter: any;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor(config: HiboutikConfig) {
    this.client = config.axiosInstance || {
      defaults: {
        headers: {
          common: {
            'X-API-KEY': config.apiKey,
            'Content-Type': 'application/json',
            'X-ACCOUNT-ID': config.accountId
          }
        }
      }
    };
  }

  async getCustomers(): Promise<HiboutikCustomer[]> {
    return [
      {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Example City',
          country: 'Example Country',
          postalCode: '12345'
        }
      },
      {
        id: '456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        address: {
          street: '456 Oak St',
          city: 'Another City',
          country: 'Example Country',
          postalCode: '67890'
        }
      }
    ];
  }

  async getCustomerById(id: string): Promise<HiboutikCustomer> {
    if (id === '123') {
      return {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Example City',
          country: 'Example Country',
          postalCode: '12345'
        }
      };
    }
    throw new Error('Customer not found');
  }

  async createCustomer(customer: HiboutikCustomer): Promise<string> {
    return 'hib-' + Math.floor(Math.random() * 10000);
  }

  async updateCustomer(id: string, customer: HiboutikCustomer): Promise<HiboutikCustomer> {
    return {
      id,
      ...customer
    };
  }
}