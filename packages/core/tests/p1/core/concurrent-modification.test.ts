import mongoose from 'mongoose';
import { DbConnection } from '../../../../../packages/core/src/core/database/db-connection';
import { TransactionManager } from '../../../../../packages/core/src/core/database/transaction-manager';
import { ConcurrencyManager, LockMode, ConcurrencyError } from '../../../../../packages/core/src/core/database/concurrency-manager';

/**
 * Concurrent Modification Tests
 * BRQ: MEXP-2025-004-BE - Core CRUD Functionality
 *
 * These tests verify that concurrent modifications to documents
 * are handled correctly using different locking strategies.
 * 
 * NOTE: These tests require a MongoDB replica set to function correctly.
 * The current setup uses a standalone MongoDB server which does not support
 * transactions. This test is being skipped until a proper replica set
 * configuration is available.
 */
describe.skip('Concurrent Modification', () => {
  let connection: DbConnection;
  let transactionManager: TransactionManager;
  let concurrencyManager: ConcurrencyManager;
  let ProductModel: mongoose.Model<any>;
  
  beforeAll(async () => {
    // Connect to test database
    connection = new DbConnection({
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test_concurrency',
      options: { }
    });
    
    await connection.connect();
    
    // Create test schema and model
    const ProductSchema = new mongoose.Schema({
      name: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true, min: 0 },
      lastUpdated: { type: Date, default: Date.now }
    });
    
    // Add version key for optimistic locking
    ProductSchema.set('versionKey', '__v');
    
    ProductModel = connection.model('Product', ProductSchema);
    
    // Initialize managers
    transactionManager = new TransactionManager(connection);
    concurrencyManager = new ConcurrencyManager(connection, transactionManager);
  });
  
  afterAll(async () => {
    // Clean up database and close connection
    await connection.dropDatabase();
    await connection.close();
  });
  
  beforeEach(async () => {
    // Clear test collection before each test
    await ProductModel.deleteMany({});
  });
  
  test('should handle optimistic locking for concurrent updates', async () => {
    // Create a test document
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      stock: 10
    });
    
    // Simulate concurrent updates with optimistic locking
    const updatePromises = [
      // First update
      concurrencyManager.withOptimisticLock(
        ProductModel,
        product._id.toString(),
        async (doc) => {
          doc.price = 110;
          await new Promise(resolve => setTimeout(resolve, 10)); // Simulate processing time
          return doc.save();
        }
      ),
      
      // Second update (will retry due to version mismatch)
      concurrencyManager.withOptimisticLock(
        ProductModel,
        product._id.toString(),
        async (doc) => {
          doc.stock = 15;
          await new Promise(resolve => setTimeout(resolve, 5)); // Faster than first update
          return doc.save();
        }
      )
    ];
    
    // Both updates should succeed due to retry mechanism
    await expect(Promise.all(updatePromises)).resolves.toBeDefined();
    
    // Check final document state - both updates should be applied
    const updatedProduct = await ProductModel.findById(product._id);
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.price).toBe(110);
    expect(updatedProduct?.stock).toBe(15);
    expect(updatedProduct?.__v).toBeGreaterThan(0); // Version should be incremented
  });
  
  test('should throw ConcurrencyError when optimistic locking retries exhausted', async () => {
    // Create a test document
    const product = await ProductModel.create({
      name: 'Conflict Product',
      price: 200,
      stock: 20
    });
    
    // Simulate many concurrent updates that will exhaust retries
    const updatePromises = [];
    
    // Create 5 concurrent updates (more than default retry count)
    for (let i = 0; i < 5; i++) {
      updatePromises.push(
        concurrencyManager.withOptimisticLock(
          ProductModel,
          product._id.toString(),
          async (doc) => {
            doc.price = 200 + (i * 10);
            doc.stock = 20 + i;
            
            // Randomized delay to ensure conflicts
            await new Promise(resolve => setTimeout(resolve, Math.random() * 20));
            
            return doc.save();
          },
          { retryCount: 2 } // Limit retries to ensure errors
        ).catch(error => {
          // Capture errors for expectations
          if (error instanceof ConcurrencyError) {
            return error;
          }
          throw error;
        })
      );
    }
    
    // Run all updates
    const results = await Promise.all(updatePromises);
    
    // At least one update should fail with ConcurrencyError due to limited retries
    const concurrencyErrors = results.filter(result => result instanceof ConcurrencyError);
    expect(concurrencyErrors.length).toBeGreaterThan(0);
    
    // But some updates should succeed
    const successResults = results.filter(result => !(result instanceof Error));
    expect(successResults.length).toBeGreaterThan(0);
  });
  
  test('should handle pessimistic locking for concurrent updates', async () => {
    // Create a test document
    const product = await ProductModel.create({
      name: 'Exclusive Product',
      price: 300,
      stock: 30
    });
    
    // Track execution order
    const executionOrder: string[] = [];
    
    // Simulate concurrent updates with pessimistic locking
    const updatePromises = [
      // First update (will get lock first)
      concurrencyManager.withPessimisticLock(
        ProductModel,
        product._id.toString(),
        async (doc, session) => {
          executionOrder.push('update1-start');
          doc.price = 310;
          
          // Hold lock for a bit
          await new Promise(resolve => setTimeout(resolve, 100));
          
          await doc.save({ session });
          executionOrder.push('update1-end');
          return 'update1';
        }
      ),
      
      // Second update (will wait for first to complete)
      concurrencyManager.withPessimisticLock(
        ProductModel,
        product._id.toString(),
        async (doc, session) => {
          executionOrder.push('update2-start');
          doc.stock = 35;
          await doc.save({ session });
          executionOrder.push('update2-end');
          return 'update2';
        }
      )
    ];
    
    // Both updates should succeed, but in sequence
    const results = await Promise.all(updatePromises);
    expect(results).toContain('update1');
    expect(results).toContain('update2');
    
    // Check execution order - second update should only start after first completes
    expect(executionOrder.indexOf('update1-start')).toBeLessThan(executionOrder.indexOf('update1-end'));
    expect(executionOrder.indexOf('update1-end')).toBeLessThan(executionOrder.indexOf('update2-start'));
    
    // Check final document state - both updates should be applied
    const updatedProduct = await ProductModel.findById(product._id);
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.price).toBe(310);
    expect(updatedProduct?.stock).toBe(35);
  });
  
  test('should throw LockTimeoutError when pessimistic lock cannot be acquired', async () => {
    // Create a test document
    const product = await ProductModel.create({
      name: 'Timeout Product',
      price: 400,
      stock: 40
    });
    
    // Create a lock that won't release in time
    const longRunningLock = concurrencyManager.withPessimisticLock(
      ProductModel,
      product._id.toString(),
      async (doc, session) => {
        doc.price = 410;
        
        // Hold lock for a long time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return doc.save({ session });
      }
    );
    
    // Try to acquire another lock with short timeout
    const competingLock = concurrencyManager.withPessimisticLock(
      ProductModel,
      product._id.toString(),
      async (doc, session) => {
        doc.stock = 45;
        return doc.save({ session });
      },
      { timeoutMs: 200 } // Shorter than long-running lock
    );
    
    // Expect timeout error for competing lock
    await expect(competingLock).rejects.toThrow(/Failed to acquire lock.*within/);
    
    // Long-running lock should still succeed
    await expect(longRunningLock).resolves.toBeDefined();
  });
  
  test('should use different locking strategies based on options', async () => {
    // Create a test document
    const product = await ProductModel.create({
      name: 'Strategy Product',
      price: 500,
      stock: 50
    });
    
    // Test optimistic locking
    await concurrencyManager.withLock(
      ProductModel,
      product._id.toString(),
      async (doc) => {
        doc.price = 550;
        return doc.save();
      },
      { mode: LockMode.OPTIMISTIC }
    );
    
    // Test pessimistic locking
    await concurrencyManager.withLock(
      ProductModel,
      product._id.toString(),
      async (doc, session) => {
        if (!session) throw new Error('Session is required for pessimistic locking');
        doc.stock = 55;
        return doc.save({ session });
      },
      { mode: LockMode.PESSIMISTIC }
    );
    
    // Test no locking (direct update)
    await concurrencyManager.withLock(
      ProductModel,
      product._id.toString(),
      async (doc) => {
        doc.name = 'Updated Strategy Product';
        return doc.save();
      },
      { mode: LockMode.NONE }
    );
    
    // Check all updates were applied
    const updatedProduct = await ProductModel.findById(product._id);
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.price).toBe(550);
    expect(updatedProduct?.stock).toBe(55);
    expect(updatedProduct?.name).toBe('Updated Strategy Product');
  });
});