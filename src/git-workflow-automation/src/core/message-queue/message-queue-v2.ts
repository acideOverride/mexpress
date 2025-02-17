import { EventHandler } from '../event-system/event-handler';
import { MessageStateManager } from './message-state-manager';
import { QueuedMessage, MessageStatus, MessageQueueEvents } from './types';

/**
 * Message Queue implementation using state manager
 * Part of BRQ-2025-003
 */
export class MessageQueue {
    private queue: Map<number, QueuedMessage[]>;
    private stateManager: MessageStateManager;
    private processing: boolean;
    private timeouts: Set<NodeJS.Timeout>;
    private retryPromises: Set<Promise<void>>;

    constructor(private eventHandler: EventHandler) {
        this.queue = new Map();
        this.stateManager = new MessageStateManager(eventHandler);
        this.processing = false;
        this.timeouts = new Set();
        this.retryPromises = new Set();
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
        await this.eventHandler.emit('message-queued', queuedMessage);
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
                            // Remove from retry queue
                            this.queue.delete(priority);
                        } else {
                            // Move to retry if retries remaining
                            await this.stateManager.transitionToRetry(currentMessage, result.reason);
                            // Keep in queue for retry
                            const retryMessage = await this.stateManager.getCachedMessage(message.id);
                            if (retryMessage?.status === 'retry') {
                                this.queue.set(priority, [retryMessage]);
                            }
                        }
                    } else {
                        // Handle success case
                        await this.stateManager.transitionToProcessed(message);
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
            
            // Emit event through EventHandler
            if (this.eventHandler) {
                await this.eventHandler.emit(message.type, message.payload);
            }
        } catch (error) {
            throw error; // Re-throw to be handled by processQueue
        }
    }
}