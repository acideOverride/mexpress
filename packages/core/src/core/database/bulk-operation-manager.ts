import mongoose from 'mongoose';
import { DbConnection } from './db-connection';
import { TransactionManager } from './transaction-manager';

/**
 * Options for configuring bulk operations
 */
export interface BulkOperationOptions {
  /**
   * Batch size for breaking up large operations
   * Default: 1000
   */
  batchSize?: number;
  
  /**
   * Whether to run the operation in a transaction
   * Default: true
   */
  useTransaction?: boolean;
  
  /**
   * Whether to continue on error (for some operations)
   * Default: false
   */
  continueOnError?: boolean;
  
  /**
   * Whether to validate documents before operation
   * Default: true
   */
  validate?: boolean;
  
  /**
   * Whether to order operations (required for some dependency chains)
   * Default: false
   */
  ordered?: boolean;
  
  /**
   * Custom timeout in milliseconds
   * Default: 30000 (30 seconds)
   */
  timeoutMs?: number;
}

/**
 * Results of a bulk operation
 */
export interface BulkOperationResult<T> {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  
  /**
   * Number of documents processed
   */
  processedCount: number;
  
  /**
   * Number of documents with errors
   */
  errorCount: number;
  
  /**
   * Array of errors encountered during operation
   */
  errors: Error[];
  
  /**
   * Array of document IDs that were processed
   */
  ids: string[];
  
  /**
   * The modified documents (if requested)
   */
  documents?: T[];
}

/**
 * Error thrown during bulk operations
 */
export class BulkOperationError extends Error {
  /**
   * Index of the document that caused the error
   */
  index: number;
  
  /**
   * Original document that caused the error
   */
  document: any;
  
  constructor(message: string, index: number, document: any) {
    super(message);
    this.name = 'BulkOperationError';
    this.index = index;
    this.document = document;
  }
}

/**
 * Extended MongoDB bulk write result with properties used in this manager
 * This is necessary because the mongoose types don't include all properties
 */
interface ExtendedBulkWriteResult extends mongoose.mongo.BulkWriteResult {
  nModified?: number;
  nUpserted?: number;
  nRemoved?: number;
  upserted?: Array<{ _id: mongoose.Types.ObjectId | string | any, index: number }>;
  getOperations?: () => Array<{
    q?: { _id?: mongoose.Types.ObjectId | string | any };
    u?: any;
    d?: any;
  }>;
}

/**
 * Manager for handling bulk database operations efficiently
 * Part of MEXP-2025-004-BE: Core CRUD Functionality
 */
export class BulkOperationManager {
  private connection: DbConnection;
  private transactionManager: TransactionManager;
  
  /**
   * Create a new bulk operation manager
   * @param connection Database connection
   * @param transactionManager Transaction manager
   */
  constructor(connection: DbConnection, transactionManager: TransactionManager) {
    this.connection = connection;
    this.transactionManager = transactionManager;
  }
  
