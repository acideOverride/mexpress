/**
 * Customers service implementation
 */

// Simple mock for axios responses
const mockResponses = {
  get: jest.fn().mockImplementation((url) => {
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
  post: jest.fn().mockImplementation((url, data) => {
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
  patch: jest.fn().mockImplementation((url, data) => {
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
  delete: jest.fn().mockImplementation((url) => {
    if (url.includes('/customers/999')) {
      return Promise.reject(new Error('Customer not found'));
    }
    return Promise.resolve({ status: 204 });
  })
};

// Mock for apiClient
const apiClient = {
  get: mockResponses.get,
  post: mockResponses.post,
  patch: mockResponses.patch,
  delete: mockResponses.delete
};

// Customers service implementation
class CustomersService {
  constructor() {
    this.basePath = '/customers';
  }

  async getCustomers() {
    const response = await apiClient.get(this.basePath);
    return response.data;
  }

  async getAll() {
    return this.getCustomers();
  }

  async getById(id) {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(this.basePath, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.patch(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id) {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

// Export the service instance
const customersService = new CustomersService();

module.exports = {
  customersService,
  apiClient,
  mockResponses
};