import { apiClient } from '../client';
import {
  Customer,
  CustomerStatus,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponse,
  ListResponse,
  CustomerFilterOptions,
  CustomerSortOptions,
  CustomerPaginationOptions
} from '../../types/customer';

class CustomersService {
  private readonly basePath = '/customers';

  /**
   * Get customers with filtering, sorting and pagination
   * @param filters Optional filters (search, status, date range)
   * @param sorting Optional sorting configuration
   * @param pagination Optional pagination parameters
   * @returns Promise with paginated customer data
   */
  async getCustomers(
    filters: CustomerFilterOptions = {},
    sorting: CustomerSortOptions = { field: '', direction: 'asc' },
    pagination: CustomerPaginationOptions = { page: 1, pageSize: 10, pageSizeOptions: [10, 25, 50, 100] }
  ): Promise<ListResponse<Customer>> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    // Add sorting
    if (sorting.field) {
      params.append('sortField', sorting.field);
      params.append('sortDirection', sorting.direction);
    }
    
    // Add pagination
    if (pagination.page) params.append('page', pagination.page.toString());
    if (pagination.pageSize) params.append('pageSize', pagination.pageSize.toString());
    
    const url = params.toString() ? `${this.basePath}?${params.toString()}` : this.basePath;
    
    try {
      const response = await apiClient.get<ListResponse<Customer>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get all customers (legacy method)
   * @returns Promise with array of customers
   */
  async getAll(): Promise<ListResponse<Customer>> {
    return this.getCustomers();
  }

  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Promise with customer data
   */
  async getById(id: string): Promise<Customer> {
    const response = await apiClient.get<CustomerResponse>(`${this.basePath}/${id}`);
    return response.data.data;
  }

  /**
   * Create a new customer
   * @param data Customer creation data
   * @returns Promise with created customer data
   */
  async create(data: CreateCustomerDto): Promise<Customer> {
    const response = await apiClient.post<CustomerResponse>(this.basePath, data);
    return response.data.data;
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param data Customer update data
   * @returns Promise with updated customer data
   */
  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    const response = await apiClient.patch<CustomerResponse>(`${this.basePath}/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns Promise that resolves when customer is deleted
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const customersService = new CustomersService();