  /**
   * Perform a bulk insert operation
   * @param model Mongoose model
   * @param documents Documents to insert
   * @param options Bulk operation options
   * @returns Result of the bulk operation
   */
  async bulkInsert<T extends mongoose.Document>(
    model: mongoose.Model<T>,
    documents: Partial<T>[],
    options: BulkOperationOptions = {}
  ): Promise<BulkOperationResult<T>> {
    const {
      batchSize = 1000,
      useTransaction = true,
      continueOnError = false,
      validate = true,
      ordered = false,
      timeoutMs = 30000
    } = options;
    
    const result: BulkOperationResult<T> = {
      success: true,
      processedCount: 0,
      errorCount: 0,
      errors: [],
      ids: [],
      documents: []
    };
    
    // No documents to process
    if (documents.length === 0) {
      return result;
    }
    
    // Timeout handling
    const timeout = setTimeout(() => {
      throw new Error(`Bulk insert operation timed out after ${timeoutMs}ms`);
    }, timeoutMs);
    
    try {
      // Prepare batches
      const batches: Partial<T>[][] = [];
      for (let i = 0; i < documents.length; i += batchSize) {
        batches.push(documents.slice(i, i + batchSize));
      }
      
      // Function to process a batch with or without transaction
      const processBatch = async (batch: Partial<T>[], session?: mongoose.ClientSession): Promise<void> => {
        // If validation is required, validate each document
        if (validate) {
          for (let i = 0; i < batch.length; i++) {
            const document = batch[i];
            const doc = new model(document);
            try {
              await doc.validate();
            } catch (error) {
              const index = i + (batches.indexOf(batch) * batchSize);
              const bulkError = new BulkOperationError(
                `Validation failed for document at index ${index}: ${(error as Error).message}`,
                index,
                document
              );
              
              result.errorCount++;
              result.errors.push(bulkError);
              
              if (!continueOnError) {
                result.success = false;
                throw bulkError;
              }
            }
          }
        }
        
        try {
          // Perform bulk insert for the batch
          const insertResult = await model.insertMany(batch, {
            session,
            ordered,
            rawResult: false
          });
          
          result.processedCount += insertResult.length;
          
          // Collect IDs and documents
          insertResult.forEach((doc: any) => {
            result.ids.push(doc._id instanceof mongoose.Types.ObjectId 
              ? doc._id.toString() 
              : String(doc._id));
          });
          
          if (result.documents) {
            result.documents = [...(result.documents || []), ...(insertResult as unknown as T[])];
          }
        } catch (error) {
          // Handle MongoDB bulk error
          if ((error as any).writeErrors) {
            const writeErrors = (error as any).writeErrors;
            result.errorCount += writeErrors.length;
            
            writeErrors.forEach((writeError: any) => {
              const index = writeError.index + (batches.indexOf(batch) * batchSize);
              const document = batch[writeError.index];
              
              const bulkError = new BulkOperationError(
                `Insert failed for document at index ${index}: ${writeError.errmsg}`,
                index,
                document
              );
              
              result.errors.push(bulkError);
            });
          } else {
            result.errorCount++;
            result.errors.push(error as Error);
          }
          
          result.success = false;
          
          if (!continueOnError) {
            throw error;
          }
        }
      };
      
      // Process batches with or without transaction
      if (useTransaction) {
        await this.transactionManager.runTransaction(async (session) => {
          for (const batch of batches) {
            await processBatch(batch, session);
          }
        });
      } else {
        for (const batch of batches) {
          await processBatch(batch);
        }
      }
    } catch (error) {
      result.success = false;
      
      // Add error if not already tracked
      if (!result.errors.includes(error as Error)) {
        result.errors.push(error as Error);
        result.errorCount++;
      }
    } finally {
      clearTimeout(timeout);
    }
    
    return result;
  }
  
  /**
   * Perform a bulk update operation
   * @param model Mongoose model
   * @param updates Array of updates, each with filter and update
   * @param options Bulk operation options
   * @returns Result of the bulk operation
   */
  async bulkUpdate<T extends mongoose.Document>(
    model: mongoose.Model<T>,
    updates: { filter: mongoose.FilterQuery<T>; update: mongoose.UpdateQuery<T> }[],
    options: BulkOperationOptions = {}
  ): Promise<BulkOperationResult<T>> {
    const {
      batchSize = 1000,
      useTransaction = true,
      continueOnError = false,
      ordered = false,
      timeoutMs = 30000
    } = options;
    
    const result: BulkOperationResult<T> = {
      success: true,
      processedCount: 0,
      errorCount: 0,
      errors: [],
      ids: []
    };
    
    // No updates to process
    if (updates.length === 0) {
      return result;
    }
    
    // Timeout handling
    const timeout = setTimeout(() => {
      throw new Error(`Bulk update operation timed out after ${timeoutMs}ms`);
    }, timeoutMs);
    
    try {
      // Prepare batches
      const batches: typeof updates[] = [];
      for (let i = 0; i < updates.length; i += batchSize) {
        batches.push(updates.slice(i, i + batchSize));
      }
      
      // Function to process a batch with or without transaction
      const processBatch = async (batch: typeof updates, session?: mongoose.ClientSession): Promise<void> => {
        try {
          // Create bulk operation
          const bulk = session ? model.collection.initializeUnorderedBulkOp({ session }) : 
                               model.collection.initializeUnorderedBulkOp();
          
          // Add each update to the bulk operation
          batch.forEach(({ filter, update }) => {
            bulk.find(filter).updateOne(update);
          });
          
          // Execute the bulk operation
          const bulkResult = await bulk.execute() as ExtendedBulkWriteResult;
          
          // Use modifiedCount if available, otherwise fall back to nModified
          result.processedCount += bulkResult.modifiedCount || bulkResult.nModified || 0;
          
          // Try to collect affected IDs if possible
          if (typeof bulkResult.getOperations === 'function') {
            const operations = bulkResult.getOperations();
            operations.forEach((op: any) => {
              if (op.q && op.q._id) {
                const id = op.q._id instanceof mongoose.Types.ObjectId
                  ? op.q._id.toString()
                  : String(op.q._id);
                result.ids.push(id);
              }
            });
          }
        } catch (error) {
          // Handle MongoDB bulk error
          if ((error as any).writeErrors) {
            const writeErrors = (error as any).writeErrors;
            result.errorCount += writeErrors.length;
            
            writeErrors.forEach((writeError: any) => {
              const index = writeError.index + (batches.indexOf(batch) * batchSize);
              const updateData = batch[writeError.index];
              
              const bulkError = new BulkOperationError(
                `Update failed for document at index ${index}: ${writeError.errmsg}`,
                index,
                updateData
              );
              
              result.errors.push(bulkError);
            });
          } else {
            result.errorCount++;
            result.errors.push(error as Error);
          }
          
          result.success = false;
          
          if (!continueOnError) {
            throw error;
          }
        }
      };
      
      // Process batches with or without transaction
      if (useTransaction) {
        await this.transactionManager.runTransaction(async (session) => {
          for (const batch of batches) {
            await processBatch(batch, session);
          }
        });
      } else {
        for (const batch of batches) {
          await processBatch(batch);
        }
      }
    } catch (error) {
      result.success = false;
      
      // Add error if not already tracked
      if (!result.errors.includes(error as Error)) {
        result.errors.push(error as Error);
        result.errorCount++;
      }
    } finally {
      clearTimeout(timeout);
    }
    
    return result;
  }
  
