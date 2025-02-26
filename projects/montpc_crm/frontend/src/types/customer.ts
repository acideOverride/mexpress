/**
 * Customer interfaces for the MontPC CRM frontend
 */

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED'
}

/**
 * Customer interface for the frontend
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for paginated list responses
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Interface for customer list filter options
 */
export interface CustomerFilterOptions {
  search?: string;
  status?: CustomerStatus | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

/**
 * Interface for customer list sort options
 */
export interface CustomerSortOptions {
  field: keyof Customer | '';
  direction: 'asc' | 'desc';
}

/**
 * Interface for customer list column configuration
 */
export interface CustomerColumnConfig {
  field: keyof Customer | 'actions';
  label: string;
  visible: boolean;
  sortable: boolean;
  order: number;
}

/**
 * Interface for customer list pagination options
 */
export interface CustomerPaginationOptions {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
}