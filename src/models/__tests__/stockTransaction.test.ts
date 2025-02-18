import { Schema } from 'mongoose';
import { StockTransaction, IStockTransaction } from '../stockTransaction';
import { Product } from '../product';
import mongoose from 'mongoose';

describe('StockTransaction Model', () => {
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
    await StockTransaction.deleteMany({});
    await Product.deleteMany({});
  });

  const validProductData = {
    name: 'Test Product',
    description: 'A test product',
    price: 99.99,
    sku: 'TEST123',
    category: 'electronics',
    stockLevel: 100,
    status: 'active'
  };

  const validTransactionData: Partial<IStockTransaction> = {
    type: 'increment',
    quantity: 10,
    reason: 'restock',
    userId: new mongoose.Types.ObjectId(),
    notes: 'Initial stock'
  };

  describe('basic validation', () => {
    it('should create a valid stock transaction', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError).toBeUndefined();
    });

    it('should require productId', async () => {
      const transaction = new StockTransaction(validTransactionData);
      const validationError = transaction.validateSync();
      expect(validationError?.errors.productId).toBeDefined();
    });

    it('should require type', async () => {
      const product = await Product.create(validProductData);
      const transactionData = { ...validTransactionData, type: undefined };
      delete transactionData.type;
      const transaction = new StockTransaction({
        ...transactionData,
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.type).toBeDefined();
    });

    it('should validate type values', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        type: 'invalid',
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.type).toBeDefined();
    });
  });

  describe('quantity validation', () => {
    it('should require quantity', async () => {
      const product = await Product.create(validProductData);
      const transactionData = { ...validTransactionData };
      delete transactionData.quantity;
      const transaction = new StockTransaction({
        ...transactionData,
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.quantity).toBeDefined();
    });

    it('should require positive quantity', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        quantity: -1,
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.quantity).toBeDefined();
    });

    it('should require integer quantity', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        quantity: 10.5,
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.quantity).toBeDefined();
    });
  });

  describe('reason validation', () => {
    it('should require reason', async () => {
      const product = await Product.create(validProductData);
      const transactionData = { ...validTransactionData };
      delete transactionData.reason;
      const transaction = new StockTransaction({
        ...transactionData,
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.reason).toBeDefined();
    });

    it('should validate reason values', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        reason: 'invalid',
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.reason).toBeDefined();
    });
  });

  describe('status validation', () => {
    it('should set default status to pending', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        productId: product._id
      });
      expect(transaction.status).toBe('pending');
    });

    it('should validate status values', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        status: 'invalid',
        productId: product._id
      });
      const validationError = transaction.validateSync();
      expect(validationError?.errors.status).toBeDefined();
    });
  });

  describe('timestamps', () => {
    it('should set timestamps on save', async () => {
      const product = await Product.create(validProductData);
      const transaction = new StockTransaction({
        ...validTransactionData,
        productId: product._id
      });
      
      // Initial timestamps should be undefined
      expect(transaction.createdAt).toBeUndefined();
      expect(transaction.updatedAt).toBeUndefined();
      
      // Save the transaction
      const saved = await transaction.save();
      
      // After save, timestamps should be defined
      expect(saved.createdAt).toBeDefined();
      expect(saved.updatedAt).toBeDefined();
    });

    it('should update timestamps on update', async () => {
      // Create and save transaction
      const product = await Product.create(validProductData);
      const transaction = await StockTransaction.create({
        ...validTransactionData,
        productId: product._id
      });
      
      // Get initial timestamps
      const createdAt = transaction.createdAt;
      const updatedAt = transaction.updatedAt;
      
      // Wait to ensure timestamp will be different
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Update transaction
      transaction.notes = 'Updated notes';
      const updated = await transaction.save();
      
      // createdAt should not change
      expect(updated.createdAt).toEqual(createdAt);
      
      // updatedAt should change
      expect(updated.updatedAt).not.toEqual(updatedAt);
      expect(updated.updatedAt!.getTime()).toBeGreaterThan(updatedAt!.getTime());
    });
  });
});