  /**
   * Perform a bulk delete operation
   * @param model Mongoose model
   * @param filters Array of filters to identify documents to delete
   * @param options Bulk operation options
   * @returns Result of the bulk operation
   */
  async bulkDelete<T extends mongoose.Document>(
    model: mongoose.Model<T>,
    filters: mongoose.FilterQuery<T>[],
    options: BulkOperationOptions = {}
  ): Promise<BulkOperationResult<T>> {
    const {
      batchSize = 1000,
      useTransaction = true,
      continueOnError = false,
      ordered = false,
      timeoutMs = 30000
    } = options;
    
    const result: BulkOperationResult<T> = {
      success: true,
      processedCount: 0,
      errorCount: 0,
      errors: [],
      ids: []
    };
    
    // No deletes to process
    if (filters.length === 0) {
      return result;
    }
    
    // Timeout handling
    const timeout = setTimeout(() => {
      throw new Error(`Bulk delete operation timed out after ${timeoutMs}ms`);
    }, timeoutMs);
    
    try {
      // If we need to collect IDs before deletion (optional)
      if (options.useTransaction) {
        // Collect IDs before deletion (for possible rollback)
        const idsToDelete: string[] = [];
        
        await this.transactionManager.runTransaction(async (session) => {
          // Find all documents to be deleted
          for (const filter of filters) {
            const docs = await model.find(filter).select('_id').session(session);
            idsToDelete.push(...docs.map((doc: any) => 
              doc._id instanceof mongoose.Types.ObjectId
                ? doc._id.toString()
                : String(doc._id)
            ));
          }
          
          // Prepare batches
          const batches: mongoose.FilterQuery<T>[][] = [];
          for (let i = 0; i < filters.length; i += batchSize) {
            batches.push(filters.slice(i, i + batchSize));
          }
          
          // Process each batch
          for (const batch of batches) {
            try {
              // Use bulk operation for deletion
              const bulk = model.collection.initializeUnorderedBulkOp({ session });
              
              batch.forEach(filter => {
                bulk.find(filter).deleteOne();
              });
              
              const bulkResult = await bulk.execute() as ExtendedBulkWriteResult;
              result.processedCount += bulkResult.deletedCount || bulkResult.nRemoved || 0;
            } catch (error) {
              result.success = false;
              result.errorCount++;
              result.errors.push(error as Error);
              
              if (!continueOnError) {
                throw error;
              }
            }
          }
          
          // Store deleted IDs
          result.ids = idsToDelete;
        });
      } else {
        // Non-transactional approach
        // Prepare batches
        const batches: mongoose.FilterQuery<T>[][] = [];
        for (let i = 0; i < filters.length; i += batchSize) {
          batches.push(filters.slice(i, i + batchSize));
        }
        
        // Process each batch
        for (const batch of batches) {
          try {
            // Find IDs before deletion
            const idsInBatch: string[] = [];
            for (const filter of batch) {
              const docs = await model.find(filter).select('_id');
              idsInBatch.push(...docs.map((doc: any) => 
                doc._id instanceof mongoose.Types.ObjectId
                  ? doc._id.toString()
                  : String(doc._id)
              ));
            }
            
            // Use bulk operation for deletion
            const bulk = model.collection.initializeUnorderedBulkOp();
            
            batch.forEach(filter => {
              bulk.find(filter).deleteOne();
            });
            
            const bulkResult = await bulk.execute() as ExtendedBulkWriteResult;
            result.processedCount += bulkResult.deletedCount || bulkResult.nRemoved || 0;
            result.ids.push(...idsInBatch);
          } catch (error) {
            result.success = false;
            result.errorCount++;
            result.errors.push(error as Error);
            
            if (!continueOnError) {
              throw error;
            }
          }
        }
      }
    } catch (error) {
      result.success = false;
      
      // Add error if not already tracked
      if (!result.errors.includes(error as Error)) {
        result.errors.push(error as Error);
        result.errorCount++;
      }
    } finally {
      clearTimeout(timeout);
    }
    
    return result;
  }
  
