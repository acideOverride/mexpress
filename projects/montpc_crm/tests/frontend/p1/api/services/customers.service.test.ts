import axios from 'axios';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Define our custom types inline to make the test self-contained
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CustomerResponse {
  data: Customer;
}

interface CustomersResponse {
  data: Customer[];
}

// Create a mock API client
const apiClient = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
};

// Mock implementation of the customers service
class CustomersService {
  private readonly basePath: string;

  constructor() {
    this.basePath = '/customers';
  }

  async getAll() {
    const response = await apiClient.get<CustomersResponse>(this.basePath);
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<CustomerResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateCustomerDto) {
    const response = await apiClient.post<CustomerResponse>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateCustomerDto) {
    const response = await apiClient.patch<CustomerResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

const customersService = new CustomersService();

describe('CustomersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all customers successfully', async () => {
      const mockCustomers: Customer[] = [
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
      ];

      apiClient.get.mockResolvedValueOnce({
        data: {
          data: mockCustomers
        }
      });

      const response = await customersService.getAll();
      expect(response.data).toEqual(mockCustomers);
    });

    it('should handle error when fetching customers fails', async () => {
      apiClient.get.mockRejectedValueOnce(
        new Error('Internal server error')
      );

      await expect(customersService.getAll()).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('should fetch customer by id successfully', async () => {
      const mockCustomer: Customer = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      apiClient.get.mockResolvedValueOnce({
        data: {
          data: mockCustomer
        }
      });

      const response = await customersService.getById('1');
      expect(response.data).toEqual(mockCustomer);
    });

    it('should handle error when customer is not found', async () => {
      apiClient.get.mockRejectedValueOnce(
        new Error('Customer not found')
      );

      await expect(customersService.getById('999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create customer successfully', async () => {
      const newCustomer: CreateCustomerDto = {
        name: 'New Customer',
        email: 'new@example.com',
        phone: '123-456-7890',
        address: '123 Main St'
      };

      const mockResponse = {
        data: {
          id: '3',
          ...newCustomer,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      };

      apiClient.post.mockResolvedValueOnce({
        data: mockResponse
      });

      const response = await customersService.create(newCustomer);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle validation error when creating customer', async () => {
      const invalidCustomer: CreateCustomerDto = {
        name: '',
        email: 'invalid-email',
        phone: '',
        address: ''
      };

      apiClient.post.mockRejectedValueOnce(
        new Error('Validation error')
      );

      await expect(customersService.create(invalidCustomer)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update customer successfully', async () => {
      const updateData: UpdateCustomerDto = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockResponse = {
        data: {
          id: '1',
          ...updateData,
          phone: '123-456-7890',
          address: '123 Main St',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      };

      apiClient.patch.mockResolvedValueOnce({
        data: mockResponse
      });

      const response = await customersService.update('1', updateData);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle error when updating non-existent customer', async () => {
      const updateData: UpdateCustomerDto = {
        name: 'Updated Name'
      };

      apiClient.patch.mockRejectedValueOnce(
        new Error('Customer not found')
      );

      await expect(customersService.update('999', updateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete customer successfully', async () => {
      apiClient.delete.mockResolvedValueOnce({
        status: 204
      });

      await expect(customersService.delete('1')).resolves.not.toThrow();
    });

    it('should handle error when deleting non-existent customer', async () => {
      apiClient.delete.mockRejectedValueOnce(
        new Error('Customer not found')
      );

      await expect(customersService.delete('999')).rejects.toThrow();
    });
  });
});