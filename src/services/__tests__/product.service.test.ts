import { ProductService } from '../product.service';
import { Product } from '../../models/types';

describe('ProductService', () => {
    let productService: ProductService;

    beforeEach(() => {
        productService = new ProductService();
    });

    describe('create', () => {
        it('should create a new product with required fields', async () => {
            const productData = {
                name: 'Test Product',
                description: 'A test product',
                price: 99.99,
                sku: 'TEST-001',
                stock: 100
            };

            const product = await productService.create(productData);

            expect(product).toMatchObject({
                ...productData,
                id: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('should create a product with optional fields', async () => {
            const productData = {
                name: 'Test Product',
                description: 'A test product',
                price: 99.99,
                sku: 'TEST-001',
                stock: 100,
                category: 'Electronics',
                tags: ['new', 'featured']
            };

            const product = await productService.create(productData);

            expect(product).toMatchObject({
                ...productData,
                id: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });
    });

    describe('read', () => {
        it('should retrieve an existing product', async () => {
            const productData = {
                name: 'Test Product',
                description: 'A test product',
                price: 99.99,
                sku: 'TEST-001',
                stock: 100
            };

            const created = await productService.create(productData);
            const retrieved = await productService.read(created.id);

            expect(retrieved).toEqual(created);
        });

        it('should throw error for non-existent product', async () => {
            await expect(productService.read('non-existent-id'))
                .rejects
                .toThrow('Product not found: non-existent-id');
        });
    });

    describe('update', () => {
        it('should update an existing product', async () => {
            const productData = {
                name: 'Test Product',
                description: 'A test product',
                price: 99.99,
                sku: 'TEST-001',
                stock: 100
            };

            const created = await productService.create(productData);
            const updateData = {
                name: 'Updated Product',
                price: 149.99,
                stock: 75
            };

            const updated = await productService.update(created.id, updateData);

            expect(updated).toMatchObject({
                ...created,
                ...updateData,
                updatedAt: expect.any(Date)
            });
            expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
        });

        it('should throw error for non-existent product', async () => {
            await expect(productService.update('non-existent-id', { name: 'Test' }))
                .rejects
                .toThrow('Product not found: non-existent-id');
        });
    });

    describe('delete', () => {
        it('should delete an existing product', async () => {
            const productData = {
                name: 'Test Product',
                description: 'A test product',
                price: 99.99,
                sku: 'TEST-001',
                stock: 100
            };

            const created = await productService.create(productData);
            await productService.delete(created.id);

            await expect(productService.read(created.id))
                .rejects
                .toThrow('Product not found: ' + created.id);
        });

        it('should throw error for non-existent product', async () => {
            await expect(productService.delete('non-existent-id'))
                .rejects
                .toThrow('Product not found: non-existent-id');
        });
    });

    describe('list', () => {
        beforeEach(async () => {
            // Create test products
            await productService.create({
                name: 'Product A',
                description: 'First product',
                price: 99.99,
                sku: 'PROD-001',
                stock: 100,
                category: 'Electronics'
            });
            await productService.create({
                name: 'Product B',
                description: 'Second product',
                price: 149.99,
                sku: 'PROD-002',
                stock: 50,
                category: 'Electronics'
            });
            await productService.create({
                name: 'Product C',
                description: 'Third product',
                price: 199.99,
                sku: 'PROD-003',
                stock: 25,
                category: 'Accessories'
            });
        });

        it('should list all products with default pagination', async () => {
            const result = await productService.list();

            expect(result.items).toHaveLength(3);
            expect(result.total).toBe(3);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
            expect(result.totalPages).toBe(1);
        });

        it('should apply pagination correctly', async () => {
            const result = await productService.list({ page: 1, limit: 2 });

            expect(result.items).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(2);
            expect(result.totalPages).toBe(2);
        });

        it('should apply sorting correctly', async () => {
            const result = await productService.list({
                sort: { field: 'price', order: 'desc' }
            });

            expect(result.items[0].price).toBe(199.99);
            expect(result.items[1].price).toBe(149.99);
            expect(result.items[2].price).toBe(99.99);
        });

        it('should apply filtering correctly', async () => {
            const result = await productService.list({
                filter: { category: 'Electronics' }
            });

            expect(result.items).toHaveLength(2);
            expect(result.items.every(item => item.category === 'Electronics')).toBe(true);
        });

        it('should filter by multiple criteria', async () => {
            const result = await productService.list({
                filter: {
                    category: 'Electronics',
                    stock: 50
                }
            });

            expect(result.items).toHaveLength(1);
            expect(result.items[0].sku).toBe('PROD-002');
        });
    });
});