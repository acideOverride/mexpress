/**
 * Message queue types for Git Workflow Automation
 * Part of BRQ-2025-003
 */

export type MessageStatus = 'pending' | 'processing' | 'retry' | 'failed' | 'processed';

export interface QueuedMessage {
    id: string;
    type: string;
    payload: Record<string, unknown>;
    priority?: number | null;
    retryCount?: number;
    timestamp?: number;
    status?: MessageStatus;
    error?: string;
    processedAt?: number;
    failedAt?: number;
}

export interface MessageQueueEvents {
    'message-processed': QueuedMessage;
    'message-error': { messageId: string; error: Error; message: QueuedMessage };
    'message-retry': { messageId: string; error: Error; retryCount: number; message: QueuedMessage };
    'message-processing': QueuedMessage;
    'message-queued': QueuedMessage;
    'state-transition': { messageId: string; fromState: MessageStatus; toState: MessageStatus; message: QueuedMessage };
}

export type MessageQueueEventHandler<T extends keyof MessageQueueEvents> = 
    (data: MessageQueueEvents[T]) => void | Promise<void>;

export interface StateTransitionResult {
    success: boolean;
    message?: QueuedMessage;
    error?: Error;
}