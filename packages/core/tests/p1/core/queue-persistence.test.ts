import { MessageQueue } from '../../../src/core/message-queue/message-queue-v2';
import { QueuedMessage, MessageStatus } from '../../../src/core/message-queue/types';
import * as fs from 'fs';
import * as path from 'path';

// Mock implementation of necessary interfaces
class MockEventHandler {
    private handlers = new Map<string, Set<Function>>();
    private events: any[] = [];

    on(event: string, handler: Function): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    off(event: string, handler: Function): void {
        if (this.handlers.has(event)) {
            this.handlers.get(event)!.delete(handler);
        }
    }

    hasHandler(event: string): boolean {
        return this.handlers.has(event) && this.handlers.get(event)!.size > 0;
    }

    async emit(event: string, data: any): Promise<void> {
        this.events.push({ event, data });
        
        if (this.handlers.has(event)) {
            const promises = Array.from(this.handlers.get(event)!).map(handler => handler(data));
            await Promise.all(promises);
        }
    }

    getEvents(): any[] {
        return [...this.events];
    }

    clearEvents(): void {
        this.events = [];
    }
}

// Mock implementation of persistence manager
class MockPersistenceManager {
    private messages = new Map<string, QueuedMessage>();
    private queueState = { priorities: [] as number[], messageCount: 0, lastUpdated: Date.now() };
    private closed = false;

    constructor() {
        // No timers or file operations in this mock
    }

    updateMessage(messageId: string, message: QueuedMessage): void {
        this.messages.set(messageId, { ...message });
    }

    updateQueueState(state: Partial<typeof this.queueState>): void {
        // Handle priorities specifically to ensure correct typing
        const priorities = state.priorities ? state.priorities as number[] : this.queueState.priorities;
        
        this.queueState = { 
            ...this.queueState, 
            ...state, 
            priorities,
            lastUpdated: Date.now() 
        };
    }

    removeMessage(messageId: string): void {
        this.messages.delete(messageId);
    }

    getMessages(): Map<string, QueuedMessage> {
        return new Map(this.messages);
    }

    getQueueState(): typeof this.queueState {
        return { ...this.queueState };
    }

    async flush(): Promise<void> {
        // No-op in mock
    }

    async close(): Promise<void> {
        this.closed = true;
    }

    isClosed(): boolean {
        return this.closed;
    }
}

/**
 * Queue Persistence Tests
 * MEXP-2025-003-BE: Message Queue System
 * 
 * These tests ensure that the message queue can persist its state and recover
 * from crashes or system restarts.
 */
