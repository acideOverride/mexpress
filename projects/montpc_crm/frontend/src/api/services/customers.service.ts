import { apiClient } from '../client';
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponse,
  ListResponse,
  CustomerFilterOptions,
  CustomerSortOptions,
  CustomerPaginationOptions
} from '../types/customer';

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Mock data for offline development
const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '1234567890',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cust2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '0987654321',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Flag to control whether to use mock data or real MongoDB server
// Set to false to use the real MongoDB server that we will start
const useMockData = false; // Keep this false to use our real API

// Store mock customers in localStorage to persist across page refreshes
try {
  const storedCustomers = localStorage.getItem('mockCustomers');
  if (storedCustomers) {
    const parsedCustomers = JSON.parse(storedCustomers);
    if (Array.isArray(parsedCustomers) && parsedCustomers.length > 0) {
      mockCustomers.length = 0; // Clear the array
      mockCustomers.push(...parsedCustomers); // Add stored customers
      console.log('Loaded mock customers from localStorage:', mockCustomers);
    }
  }
} catch (error) {
  console.error('Error loading mock customers from localStorage:', error);
}

class CustomersService {
  private readonly basePath = '/customers';

  /**
   * Get customers with filtering, sorting and pagination
   * @param filters Optional filters (search, status, date range)
   * @param sorting Optional sorting configuration
   * @param pagination Optional pagination parameters
   * @returns Promise with paginated customer data in standardized format
   */
  async getCustomers(
    filters: CustomerFilterOptions = {},
    sorting: CustomerSortOptions = { field: 'createdAt', direction: 'desc' },
    pagination: CustomerPaginationOptions = { page: 1, pageSize: 10 }
  ): Promise<ListResponse<Customer>> {
    // Use mock data if flag is set
    if (useMockData) {
      console.log('Using mock data for getCustomers');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        status: 'success',
        data: mockCustomers,
        meta: {
          pagination: {
            page: pagination.page,
            limit: pagination.pageSize,
            total: mockCustomers.length,
            pages: Math.ceil(mockCustomers.length / pagination.pageSize)
          },
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
    
    // Real API implementation
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
      console.log('Fetching customers from API:', url);
      const response = await apiClient.get(url);
      
      // Handle different API response formats
      if (response.data && typeof response.data === 'object') {
        // If response is in our standardized format
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          console.log('Received standardized response with', response.data.data.length, 'customers');
          return response.data;
        }
        // Direct array response
        else if (Array.isArray(response.data)) {
          console.log('Received direct array response with', response.data.length, 'customers');
          return {
            status: 'success',
            data: response.data,
            meta: {
              pagination: {
                page: pagination.page,
                limit: pagination.pageSize,
                total: response.data.length,
                pages: Math.ceil(response.data.length / pagination.pageSize)
              },
              timestamp: new Date().toISOString()
            }
          };
        }
      }
      
      // For other formats, just wrap it with our standard format
      return {
        status: 'success',
        data: Array.isArray(response.data) ? response.data : [],
        meta: {
          pagination: {
            page: pagination.page,
            limit: pagination.pageSize,
            total: 0,
            pages: 0
          },
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get all customers (legacy method)
   * @returns Promise with array of customers in standardized format
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
    // Use mock data if flag is set
    if (useMockData) {
      console.log('Using mock data for getById');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const customer = mockCustomers.find(c => c.id === id);
      if (customer) {
        return customer;
      }
      throw new Error('Customer not found');
    }
    
    // Real API implementation
    const response = await apiClient.get<CustomerResponse>(`${this.basePath}/${id}`);
    
    // Handle standardized response format
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Invalid response format or customer not found');
    }
  }

  /**
   * Create a new customer
   * @param data Customer creation data
   * @returns Promise with created customer data
   */
  async create(data: CreateCustomerDto): Promise<Customer> {
    // Use mock data if flag is set
    if (useMockData) {
      console.log('Using mock data for create customer');
      console.log('Customer data:', data);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check for duplicate email
        if (mockCustomers.some(c => c.email === data.email)) {
          console.error('Email already exists in mock data');
          throw new Error('Email already exists');
        }
        
        // Validate required fields
        if ((!data.firstName && !data.lastName) && !data.name) {
          console.error('Name is required');
          throw new Error('Name is required');
        }
        
        if (!data.email) {
          console.error('Email is required');
          throw new Error('Email is required');
        }
        
        // Create new customer
        const newCustomer: Customer = {
          id: generateId(),
          name: data.name || `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          status: data.status as 'active' | 'inactive' | 'pending' || 'active',
          notes: data.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to mock data array (in real app this would be a DB operation)
        mockCustomers.push(newCustomer);
        
        // Save to localStorage for persistence
        try {
          localStorage.setItem('mockCustomers', JSON.stringify(mockCustomers));
          console.log('Saved mockCustomers to localStorage');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        console.log('Created mock customer:', newCustomer);
        console.log('Updated mock data:', mockCustomers);
        
        return newCustomer;
      } catch (error) {
        console.error('Error in mock customer creation:', error);
        throw error;
      }
    }
    
    try {
      // Real API implementation
      console.log('Attempting to create customer with real API at:', this.basePath);
      console.log('Data:', data);
      
      const response = await apiClient.post(this.basePath, data);
      
      console.log('API response:', response);
      
      // Handle various response formats
      if (response.data) {
        // Handle standardized response format
        if (response.data.status === 'success' && response.data.data) {
          return response.data.data;
        } 
        // Handle direct object response
        else if (response.data._id || response.data.id) {
          // Format the response to ensure it has expected properties
          return {
            id: response.data._id || response.data.id,
            name: response.data.name || `${response.data.firstName} ${response.data.lastName}`,
            email: response.data.email,
            phone: response.data.phone || '',
            status: response.data.status || 'active',
            createdAt: response.data.createdAt || new Date().toISOString(),
            updatedAt: response.data.updatedAt || new Date().toISOString()
          };
        } else {
          throw new Error('Invalid response format or customer creation failed');
        }
      } else {
        throw new Error('Empty response from server');
      }
    } catch (error: any) {
      console.error('Error in API customer creation:', error);
      
      // Enhance error message if it's a network error
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check that the API server is running.');
      }
      
      throw error;
    }
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param data Customer update data
   * @returns Promise with updated customer data
   */
  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    // Use mock data if flag is set
    if (useMockData) {
      console.log('Using mock data for update');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      
      // Update customer
      const updatedCustomer = {
        ...mockCustomers[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      mockCustomers[index] = updatedCustomer;
      return updatedCustomer;
    }
    
    // Real API implementation
    const response = await apiClient.patch<CustomerResponse>(`${this.basePath}/${id}`, data);
    
    // Handle standardized response format
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Invalid response format or customer update failed');
    }
  }

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns Promise that resolves when customer is deleted
   */
  async delete(id: string): Promise<void> {
    // Use mock data if flag is set
    if (useMockData) {
      console.log('Using mock data for delete');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = mockCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      
      // Remove from mock data
      mockCustomers.splice(index, 1);
      
      // Update localStorage
      try {
        localStorage.setItem('mockCustomers', JSON.stringify(mockCustomers));
        console.log('Updated mockCustomers in localStorage after deletion');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return;
    }
    
    // Real API implementation
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const customersService = new CustomersService();