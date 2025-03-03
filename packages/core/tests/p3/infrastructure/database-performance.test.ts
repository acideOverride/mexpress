import mongoose from 'mongoose';
import { DbConnection } from '../../../src/core/database/db-connection';
import { TransactionManager } from '../../../src/core/database/transaction-manager';
import { ConcurrencyManager, LockMode } from '../../../src/core/database/concurrency-manager';
import { BulkOperationManager } from '../../../src/core/database/bulk-operation-manager';

/**
 * Database Performance Tests
 * MEXP-2025-004-BE: Core CRUD Functionality
 * 
 * These tests verify the performance characteristics of database operations
 * under various loads and concurrency levels. They ensure that performance
 * remains within acceptable thresholds even under heavy load.
 */
describe('Database Performance', () => {
  let connection: DbConnection;
  let transactionManager: TransactionManager;
  let concurrencyManager: ConcurrencyManager;
  let bulkManager: BulkOperationManager;
  let PerformanceModel: mongoose.Model<any>;
  
  // Performance thresholds
  const THRESHOLDS = {
    // Transaction performance thresholds
    TRANSACTION_SIMPLE_MS: 50,  // Simple transaction should complete within 50ms
    TRANSACTION_COMPLEX_MS: 150, // Complex transaction should complete within 150ms
    TRANSACTION_CONCURRENT_MS: 300, // 10 concurrent transactions should complete within 300ms
    
    // Concurrency operation thresholds
    OPTIMISTIC_LOCK_MS: 100,  // Optimistic lock operation should complete within 100ms
    PESSIMISTIC_LOCK_MS: 150, // Pessimistic lock operation should complete within 150ms
    CONCURRENT_LOCKS_MS: 400, // 10 concurrent locks should complete within 400ms
    
    // Bulk operation thresholds
    BULK_INSERT_RATE: 1000,  // Should insert at least 1000 docs per second
    BULK_UPDATE_RATE: 800,   // Should update at least 800 docs per second
    BULK_DELETE_RATE: 900,   // Should delete at least 900 docs per second
    BULK_UPSERT_RATE: 700    // Should upsert at least 700 docs per second
  };
  
  beforeAll(async () => {
    // Connect to test database
    connection = new DbConnection({
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress_test_performance',
      options: {}
    });
    
    await connection.connect();
    
    // Create test schema and model with all necessary fields for performance testing
    const PerformanceSchema = new mongoose.Schema({
      key: { type: String, required: true, index: true },
      value: { type: Number, required: true },
      data: { type: String, required: true },
      tags: [String],
      metadata: {
        createdBy: String,
        lastModified: Date,
        version: { type: Number, default: 1 }
      },
      status: { 
        type: String, 
        enum: ['active', 'inactive', 'pending', 'archived'],
        default: 'active'
      },
      isImportant: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    // Add indexes for performance
    PerformanceSchema.index({ key: 1, status: 1 });
    PerformanceSchema.index({ 'metadata.createdBy': 1 });
    PerformanceSchema.index({ createdAt: -1 });
    
    PerformanceModel = connection.model('PerformanceTest', PerformanceSchema);
    
    // Initialize managers
    transactionManager = new TransactionManager(connection);
    concurrencyManager = new ConcurrencyManager(connection, transactionManager);
    bulkManager = new BulkOperationManager(connection, transactionManager);
  });
  
  afterAll(async () => {
    // Clean up database and close connection
    await connection.dropDatabase();
    await connection.close();
  });
  
  beforeEach(async () => {
    // Clear test collection before each test
    await PerformanceModel.deleteMany({});
  });
  
  describe('Transaction Performance', () => {
    test('should complete simple transactions within performance threshold', async () => {
      // Create a simple transaction that creates and updates a document
      const startTime = Date.now();
      
      await transactionManager.runTransaction(async (session) => {
        // Create a document
        const doc = new PerformanceModel({
          key: 'simple-transaction-test',
          value: 100,
          data: 'This is a simple transaction test',
          tags: ['performance', 'simple'],
          metadata: {
            createdBy: 'performance-test',
            lastModified: new Date(),
            version: 1
          }
        });
        
        await doc.save({ session });
        
        // Update the document
        doc.value = 200;
        doc.metadata.version = 2;
        doc.metadata.lastModified = new Date();
        
        await doc.save({ session });
        
        // Verify the document
        const updatedDoc = await PerformanceModel.findOne({ key: 'simple-transaction-test' }).session(session);
        expect(updatedDoc.value).toBe(200);
        expect(updatedDoc.metadata.version).toBe(2);
      });
      
      const duration = Date.now() - startTime;
      
      // Verify performance
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.TRANSACTION_SIMPLE_MS);
    });
    
    test('should complete complex transactions within performance threshold', async () => {
      // Create a complex transaction that performs multiple operations
      const startTime = Date.now();
      
      await transactionManager.runTransaction(async (session) => {
        // Create multiple documents
        const docs = [];
        for (let i = 0; i < 10; i++) {
          docs.push({
            key: `complex-transaction-test-${i}`,
            value: i * 100,
            data: `This is a complex transaction test document ${i}`,
            tags: ['performance', 'complex', `doc-${i}`],
            metadata: {
              createdBy: 'performance-test',
              lastModified: new Date(),
              version: 1
            },
            status: i % 2 === 0 ? 'active' : 'pending'
          });
        }
        
        await PerformanceModel.insertMany(docs, { session });
        
        // Update documents matching a condition
        await PerformanceModel.updateMany(
          { status: 'pending' },
          { 
            $set: { status: 'active' },
            $push: { tags: 'activated' },
            $inc: { 'metadata.version': 1 }
          },
          { session }
        );
        
        // Delete documents matching another condition
        await PerformanceModel.deleteMany(
          { value: { $lt: 300 } },
          { session }
        );
        
        // Query and verify remaining documents
        const remainingDocs = await PerformanceModel.find({}).session(session);
        expect(remainingDocs.length).toBe(7); // 10 created, 3 deleted
        
        // All should be active
        for (const doc of remainingDocs) {
          expect(doc.status).toBe('active');
        }
      });
      
      const duration = Date.now() - startTime;
      
      // Verify performance
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.TRANSACTION_COMPLEX_MS);
    });
    
    test('should handle concurrent transactions efficiently', async () => {
      // Test multiple concurrent transactions
      const startTime = Date.now();
      
      const concurrentTasks = 10;
      const transactionPromises = [];
      
      for (let i = 0; i < concurrentTasks; i++) {
        transactionPromises.push(
          transactionManager.runTransaction(async (session) => {
            // Create a document
            const doc = new PerformanceModel({
              key: `concurrent-transaction-test-${i}`,
              value: i * 100,
              data: `This is a concurrent transaction test document ${i}`,
              tags: ['performance', 'concurrent', `task-${i}`],
              metadata: {
                createdBy: `task-${i}`,
                lastModified: new Date(),
                version: 1
              }
            });
            
            await doc.save({ session });
            
            // Small delay to simulate processing time (various durations)
            await new Promise(resolve => setTimeout(resolve, i * 2));
            
            // Update the document
            doc.value = i * 200;
            doc.metadata.version = 2;
            doc.metadata.lastModified = new Date();
            
            await doc.save({ session });
            
            return doc;
          })
        );
      }
      
      // Wait for all transactions to complete
      await Promise.all(transactionPromises);
      
      const duration = Date.now() - startTime;
      
      // Verify database state
      const docs = await PerformanceModel.find({}).sort({ key: 1 });
      expect(docs.length).toBe(concurrentTasks);
      
      for (let i = 0; i < concurrentTasks; i++) {
        const doc = docs[i];
        expect(doc.key).toBe(`concurrent-transaction-test-${i}`);
        expect(doc.value).toBe(i * 200);
        expect(doc.metadata.version).toBe(2);
      }
      
      // Verify performance
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.TRANSACTION_CONCURRENT_MS);
    });
  });
  
  describe('Concurrency Performance', () => {
    test('should perform optimistic locking operations within threshold', async () => {
      // Create a test document
      const doc = await PerformanceModel.create({
        key: 'optimistic-lock-test',
        value: 100,
        data: 'This is an optimistic lock test',
        tags: ['performance', 'optimistic'],
        metadata: {
          createdBy: 'performance-test',
          lastModified: new Date(),
          version: 1
        }
      });
      
      const startTime = Date.now();
      
      // Perform 5 sequential optimistic lock operations
      for (let i = 0; i < 5; i++) {
        await concurrencyManager.withOptimisticLock(
          PerformanceModel,
          doc._id.toString(),
          async (document) => {
            document.value += 100;
            document.metadata.version += 1;
            document.metadata.lastModified = new Date();
            document.tags.push(`update-${i}`);
            
            // Small delay to simulate processing time
            await new Promise(resolve => setTimeout(resolve, 5));
            
            return document.save();
          }
        );
      }
      
      const duration = Date.now() - startTime;
      
      // Verify database state
      const updatedDoc = await PerformanceModel.findById(doc._id);
      expect(updatedDoc.value).toBe(600); // 100 + (5 * 100)
      expect(updatedDoc.metadata.version).toBe(6); // 1 + 5
      expect(updatedDoc.tags.length).toBe(6); // ['performance', 'optimistic', 'update-0', ..., 'update-4']
      
      // Verify performance
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.OPTIMISTIC_LOCK_MS);
    });
    
    test('should perform pessimistic locking operations within threshold', async () => {
      // Create a test document
      const doc = await PerformanceModel.create({
        key: 'pessimistic-lock-test',
        value: 100,
        data: 'This is a pessimistic lock test',
        tags: ['performance', 'pessimistic'],
        metadata: {
          createdBy: 'performance-test',
          lastModified: new Date(),
          version: 1
        }
      });
      
      const startTime = Date.now();
      
      // Perform 5 sequential pessimistic lock operations
      for (let i = 0; i < 5; i++) {
        await concurrencyManager.withPessimisticLock(
          PerformanceModel,
          doc._id.toString(),
          async (document, session) => {
            document.value += 100;
            document.metadata.version += 1;
            document.metadata.lastModified = new Date();
            document.tags.push(`update-${i}`);
            
            // Small delay to simulate processing time
            await new Promise(resolve => setTimeout(resolve, 10));
            
            return document.save({ session });
          }
        );
      }
      
      const duration = Date.now() - startTime;
      
      // Verify database state
      const updatedDoc = await PerformanceModel.findById(doc._id);
      expect(updatedDoc.value).toBe(600); // 100 + (5 * 100)
      expect(updatedDoc.metadata.version).toBe(6); // 1 + 5
      expect(updatedDoc.tags.length).toBe(7); // ['performance', 'pessimistic', 'update-0', ..., 'update-4']
      
      // Verify performance
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.PESSIMISTIC_LOCK_MS);
    });
    
    test('should handle concurrent locks efficiently', async () => {
      // Create 10 test documents
      const docs = [];
      for (let i = 0; i < 10; i++) {
        docs.push({
          key: `concurrent-lock-test-${i}`,
          value: i * 100,
          data: `This is a concurrent lock test document ${i}`,
          tags: ['performance', 'concurrent', `doc-${i}`],
          metadata: {
            createdBy: 'performance-test',
            lastModified: new Date(),
            version: 1
          }
        });
      }
      
      const createdDocs = await PerformanceModel.insertMany(docs);
      
      const startTime = Date.now();
      
      // Perform concurrent lock operations on different documents
      const lockPromises = createdDocs.map((doc, index) => {
        const lockMode = index % 2 === 0 ? LockMode.OPTIMISTIC : LockMode.PESSIMISTIC;
        
        return concurrencyManager.withLock(
          PerformanceModel,
          doc._id.toString(),
          async (document, session) => {
            document.value += 100;
            document.metadata.version += 1;
            document.metadata.lastModified = new Date();
            document.tags.push(`concurrent-update`);
            
            // Small delay to simulate processing time (various durations)
            await new Promise(resolve => setTimeout(resolve, index * 2));
            
            if (session) {
              return document.save({ session });
            } else {
              return document.save();
            }
          },
          { mode: lockMode }
        );
      });
      
      // Wait for all lock operations to complete
      await Promise.all(lockPromises);
      
      const duration = Date.now() - startTime;
      
      // Verify database state
      const updatedDocs = await PerformanceModel.find({}).sort({ key: 1 });
      expect(updatedDocs.length).toBe(10);
      
      for (let i = 0; i < 10; i++) {
        const doc = updatedDocs[i];
        expect(doc.key).toBe(`concurrent-lock-test-${i}`);
        expect(doc.value).toBe(i * 100 + 100);
        expect(doc.metadata.version).toBe(2);
        expect(doc.tags).toContain('concurrent-update');
      }
      
      // Verify performance
      expect(duration).toBeLessThanOrEqual(THRESHOLDS.CONCURRENT_LOCKS_MS);
    });
  });
  
  describe('Bulk Operation Performance', () => {
    test('should perform bulk inserts at required rate', async () => {
      // Create test data - 5000 documents
      const docsToInsert = 5000;
      const documents = [];
      
      for (let i = 0; i < docsToInsert; i++) {
        documents.push({
          key: `bulk-insert-test-${i}`,
          value: i,
          data: `This is a bulk insert test document ${i}`,
          tags: ['performance', 'bulk-insert', `doc-${i % 10}`],
          metadata: {
            createdBy: 'performance-test',
            lastModified: new Date(),
            version: 1
          },
          status: i % 4 === 0 ? 'active' : 
                 i % 4 === 1 ? 'inactive' :
                 i % 4 === 2 ? 'pending' : 'archived',
          isImportant: i % 5 === 0
        });
      }
      
      const startTime = Date.now();
      
      // Perform bulk insert
      const result = await bulkManager.bulkInsert(PerformanceModel, documents, {
        batchSize: 1000, // Use 1000 docs per batch
        useTransaction: true,
        validate: false // Skip validation for performance testing
      });
      
      const duration = Date.now() - startTime;
      const operationsPerSecond = Math.floor(docsToInsert / (duration / 1000));
      
      // Verify database state
      const count = await PerformanceModel.countDocuments();
      expect(count).toBe(docsToInsert);
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(docsToInsert);
      expect(result.errorCount).toBe(0);
      
      // Verify performance
      expect(operationsPerSecond).toBeGreaterThanOrEqual(THRESHOLDS.BULK_INSERT_RATE);
      
      console.log(`Bulk insert performance: ${operationsPerSecond} docs/second`);
    });
    
    test('should perform bulk updates at required rate', async () => {
      // First create test documents
      const docsToCreate = 5000;
      const documents = [];
      
      for (let i = 0; i < docsToCreate; i++) {
        documents.push({
          key: `bulk-update-test-${i}`,
          value: i,
          data: `This is a bulk update test document ${i}`,
          tags: ['performance', 'bulk-update'],
          metadata: {
            createdBy: 'performance-test',
            lastModified: new Date(),
            version: 1
          },
          status: i % 2 === 0 ? 'active' : 'inactive'
        });
      }
      
      // Insert test documents
      await PerformanceModel.insertMany(documents);
      
      // Create update operations - update all inactive documents
      const updates = [];
      for (let i = 0; i < docsToCreate; i++) {
        if (i % 2 !== 0) { // Only update inactive documents
          updates.push({
            filter: { key: `bulk-update-test-${i}` },
            update: {
              $set: {
                status: 'active',
                'metadata.version': 2,
                'metadata.lastModified': new Date(),
                updatedAt: new Date()
              },
              $push: { tags: 'updated' }
            }
          });
        }
      }
      
      const startTime = Date.now();
      
      // Perform bulk update
      const result = await bulkManager.bulkUpdate(PerformanceModel, updates, {
        batchSize: 1000, // Use 1000 updates per batch
        useTransaction: true
      });
      
      const duration = Date.now() - startTime;
      const operationsPerSecond = Math.floor(updates.length / (duration / 1000));
      
      // Verify database state
      const activeCount = await PerformanceModel.countDocuments({ status: 'active' });
      const inactiveCount = await PerformanceModel.countDocuments({ status: 'inactive' });
      
      expect(activeCount).toBe(docsToCreate); // All documents should now be active
      expect(inactiveCount).toBe(0);
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(updates.length);
      expect(result.errorCount).toBe(0);
      
      // Verify performance
      expect(operationsPerSecond).toBeGreaterThanOrEqual(THRESHOLDS.BULK_UPDATE_RATE);
      
      console.log(`Bulk update performance: ${operationsPerSecond} docs/second`);
    });
    
    test('should perform bulk deletes at required rate', async () => {
      // First create test documents
      const docsToCreate = 5000;
      const documents = [];
      
      for (let i = 0; i < docsToCreate; i++) {
        documents.push({
          key: `bulk-delete-test-${i}`,
          value: i,
          data: `This is a bulk delete test document ${i}`,
          tags: ['performance', 'bulk-delete'],
          metadata: {
            createdBy: 'performance-test',
            lastModified: new Date(),
            version: 1
          },
          status: i % 4 === 0 ? 'active' : 
                 i % 4 === 1 ? 'inactive' :
                 i % 4 === 2 ? 'pending' : 'archived'
        });
      }
      
      // Insert test documents
      await PerformanceModel.insertMany(documents);
      
      // Create delete filters - delete inactive and archived documents
      const filters = [
        { status: 'inactive' },
        { status: 'archived' }
      ];
      
      // Count documents that will be deleted
      const expectedDeletions = await PerformanceModel.countDocuments({
        $or: filters
      });
      
      expect(expectedDeletions).toBe(docsToCreate / 2); // Half of the documents should match
      
      const startTime = Date.now();
      
      // Perform bulk delete
      const result = await bulkManager.bulkDelete(PerformanceModel, filters, {
        useTransaction: true
      });
      
      const duration = Date.now() - startTime;
      const operationsPerSecond = Math.floor(expectedDeletions / (duration / 1000));
      
      // Verify database state
      const remainingCount = await PerformanceModel.countDocuments();
      expect(remainingCount).toBe(docsToCreate - expectedDeletions);
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(expectedDeletions);
      expect(result.errorCount).toBe(0);
      
      // Verify performance
      expect(operationsPerSecond).toBeGreaterThanOrEqual(THRESHOLDS.BULK_DELETE_RATE);
      
      console.log(`Bulk delete performance: ${operationsPerSecond} docs/second`);
    });
    
    test('should perform bulk upserts at required rate', async () => {
      // First create some test documents
      const existingDocsCount = 2500;
      const newDocsCount = 2500;
      const documents = [];
      
      for (let i = 0; i < existingDocsCount; i++) {
        documents.push({
          key: `bulk-upsert-test-${i}`,
          value: i,
          data: `This is a bulk upsert test document ${i}`,
          tags: ['performance', 'bulk-upsert'],
          metadata: {
            createdBy: 'performance-test',
            lastModified: new Date(),
            version: 1
          },
          status: 'active'
        });
      }
      
      // Insert existing documents
      await PerformanceModel.insertMany(documents);
      
      // Create upsert operations - update existing and insert new
      const upserts = [];
      
      // Update existing documents
      for (let i = 0; i < existingDocsCount; i++) {
        upserts.push({
          filter: { key: `bulk-upsert-test-${i}` },
          update: {
            $set: {
              value: i + 1000,
              'metadata.version': 2,
              'metadata.lastModified': new Date(),
              updatedAt: new Date()
            },
            $push: { tags: 'updated' }
          }
        });
      }
      
      // Insert new documents
      for (let i = existingDocsCount; i < existingDocsCount + newDocsCount; i++) {
        upserts.push({
          filter: { key: `bulk-upsert-test-${i}` },
          update: {
            $set: {
              key: `bulk-upsert-test-${i}`,
              value: i,
              data: `This is a new bulk upsert test document ${i}`,
              tags: ['performance', 'bulk-upsert', 'new'],
              metadata: {
                createdBy: 'performance-test',
                lastModified: new Date(),
                version: 1
              },
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        });
      }
      
      const startTime = Date.now();
      
      // Perform bulk upsert
      const result = await bulkManager.bulkUpsert(PerformanceModel, upserts, {
        batchSize: 1000, // Use 1000 upserts per batch
        useTransaction: true
      });
      
      const duration = Date.now() - startTime;
      const operationsPerSecond = Math.floor(upserts.length / (duration / 1000));
      
      // Verify database state
      const totalCount = await PerformanceModel.countDocuments();
      const updatedCount = await PerformanceModel.countDocuments({ tags: 'updated' });
      const newCount = await PerformanceModel.countDocuments({ tags: 'new' });
      
      expect(totalCount).toBe(existingDocsCount + newDocsCount);
      expect(updatedCount).toBe(existingDocsCount);
      expect(newCount).toBe(newDocsCount);
      expect(result.success).toBe(true);
      expect(result.processedCount).toBe(upserts.length);
      expect(result.errorCount).toBe(0);
      
      // Verify performance
      expect(operationsPerSecond).toBeGreaterThanOrEqual(THRESHOLDS.BULK_UPSERT_RATE);
      
      console.log(`Bulk upsert performance: ${operationsPerSecond} docs/second`);
    });
  });
});