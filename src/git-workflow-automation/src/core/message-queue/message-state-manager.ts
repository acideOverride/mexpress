import { EventHandler } from '../event-system/event-handler';
import { QueuedMessage, MessageStatus, StateTransitionResult, MessageQueueEvents } from './types';

/**
 * Manages message state transitions and ensures atomic operations
 * Part of BRQ-2025-003
 */
export class MessageStateManager {
    private cache: Map<string, QueuedMessage>;
    private retryQueue: Set<string>;
    private maxRetries: number;
    private handlers: Map<string, Set<(data: any) => void | Promise<void>>>;

    constructor(private eventHandler: EventHandler, maxRetries: number = 3) {
        this.cache = new Map();
        this.retryQueue = new Set();
        this.maxRetries = maxRetries;
        this.handlers = new Map();
    }

    /**
     * Get a message from cache
     */
    getCachedMessage(messageId: string): QueuedMessage | undefined {
        return this.cache.get(messageId);
    }

    /**
     * Check if message is in retry queue
     */
    isInRetryQueue(messageId: string): boolean {
        return this.retryQueue.has(messageId);
    }

    /**
     * Get retry count for message
     */
    getRetryCount(message: QueuedMessage): number {
        return message.retryCount || 0;
    }

    /**
     * Check if message can be retried
     */
    isRetryable(message: QueuedMessage): boolean {
        const currentRetryCount = this.getRetryCount(message);
        return currentRetryCount < this.maxRetries;
    }

    /**
     * Get next retry count for message
     */
    getNextRetryCount(message: QueuedMessage): number {
        return this.getRetryCount(message) + 1;
    }

    /**
     * Atomic state transition
     */
    private async transitionState(
        messageId: string,
        fromState: MessageStatus | undefined,
        toState: MessageStatus,
        updates: Partial<QueuedMessage> = {}
    ): Promise<StateTransitionResult> {
        const message = this.cache.get(messageId);
        if (!message) {
            return { success: false, error: new Error(`Message ${messageId} not found`) };
        }

        if (fromState && message.status !== fromState) {
            return { 
                success: false, 
                error: new Error(`Invalid state transition: ${message.status} -> ${toState}`)
            };
        }

        const updatedMessage: QueuedMessage = {
            ...message,
            ...updates,
            status: toState,
            timestamp: Date.now()
        };

        this.cache.set(messageId, updatedMessage);

        await this._emit('state-transition', {
            messageId,
            fromState: message.status || 'pending',
            toState,
            message: updatedMessage
        });

        return { success: true, message: updatedMessage };
    }

    /**
     * Transition to processing state
     */
    async transitionToProcessing(message: QueuedMessage): Promise<StateTransitionResult> {
        return this.transitionState(message.id, 'pending', 'processing');
    }

    /**
     * Transition to retry state
     */
    async transitionToRetry(message: QueuedMessage, error: Error): Promise<StateTransitionResult> {
        const nextRetryCount = this.getRetryCount(message) + 1;
        
        // Check if max retries exceeded before transition
        if (nextRetryCount > this.maxRetries) {
            return this.transitionToFailed(message, error);
        }

        const result = await this.transitionState(message.id, 'processing', 'retry', {
            retryCount: nextRetryCount,
            error: error.message
        });

        if (result.success) {
            this.retryQueue.add(message.id);
            await this._emit('message-retry', {
                messageId: message.id,
                error,
                retryCount: nextRetryCount,
                message: result.message!
            });
        }

        return result;
    }

    /**
     * Transition to failed state
     */
    async transitionToFailed(message: QueuedMessage, error: Error): Promise<StateTransitionResult> {
        const result = await this.transitionState(message.id, 'processing', 'failed', {
            error: error.message,
            failedAt: Date.now()
        });

        if (result.success) {
            this.retryQueue.delete(message.id);
            await this._emit('message-error', {
                messageId: message.id,
                error,
                message: result.message!
            });
        }

        return result;
    }

    /**
     * Transition to processed state
     */
    async transitionToProcessed(message: QueuedMessage): Promise<StateTransitionResult> {
        const result = await this.transitionState(message.id, 'processing', 'processed', {
            processedAt: Date.now()
        });

        if (result.success) {
            this.retryQueue.delete(message.id);
            await this._emit('message-processed', result.message!);
        }

        return result;
    }

    /**
     * Update message in cache
     */
    async updateCache(messageId: string, data: QueuedMessage): Promise<void> {
        this.cache.set(messageId, { ...data });
    }

    /**
     * Register event handler
     */
    on<T extends keyof MessageQueueEvents>(
        event: T,
        handler: (data: MessageQueueEvents[T]) => void | Promise<void>
    ): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler as any);
    }

    /**
     * Emit event
     */
    private async _emit<T extends keyof MessageQueueEvents>(
        event: T,
        data: MessageQueueEvents[T]
    ): Promise<void> {
        if (this.handlers.has(event)) {
            const handlers = this.handlers.get(event)!;
            for (const handler of handlers) {
                try {
                    await Promise.resolve(handler(data));
                } catch (error) {
                    console.error(`Error in ${event} handler:`, error);
                }
            }
        }

        // Forward to event handler if available
        if (this.eventHandler) {
            try {
                await this.eventHandler.emit(event, data);
            } catch (error) {
                console.error(`Error forwarding ${event} to EventHandler:`, error);
            }
        }
    }
}