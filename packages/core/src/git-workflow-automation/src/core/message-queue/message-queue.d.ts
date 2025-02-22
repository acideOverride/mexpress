import { EventHandler } from '../event-system/event-handler';

export interface QueuedMessage {
    id: string;
    type: string;
    payload: {
        operation: string;
        [key: string]: any;
    };
    priority?: number;
    retryCount?: number;
    timestamp?: number;
    status?: 'pending' | 'processed' | 'failed' | 'retry';
    processedAt?: number;
    failedAt?: number;
    error?: string;
}

export type MessageHandler = (data: any) => void | Promise<void>;

export class MessageQueue {
    constructor(eventHandler?: EventHandler);
    
    handlers: Map<string, Set<MessageHandler>>;
    cleanup(): Promise<void>;
    on(event: string, handler: MessageHandler): void;
    enqueue(message: QueuedMessage): Promise<void>;
    getPendingMessages(): Promise<QueuedMessage[]>;
    getCachedMessage(messageId: string): Promise<QueuedMessage | undefined>;
    processQueue(): Promise<void>;
    initialize?(): Promise<void>;
    clear?(): Promise<void>;
    close?(): Promise<void>;
}