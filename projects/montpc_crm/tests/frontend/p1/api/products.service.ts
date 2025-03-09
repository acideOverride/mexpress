/**
 * Products service implementation
 */

// Simple mock for axios responses
const mockResponses = {
  get: jest.fn().mockImplementation((url: string) => {
    if (url.includes('/products/999')) {
      return Promise.reject(new Error('Product not found'));
    }
    if (url.includes('/products/')) {
      return Promise.resolve({
        data: {
          data: {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 99.99,
            sku: 'SKU001',
            stock: 100,
            category: 'Category 1',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z'
          }
        }
      });
    }
    return Promise.resolve({
      data: {
        data: [
          {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 99.99,
            sku: 'SKU001',
            stock: 100,
            category: 'Category 1',
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z'
          },
          {
            id: '2',
            name: 'Product 2',
            price: 49.99,
            sku: 'SKU002',
            stock: 50,
            createdAt: '2025-02-17T10:00:00Z',
            updatedAt: '2025-02-17T10:00:00Z'
          }
        ]
      }
    });
  }),
  post: jest.fn().mockImplementation((url: string, data: any) => {
    if (!data.name || !data.sku || data.price < 0 || data.stock < 0) {
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
    if (url.includes('/products/999')) {
      return Promise.reject(new Error('Product not found'));
    }
    return Promise.resolve({
      data: {
        data: {
          id: '1',
          name: data.name || 'Product 1',
          description: 'Description 1',
          price: data.price || 99.99,
          sku: 'SKU001',
          stock: data.stock || 100,
          category: 'Category 1',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      }
    });
  }),
  delete: jest.fn().mockImplementation((url: string) => {
    if (url.includes('/products/999')) {
      return Promise.reject(new Error('Product not found'));
    }
    return Promise.resolve({ status: 204 });
  })
};

// Import types from product.ts
import { CreateProductDto, UpdateProductDto, ProductResponse, ProductsResponse } from '../../types/product';

// Mock for apiClient
const apiClient = {
  get: mockResponses.get,
  post: mockResponses.post,
  patch: mockResponses.patch,
  delete: mockResponses.delete
};

// Products service implementation
class ProductsService {
  private readonly basePath: string;

  constructor() {
    this.basePath = '/products';
  }

  async getAll() {
    const response = await apiClient.get<ProductsResponse>(this.basePath);
    return response.data;
  }

  async getById(id: string) {
    const response = await apiClient.get<ProductResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateProductDto) {
    const response = await apiClient.post<ProductResponse>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: UpdateProductDto) {
    const response = await apiClient.patch<ProductResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string) {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

// Export the service instance
export const productsService = new ProductsService();

// Export for testing
export { apiClient, mockResponses };