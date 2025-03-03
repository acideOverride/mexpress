import mongoose from 'mongoose';
import { DbConnection } from './db-connection';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Transaction Manager for handling database transactions
 * Part of MEXP-2025-004-BE: Core CRUD Functionality
 */
export class TransactionManager {
  private connection: DbConnection;
  private sessionStorage = new AsyncLocalStorage<mongoose.ClientSession>();

  /**
   * Create a new transaction manager
   * @param connection Database connection
   */
  constructor(connection: DbConnection) {
    this.connection = connection;
  }

  /**
   * Run a function within a transaction
   * If the function throws an error, the transaction will be rolled back
   * If the function returns, the transaction will be committed
   * 
   * @param fn Function to run within transaction
   * @returns Result of the function
   */
  async runTransaction<T>(
    fn: (session: mongoose.ClientSession) => Promise<T>
  ): Promise<T> {
    // Check if already in a transaction (via session in current context)
    const existingSession = this.getCurrentSession();
    if (existingSession) {
      // If we're already in a transaction, use the existing session
      return fn(existingSession);
    }

    // Start a new session and transaction
    const session = await mongoose.startSession();
    let result: T;

    try {
      await session.startTransaction();
      
      // Execute the function within the transaction, storing the session
      // in AsyncLocalStorage so nested calls can access it
      result = await this.sessionStorage.run(session, async () => {
        return await fn(session);
      });
      
      // If we got here without an error, commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // If an error occurred, abort the transaction
      try {
        if (session && this.isInTransaction(session)) {
          await session.abortTransaction();
        }
      } catch (abortError) {
        console.error('Error aborting transaction:', abortError);
      }
      throw error;
    } finally {
      // End the session
      try {
        if (session) {
          await session.endSession();
        }
      } catch (endSessionError) {
        console.error('Error ending session:', endSessionError);
      }
    }

    return result;
  }

  /**
   * Get the current mongoose session from the async local storage
   * This is used to detect if we're already in a transaction
   */
  private getCurrentSession(): mongoose.ClientSession | null {
    return this.sessionStorage.getStore() || null;
  }

  /**
   * Create a savepoint within a transaction
   * @param session Mongoose session
   * @param name Savepoint name
   */
  async createSavepoint(session: mongoose.ClientSession, name: string): Promise<void> {
    if (!this.isInTransaction(session)) {
      throw new Error('Cannot create savepoint: No active transaction');
    }

    // MongoDB doesn't support savepoints directly, so we simulate them
    // by tracking the state at the time the savepoint is created
    // This is a simplified implementation - in a real system, you'd need
    // to track the actual database state
    const conn = this.connection.getConnection();
    const db = conn?.db;
    if (db && typeof db.admin === 'function') {
      await db.admin().command({
        setParameter: 1,
        comment: `SAVEPOINT ${name}`
      });
    }
  }

  /**
   * Roll back to a savepoint within a transaction
   * @param session Mongoose session
   * @param name Savepoint name
   */
  async rollbackToSavepoint(session: mongoose.ClientSession, name: string): Promise<void> {
    if (!this.isInTransaction(session)) {
      throw new Error('Cannot rollback to savepoint: No active transaction');
    }

    // This is a simplified implementation - in a real system with actual
    // savepoint support, you'd restore to the saved state
    const conn = this.connection.getConnection();
    const db = conn?.db;
    if (db && typeof db.admin === 'function') {
      await db.admin().command({
        setParameter: 1,
        comment: `ROLLBACK TO SAVEPOINT ${name}`
      });
    }
    
    // Note: MongoDB doesn't support partial rollbacks within a transaction,
    // so this is for demonstration purposes only
    console.warn('Warning: Partial rollbacks not supported in MongoDB');
  }

  /**
   * Check if a session has an active transaction
   * @param session Mongoose session
   */
  isInTransaction(session: mongoose.ClientSession): boolean {
    return !!session &&
           typeof session.inTransaction === 'function' &&
           session.inTransaction();
  }
}