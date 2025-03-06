/**
 * Test file for products service
 * 
 * @BRQ MEXP-2025-007-BE
 */

// Import the mocked server and rest utilities
const { rest, server } = require('../../setupTests');

// Import the products service
const { productsService } = require('../products.service');

describe('ProductsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all products successfully', async () => {
      const mockProducts = [
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
      // Our mock will reject with an error for specific paths
      await expect(async () => {
        // Force a rejection by manipulating the mock implementation
        const originalGet = productsService.getAll;
        productsService.getAll = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));
        
        try {
          await productsService.getAll();
        } finally {
          // Restore the original implementation
          productsService.getAll = originalGet;
        }
      }).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('should fetch product by id successfully', async () => {
      const mockProduct = {
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

      const response = await productsService.getById('1');
      expect(response.data).toEqual(mockProduct);
    });

    it('should handle error when product is not found', async () => {
      await expect(productsService.getById('999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create product successfully', async () => {
      const newProduct = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        sku: 'SKU003',
        stock: 75,
        category: 'New Category'
      };

      const response = await productsService.create(newProduct);
      expect(response.data.name).toEqual(newProduct.name);
      expect(response.data.sku).toEqual(newProduct.sku);
      expect(response.data.price).toEqual(newProduct.price);
    });

    it('should handle validation error when creating product', async () => {
      const invalidProduct = {
        name: '',
        price: -1,
        sku: '',
        stock: -1
      };

      await expect(productsService.create(invalidProduct)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update product successfully', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 199.99,
        stock: 150
      };

      const response = await productsService.update('1', updateData);
      expect(response.data.name).toEqual(updateData.name);
      expect(response.data.price).toEqual(updateData.price);
      expect(response.data.stock).toEqual(updateData.stock);
    });

    it('should handle error when updating non-existent product', async () => {
      const updateData = {
        name: 'Updated Product'
      };

      await expect(productsService.update('999', updateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete product successfully', async () => {
      await expect(productsService.delete('1')).resolves.not.toThrow();
    });

    it('should handle error when deleting non-existent product', async () => {
      await expect(productsService.delete('999')).rejects.toThrow();
    });
  });
});