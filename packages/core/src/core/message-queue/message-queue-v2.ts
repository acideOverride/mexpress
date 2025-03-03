import { EventHandler } from '../event-system/event-handler';
import { MessageStateManager } from './message-state-manager';
import { QueuedMessage, MessageStatus, MessageQueueEvents } from './types';
import { QueuePersistenceManager } from './queue-persistence-manager';

/**
 * Message Queue implementation using state manager
 * Part of MEXP-2025-003-BE
 */
export class MessageQueue {
    private queue: Map<number, QueuedMessage[]>;
    private stateManager: MessageStateManager;
    private processing: boolean;
    private timeouts: Set<NodeJS.Timeout>;
    private retryPromises: Set<Promise<void>>;
    private confirmations: Map<string, { resolve: Function, timeout: NodeJS.Timeout }>;
    private persistenceManager?: QueuePersistenceManager;

    constructor(private eventHandler: EventHandler, persistenceManager?: QueuePersistenceManager) {
        this.queue = new Map();
        this.stateManager = new MessageStateManager(eventHandler);
        this.processing = false;
        this.timeouts = new Set();
        this.retryPromises = new Set();
        this.confirmations = new Map();
        this.persistenceManager = persistenceManager;
        
        // Register for message-processed events for delivery confirmation
        this.stateManager.on('message-processed', this._handleMessageProcessed.bind(this));
        
        // Initialize from persistence if available
        this._initializeFromPersistence();
    }
    
    /**
     * Initialize queue from persistence storage
     */
    private async _initializeFromPersistence(): Promise<void> {
        if (!this.persistenceManager) return;
        
        try {
            // Load queue state
            const queueState = this.persistenceManager.getQueueState();
            if (queueState && queueState.priorities && queueState.priorities.length > 0) {
                // Restore priorities
                for (const priority of queueState.priorities) {
                    if (!this.queue.has(priority)) {
                        this.queue.set(priority, []);
                    }
                }
            }
            
            // Load persisted messages
            const messages = this.persistenceManager.getMessages();
            
            // Restore message cache
            for (const [messageId, message] of messages.entries()) {
                // Update state manager cache
                await this.stateManager.updateCache(messageId, message);
                
                // Add to processing queue if pending or retry
                if (message.status === 'pending' || message.status === 'retry') {
                    const priority = message.priority ?? 1;
                    if (!this.queue.has(priority)) {
                        this.queue.set(priority, []);
                    }
                    this.queue.get(priority)!.push(message);
                }
            }
            
            // If we restored any messages, emit an event
            if (messages.size > 0) {
                await this.eventHandler.emit('queue-restored', {
                    messageCount: messages.size,
                    pendingCount: this.queue.size
                });
            }
        } catch (error) {
            // Log error but continue without persistence
            console.error('Failed to initialize from persistence:', error);
            await this.eventHandler.emit('persistence-error', {
                message: 'Failed to initialize from persistence',
                error
            });
        }
    }

    /**
     * Clean up resources
     */
    async cleanup(): Promise<void> {
        // Clear all timeouts
        for (const timeout of this.timeouts) {
            clearTimeout(timeout);
        }
        this.timeouts.clear();
        
        // Clear all confirmation timeouts
        for (const { timeout } of this.confirmations.values()) {
            clearTimeout(timeout);
        }
        this.confirmations.clear();

        // Wait for any pending retries
        if (this.retryPromises.size > 0) {
            await Promise.all(Array.from(this.retryPromises));
        }

        // Process any remaining messages
        for (const [priority, messages] of this.queue.entries()) {
            for (const message of messages) {
                const cached = await this.stateManager.getCachedMessage(message.id);
                if (!cached) continue;

                // Handle based on current state and retry count
                if (cached.status === 'retry' || cached.status === 'pending') {
                    const nextRetryCount = (cached.retryCount || 0) + 1;
                    if (nextRetryCount >= 3 || cached.payload.operation === 'invalid') {
                        await this.stateManager.transitionToFailed(cached, new Error('Max retries exceeded or invalid operation'));
                    } else {
                        await this.stateManager.transitionToProcessed(cached);
                    }
                }
            }
            // Clear queue after processing
            this.queue.delete(priority);
        }

        // Update persistence with final state before closing
        if (this.persistenceManager) {
            try {
                // Update queue state
                this.persistenceManager.updateQueueState({
                    priorities: Array.from(this.queue.keys()),
                    messageCount: 0
                });
                
                // Flush changes to disk
                await this.persistenceManager.flush();
            } catch (error) {
                console.error('Error updating persistence during cleanup:', error);
            }
        }

        // Clear all state
        this.queue.clear();
        this.retryPromises.clear();
    }

