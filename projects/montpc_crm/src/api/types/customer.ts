export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;  // Stored as a stringified JSON in the API
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: CustomerAddress;
}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  page: number;
  perPage: number;
}

export interface CustomerFilterParams {
  search?: string;
  state?: string;
  city?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}