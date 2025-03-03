import mongoose from 'mongoose';

/**
 * Database connection options interface
 */
export interface DbConnectionOptions {
  uri: string;
  options?: mongoose.ConnectOptions;
}

/**
 * Database connection manager
 * Part of MEXP-2025-004-BE: Core CRUD Functionality
 */
export class DbConnection {
  private uri: string;
  private options: mongoose.ConnectOptions;
  private isConnected: boolean = false;
  private connectionInstance: mongoose.Connection | null = null;

  /**
   * Create a new database connection
   * @param options Connection options
   */
  constructor(options: DbConnectionOptions) {
    this.uri = options.uri;
    this.options = options.options || {};
  }

  /**
   * Connect to the database
   */
  async connect(): Promise<mongoose.Connection> {
    if (this.isConnected && this.connectionInstance) {
      return this.connectionInstance;
    }

    try {
      await mongoose.connect(this.uri, this.options);
      this.isConnected = true;
      this.connectionInstance = mongoose.connection;
      return this.connectionInstance;
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw new Error(`Database connection failed: ${(error as Error).message}`);
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.isConnected) {
      try {
        await mongoose.connection.close();
        this.isConnected = false;
        this.connectionInstance = null;
      } catch (error) {
        console.error('Failed to close database connection:', error);
        throw new Error(`Database disconnection failed: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Create a model with the given name and schema
   * @param name Model name
   * @param schema Mongoose schema
   * @returns Mongoose model
   */
  model<T extends mongoose.Document>(
    name: string,
    schema: mongoose.Schema
  ): mongoose.Model<T> {
    return mongoose.model<T>(name, schema);
  }

  /**
   * Get the connection instance
   */
  getConnection(): mongoose.Connection {
    if (!this.isConnected || !this.connectionInstance) {
      throw new Error('Not connected to database');
    }
    return this.connectionInstance;
  }

  /**
   * Drop the database (for testing)
   */
  async dropDatabase(): Promise<void> {
    if (this.isConnected && this.connectionInstance) {
      try {
        await this.connectionInstance.dropDatabase();
      } catch (error) {
        console.error('Failed to drop database:', error);
        throw new Error(`Failed to drop database: ${(error as Error).message}`);
      }
    } else {
      throw new Error('Not connected to database');
    }
  }

  /**
   * Check if connected to database
   */
  isConnectedToDatabase(): boolean {
    return this.isConnected;
  }
}