    /**
     * Register event handler
     */
    on<T extends keyof MessageQueueEvents>(
        event: T,
        handler: (data: MessageQueueEvents[T]) => void | Promise<void>
    ): void {
        this.stateManager.on(event, handler);
    }

    /**
     * Add a message to the queue
     */
    async enqueue(message: QueuedMessage): Promise<void> {
        // Ensure priority is a valid number, default to 1 if undefined, null, or invalid
        const priority = typeof message.priority === 'number' && !isNaN(message.priority)
            ? message.priority
            : 1;
        
        if (!this.queue.has(priority)) {
            this.queue.set(priority, []);
        }
        
        // Add message to queue with normalized priority
        const queuedMessage: QueuedMessage = {
            ...message,
            priority,
            timestamp: Date.now(),
            status: message.status || 'pending',
            retryCount: message.retryCount ?? 0
        };

        this.queue.get(priority)!.push(queuedMessage);
        await this.stateManager.updateCache(message.id, queuedMessage);
        
        // Persist to storage if persistence manager is available
        if (this.persistenceManager) {
            // Update message in persistence
            this.persistenceManager.updateMessage(message.id, queuedMessage);
            
            // Update queue state
            this.persistenceManager.updateQueueState({
                priorities: Array.from(this.queue.keys()),
                messageCount: this._getTotalMessageCount()
            });
        }
        
        await this.eventHandler.emit('message-queued', queuedMessage);
    }
    
    /**
     * Get total number of messages across all priorities
     */
    private _getTotalMessageCount(): number {
        let count = 0;
        for (const messages of this.queue.values()) {
            count += messages.length;
        }
        return count;
    }

    /**
     * Get all pending messages
     */
    async getPendingMessages(): Promise<QueuedMessage[]> {
        const messages: QueuedMessage[] = [];
        for (const [priority, queue] of this.queue.entries()) {
            messages.push(...queue.map(msg => ({ ...msg, priority })));
        }
        return messages.sort((a, b) => (a.priority ?? 1) - (b.priority ?? 1));
    }

    /**
     * Get a message from cache
     */
    async getCachedMessage(messageId: string): Promise<QueuedMessage | undefined> {
        return this.stateManager.getCachedMessage(messageId);
    }

