import { StockService } from '../stock.service';
import { StockTransaction } from '../../models/stockTransaction';
import { Product } from '../../models/product';
import mongoose from 'mongoose';

describe('StockService', () => {
  let stockService: StockService;
  let db: mongoose.Connection;

  const validProductData = {
    name: 'Test Product',
    description: 'A test product',
    price: 99.99,
    sku: 'TEST123',
    category: 'electronics',
    stockLevel: 100,
    status: 'active'
  };

  const validTransactionData = {
    type: 'increment' as const,
    quantity: 10,
    reason: 'restock' as const,
    userId: new mongoose.Types.ObjectId(),
    notes: 'Initial stock'
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test');
    db = mongoose.connection;
    stockService = new StockService();
  });

  afterAll(async () => {
    await db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await StockTransaction.deleteMany({});
    await Product.deleteMany({});
  });

  describe('createTransaction', () => {
    it('should create a stock transaction', async () => {
      const product = await Product.create(validProductData);
      const transaction = await stockService.createTransaction({
        ...validTransactionData,
        productId: product._id
      });

      expect(transaction).toBeDefined();
      expect(transaction.productId).toEqual(product._id);
      expect(transaction.type).toBe(validTransactionData.type);
      expect(transaction.quantity).toBe(validTransactionData.quantity);
      expect(transaction.status).toBe('pending');
    });

    it('should fail for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(stockService.createTransaction({
        ...validTransactionData,
        productId: nonExistentId
      })).rejects.toThrow();
    });
  });

  describe('processTransaction', () => {
    it('should process increment transaction', async () => {
      const product = await Product.create(validProductData);
      const initialStock = product.stockLevel;
      
      const transaction = await stockService.createTransaction({
        ...validTransactionData,
        productId: product._id,
        type: 'increment',
        quantity: 10
      });

      const processed = await stockService.processTransaction(transaction._id);
      expect(processed.status).toBe('completed');

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct?.stockLevel).toBe(initialStock + 10);
    });

    it('should process decrement transaction', async () => {
      const product = await Product.create(validProductData);
      const initialStock = product.stockLevel;
      
      const transaction = await stockService.createTransaction({
        ...validTransactionData,
        productId: product._id,
        type: 'decrement',
        quantity: 10
      });

      const processed = await stockService.processTransaction(transaction._id);
      expect(processed.status).toBe('completed');

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct?.stockLevel).toBe(initialStock - 10);
    });

    it('should fail decrement if insufficient stock', async () => {
      const product = await Product.create({
        ...validProductData,
        stockLevel: 5
      });
      
      const transaction = await stockService.createTransaction({
        ...validTransactionData,
        productId: product._id,
        type: 'decrement',
        quantity: 10
      });

      const processed = await stockService.processTransaction(transaction._id);
      expect(processed.status).toBe('failed');

      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct?.stockLevel).toBe(5);
    });
  });

  describe('getTransactionHistory', () => {
    it('should get product transaction history', async () => {
      const product = await Product.create(validProductData);
      
      // Create multiple transactions
      await stockService.createTransaction({
        ...validTransactionData,
        productId: product._id,
        type: 'increment',
        quantity: 10
      });

      await stockService.createTransaction({
        ...validTransactionData,
        productId: product._id,
        type: 'decrement',
        quantity: 5
      });

      const history = await stockService.getTransactionHistory(product._id);
      expect(history).toHaveLength(2);
      expect(history[0].type).toBe('decrement');
      expect(history[1].type).toBe('increment');
    });

    it('should return empty array for no transactions', async () => {
      const product = await Product.create(validProductData);
      const history = await stockService.getTransactionHistory(product._id);
      expect(history).toHaveLength(0);
    });
  });

  describe('getStockLevel', () => {
    it('should get current stock level', async () => {
      const product = await Product.create(validProductData);
      const stockLevel = await stockService.getStockLevel(product._id);
      expect(stockLevel).toBe(product.stockLevel);
    });

    it('should return null for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const stockLevel = await stockService.getStockLevel(nonExistentId);
      expect(stockLevel).toBeNull();
    });
  });

  describe('validateStockLevel', () => {
    it('should validate sufficient stock', async () => {
      const product = await Product.create({
        ...validProductData,
        stockLevel: 20
      });
      
      const isValid = await stockService.validateStockLevel(product._id, 15);
      expect(isValid).toBe(true);
    });

    it('should invalidate insufficient stock', async () => {
      const product = await Product.create({
        ...validProductData,
        stockLevel: 10
      });
      
      const isValid = await stockService.validateStockLevel(product._id, 15);
      expect(isValid).toBe(false);
    });
  });
});