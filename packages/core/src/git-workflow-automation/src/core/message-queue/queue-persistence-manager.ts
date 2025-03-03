import * as fs from 'fs';
import * as path from 'path';
import { QueuedMessage } from './types';

export interface QueueState {
    priorities: number[];
    messageCount: number;
    lastUpdated: number;
}

export interface PersistenceManagerConfig {
    storagePath: string;
    flushInterval: number;
    maxRetries: number;
    retryDelay: number;
}

/**
 * Manages persistence of queue state and messages
 * Part of MEXP-2025-003-BE: Message Queue System
 */
export class QueuePersistenceManager {
    private queueStateFile: string;
    private messageCacheFile: string;
    private flushInterval: number;
    private maxRetries: number;
    private retryDelay: number;
    private messageCache: Map<string, QueuedMessage>;
    private queueState: QueueState;
    private flushTimer: NodeJS.Timeout | null = null;
    private pendingWrites: boolean = false;
    private closed: boolean = false;
    private eventHandlers: Map<string, Set<Function>> = new Map();

    constructor(config: PersistenceManagerConfig) {
        this.queueStateFile = path.join(config.storagePath, 'queue-state.json');
        this.messageCacheFile = path.join(config.storagePath, 'message-cache.json');
        this.flushInterval = config.flushInterval || 5000; // Default to 5 seconds
        this.maxRetries = config.maxRetries || 3;
        this.retryDelay = config.retryDelay || 500; // Default to 500ms
        this.messageCache = new Map();
        this.queueState = {
            priorities: [],
            messageCount: 0,
            lastUpdated: Date.now()
        };

        // Create storage directory if it doesn't exist
        try {
            if (!fs.existsSync(config.storagePath)) {
                fs.mkdirSync(config.storagePath, { recursive: true });
            }
        } catch (error) {
            this.emitEvent('persistence-error', { 
                message: 'Failed to create storage directory',
                error 
            });
        }

        // Load existing data if available
        this.loadFromDisk();

        // Start flush timer
        this.startFlushTimer();
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
    private loadFromDisk(): void {
        try {
            // Load queue state
            if (fs.existsSync(this.queueStateFile)) {
                const queueStateData = fs.readFileSync(this.queueStateFile, 'utf8');
                this.queueState = JSON.parse(queueStateData);
                
                this.emitEvent('persistence-loaded', { 
                    type: 'queue-state',
                    queueState: this.queueState
                });
            }

            // Load message cache
            if (fs.existsSync(this.messageCacheFile)) {
                const messageCacheData = fs.readFileSync(this.messageCacheFile, 'utf8');
                const messages = JSON.parse(messageCacheData);
                
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
        this.queueState = {
            ...this.queueState,
            ...state,
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
     * Flush all pending changes to disk
     */
    async flush(): Promise<void> {
        if (this.closed) return;
        
        this.pendingWrites = false;
        
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            try {
                // Write queue state
                const queueStateData = JSON.stringify(this.queueState);
                fs.writeFileSync(this.queueStateFile, queueStateData, 'utf8');
                
                // Write message cache
                const messageCacheObj: { [key: string]: QueuedMessage } = {};
                for (const [messageId, message] of this.messageCache.entries()) {
                    messageCacheObj[messageId] = message;
                }
                
                const messageCacheData = JSON.stringify(messageCacheObj);
                fs.writeFileSync(this.messageCacheFile, messageCacheData, 'utf8');
                
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