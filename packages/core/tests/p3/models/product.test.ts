import { Schema } from 'mongoose';
import { Product, IProduct, IProductDocument } from '../product';
import mongoose from 'mongoose';

describe('Product Model', () => {
  let db: mongoose.Connection;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test');
    db = mongoose.connection;
  });

  afterAll(async () => {
    await db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

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

  it('should create a valid product', () => {
    const product = new Product(validProductData);
    const validationError = product.validateSync();
    expect(validationError).toBeUndefined();
  });

  describe('name validation', () => {
    it('should require name', () => {
      const productData = { ...validProductData };
      delete productData.name;
      const product = new Product(productData);
      const validationError = product.validateSync();
      expect(validationError?.errors.name).toBeDefined();
    });

    it('should enforce minimum name length', () => {
      const product = new Product({ ...validProductData, name: 'A' });
      const validationError = product.validateSync();
      expect(validationError?.errors.name).toBeDefined();
    });

    it('should enforce maximum name length', () => {
      const product = new Product({
        ...validProductData,
        name: 'A'.repeat(101)
      });
      const validationError = product.validateSync();
      expect(validationError?.errors.name).toBeDefined();
    });
  });

  describe('price validation', () => {
    it('should require price', () => {
      const productData = { ...validProductData };
      delete productData.price;
      const product = new Product(productData);
      const validationError = product.validateSync();
      expect(validationError?.errors.price).toBeDefined();
    });

    it('should require positive price', () => {
      const product = new Product({ ...validProductData, price: -1 });
      const validationError = product.validateSync();
      expect(validationError?.errors.price).toBeDefined();
    });

    it('should enforce maximum 2 decimal places', () => {
      const product = new Product({ ...validProductData, price: 99.999 });
      const validationError = product.validateSync();
      expect(validationError?.errors.price).toBeDefined();
    });
  });

  describe('sku validation', () => {
    it('should require sku', () => {
      const productData = { ...validProductData };
      delete productData.sku;
      const product = new Product(productData);
      const validationError = product.validateSync();
      expect(validationError?.errors.sku).toBeDefined();
    });

    it('should require alphanumeric sku', () => {
      const product = new Product({ ...validProductData, sku: 'TEST@123' });
      const validationError = product.validateSync();
      expect(validationError?.errors.sku).toBeDefined();
    });

    it('should enforce unique sku', async () => {
      await Product.create(validProductData);
      await expect(Product.create({
        ...validProductData,
        _id: new mongoose.Types.ObjectId()
      })).rejects.toThrow();
    });
  });

  describe('category validation', () => {
    it('should require category', () => {
      const productData = { ...validProductData };
      delete productData.category;
      const product = new Product(productData);
      const validationError = product.validateSync();
      expect(validationError?.errors.category).toBeDefined();
    });

    it('should validate category from predefined list', () => {
      const product = new Product({ ...validProductData, category: 'invalid' });
      const validationError = product.validateSync();
      expect(validationError?.errors.category).toBeDefined();
    });
  });

  describe('stock validation', () => {
    it('should require stockLevel', () => {
      const productData = { ...validProductData };
      delete productData.stockLevel;
      const product = new Product(productData);
      const validationError = product.validateSync();
      expect(validationError?.errors.stockLevel).toBeDefined();
    });

    it('should require non-negative stockLevel', () => {
      const product = new Product({ ...validProductData, stockLevel: -1 });
      const validationError = product.validateSync();
      expect(validationError?.errors.stockLevel).toBeDefined();
    });

    it('should require integer stockLevel', () => {
      const product = new Product({ ...validProductData, stockLevel: 10.5 });
      const validationError = product.validateSync();
      expect(validationError?.errors.stockLevel).toBeDefined();
    });
  });

  describe('status validation', () => {
    it('should set default status to active', () => {
      const productData = { ...validProductData };
      delete productData.status;
      const product = new Product(productData);
      expect(product.status).toBe('active');
    });

    it('should validate status values', () => {
      const product = new Product({ ...validProductData, status: 'invalid' });
      const validationError = product.validateSync();
      expect(validationError?.errors.status).toBeDefined();
    });
  });

  describe('timestamps', () => {
    it('should set timestamps on save', async () => {
      const product = new Product({
        ...validProductData,
        sku: 'TIMESTAMP123'
      });
      
      // Initial timestamps should be undefined
      expect(product.createdAt).toBeUndefined();
      expect(product.updatedAt).toBeUndefined();
      
      // Save the product
      const saved = await product.save();
      
      // After save, timestamps should be defined
      expect(saved.createdAt).toBeDefined();
      expect(saved.updatedAt).toBeDefined();
    });

    it('should update timestamps on update', async () => {
      // Create and save product
      const product = await Product.create({
        ...validProductData,
        sku: 'UPDATE123'
      }) as IProductDocument;

      // Get initial timestamps
      const initialCreatedAt = product.createdAt!;
      const initialUpdatedAt = product.updatedAt!;
      
      // Wait to ensure timestamp will be different
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update and save product
      product.name = 'Updated Product';
      const updated = await product.save() as IProductDocument;
      
      // createdAt should not change
      expect(updated.createdAt!.getTime()).toBe(initialCreatedAt.getTime());
      
      // updatedAt should change
      expect(updated.updatedAt!.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
    });
  });
});