/**
 * Customers service implementation
 */
import { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerResponse, CustomersResponse } from '../types';

// Define the axios response interfaces
interface AxiosResponse<T> {
  data: T;
  status?: number;
}

// Define the API client interface
interface ApiClient {
  get<T>(url: string): Promise<AxiosResponse<T>>;
  post<T>(url: string, data: any): Promise<AxiosResponse<T>>;
  patch<T>(url: string, data: any): Promise<AxiosResponse<T>>;
  delete<T>(url: string): Promise<AxiosResponse<T>>;
}

// Simple mock for axios responses
const mockResponses = {
  get: jest.fn().mockImplementation((url: string) => {
    if (url.includes('/customers/999')) {
      return Promise.reject(new Error('Customer not found'));
    }
    if (url.includes('/customers/')) {
      return Promise.resolve({
        data: {
          data: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z'
          }
        }
      });
    }
    // Default case - list of customers
    return Promise.resolve({
      data: {
        data: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1
      }
    });
  }),
  post: jest.fn().mockImplementation((url: string, data: any) => {
    if (!data.name || !data.email) {
      return Promise.reject(new Error('Validation error'));
    }
    return Promise.resolve({
      data: {
        data: {
          id: '3',
          ...data,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      }
    });
  }),
  patch: jest.fn().mockImplementation((url: string, data: any) => {
    if (url.includes('/customers/999')) {
      return Promise.reject(new Error('Customer not found'));
    }
    return Promise.resolve({
      data: {
        data: {
          id: '1',
          name: data.name || 'John Doe',
          email: data.email || 'john@example.com',
          phone: '123-456-7890',
          address: '123 Main St',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      }
    });
  }),
  delete: jest.fn().mockImplementation((url: string) => {
    if (url.includes('/customers/999')) {
      return Promise.reject(new Error('Customer not found'));
    }
    return Promise.resolve({ status: 204 });
  })
};

// Mock for apiClient
const apiClient: ApiClient = {
  get: mockResponses.get,
  post: mockResponses.post,
  patch: mockResponses.patch,
  delete: mockResponses.delete
};

// Customers service implementation
class CustomersService {
  private basePath: string;

  constructor() {
    this.basePath = '/customers';
  }

  async getCustomers(): Promise<CustomersResponse> {
    const response = await apiClient.get<CustomersResponse>(this.basePath);
    return response.data;
  }

  async getAll(): Promise<CustomersResponse> {
    return this.getCustomers();
  }

  async getById(id: string): Promise<CustomerResponse> {
    const response = await apiClient.get<CustomerResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateCustomerDto): Promise<CustomerResponse> {
    const response = await apiClient.post<CustomerResponse>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateCustomerDto): Promise<CustomerResponse> {
    const response = await apiClient.patch<CustomerResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`${this.basePath}/${id}`);
  }
}

// Export the service instance
export const customersService = new CustomersService();

export { apiClient, mockResponses };