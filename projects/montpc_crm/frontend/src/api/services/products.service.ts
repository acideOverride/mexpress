import { apiClient } from '../client';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductResponse,
  ProductsResponse
} from '../types/product';

class ProductsService {
  private readonly basePath = '/products';

  /**
   * Get all products
   * @returns Promise with array of products
   */
  async getAll() {
    const response = await apiClient.get<ProductsResponse>(this.basePath);
    return response.data;
  }

  /**
   * Get product by ID
   * @param id Product ID
   * @returns Promise with product data
   */
  async getById(id: string) {
    const response = await apiClient.get<ProductResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new product
   * @param data Product creation data
   * @returns Promise with created product data
   */
  async create(data: CreateProductDto) {
    const response = await apiClient.post<ProductResponse>(this.basePath, data);
    return response.data;
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param data Product update data
   * @returns Promise with updated product data
   */
  async update(id: string, data: UpdateProductDto) {
    const response = await apiClient.patch<ProductResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a product
   * @param id Product ID
   * @returns Promise that resolves when product is deleted
   */
  async delete(id: string) {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const productsService = new ProductsService();