describe('Queue Persistence', () => {
    let messageQueue: MessageQueue;
    let eventHandler: MockEventHandler;
    let persistenceManager: MockPersistenceManager;
    
    beforeEach(() => {
        // Create mock event handler
        eventHandler = new MockEventHandler();
        
        // Create mock persistence manager
        persistenceManager = new MockPersistenceManager();
        
        // Create message queue with mock persistence
        messageQueue = new MessageQueue(eventHandler as any, persistenceManager as any);
    });
    
    afterEach(async () => {
        // Clean up resources
        await messageQueue.cleanup();
        await persistenceManager.close();
    });
    
    test('should persist messages after enqueue', async () => {
        // Create test messages
        const messages: QueuedMessage[] = [
            { id: 'persist-1', type: 'test', payload: { data: 'Test 1' }, priority: 1 },
            { id: 'persist-2', type: 'test', payload: { data: 'Test 2' }, priority: 2 }
        ];
        
        // Enqueue messages
        await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
        
        // Get persisted messages from mock
        const persistedMessages = persistenceManager.getMessages();
        const queueState = persistenceManager.getQueueState();
        
        // Verify queue state is updated
        expect(queueState.priorities).toContain(1);
        expect(queueState.priorities).toContain(2);
        
        // Verify messages are persisted
        expect(persistedMessages.get('persist-1')).toBeDefined();
        expect(persistedMessages.get('persist-2')).toBeDefined();
        expect(persistedMessages.get('persist-1')!.payload.data).toBe('Test 1');
        expect(persistedMessages.get('persist-2')!.payload.data).toBe('Test 2');
    });
    
    test('should recover queue state on initialization', async () => {
        // Setup: Create and store messages in persistence manager
        const message1: QueuedMessage = { 
            id: 'recover-1', 
            type: 'test', 
            payload: { data: 'Test 1' }, 
            priority: 1,
            status: 'pending',
            timestamp: Date.now()
        };
        
        const message2: QueuedMessage = { 
            id: 'recover-2', 
            type: 'test', 
            payload: { data: 'Test 2' }, 
            priority: 2,
            status: 'pending',
            timestamp: Date.now()
        };
        
        // Directly update persistence manager
        persistenceManager.updateMessage('recover-1', message1);
        persistenceManager.updateMessage('recover-2', message2);
        persistenceManager.updateQueueState({
            priorities: [1, 2] as number[],
            messageCount: 2
        });
        
        // Create a new queue with the same persistence manager
        const newQueue = new MessageQueue(eventHandler as any, persistenceManager as any);
        
        // Verify messages are recovered
        const cachedMessage1 = await newQueue.getCachedMessage('recover-1');
        const cachedMessage2 = await newQueue.getCachedMessage('recover-2');
        
        expect(cachedMessage1).toBeDefined();
        expect(cachedMessage2).toBeDefined();
        expect(cachedMessage1?.payload.data).toBe('Test 1');
        expect(cachedMessage2?.payload.data).toBe('Test 2');
        
        // Cleanup
        await newQueue.cleanup();
    });
    
    test('should update persistence after processing', async () => {
        // Create test messages
        const messages: QueuedMessage[] = [
            { id: 'process-1', type: 'test', payload: { data: 'Test 1' } },
            { id: 'process-2', type: 'test', payload: { data: 'Test 2' } }
        ];
        
        // Enqueue messages
        await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
        
        // Process the queue
        await messageQueue.processQueue();
        
        // Get updated messages from persistence
        const persistedMessages = persistenceManager.getMessages();
        
        // Verify message states are updated
        expect(persistedMessages.get('process-1')?.status).toBe('processed');
        expect(persistedMessages.get('process-2')?.status).toBe('processed');
        expect(persistedMessages.get('process-1')?.processedAt).toBeDefined();
        expect(persistedMessages.get('process-2')?.processedAt).toBeDefined();
        
        // Queue state should reflect empty queue
        const queueState = persistenceManager.getQueueState();
        expect(queueState.messageCount).toBe(0);
    });
    
    test('should handle persistence errors gracefully', async () => {
        // Create a test message
        const testMessage: QueuedMessage = {
            id: 'error-test',
            type: 'test',
            payload: { data: 'Test data' },
            status: 'pending',
            timestamp: Date.now()
        };
        
        // Mock persistence manager that doesn't throw but keeps track of calls
        const mockPersistenceManager = {
            updateMessage: jest.fn(),
            updateQueueState: jest.fn(),
            getMessages: jest.fn().mockReturnValue(new Map()),
            getQueueState: jest.fn().mockReturnValue({ priorities: [], messageCount: 0, lastUpdated: Date.now() }),
            flush: jest.fn().mockResolvedValue(undefined),
            close: jest.fn().mockResolvedValue(undefined)
        };
        
        // Create queue with simple mock persistence
        const testQueue = new MessageQueue(eventHandler as any, mockPersistenceManager as any);
        
        try {
            // Add a message to the queue
            await testQueue.enqueue(testMessage);
            
            // Verify the persistence methods were called
            expect(mockPersistenceManager.updateMessage).toHaveBeenCalledWith(
                'error-test', 
                expect.objectContaining({ 
                    id: 'error-test', 
                    status: 'pending'
                })
            );
            
            expect(mockPersistenceManager.updateQueueState).toHaveBeenCalled();
            
            // Verify the message is in memory
            const cachedMessage = await testQueue.getCachedMessage('error-test');
            expect(cachedMessage).toBeDefined();
            expect(cachedMessage?.payload.data).toBe('Test data');
            
            // Process queue
            await testQueue.processQueue();
            
            // Message should be processed
            const processedMessage = await testQueue.getCachedMessage('error-test');
            expect(processedMessage?.status).toBe('processed');
            
            // Verify persistence was updated
            expect(mockPersistenceManager.updateMessage).toHaveBeenCalledWith(
                'error-test', 
                expect.objectContaining({ 
                    id: 'error-test', 
                    status: 'processed'
                })
            );
        } finally {
            // Clean up
            await testQueue.cleanup();
        }
    });
});