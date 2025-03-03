import mongoose from 'mongoose';
import { DbConnection } from '../../../../../packages/core/src/core/database/db-connection';
import { TransactionManager } from '../../../../../packages/core/src/core/database/transaction-manager';
import { BulkOperationManager } from '../../../../../packages/core/src/core/database/bulk-operation-manager';

/**
 * Bulk Operations Tests
 * BRQ: MEXP-2025-004-BE - Core CRUD Functionality
 *
 * These tests verify the proper functioning of bulk database operations,
 * including insert, update, delete, and upsert operations with various options.
 * 
 * NOTE: These tests require a MongoDB replica set to function correctly.
 * The current setup uses a standalone MongoDB server which does not support
 * transactions. This test is being skipped until a proper replica set
 * configuration is available.
 */
describe.skip('Bulk Operations', () => {
  let connection: DbConnection;
  let transactionManager: TransactionManager;
  let bulkManager: BulkOperationManager;
  let ProductModel: mongoose.Model<any>;
  
  beforeAll(async () => {
    // Connect to test database
    connection = new DbConnection({
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test_bulk',
      options: {}
    });
    
    await connection.connect();
    
    // Create test schema and model
    const ProductSchema = new mongoose.Schema({
      sku: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true, min: 0 },
      category: { type: String, required: true },
      tags: [String],
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    ProductModel = connection.model('Product', ProductSchema);
    
    // Initialize managers
    transactionManager = new TransactionManager(connection);
    bulkManager = new BulkOperationManager(connection, transactionManager);
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
  
  describe('bulkInsert', () => {
    test('should insert multiple documents efficiently', async () => {
      // Create test data - 500 products
      const products = [];
      for (let i = 0; i < 500; i++) {
        products.push({
          sku: `SKU-${i.toString().padStart(6, '0')}`,
          name: `Product ${i}`,
          price: Math.floor(Math.random() * 1000) / 10,
          stock: Math.floor(Math.random() * 100),
          category: ['Electronics', 'Clothing', 'Home', 'Books', 'Food'][Math.floor(Math.random() * 5)],
          tags: ['new', 'sale', 'featured', 'clearance'].filter(() => Math.random() > 0.7),
          isActive: Math.random() > 0.1
        });
      }
      
      // Perform bulk insert
      const result = await bulkManager.bulkInsert(ProductModel, products);
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(500);
      expect(result.errorCount).toBe(0);
      expect(result.ids.length).toBe(500);
      
      // Verify database state
      const dbCount = await ProductModel.countDocuments();
      expect(dbCount).toBe(500);
    });
    
    test('should handle validation errors in bulk insert', async () => {
      // Create test data with validation errors
      const products = [
        {
          sku: 'SKU-001',
          name: 'Valid Product 1',
          price: 10.99,
          stock: 5,
          category: 'Electronics'
        },
        {
          sku: 'SKU-002',
          name: 'Invalid Product - Missing Price',
          // price is missing (required)
          stock: 10,
          category: 'Clothing'
        },
        {
          sku: 'SKU-003',
          name: 'Invalid Product - Negative Stock',
          price: 24.99,
          stock: -5, // Invalid - min 0
          category: 'Books'
        },
        {
          sku: 'SKU-004',
          name: 'Valid Product 2',
          price: 15.99,
          stock: 20,
          category: 'Home'
        }
      ];
      
      // Perform bulk insert with continueOnError
      const result = await bulkManager.bulkInsert(ProductModel, products, {
        continueOnError: true,
        validate: true
      });
      
      // Check results
      expect(result.success).toBe(false); // Some operations failed
      expect(result.processedCount).toBe(2); // 2 valid documents
      expect(result.errorCount).toBe(2); // 2 validation errors
      expect(result.errors.length).toBe(2);
      
      // Verify error details
      expect(result.errors[0].message).toMatch(/Missing.*price|required/i);
      expect(result.errors[1].message).toMatch(/stock.*min/i);
      
      // Verify database state - only valid documents should be inserted
      const dbProducts = await ProductModel.find().sort({ sku: 1 });
      expect(dbProducts.length).toBe(2);
      expect(dbProducts[0].sku).toBe('SKU-001');
      expect(dbProducts[1].sku).toBe('SKU-004');
    });
    
    test('should respect batch size for large inserts', async () => {
      // Generate large dataset - 1200 products
      const products = [];
      for (let i = 0; i < 1200; i++) {
        products.push({
          sku: `BATCH-${i.toString().padStart(6, '0')}`,
          name: `Batch Product ${i}`,
          price: Math.floor(Math.random() * 1000) / 10,
          stock: Math.floor(Math.random() * 100),
          category: 'Batch Test'
        });
      }
      
      // Use small batch size to test batching
      const result = await bulkManager.bulkInsert(ProductModel, products, {
        batchSize: 200 // 6 batches for 1200 products
      });
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(1200);
      expect(result.errorCount).toBe(0);
      expect(result.ids.length).toBe(1200);
      
      // Verify database state
      const dbCount = await ProductModel.countDocuments();
      expect(dbCount).toBe(1200);
    });
  });
  
  describe('bulkUpdate', () => {
    beforeEach(async () => {
      // Create test data for updates
      const baseProducts = [];
      for (let i = 0; i < 100; i++) {
        baseProducts.push({
          sku: `UPD-${i.toString().padStart(3, '0')}`,
          name: `Product ${i}`,
          price: 10 + i,
          stock: 100 - i,
          category: i % 2 === 0 ? 'Category A' : 'Category B',
          isActive: true
        });
      }
      
      // Insert test data
      await ProductModel.insertMany(baseProducts);
    });
    
    test('should update multiple documents efficiently', async () => {
      // Prepare update operations
      const priceIncrease = 5.0;
      const stockDecrease = 10;
      
      // Find products to update
      const productsToUpdate = await ProductModel.find({ category: 'Category A' });
      
      // Create update operations
      const updates = productsToUpdate.map(product => ({
        filter: { _id: product._id },
        update: { 
          $inc: { price: priceIncrease, stock: -stockDecrease },
          $set: { updatedAt: new Date() }
        }
      }));
      
      // Perform bulk update
      const result = await bulkManager.bulkUpdate(ProductModel, updates);
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(updates.length);
      expect(result.errorCount).toBe(0);
      
      // Verify database state
      const updatedProducts = await ProductModel.find({ category: 'Category A' });
      for (const product of updatedProducts) {
        const originalProduct = productsToUpdate.find(p => p._id.toString() === product._id.toString());
        expect(product.price).toBe(originalProduct.price + priceIncrease);
        expect(product.stock).toBe(originalProduct.stock - stockDecrease);
      }
    });
    
    test('should handle invalid updates gracefully', async () => {
      // Create some updates that will fail schema validation
      const updates = [
        {
          // Valid update
          filter: { sku: 'UPD-001' },
          update: { $set: { price: 25.99, stock: 75 } }
        },
        {
          // Invalid update - negative stock
          filter: { sku: 'UPD-002' },
          update: { $set: { stock: -10 } }
        },
        {
          // Valid update
          filter: { sku: 'UPD-003' },
          update: { $set: { price: 15.50, isActive: false } }
        }
      ];
      
      // Perform bulk update
      const result = await bulkManager.bulkUpdate(ProductModel, updates, {
        continueOnError: true
      });
      
      // Check results
      expect(result.success).toBe(false); // Some operations failed
      expect(result.processedCount).toBe(2); // 2 valid updates
      expect(result.errorCount).toBe(1); // 1 invalid update
      
      // Verify database state
      const product1 = await ProductModel.findOne({ sku: 'UPD-001' });
      const product2 = await ProductModel.findOne({ sku: 'UPD-002' });
      const product3 = await ProductModel.findOne({ sku: 'UPD-003' });
      
      expect(product1.price).toBe(25.99);
      expect(product2.stock).not.toBe(-10); // Should not be updated
      expect(product3.isActive).toBe(false);
    });
    
    test('should update documents with complex conditions', async () => {
      // Perform bulk update based on complex filters
      const updates = [
        {
          // Update all products in Category A with stock > 80
          filter: { category: 'Category A', stock: { $gt: 80 } },
          update: { 
            $set: { 
              tags: ['high-stock', 'premium'],
              isActive: true
            }
          }
        },
        {
          // Update all products in Category B with price < 30
          filter: { category: 'Category B', price: { $lt: 30 } },
          update: { 
            $set: { 
              tags: ['budget', 'sale'],
              isActive: true
            },
            $inc: { price: 2 } // Increase price by 2
          }
        }
      ];
      
      // Perform bulk update
      const result = await bulkManager.bulkUpdate(ProductModel, updates);
      
      // Check results
      expect(result.success).toBe(true);
      
      // Verify database state
      const highStockProducts = await ProductModel.find({ tags: 'high-stock' });
      const saleProducts = await ProductModel.find({ tags: 'sale' });
      
      for (const product of highStockProducts) {
        expect(product.category).toBe('Category A');
        expect(product.stock).toBeGreaterThan(80);
        expect(product.tags).toContain('premium');
      }
      
      for (const product of saleProducts) {
        expect(product.category).toBe('Category B');
        expect(product.tags).toContain('budget');
      }
    });
  });
  
  describe('bulkDelete', () => {
    beforeEach(async () => {
      // Create test data for deletion
      const baseProducts = [];
      for (let i = 0; i < 100; i++) {
        baseProducts.push({
          sku: `DEL-${i.toString().padStart(3, '0')}`,
          name: `Delete Product ${i}`,
          price: 10 + i,
          stock: 100 - i,
          category: i % 4 === 0 ? 'Obsolete' : 
                    i % 4 === 1 ? 'Clearance' : 
                    i % 4 === 2 ? 'Regular' : 'Premium',
          isActive: i % 5 !== 0 // Some inactive products
        });
      }
      
      // Insert test data
      await ProductModel.insertMany(baseProducts);
    });
    
    test('should delete multiple documents efficiently', async () => {
      // Delete all products in 'Obsolete' category or inactive products
      const filters = [
        { category: 'Obsolete' },
        { isActive: false }
      ];
      
      // Count matching documents before deletion
      const expectedDeletions = await ProductModel.countDocuments({
        $or: filters
      });
      
      // Perform bulk delete
      const result = await bulkManager.bulkDelete(ProductModel, filters);
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(expectedDeletions);
      expect(result.errorCount).toBe(0);
      expect(result.ids.length).toBe(expectedDeletions);
      
      // Verify database state
      const totalRemaining = await ProductModel.countDocuments();
      expect(totalRemaining).toBe(100 - expectedDeletions);
      
      // Ensure no obsolete products remain
      const obsoleteCount = await ProductModel.countDocuments({ category: 'Obsolete' });
      expect(obsoleteCount).toBe(0);
      
      // Ensure no inactive products remain
      const inactiveCount = await ProductModel.countDocuments({ isActive: false });
      expect(inactiveCount).toBe(0);
    });
    
    test('should use transaction for safe deletion', async () => {
      // Use transaction to safely delete products with stock zero
      const initialZeroStock = await ProductModel.find({ stock: 0 }).lean();
      const zeroStockIds = initialZeroStock.map(p => p._id);
      
      // Delete zero stock products in a transaction
      const result = await bulkManager.bulkDelete(ProductModel, [{ stock: 0 }], {
        useTransaction: true
      });
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(initialZeroStock.length);
      
      // Verify database state
      const remainingZeroStock = await ProductModel.countDocuments({ stock: 0 });
      expect(remainingZeroStock).toBe(0);
      
      // Verify IDs match what we expected to delete
      expect(result.ids.length).toBe(zeroStockIds.length);
      for (const id of zeroStockIds) {
        const idString = id instanceof mongoose.Types.ObjectId
          ? id.toString()
          : String(id);
        expect(result.ids).toContain(idString);
      }
    });
    
    test('should handle empty filters gracefully', async () => {
      // Empty filters should not delete anything
      const result = await bulkManager.bulkDelete(ProductModel, []);
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(0);
      expect(result.errorCount).toBe(0);
      expect(result.ids.length).toBe(0);
      
      // Verify database state is unchanged
      const count = await ProductModel.countDocuments();
      expect(count).toBe(100);
    });
  });
  
  describe('bulkUpsert', () => {
    beforeEach(async () => {
      // Create test data for upserts
      const baseProducts = [];
      for (let i = 0; i < 50; i++) {
        baseProducts.push({
          sku: `UPS-${i.toString().padStart(3, '0')}`,
          name: `Upsert Product ${i}`,
          price: 10 + i,
          stock: 100 - i,
          category: 'Regular',
          isActive: true
        });
      }
      
      // Insert test data
      await ProductModel.insertMany(baseProducts);
    });
    
    test('should perform mixed updates and inserts efficiently', async () => {
      // Create a mix of updates (existing SKUs) and inserts (new SKUs)
      const upserts = [
        // Updates to existing products
        {
          filter: { sku: 'UPS-001' },
          update: { $set: { price: 99.99, stock: 200, category: 'Updated' } }
        },
        {
          filter: { sku: 'UPS-010' },
          update: { $set: { price: 88.88, tags: ['updated'] } }
        },
        
        // Inserts for new products
        {
          filter: { sku: 'NEW-001' },
          update: {
            $set: {
              sku: 'NEW-001',
              name: 'New Product 1',
              price: 25.99,
              stock: 50,
              category: 'New',
              isActive: true
            }
          }
        },
        {
          filter: { sku: 'NEW-002' },
          update: {
            $set: {
              sku: 'NEW-002',
              name: 'New Product 2',
              price: 35.99,
              stock: 75,
              category: 'New',
              isActive: true
            }
          }
        }
      ];
      
      // Perform bulk upsert
      const result = await bulkManager.bulkUpsert(ProductModel, upserts);
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(4);
      expect(result.errorCount).toBe(0);
      
      // Verify database state
      const updated1 = await ProductModel.findOne({ sku: 'UPS-001' });
      const updated2 = await ProductModel.findOne({ sku: 'UPS-010' });
      const new1 = await ProductModel.findOne({ sku: 'NEW-001' });
      const new2 = await ProductModel.findOne({ sku: 'NEW-002' });
      
      // Check updates
      expect(updated1.price).toBe(99.99);
      expect(updated1.stock).toBe(200);
      expect(updated1.category).toBe('Updated');
      
      expect(updated2.price).toBe(88.88);
      expect(updated2.tags).toContain('updated');
      
      // Check inserts
      expect(new1).toBeDefined();
      expect(new1.name).toBe('New Product 1');
      expect(new1.price).toBe(25.99);
      
      expect(new2).toBeDefined();
      expect(new2.name).toBe('New Product 2');
      expect(new2.price).toBe(35.99);
      
      // Check total count
      const totalCount = await ProductModel.countDocuments();
      expect(totalCount).toBe(52); // 50 original + 2 new
    });
    
    test('should handle validation errors in upserts', async () => {
      // Create upserts with validation errors
      const upserts = [
        // Valid update
        {
          filter: { sku: 'UPS-005' },
          update: { $set: { price: 199.99 } }
        },
        // Invalid insert - missing required fields
        {
          filter: { sku: 'INVALID-001' },
          update: {
            $set: {
              sku: 'INVALID-001',
              // Missing name (required)
              price: 15.99,
              // Missing category (required)
              stock: 20
            }
          }
        },
        // Valid insert
        {
          filter: { sku: 'VALID-001' },
          update: {
            $set: {
              sku: 'VALID-001',
              name: 'Valid New Product',
              price: 45.99,
              stock: 30,
              category: 'Valid'
            }
          }
        }
      ];
      
      // Perform bulk upsert with continueOnError
      const result = await bulkManager.bulkUpsert(ProductModel, upserts, {
        continueOnError: true
      });
      
      // Check results
      expect(result.success).toBe(false); // Some operations failed
      expect(result.errorCount).toBeGreaterThan(0);
      
      // Verify database state
      const updated = await ProductModel.findOne({ sku: 'UPS-005' });
      const invalid = await ProductModel.findOne({ sku: 'INVALID-001' });
      const valid = await ProductModel.findOne({ sku: 'VALID-001' });
      
      // Check updates
      expect(updated.price).toBe(199.99);
      
      // Invalid insert should not exist
      expect(invalid).toBeNull();
      
      // Valid insert should exist
      expect(valid).toBeDefined();
      expect(valid.name).toBe('Valid New Product');
      expect(valid.price).toBe(45.99);
    });
    
    test('should handle large batch of upserts efficiently', async () => {
      // Create a large batch of upserts
      const upserts = [];
      
      // Updates for existing items
      for (let i = 0; i < 25; i++) {
        upserts.push({
          filter: { sku: `UPS-${i.toString().padStart(3, '0')}` },
          update: {
            $inc: { price: 5 },
            $set: { updatedAt: new Date() }
          }
        });
      }
      
      // Inserts for new items
      for (let i = 0; i < 75; i++) {
        upserts.push({
          filter: { sku: `BATCH-${i.toString().padStart(3, '0')}` },
          update: {
            $set: {
              sku: `BATCH-${i.toString().padStart(3, '0')}`,
              name: `Batch Upsert ${i}`,
              price: Math.floor(Math.random() * 1000) / 10,
              stock: Math.floor(Math.random() * 100),
              category: 'Batch',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        });
      }
      
      // Perform bulk upsert with small batch size
      const result = await bulkManager.bulkUpsert(ProductModel, upserts, {
        batchSize: 20 // 5 batches of 20 for 100 operations
      });
      
      // Check results
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(100);
      expect(result.errorCount).toBe(0);
      
      // Verify database state
      const totalCount = await ProductModel.countDocuments();
      expect(totalCount).toBe(125); // 50 original + 75 new
      
      // Verify updates
      const updatedProducts = await ProductModel.find({ 
        sku: { $regex: /^UPS-/ },
        price: { $gt: 10 } // All should have had price increased
      });
      expect(updatedProducts.length).toBe(25);
      
      // Verify inserts
      const newProducts = await ProductModel.find({ sku: { $regex: /^BATCH-/ } });
      expect(newProducts.length).toBe(75);
    });
  });
});