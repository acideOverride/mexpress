import { jest } from '@jest/globals';

export interface RingoverConfig {
  baseUrl: string;
  apiKey: string;
  teamId: string;
  axiosInstance?: any;
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
  private client: any;
  private rateLimiter: any;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor(config: RingoverConfig) {
    this.client = config.axiosInstance || {
      defaults: {
        headers: {
          common: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'X-Team-Id': config.teamId
          }
        }
      }
    };
  }

  async getRecentCalls(): Promise<RingoverCall[]> {
    return [
      {
        id: 'call123',
        callerNumber: '+1234567890',
        recipientNumber: '+0987654321',
        durationSeconds: 300,
        status: 'completed',
        timestamp: new Date('2025-02-18T12:00:00Z'),
        recordingUrl: 'https://recordings.ringover.com/123.mp3'
      }
    ];
  }

  async getCallById(id: string): Promise<RingoverCall> {
    if (id === '123') {
      return {
        id: '123',
        callerNumber: '+1234567890',
        recipientNumber: '+0987654321',
        durationSeconds: 300,
        status: 'completed',
        timestamp: new Date('2025-02-18T12:00:00Z'),
        recordingUrl: 'https://recordings.ringover.com/123.mp3'
      };
    }
    throw new Error('Call not found');
  }

  async createCustomer(customer: Omit<RingoverCustomer, 'id'>): Promise<RingoverCustomer> {
    return {
      id: 'cust-' + Math.floor(Math.random() * 1000),
      ...customer
    };
  }

  async getCustomerById(id: string): Promise<RingoverCustomer> {
    if (id === 'cust123') {
      return {
        id: 'cust123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };
    }
    throw new Error('Customer not found');
  }

  async updateCustomer(id: string, customer: Omit<RingoverCustomer, 'id'>): Promise<RingoverCustomer> {
    return {
      id,
      ...customer
    };
  }

  async getCustomerByPhone(phone: string): Promise<RingoverCustomer | null> {
    if (phone === '+1234567890') {
      return {
        id: 'cust123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };
    }
    return null;
  }

  // For the simplified mock interface expected by the integration tester
  async createContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<string> {
    return `ringover-${Math.floor(Math.random() * 10000)}`;
  }
}