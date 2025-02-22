// Common response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Customer types
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

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}