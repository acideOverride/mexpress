import { rest } from 'msw';
import { server } from '../../../setupTests';
import { productsService } from '../products.service';
import { Product, CreateProductDto, UpdateProductDto } from '../../types/product';

describe('ProductsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          price: 99.99,
          sku: 'SKU001',
          stock: 100,
          category: 'Category 1',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        },
        {
          id: '2',
          name: 'Product 2',
          price: 49.99,
          sku: 'SKU002',
          stock: 50,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      ];

      server.use(
        rest.get('http://localhost:3000/api/products', (req, res, ctx) => {
          return res(ctx.json({ data: mockProducts }));
        })
      );

      const response = await productsService.getAll();
      expect(response.data).toEqual(mockProducts);
    });

    it('should handle error when fetching products fails', async () => {
      server.use(
        rest.get('http://localhost:3000/api/products', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Internal server error' }));
        })
      );

      await expect(productsService.getAll()).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('should fetch product by id successfully', async () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 99.99,
        sku: 'SKU001',
        stock: 100,
        category: 'Category 1',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      server.use(
        rest.get('http://localhost:3000/api/products/1', (req, res, ctx) => {
          return res(ctx.json({ data: mockProduct }));
        })
      );

      const response = await productsService.getById('1');
      expect(response.data).toEqual(mockProduct);
    });

    it('should handle error when product is not found', async () => {
      server.use(
        rest.get('http://localhost:3000/api/products/999', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Product not found' }));
        })
      );

      await expect(productsService.getById('999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      const newProduct: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        sku: 'SKU003',
        stock: 75,
        category: 'New Category'
      };

      const mockResponse = {
        data: {
          id: '3',
          ...newProduct,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      };

      server.use(
        rest.post('http://localhost:3000/api/products', (req, res, ctx) => {
          return res(ctx.status(201), ctx.json(mockResponse));
        })
      );

      const response = await productsService.create(newProduct);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle validation error when creating product', async () => {
      const invalidProduct: CreateProductDto = {
        name: '',
        price: -1,
        sku: '',
        stock: -1
      };

      server.use(
        rest.post('http://localhost:3000/api/products', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Validation error' }));
        })
      );

      await expect(productsService.create(invalidProduct)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const updateData: UpdateProductDto = {
        name: 'Updated Product',
        price: 199.99,
        stock: 150
      };

      const mockResponse = {
        data: {
          id: '1',
          ...updateData,
          description: 'Description 1',
          sku: 'SKU001',
          category: 'Category 1',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      };

      server.use(
        rest.patch('http://localhost:3000/api/products/1', (req, res, ctx) => {
          return res(ctx.json(mockResponse));
        })
      );

      const response = await productsService.update('1', updateData);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle error when updating non-existent product', async () => {
      const updateData: UpdateProductDto = {
        name: 'Updated Product'
      };

      server.use(
        rest.patch('http://localhost:3000/api/products/999', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Product not found' }));
        })
      );

      await expect(productsService.update('999', updateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      server.use(
        rest.delete('http://localhost:3000/api/products/1', (req, res, ctx) => {
          return res(ctx.status(204));
        })
      );

      await expect(productsService.delete('1')).resolves.not.toThrow();
    });

    it('should handle error when deleting non-existent product', async () => {
      server.use(
        rest.delete('http://localhost:3000/api/products/999', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Product not found' }));
        })
      );

      await expect(productsService.delete('999')).rejects.toThrow();
    });
  });
});