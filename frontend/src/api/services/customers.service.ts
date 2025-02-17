import { apiClient } from '../client';
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponse,
  CustomersResponse
} from '../types/customer';

class CustomersService {
  private readonly basePath = '/customers';

  /**
   * Get all customers
   * @returns Promise with array of customers
   */
  async getAll() {
    const response = await apiClient.get<CustomersResponse>(this.basePath);
    return response.data;
  }

  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Promise with customer data
   */
  async getById(id: string) {
    const response = await apiClient.get<CustomerResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new customer
   * @param data Customer creation data
   * @returns Promise with created customer data
   */
  async create(data: CreateCustomerDto) {
    const response = await apiClient.post<CustomerResponse>(this.basePath, data);
    return response.data;
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param data Customer update data
   * @returns Promise with updated customer data
   */
  async update(id: string, data: UpdateCustomerDto) {
    const response = await apiClient.patch<CustomerResponse>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns Promise that resolves when customer is deleted
   */
  async delete(id: string) {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const customersService = new CustomersService();