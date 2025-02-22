/**
 * Core business models for mExpress
 */

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    sku: string;
    stock: number;
    category?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ListOptions<T> {
    page?: number;
    limit?: number;
    sort?: {
        field: keyof T;
        order: 'asc' | 'desc';
    };
    filter?: Partial<T>;
}

export interface ListResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CrudOperations<T> {
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    read(id: string): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    list(options?: ListOptions<T>): Promise<ListResponse<T>>;
}