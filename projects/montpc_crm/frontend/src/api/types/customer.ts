export interface Customer {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string | {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  status?: 'active' | 'inactive' | 'pending' | 'ACTIVE' | 'INACTIVE' | 'PENDING';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string | {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  status?: string;
  notes?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  notes?: string;
}

// Standardized API response formats
export interface CustomerResponse {
  status: 'success';
  data: Customer;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface ListResponse<T> {
  status: 'success';
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    timestamp: string;
    version: string;
  };
}

// Filter, Sort and Pagination options
export interface CustomerFilterOptions {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | undefined;
}

export interface CustomerSortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CustomerPaginationOptions {
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
}