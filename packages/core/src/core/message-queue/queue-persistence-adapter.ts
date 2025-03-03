import * as fs from 'fs';
import * as path from 'path';
import { QueuedMessage } from './types';
import { QueuePersistenceManager, QueueState, PersistenceManagerConfig } from './queue-persistence-manager';

/**
 * Interface for storage providers (allows for different implementations)
 * Part of MEXP-2025-003-BE: Message Queue System
 */
export interface StorageProvider {
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
  createDirectory(dirPath: string): Promise<void>;
}

/**
 * File system based storage provider
 */
export class FileSystemStorageProvider implements StorageProvider {
  async readFile(filePath: string): Promise<string> {
    return fs.promises.readFile(filePath, 'utf8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    return fs.promises.writeFile(filePath, content, 'utf8');
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

/**
 * In-memory storage provider (for testing)
 */
export class InMemoryStorageProvider implements StorageProvider {
  private files: Map<string, string> = new Map();
  private directories: Set<string> = new Set();

  async readFile(filePath: string): Promise<string> {
    const content = this.files.get(filePath);
    if (content === undefined) {
      throw new Error(`File not found: ${filePath}`);
    }
    return content;
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    if (!this.directories.has(dir)) {
      throw new Error(`Directory does not exist: ${dir}`);
    }
    this.files.set(filePath, content);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.files.has(filePath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    this.directories.add(dirPath);
    // Also add parent directories
    let parent = path.dirname(dirPath);
    while (parent !== dirPath) {
      this.directories.add(parent);
      dirPath = parent;
      parent = path.dirname(dirPath);
    }
  }
}

/**
 * Configuration for QueuePersistenceAdapter
 */
export interface QueuePersistenceAdapterConfig extends PersistenceManagerConfig {
  storageProvider?: StorageProvider;
  compressionEnabled?: boolean;
  encryptionKey?: string;
  backupEnabled?: boolean;
  maxBackupCount?: number;
}

/**
 * Enhanced Queue Persistence Adapter with additional features
 * - Custom storage providers (file system, in-memory, etc.)
 * - Compression option
 * - Encryption option (stub implementation)
 * - Backup and rotation
 */
export class QueuePersistenceAdapter implements QueuePersistenceManager {
  private messageCache: Map<string, QueuedMessage> = new Map();
  private queueState: QueueState = {
    priorities: [],
    messageCount: 0,
    lastUpdated: Date.now()
  };
  
  private queueStateFile: string;
  private messageCacheFile: string;
  private backupDir: string;
  private storageProvider: StorageProvider;
  private compressionEnabled: boolean;
  private encryptionKey?: string;
  private backupEnabled: boolean;
  private maxBackupCount: number;
  private flushTimer: NodeJS.Timeout | null = null;
  private pendingWrites: boolean = false;
  private closed: boolean = false;
  private eventHandlers: Map<string, Set<Function>> = new Map();
  private flushInterval: number;
  private maxRetries: number;
  private retryDelay: number;
  
  constructor(config: QueuePersistenceAdapterConfig) {
    this.queueStateFile = path.join(config.storagePath, 'queue-state.json');
    this.messageCacheFile = path.join(config.storagePath, 'message-cache.json');
    this.backupDir = path.join(config.storagePath, 'backups');
    this.storageProvider = config.storageProvider || new FileSystemStorageProvider();
    this.compressionEnabled = config.compressionEnabled || false;
    this.encryptionKey = config.encryptionKey;
    this.backupEnabled = config.backupEnabled || false;
    this.maxBackupCount = config.maxBackupCount || 5;
    this.flushInterval = config.flushInterval || 5000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 500;

    // Initialize
    this.init();
  }

  /**
   * Initialize the adapter
   */
  private async init(): Promise<void> {
    try {
      // Create storage directory if it doesn't exist
      const dirExists = await this.storageProvider.exists(path.dirname(this.queueStateFile));
      if (!dirExists) {
        await this.storageProvider.createDirectory(path.dirname(this.queueStateFile));
      }

      // Create backup directory if enabled
      if (this.backupEnabled) {
        const backupDirExists = await this.storageProvider.exists(this.backupDir);
        if (!backupDirExists) {
          await this.storageProvider.createDirectory(this.backupDir);
        }
      }

      // Load existing data if available
      await this.loadFromDisk();

      // Start flush timer
      this.startFlushTimer();
    } catch (error) {
      this.emitEvent('persistence-error', {
        message: 'Failed to initialize persistence adapter',
        error
      });
    }
  }

  /**
   * Register event handler
   */
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Emit an event to all handlers
   */
  private emitEvent(event: string, data: any): void {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      }
    }
  }

  /**
   * Load queue state and messages from disk
   */
  private async loadFromDisk(): Promise<void> {
    try {
      // Load queue state
      const queueStateExists = await this.storageProvider.exists(this.queueStateFile);
      if (queueStateExists) {
        const queueStateData = await this.storageProvider.readFile(this.queueStateFile);
        const decompressedData = this.compressionEnabled 
          ? this.decompress(queueStateData)
          : queueStateData;
        
        const decryptedData = this.encryptionKey 
          ? this.decrypt(decompressedData)
          : decompressedData;
        
        this.queueState = JSON.parse(decryptedData);
        
        this.emitEvent('persistence-loaded', { 
          type: 'queue-state',
          queueState: this.queueState
        });
      }

      // Load message cache
      const messageCacheExists = await this.storageProvider.exists(this.messageCacheFile);
      if (messageCacheExists) {
        const messageCacheData = await this.storageProvider.readFile(this.messageCacheFile);
        const decompressedData = this.compressionEnabled 
          ? this.decompress(messageCacheData)
          : messageCacheData;
        
        const decryptedData = this.encryptionKey 
          ? this.decrypt(decompressedData)
          : decompressedData;
        
        const messages = JSON.parse(decryptedData);
        
        for (const [messageId, message] of Object.entries(messages)) {
          this.messageCache.set(messageId, message as QueuedMessage);
        }
        
        this.emitEvent('persistence-loaded', { 
          type: 'message-cache',
          messageCount: this.messageCache.size
        });
      }
    } catch (error) {
      this.emitEvent('persistence-error', { 
        message: 'Failed to load data from disk',
        error 
      });
    }
  }

  /**
   * Start the flush timer for periodic persistence
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      if (this.pendingWrites && !this.closed) {
        this.flush().catch(error => {
          this.emitEvent('persistence-error', { 
            message: 'Failed to flush to disk',
            error 
          });
        });
      }
    }, this.flushInterval);
  }

  /**
   * Get all persisted messages
   */
  getMessages(): Map<string, QueuedMessage> {
    return new Map(this.messageCache);
  }

  /**
   * Get queue state
   */
  getQueueState(): QueueState {
    return { ...this.queueState };
  }

  /**
   * Update a message in the cache
   */
  updateMessage(messageId: string, message: QueuedMessage): void {
    this.messageCache.set(messageId, { ...message });
    this.pendingWrites = true;
  }

  /**
   * Update queue state
   */
  updateQueueState(state: Partial<QueueState>): void {
    // Ensure priorities field is properly typed as number[]
    const typedState: Partial<QueueState> = {
      ...state,
      // Convert priorities to number[] if it exists
      ...(state.priorities && { priorities: state.priorities as number[] })
    };
    
    this.queueState = {
      ...this.queueState,
      ...typedState,
      lastUpdated: Date.now()
    };
    this.pendingWrites = true;
  }

  /**
   * Remove a message from the cache
   */
  removeMessage(messageId: string): void {
    this.messageCache.delete(messageId);
    this.pendingWrites = true;
  }

  /**
   * Create a backup of current files
   */
  private async createBackup(): Promise<void> {
    if (!this.backupEnabled) return;

    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const queueStateBackup = path.join(this.backupDir, `queue-state.${timestamp}.json`);
      const messageCacheBackup = path.join(this.backupDir, `message-cache.${timestamp}.json`);

      // Check if files exist before backing up
      const queueStateExists = await this.storageProvider.exists(this.queueStateFile);
      const messageCacheExists = await this.storageProvider.exists(this.messageCacheFile);

      if (queueStateExists) {
        const queueStateData = await this.storageProvider.readFile(this.queueStateFile);
        await this.storageProvider.writeFile(queueStateBackup, queueStateData);
      }

      if (messageCacheExists) {
        const messageCacheData = await this.storageProvider.readFile(this.messageCacheFile);
        await this.storageProvider.writeFile(messageCacheBackup, messageCacheData);
      }

      // Manage backup rotation (delete oldest if exceeding maxBackupCount)
      // Not implemented for brevity, would need to list files in directory
    } catch (error) {
      this.emitEvent('persistence-warning', {
        message: 'Failed to create backup',
        error
      });
    }
  }

  /**
   * Compress data (stub implementation)
   */
  private compress(data: string): string {
    // In a real implementation, use a compression library
    // For this example, return data unchanged
    return data;
  }

  /**
   * Decompress data (stub implementation)
   */
  private decompress(data: string): string {
    // In a real implementation, use a compression library
    // For this example, return data unchanged
    return data;
  }

  /**
   * Encrypt data (stub implementation)
   */
  private encrypt(data: string): string {
    // In a real implementation, use encryption
    // For this example, return data unchanged
    return data;
  }

  /**
   * Decrypt data (stub implementation)
   */
  private decrypt(data: string): string {
    // In a real implementation, use decryption
    // For this example, return data unchanged
    return data;
  }

  /**
   * Flush all pending changes to disk
   */
  async flush(): Promise<void> {
    if (this.closed) return;
    
    this.pendingWrites = false;
    
    // Create backup before writing new data if enabled
    if (this.backupEnabled) {
      await this.createBackup();
    }
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        // Prepare queue state data
        let queueStateData = JSON.stringify(this.queueState);
        
        // Apply encryption if configured
        if (this.encryptionKey) {
          queueStateData = this.encrypt(queueStateData);
        }
        
        // Apply compression if enabled
        if (this.compressionEnabled) {
          queueStateData = this.compress(queueStateData);
        }
        
        // Write queue state
        await this.storageProvider.writeFile(this.queueStateFile, queueStateData);
        
        // Prepare message cache data
        const messageCacheObj: Record<string, QueuedMessage> = {};
        for (const [messageId, message] of this.messageCache.entries()) {
          messageCacheObj[messageId] = message;
        }
        
        let messageCacheData = JSON.stringify(messageCacheObj);
        
        // Apply encryption if configured
        if (this.encryptionKey) {
          messageCacheData = this.encrypt(messageCacheData);
        }
        
        // Apply compression if enabled
        if (this.compressionEnabled) {
          messageCacheData = this.compress(messageCacheData);
        }
        
        // Write message cache
        await this.storageProvider.writeFile(this.messageCacheFile, messageCacheData);
        
        this.emitEvent('persistence-flush', {
          queueState: this.queueState,
          messageCount: this.messageCache.size
        });
        
        return;
      } catch (error) {
        if (attempt === this.maxRetries - 1) {
          // Last attempt failed, emit error
          this.emitEvent('persistence-error', { 
            message: `Failed to flush to disk after ${this.maxRetries} attempts`,
            error 
          });
          throw error;
        } else {
          // Emit warning and retry
          this.emitEvent('persistence-warning', { 
            message: `Flush attempt ${attempt + 1} failed, retrying...`,
            error 
          });
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }
  }

  /**
   * Close the persistence manager and flush any pending changes
   */
  async close(): Promise<void> {
    if (this.closed) return;
    
    this.closed = true;
    
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    if (this.pendingWrites) {
      try {
        await this.flush();
      } catch (error) {
        this.emitEvent('persistence-error', { 
          message: 'Failed to flush during close',
          error 
        });
      }
    }
    
    this.eventHandlers.clear();
  }
}