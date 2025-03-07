export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerResponse {
  data: Customer;
}

export interface CustomersResponse {
  data: Customer[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}