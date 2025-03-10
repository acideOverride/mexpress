import mongoose from 'mongoose';

/**
 * MongoDB connection manager
 * 
 * Handles connecting to MongoDB and provides connection status utilities
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;
  private isConnecting = false;
  private connectionAttempts = 0;
  private readonly maxConnectionAttempts = 5;
  private readonly connectionRetryDelay = 3000; // 3 seconds
  
  /**
   * Get the singleton instance of DatabaseConnection
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  
  /**
   * Connect to MongoDB
   */
  public async connect(): Promise<void> {
    // Skip if already connected or connecting
    if (this.isConnected) {
      console.log('Already connected to MongoDB');
      return;
    }
    
    if (this.isConnecting) {
      console.log('MongoDB connection in progress...');
      return;
    }
    
    this.isConnecting = true;
    
    try {
      // Get MongoDB URI from environment variable or use default
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/montpc_crm';
      
      // Configure mongoose
      mongoose.set('strictQuery', false);
      
      // Connect to MongoDB
      console.log(`Connecting to MongoDB at ${uri}...`);
      await mongoose.connect(uri, {
        // Use the connection options recommended by Mongoose
        // These will change depending on the mongoose version
      });
      
      // Reset connection state
      this.isConnected = true;
      this.isConnecting = false;
      this.connectionAttempts = 0;
      
      console.log('Connected to MongoDB successfully');
      
      // Set up connection event listeners
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
        this.retryConnection();
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        this.isConnected = false;
        this.retryConnection();
      });
      
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect to MongoDB:', error);
      this.retryConnection();
    }
  }
  
  /**
   * Retry connection with backoff
   */
  private retryConnection(): void {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      console.error(`Failed to connect to MongoDB after ${this.maxConnectionAttempts} attempts. Giving up.`);
      return;
    }
    
    this.connectionAttempts++;
    
    const delay = this.connectionRetryDelay * this.connectionAttempts;
    console.log(`Retrying MongoDB connection in ${delay}ms (attempt ${this.connectionAttempts}/${this.maxConnectionAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }
  
  /**
   * Check if connected to MongoDB
   */
  public isConnectedToMongoDB(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();