    /**
     * Process all messages in the queue
     */
    async processQueue(): Promise<void> {
        if (this.processing) return;
        this.processing = true;

        try {
            // Process messages in priority order (negative numbers first)
            const priorities = Array.from(this.queue.keys()).sort((a, b) => a - b);
            
            for (const priority of priorities) {
                const messages = this.queue.get(priority)!;
                const processingPromises: Promise<void>[] = [];
                const processedIds = new Set<string>();
                
                // Process messages concurrently within same priority
                for (const message of messages) {
                    // Skip if message is already being processed
                    if (processedIds.has(message.id)) continue;
                    
                    processedIds.add(message.id);
                    const processingPromise = this._processMessage(message)
                        .catch(error => {
                            console.error(`Error processing message ${message.id}:`, error);
                            throw error; // Re-throw to be handled by Promise.allSettled
                        });
                    processingPromises.push(processingPromise);
                }
                
                // Wait for all processing to complete
                const results = await Promise.allSettled(processingPromises);

                // Process results and update message states
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    const message = messages[i];

                    if (result.status === 'rejected') {
                        // Get current retry count
                        const currentMessage = await this.stateManager.getCachedMessage(message.id);
                        if (!currentMessage) continue;

                        // Check if we should retry or fail
                        const nextRetryCount = (currentMessage.retryCount || 0) + 1;
                        if (nextRetryCount >= 3) { // maxRetries is 3
                            // Mark as failed if max retries exceeded
                            await this.stateManager.transitionToFailed(currentMessage, result.reason);
                            
                            // Update persistence
                            if (this.persistenceManager) {
                                const failedMessage = await this.stateManager.getCachedMessage(message.id);
                                if (failedMessage) {
                                    this.persistenceManager.updateMessage(message.id, failedMessage);
                                }
                            }
                            
                            // Remove from retry queue
                            this.queue.delete(priority);
                        } else {
                            // Move to retry if retries remaining
                            await this.stateManager.transitionToRetry(currentMessage, result.reason);
                            
                            // Get the updated message after transition
                            const retryMessage = await this.stateManager.getCachedMessage(message.id);
                            if (retryMessage) {
                                // Update persistence
                                if (this.persistenceManager) {
                                    this.persistenceManager.updateMessage(message.id, retryMessage);
                                }
                                
                                // Keep in queue for retry if status is retry
                                if (retryMessage.status === 'retry') {
                                    this.queue.set(priority, [retryMessage]);
                                }
                            }
                        }
                    } else {
                        // Handle success case
                        // If delivery confirmation is required, transition happens in the confirmation handler
                        if (!message.payload.requireConfirmation) {
                            await this.stateManager.transitionToProcessed(message);
                            
                            // Update persistence if available
                            if (this.persistenceManager) {
                                const processedMessage = await this.stateManager.getCachedMessage(message.id);
                                if (processedMessage) {
                                    this.persistenceManager.updateMessage(message.id, processedMessage);
                                }
                            }
                        }
                    }
                }

                // Update queue with messages that need retry
                const retryMessages = [];
                for (const msg of messages) {
                    const cached = await this.stateManager.getCachedMessage(msg.id);
                    if (cached?.status === 'retry') {
                        retryMessages.push(cached);
                    }
                }

                // Only keep retry messages in queue
                if (retryMessages.length > 0) {
                    this.queue.set(priority, retryMessages);
                } else {
                    this.queue.delete(priority);
                }
                
                // Update persistence state after processing the current priority
                if (this.persistenceManager) {
                    try {
                        this.persistenceManager.updateQueueState({
                            priorities: Array.from(this.queue.keys()),
                            messageCount: this._getTotalMessageCount()
                        });
                    } catch (error) {
                        console.error(`Error updating persistence for priority ${priority}:`, error);
                    }
                }
            }
            
            // Flush persistence changes to disk after all processing is complete
            if (this.persistenceManager) {
                try {
                    await this.persistenceManager.flush();
                } catch (error) {
                    console.error('Error flushing persistence to disk:', error);
                }
            }
        } finally {
            this.processing = false;
        }
    }

    /**
     * Process a single message
     */
    private async _processMessage(message: QueuedMessage): Promise<void> {
        try {
            // Transition to processing state
            await this.stateManager.transitionToProcessing(message);

            // Validate operation before processing
            if (message.payload.operation === 'invalid') {
                throw new Error('Invalid operation');
            }
            
            // Check if delivery confirmation is required
            const requireConfirmation = Boolean(message.payload.requireConfirmation);
            
            if (requireConfirmation) {
                // Setup confirmation promise with timeout
                const confirmationPromise = new Promise<void>((resolve, reject) => {
                    // Setup timeout for confirmation
                    const timeoutMs = typeof message.payload.confirmationTimeout === 'number' 
                        ? message.payload.confirmationTimeout 
                        : 5000; // Default 5 second timeout
                    
                    const timeoutId = setTimeout(() => {
                        this.confirmations.delete(message.id);
                        reject(new Error(`Message delivery confirmation timeout after ${timeoutMs}ms`));
                    }, timeoutMs);
                    
                    // Store the confirmation handlers
                    this.confirmations.set(message.id, {
                        resolve,
                        timeout: timeoutId
                    });
                });
                
                // Emit event through EventHandler
                if (this.eventHandler) {
                    await this.eventHandler.emit(message.type, message.payload);
                }
                
                // Wait for confirmation or timeout
                await confirmationPromise;
            } else {
                // No confirmation required, just emit the event
                if (this.eventHandler) {
                    await this.eventHandler.emit(message.type, message.payload);
                }
            }
        } catch (error) {
            throw error; // Re-throw to be handled by processQueue
        }
    }
    
    /**
     * Handle message processed events for delivery confirmation
     */
    private async _handleMessageProcessed(message: QueuedMessage): Promise<void> {
        const confirmation = this.confirmations.get(message.id);
        
        if (confirmation) {
            // Clear the timeout
            clearTimeout(confirmation.timeout);
            
            // Resolve the confirmation promise
            confirmation.resolve();
            
            // Remove from confirmations map
            this.confirmations.delete(message.id);
            
            // Update persistence if available
            if (this.persistenceManager) {
                try {
                    // Get the latest message state
                    const processedMessage = await this.stateManager.getCachedMessage(message.id);
                    if (processedMessage) {
                        // Update message in persistence
                        this.persistenceManager.updateMessage(message.id, processedMessage);
                        
                        // Update queue state - remove message from queue
                        const priorities = Array.from(this.queue.keys());
                        this.persistenceManager.updateQueueState({
                            priorities,
                            messageCount: this._getTotalMessageCount()
                        });
                    }
                } catch (error) {
                    console.error(`Error updating persistence for message ${message.id}:`, error);
                }
            }
        }
    }
}