import { PriorityLevel } from '../types';

/**
 * Database mock configuration based on test priority
 */
export interface DbConfig {
  timeout: number;
  retries: number;
  logging: boolean;
  useRealDb: boolean;
}

/**
 * Priority-specific database configurations
 */
const DB_CONFIGS: Record<PriorityLevel, DbConfig> = {
  p0: {
    timeout: 5000,    // 5s timeout for critical tests
    retries: 0,       // No retries, must succeed
    logging: true,    // Full logging
    useRealDb: true   // Use real database
  },
  p1: {
    timeout: 10000,   // 10s timeout
    retries: 3,       // Allow retries
    logging: true,    // Full logging
    useRealDb: false  // Use test database
  },
  p2: {
    timeout: 30000,   // 30s timeout
    retries: 5,       // More retries allowed
    logging: false,   // Minimal logging
    useRealDb: false  // Use test database
  }
};

/**
 * Mock database connection factory
 */
export class MockDatabase {
  private config: DbConfig;
  private connected: boolean = false;

  constructor(priority: PriorityLevel = 'p0') {
    this.config = DB_CONFIGS[priority];
  }

  /**
   * Connect to database (real or mock)
   */
  async connect(): Promise<boolean> {
    if (this.connected) return true;

    // Simulate connection based on priority
    if (this.config.useRealDb) {
      // Use real database connection
      try {
        // TODO: Implement real connection
        this.connected = true;
        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Database connection failed: ${message}`);
      }
    } else {
      // Simulate mock connection
      await new Promise(resolve => setTimeout(resolve, 100));
      this.connected = true;
      return true;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;

    if (this.config.useRealDb) {
      // TODO: Implement real disconnection
    }

    this.connected = false;
  }

  /**
   * Execute query with priority-based behavior
   */
  async query<T>(sql: string, params: any[] = []): Promise<T> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    // Simulate query execution
    await new Promise(resolve => setTimeout(resolve, 50));

    // Mock data based on SQL
    if (sql.toLowerCase().includes('select')) {
      return [] as any as T;
    }

    if (sql.toLowerCase().includes('insert')) {
      return { insertId: Math.floor(Math.random() * 1000) } as any as T;
    }

    if (sql.toLowerCase().includes('update')) {
      return { affectedRows: 1 } as any as T;
    }

    if (sql.toLowerCase().includes('delete')) {
      return { affectedRows: 1 } as any as T;
    }

    return null as T;
  }

  /**
   * Begin transaction with priority-based timeout
   */
  async beginTransaction(): Promise<void> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    // Set transaction timeout based on priority
    setTimeout(() => {
      if (this.connected) {
        this.rollback();
      }
    }, this.config.timeout);
  }

  /**
   * Commit transaction
   */
  async commit(): Promise<void> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    // Simulate commit
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * Rollback transaction
   */
  async rollback(): Promise<void> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }

    // Simulate rollback
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

/**
 * Create database mock instance
 */
export function createMockDatabase(priority: PriorityLevel = 'p0'): MockDatabase {
  return new MockDatabase(priority);
}