import { ProductService } from '../product.service';
import { Product, IProduct } from '../../models/product';
import mongoose from 'mongoose';

describe('ProductService', () => {
  let productService: ProductService;
  let db: mongoose.Connection;

  const validProductData: Partial<IProduct> = {
    name: 'Test Product',
    description: 'A test product description',
    price: 99.99,
    sku: 'TEST123',
    category: 'electronics',
    tags: ['test', 'product'],
    stockLevel: 100,
    status: 'active'
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test');
    db = mongoose.connection;
    productService = new ProductService();
  });

  afterAll(async () => {
    await db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = await productService.create(validProductData);
      expect(product).toBeDefined();
      expect(product.name).toBe(validProductData.name);
      expect(product.price).toBe(validProductData.price);
      expect(product.sku).toBe(validProductData.sku);
      expect(product.category).toBe(validProductData.category);
      expect(product.stockLevel).toBe(validProductData.stockLevel);
      expect(product.status).toBe(validProductData.status);
    });

    it('should throw error for duplicate sku', async () => {
      await productService.create(validProductData);
      await expect(productService.create(validProductData)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const created = await productService.create({
        ...validProductData,
        sku: 'FIND123'
      });
      const found = await productService.findById(created._id.toString());
      expect(found).toBeDefined();
      expect(found?.sku).toBe('FIND123');
    });

    it('should return null for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await productService.findById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all products', async () => {
      // Create first product
      await Product.create(validProductData);
      
      // Create second product with different SKU
      await Product.create({
        ...validProductData,
        name: 'Another Product',
        sku: 'TEST456'
      });

      // Find all products
      const products = await Product.find().exec();
      expect(products).toHaveLength(2);
    });

    it('should return empty array when no products exist', async () => {
      const products = await productService.findAll();
      expect(products).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const created = await productService.create({
        ...validProductData,
        sku: 'UPDATE123'
      });
      const updateData = { name: 'Updated Product', price: 149.99 };
      const updated = await productService.update(created._id.toString(), updateData);
      expect(updated).toBeDefined();
      expect(updated?.name).toBe(updateData.name);
      expect(updated?.price).toBe(updateData.price);
    });

    it('should return null for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await productService.update(nonExistentId, { name: 'Updated' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      const created = await productService.create({
        ...validProductData,
        sku: 'DELETE123'
      });
      const result = await productService.delete(created._id.toString());
      expect(result).toBe(true);
      const found = await productService.findById(created._id.toString());
      expect(found).toBeNull();
    });

    it('should return false for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await productService.delete(nonExistentId);
      expect(result).toBe(false);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await productService.create(validProductData);
      await productService.create({
        ...validProductData,
        name: 'Another Product',
        sku: 'TEST456',
        category: 'electronics',
        tags: ['test', 'another']
      });
    });

    it('should search products by name', async () => {
      const results = await productService.search({ query: 'Another' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Another Product');
    });

    it('should search products by sku', async () => {
      const results = await productService.search({ query: 'TEST456' });
      expect(results).toHaveLength(1);
      expect(results[0].sku).toBe('TEST456');
    });

    it('should search products by category', async () => {
      const results = await productService.search({ category: 'electronics' });
      expect(results).toHaveLength(2);
    });

    it('should search products by tag', async () => {
      const results = await productService.search({ tag: 'another' });
      expect(results).toHaveLength(1);
      expect(results[0].sku).toBe('TEST456');
    });

    it('should return empty array for no matches', async () => {
      const results = await productService.search({ query: 'NonExistent' });
      expect(results).toHaveLength(0);
    });
  });
});