  /**
   * Perform a bulk upsert operation (update or insert)
   * @param model Mongoose model
   * @param upserts Array of upserts, each with filter and update
   * @param options Bulk operation options
   * @returns Result of the bulk operation
   */
  async bulkUpsert<T extends mongoose.Document>(
    model: mongoose.Model<T>,
    upserts: { filter: mongoose.FilterQuery<T>; update: mongoose.UpdateQuery<T> }[],
    options: BulkOperationOptions = {}
  ): Promise<BulkOperationResult<T>> {
    const {
      batchSize = 1000,
      useTransaction = true,
      continueOnError = false,
      ordered = false,
      timeoutMs = 30000
    } = options;
    
    const result: BulkOperationResult<T> = {
      success: true,
      processedCount: 0,
      errorCount: 0,
      errors: [],
      ids: []
    };
    
    // No upserts to process
    if (upserts.length === 0) {
      return result;
    }
    
    // Timeout handling
    const timeout = setTimeout(() => {
      throw new Error(`Bulk upsert operation timed out after ${timeoutMs}ms`);
    }, timeoutMs);
    
    try {
      // Prepare batches
      const batches: typeof upserts[] = [];
      for (let i = 0; i < upserts.length; i += batchSize) {
        batches.push(upserts.slice(i, i + batchSize));
      }
      
      // Function to process a batch with or without transaction
      const processBatch = async (batch: typeof upserts, session?: mongoose.ClientSession): Promise<void> => {
        try {
          // Create bulk operation
          const bulk = session ? model.collection.initializeUnorderedBulkOp({ session }) : 
                               model.collection.initializeUnorderedBulkOp();
          
          // Add each upsert to the bulk operation
          batch.forEach(({ filter, update }) => {
            bulk.find(filter).upsert().updateOne(update);
          });
          
          // Execute the bulk operation
          const bulkResult = await bulk.execute() as ExtendedBulkWriteResult;
          
          // Use standard properties if available, otherwise fall back to legacy properties
          const modified = bulkResult.modifiedCount || bulkResult.nModified || 0;
          const upserted = bulkResult.upsertedCount || bulkResult.nUpserted || 0;
          result.processedCount += (modified + upserted);
          
          // Collect upserted IDs
          if (bulkResult.upserted && Array.isArray(bulkResult.upserted)) {
            bulkResult.upserted.forEach((upsert: any) => {
              const id = upsert._id instanceof mongoose.Types.ObjectId
                ? upsert._id.toString()
                : String(upsert._id);
              result.ids.push(id);
            });
          }
          
          // Try to collect modified IDs if possible
          if (typeof bulkResult.getOperations === 'function') {
            const operations = bulkResult.getOperations();
            operations.forEach((op: any) => {
              if (op.q && op.q._id && !result.ids.includes(
                op.q._id instanceof mongoose.Types.ObjectId
                  ? op.q._id.toString()
                  : String(op.q._id)
              )) {
                const id = op.q._id instanceof mongoose.Types.ObjectId
                  ? op.q._id.toString()
                  : String(op.q._id);
                result.ids.push(id);
              }
            });
          }
        } catch (error) {
          // Handle MongoDB bulk error
          if ((error as any).writeErrors) {
            const writeErrors = (error as any).writeErrors;
            result.errorCount += writeErrors.length;
            
            writeErrors.forEach((writeError: any) => {
              const index = writeError.index + (batches.indexOf(batch) * batchSize);
              const upsertData = batch[writeError.index];
              
              const bulkError = new BulkOperationError(
                `Upsert failed for document at index ${index}: ${writeError.errmsg}`,
                index,
                upsertData
              );
              
              result.errors.push(bulkError);
            });
          } else {
            result.errorCount++;
            result.errors.push(error as Error);
          }
          
          result.success = false;
          
          if (!continueOnError) {
            throw error;
          }
        }
      };
      
      // Process batches with or without transaction
      if (useTransaction) {
        await this.transactionManager.runTransaction(async (session) => {
          for (const batch of batches) {
            await processBatch(batch, session);
          }
        });
      } else {
        for (const batch of batches) {
          await processBatch(batch);
        }
      }
    } catch (error) {
      result.success = false;
      
      // Add error if not already tracked
      if (!result.errors.includes(error as Error)) {
        result.errors.push(error as Error);
        result.errorCount++;
      }
    } finally {
      clearTimeout(timeout);
    }
    
    return result;
  }
}