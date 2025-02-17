import { Product, CrudOperations, ListOptions, ListResponse } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Product service implementing CRUD operations
 */
export class ProductService implements CrudOperations<Product> {
    private products: Map<string, Product> = new Map();

    async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        const now = new Date();
        const product: Product = {
            ...data,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now
        };
        this.products.set(product.id, product);
        return product;
    }

    async read(id: string): Promise<Product> {
        const product = this.products.get(id);
        if (!product) {
            throw new Error(`Product not found: ${id}`);
        }
        return product;
    }

    async update(id: string, data: Partial<Product>): Promise<Product> {
        const product = await this.read(id);
        const updated: Product = {
            ...product,
            ...data,
            id, // Ensure ID doesn't change
            updatedAt: new Date()
        };
        this.products.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<void> {
        if (!this.products.has(id)) {
            throw new Error(`Product not found: ${id}`);
        }
        this.products.delete(id);
    }

    async list(options: ListOptions<Product> = {}): Promise<ListResponse<Product>> {
        const {
            page = 1,
            limit = 10,
            sort,
            filter
        } = options;

        let items = Array.from(this.products.values());

        // Apply filters if provided
        if (filter) {
            items = items.filter(item => {
                return Object.entries(filter).every(([key, value]) => {
                    // Ensure key is a valid Product property
                    const productKey = key as keyof Product;
                    const itemValue = item[productKey];
                    
                    // Handle undefined values
                    if (value === undefined) return itemValue === undefined;
                    if (itemValue === undefined) return false;

                    // Handle date comparisons
                    if (itemValue instanceof Date && value instanceof Date) {
                        return itemValue.getTime() === value.getTime();
                    }

                    // Handle array comparisons (tags)
                    if (Array.isArray(itemValue) && Array.isArray(value)) {
                        return value.every(v => itemValue.includes(v));
                    }

                    // Handle numeric comparisons
                    if (productKey === 'price' || productKey === 'stock') {
                        const numValue = Number(value);
                        return !isNaN(numValue) && itemValue === numValue;
                    }

                    // Default comparison
                    return itemValue === value;
                });
            });
        }

        // Apply sorting if provided
        if (sort) {
            items.sort((a, b) => {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                const order = sort.order === 'asc' ? 1 : -1;

                // Handle undefined values
                if (aVal === undefined && bVal === undefined) return 0;
                if (aVal === undefined) return order;
                if (bVal === undefined) return -order;

                // Handle date comparisons
                if (aVal instanceof Date && bVal instanceof Date) {
                    return (aVal.getTime() - bVal.getTime()) * order;
                }

                // Handle array comparisons (tags)
                if (Array.isArray(aVal) && Array.isArray(bVal)) {
                    return aVal.length - bVal.length * order;
                }

                // Default comparison
                return aVal < bVal ? -order : aVal > bVal ? order : 0;
            });
        }

        const total = items.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
            items: items.slice(start, end),
            total,
            page,
            limit,
            totalPages
        };
    }
}