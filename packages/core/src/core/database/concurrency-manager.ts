import mongoose from 'mongoose';
import { DbConnection } from './db-connection';
import { TransactionManager } from './transaction-manager';

/**
 * LockMode enum defines the type of locking to use
 */
export enum LockMode {
  /**
   * Optimistic locking uses versioning to detect conflicts
   */
  OPTIMISTIC = 'optimistic',
  
  /**
   * Pessimistic locking uses transactions to lock resources
   */
  PESSIMISTIC = 'pessimistic',
  
  /**
   * No locking (not recommended for concurrent updates)
   */
  NONE = 'none'
}

/**
 * Lock options for controlling concurrency
 */
export interface LockOptions {
  /**
   * The type of locking to use
   */
  mode: LockMode;
  
  /**
   * Optional timeout in milliseconds for acquiring locks
   */
  timeoutMs?: number;
  
  /**
   * Optional retry count for failed lock acquisitions
   */
  retryCount?: number;
  
  /**
   * Optional delay between retries in milliseconds
   */
  retryDelayMs?: number;
}

/**
 * Error thrown when a concurrency conflict is detected
 */
export class ConcurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConcurrencyError';
  }
}

/**
 * Error thrown when a lock cannot be acquired within the timeout
 */
export class LockTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LockTimeoutError';
  }
}

/**
 * Concurrency Manager for handling concurrent data modifications
 * Part of MEXP-2025-004-BE: Core CRUD Functionality
 */
export class ConcurrencyManager {
  private connection: DbConnection;
  private transactionManager: TransactionManager;
  private activeLocksMap = new Map<string, Date>();
  
  /**
   * Create a new concurrency manager
   * @param connection Database connection
   * @param transactionManager Transaction manager
   */
  constructor(connection: DbConnection, transactionManager: TransactionManager) {
    this.connection = connection;
    this.transactionManager = transactionManager;
  }
  
  /**
   * Execute a function with optimistic locking
   * @param model Mongoose model
   * @param id Document ID
   * @param fn Function to execute
   * @param options Lock options
   * @returns Result of the function
   */
  async withOptimisticLock<T, U extends mongoose.Document>(
    model: mongoose.Model<U>,
    id: string,
    fn: (doc: U) => Promise<T>,
    options: Partial<LockOptions> = {}
  ): Promise<T> {
    const retryCount = options.retryCount || 3;
    const retryDelay = options.retryDelayMs || 100;
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        // Find document with current version
        const doc = await model.findById(id);
        if (!doc) {
          throw new Error(`Document not found: ${id}`);
        }
        
        // Store the current version
        const originalVersion = doc.__v;
        
        // Execute the function
        const result = await fn(doc);
        
        // Update the document with version check
        const updated = await model.findOneAndUpdate(
          { _id: id, __v: originalVersion },
          { $set: doc.toObject(), $inc: { __v: 1 } },
          { new: true }
        );
        
        if (!updated) {
          if (attempt < retryCount) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue; // Retry
          }
          throw new ConcurrencyError(`Optimistic lock failed: Document was modified by another process`);
        }
        
        return result;
      } catch (error) {
        if (error instanceof ConcurrencyError || attempt >= retryCount) {
          throw error;
        }
        // For other errors, retry if retries remain
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    throw new ConcurrencyError(`Failed to acquire optimistic lock after ${retryCount} attempts`);
  }
  
  /**
   * Execute a function with pessimistic locking
   * @param model Mongoose model
   * @param id Document ID
   * @param fn Function to execute
   * @param options Lock options
   * @returns Result of the function
   */
  async withPessimisticLock<T, U extends mongoose.Document>(
    model: mongoose.Model<U>,
    id: string,
    fn: (doc: U, session: mongoose.ClientSession) => Promise<T>,
    options: Partial<LockOptions> = {}
  ): Promise<T> {
    const lockKey = `${model.modelName}:${id}`;
    const timeout = options.timeoutMs || 5000;
    const startTime = Date.now();
    
    // Check if document is already locked
    while (this.activeLocksMap.has(lockKey)) {
      if (Date.now() - startTime > timeout) {
        throw new LockTimeoutError(`Failed to acquire lock for ${lockKey} within ${timeout}ms`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Acquire lock
    this.activeLocksMap.set(lockKey, new Date());
    
    try {
      // Execute function in transaction to ensure isolation
      return await this.transactionManager.runTransaction(async (session) => {
        // Find document with lock
        const doc = await model.findById(id).session(session);
        if (!doc) {
          throw new Error(`Document not found: ${id}`);
        }
        
        // Execute function with document and session
        return await fn(doc, session);
      });
    } finally {
      // Release lock
      this.activeLocksMap.delete(lockKey);
    }
  }
  
  /**
   * Execute a function with the specified locking mode
   * @param model Mongoose model
   * @param id Document ID
   * @param fn Function to execute
   * @param options Lock options
   * @returns Result of the function
   */
  async withLock<T, U extends mongoose.Document>(
    model: mongoose.Model<U>,
    id: string,
    fn: (doc: U, session?: mongoose.ClientSession) => Promise<T>,
    options: Partial<LockOptions> = { mode: LockMode.OPTIMISTIC }
  ): Promise<T> {
    const mode = options.mode || LockMode.OPTIMISTIC;
    
    switch (mode) {
      case LockMode.OPTIMISTIC:
        return this.withOptimisticLock(model, id, fn, options);
      
      case LockMode.PESSIMISTIC:
        return this.withPessimisticLock(model, id, fn, options);
      
      case LockMode.NONE:
        const doc = await model.findById(id);
        if (!doc) {
          throw new Error(`Document not found: ${id}`);
        }
        return fn(doc);
      
      default:
        throw new Error(`Unsupported lock mode: ${mode}`);
    }
  }
}