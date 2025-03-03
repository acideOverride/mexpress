import { EventHandler } from '../../../../src/git-workflow-automation/src/core/event-system/event-handler';
import { MessageQueue } from '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2';
import { QueuedMessage } from '../../../../src/git-workflow-automation/src/core/message-queue/types';
import { QueuePersistenceManager } from '../../../../src/git-workflow-automation/src/core/message-queue/queue-persistence-manager';
import * as path from 'path';

/**
 * Message Queue Recovery Mechanism Tests
 * MEXP-2025-003-BE: Message Queue System
 * 
 * These tests verify the queue's ability to recover from various failure scenarios,
 * including process crashes, network failures, and storage issues.
 */
describe('Message Queue Recovery Mechanisms', () => {
    // Use a memory-based mock for the filesystem operations
    class InMemoryPersistenceManager {
        private messageCache = new Map<string, QueuedMessage>();
        private queueState = { priorities: [], messageCount: 0, lastUpdated: Date.now() };
        private eventHandlers = new Map<string, Set<Function>>();
        private closed = false;
        
        constructor(private config: any) {}
        
        on(event: string, handler: Function): void {
            if (!this.eventHandlers.has(event)) {
                this.eventHandlers.set(event, new Set());
            }
            this.eventHandlers.get(event)!.add(handler);
        }
        
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
        
        getMessages(): Map<string, QueuedMessage> {
            return new Map(this.messageCache);
        }
        
        getQueueState(): any {
            return { ...this.queueState };
        }
        
        updateMessage(messageId: string, message: QueuedMessage): void {
            this.messageCache.set(messageId, { ...message });
        }
        
        updateQueueState(state: Partial<any>): void {
            this.queueState = {
                ...this.queueState,
                ...state,
                lastUpdated: Date.now()
            };
        }
        
        removeMessage(messageId: string): void {
            this.messageCache.delete(messageId);
        }
        
        async flush(): Promise<void> {
            if (this.closed) return;
            
            this.emitEvent('persistence-flush', {
                queueState: this.queueState,
                messageCount: this.messageCache.size
            });
        }
        
        async close(): Promise<void> {
            if (this.closed) return;
            this.closed = true;
            
            try {
                await this.flush();
            } catch (error) {
                this.emitEvent('persistence-error', {
                    message: 'Failed to flush during close',
                    error
                });
            }
            
            this.eventHandlers.clear();
        }

        // Method to simulate corruption
        corruptState() {
            // Just simulate a corrupted state by making it invalid
            this.queueState = null as any;
            this.emitEvent('persistence-error', {
                message: 'Corrupt state',
                error: new Error('Simulated corruption')
            });
        }
    }
    
    let messageQueue: MessageQueue;
    let eventHandler: EventHandler;
    let persistenceManager: any;
    let events: any[] = [];
    
    // Store all timeouts for proper cleanup
    const timeouts: NodeJS.Timeout[] = [];
    
    // Override setTimeout to track created timeouts
    const originalSetTimeout = setTimeout;
    global.setTimeout = function(callback, delay, ...args) {
        const timeoutId = originalSetTimeout(callback, delay, ...args);
        timeouts.push(timeoutId);
        return timeoutId;
    };
    
    beforeEach(() => {
        // Reset events array
        events = [];
        
        // Create event handler for testing
        eventHandler = {
            emit: jest.fn().mockImplementation((event, data) => {
                events.push({ event, data });
                return Promise.resolve();
            })
        } as any;
        
        // Create in-memory persistence manager
        persistenceManager = new InMemoryPersistenceManager({
            storagePath: '/mock/storage/path',
            flushInterval: 50, // 50ms flush for faster testing
            maxRetries: 3,
            retryDelay: 10
        });
        
        // Create message queue with persistence
        messageQueue = new MessageQueue(eventHandler, persistenceManager);
    });
    
    afterEach(async () => {
        // Clear all timeouts
        for (const timeout of timeouts) {
            clearTimeout(timeout);
        }
        timeouts.length = 0;
        
        // Restore original setTimeout
        global.setTimeout = originalSetTimeout;
        
        // Cleanup queue
        await messageQueue.cleanup();
        
        // Cleanup persistence manager
        await persistenceManager.close();
    });
    
    test('should recover messages after process crash simulation', async () => {
        // Create test messages
        const messages: QueuedMessage[] = [
            { id: 'recover-crash-1', type: 'test', payload: { data: 'Test 1' }, priority: 1 },
            { id: 'recover-crash-2', type: 'test', payload: { data: 'Test 2' }, priority: 2 },
            { id: 'recover-crash-3', type: 'test', payload: { data: 'Test 3' }, priority: 1 }
        ];
        
        // Enqueue messages
        await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
        
        // Force flush to disk
        await persistenceManager.flush();
        
        // Verify messages are in the queue
        const pendingMessages = await messageQueue.getPendingMessages();
        expect(pendingMessages.length).toBe(3);
        
        // Simulate a crash by closing without cleanup
        await persistenceManager.close();
        
        // Store the message cache for recovery simulation
        const messageCache = new Map(persistenceManager.getMessages());
        const queueState = { ...persistenceManager.getQueueState() };
        
        // Create new instances (simulating process restart)
        const newPersistenceManager = new InMemoryPersistenceManager({
            storagePath: '/mock/storage/path',
            flushInterval: 50,
            maxRetries: 3,
            retryDelay: 10
        });
        
        // Manually restore the state to simulate file-based recovery
        for (const [id, message] of messageCache.entries()) {
            newPersistenceManager.updateMessage(id, message);
        }
        newPersistenceManager.updateQueueState(queueState);
        
        const newQueue = new MessageQueue(eventHandler, newPersistenceManager);
        
        // Allow time for recovery (using a small timeout since we're not waiting for actual disk I/O)
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Verify messages were recovered
        const recoveredMessages = await newQueue.getPendingMessages();
        expect(recoveredMessages.length).toBe(3);
        
        // Verify message content
        const msg1 = await newQueue.getCachedMessage('recover-crash-1');
        const msg2 = await newQueue.getCachedMessage('recover-crash-2');
        const msg3 = await newQueue.getCachedMessage('recover-crash-3');
        
        expect(msg1).toBeDefined();
        expect(msg2).toBeDefined();
        expect(msg3).toBeDefined();
        expect(msg1?.payload.data).toBe('Test 1');
        expect(msg2?.payload.data).toBe('Test 2');
        expect(msg3?.payload.data).toBe('Test 3');
        
        // Cleanup
        await newQueue.cleanup();
        await newPersistenceManager.close();
    });
    
    test('should recover partially processed queues', async () => {
        // Create test messages
        const messages: QueuedMessage[] = [
            { id: 'recover-partial-1', type: 'test', payload: {}, priority: 1 },
            { id: 'recover-partial-2', type: 'test', payload: { operation: 'invalid' }, priority: 1 },
            { id: 'recover-partial-3', type: 'test', payload: {}, priority: 2 },
            { id: 'recover-partial-4', type: 'test', payload: {}, priority: 2 }
        ];
        
        // Enqueue messages
        await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
        
        // Process some messages
        await messageQueue.processQueue();
        
        // Force flush to disk
        await persistenceManager.flush();
        
        // Verify state after processing
        const msg1 = await messageQueue.getCachedMessage('recover-partial-1');
        const msg2 = await messageQueue.getCachedMessage('recover-partial-2');
        const msg3 = await messageQueue.getCachedMessage('recover-partial-3');
        const msg4 = await messageQueue.getCachedMessage('recover-partial-4');
        
        expect(msg1?.status).toBe('processed');
        expect(msg2?.status).toBe('retry');
        expect(msg3?.status).toBe('processed');
        expect(msg4?.status).toBe('processed');
        
        // Store the message cache for recovery simulation
        const messageCache = new Map(persistenceManager.getMessages());
        const queueState = { ...persistenceManager.getQueueState() };
        
        // Create new instances (simulating process restart)
        const newPersistenceManager = new InMemoryPersistenceManager({
            storagePath: '/mock/storage/path',
            flushInterval: 50,
            maxRetries: 3,
            retryDelay: 10
        });
        
        // Manually restore the state to simulate file-based recovery
        for (const [id, message] of messageCache.entries()) {
            newPersistenceManager.updateMessage(id, message);
        }
        newPersistenceManager.updateQueueState(queueState);
        
        const newQueue = new MessageQueue(eventHandler, newPersistenceManager);
        
        // Allow time for recovery
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Verify state after recovery
        const recoveredMsg1 = await newQueue.getCachedMessage('recover-partial-1');
        const recoveredMsg2 = await newQueue.getCachedMessage('recover-partial-2');
        const recoveredMsg3 = await newQueue.getCachedMessage('recover-partial-3');
        const recoveredMsg4 = await newQueue.getCachedMessage('recover-partial-4');
        
        // Successfully processed messages should remain processed
        expect(recoveredMsg1?.status).toBe('processed');
        expect(recoveredMsg3?.status).toBe('processed');
        expect(recoveredMsg4?.status).toBe('processed');
        
        // Retry messages should be in the queue
        expect(recoveredMsg2?.status).toBe('retry');
        
        // Get pending messages (should only contain the retry message)
        const pendingMessages = await newQueue.getPendingMessages();
        expect(pendingMessages.length).toBe(1);
        expect(pendingMessages[0].id).toBe('recover-partial-2');
        
        // Process the queue again to handle the retry
        await newQueue.processQueue();
        
        // Check if the retry count was incremented
        const retriedMsg = await newQueue.getCachedMessage('recover-partial-2');
        expect(retriedMsg?.retryCount).toBe(2);
        
        // Cleanup
        await newQueue.cleanup();
        await newPersistenceManager.close();
    });
    
    test('should handle recovery with corrupted persistence files', async () => {
        // Create test messages
        const messages: QueuedMessage[] = [
            { id: 'recover-corrupt-1', type: 'test', payload: { data: 'Test 1' } },
            { id: 'recover-corrupt-2', type: 'test', payload: { data: 'Test 2' } }
        ];
        
        // Enqueue messages
        await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
        
        // Force flush to disk
        await persistenceManager.flush();
        
        // Close properly
        await messageQueue.cleanup();
        await persistenceManager.close();
        
        // Create new persistence manager with corrupted state
        const corruptedPersistenceManager = new InMemoryPersistenceManager({
            storagePath: '/mock/storage/path',
            flushInterval: 50,
            maxRetries: 3,
            retryDelay: 10
        });
        
        // Simulate corruption
        corruptedPersistenceManager.corruptState();
        
        // Track recovery errors
        const recoveryErrors: Error[] = [];
        const errorHandler = {
            emit: jest.fn().mockImplementation((event, data) => {
                events.push({ event, data });
                
                if (event === 'persistence-error') {
                    recoveryErrors.push(data.error);
                }
                
                return Promise.resolve();
            })
        } as any;
        
        // Create recovery queue with corrupted persistence
        const recoveryQueue = new MessageQueue(errorHandler, corruptedPersistenceManager);
        
        // Allow time for recovery attempt
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Check for appropriate error events
        const persistenceErrors = events.filter(e => e.event === 'persistence-error');
        expect(persistenceErrors.length).toBeGreaterThan(0);
        
        // Queue should still be operational despite corrupted state
        const newMessages: QueuedMessage[] = [
            { id: 'recover-after-corrupt-1', type: 'test', payload: { data: 'New Test 1' } },
            { id: 'recover-after-corrupt-2', type: 'test', payload: { data: 'New Test 2' } }
        ];
        
        // Should be able to enqueue new messages
        await Promise.all(newMessages.map(msg => recoveryQueue.enqueue(msg)));
        
        // Should be able to process queue
        await recoveryQueue.processQueue();
        
        // Verify new messages were processed
        const processedMsg1 = await recoveryQueue.getCachedMessage('recover-after-corrupt-1');
        const processedMsg2 = await recoveryQueue.getCachedMessage('recover-after-corrupt-2');
        
        expect(processedMsg1?.status).toBe('processed');
        expect(processedMsg2?.status).toBe('processed');
        
        // Cleanup
        await recoveryQueue.cleanup();
        await corruptedPersistenceManager.close();
    });
    
    test('should recover in-flight messages after network failure', async () => {
        // Create fake network error for testing
        const networkError = new Error('Network error');
        let shouldFailNetworkRequests = false;
        
        // Create event handler with simulated network failures
        const networkErrorHandler = {
            emit: jest.fn().mockImplementation((event, data) => {
                events.push({ event, data });
                
                // Simulate network error
                if (shouldFailNetworkRequests && event === 'test') {
                    return Promise.reject(networkError);
                }
                
                return Promise.resolve();
            })
        } as any;
        
        // Create queue with network failure simulation
        const networkQueue = new MessageQueue(networkErrorHandler, persistenceManager);
        
        // Create test messages
        const messages: QueuedMessage[] = [
            { id: 'recover-network-1', type: 'test', payload: { data: 'Test 1' } },
            { id: 'recover-network-2', type: 'test', payload: { data: 'Test 2' } }
        ];
        
        // Enqueue messages
        await Promise.all(messages.map(msg => networkQueue.enqueue(msg)));
        
        // Force flush to disk
        await persistenceManager.flush();
        
        // Enable network failures
        shouldFailNetworkRequests = true;
        
        // Try to process (will fail due to network error)
        await networkQueue.processQueue();
        
        // Check message states - should be in retry state
        const msg1 = await networkQueue.getCachedMessage('recover-network-1');
        const msg2 = await networkQueue.getCachedMessage('recover-network-2');
        
        expect(msg1?.status).toBe('retry');
        expect(msg2?.status).toBe('retry');
        expect(msg1?.retryCount).toBe(1);
        expect(msg2?.retryCount).toBe(1);
        
        // Store the state for recovery
        const messageCache = new Map(persistenceManager.getMessages());
        const queueState = { ...persistenceManager.getQueueState() };
        
        // Create new persistence manager for recovery simulation
        const recoveryPersistenceManager = new InMemoryPersistenceManager({
            storagePath: '/mock/storage/path',
            flushInterval: 50,
            maxRetries: 3,
            retryDelay: 10
        });
        
        // Restore the state manually
        for (const [id, message] of messageCache.entries()) {
            recoveryPersistenceManager.updateMessage(id, message);
        }
        recoveryPersistenceManager.updateQueueState(queueState);
        
        // Disable network failures for recovery
        shouldFailNetworkRequests = false;
        
        // Create new queue with working network
        const recoveredQueue = new MessageQueue(networkErrorHandler, recoveryPersistenceManager);
        
        // Allow time for recovery
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Process queue again with working network
        await recoveredQueue.processQueue();
        
        // Check message states - should be processed successfully
        const recoveredMsg1 = await recoveredQueue.getCachedMessage('recover-network-1');
        const recoveredMsg2 = await recoveredQueue.getCachedMessage('recover-network-2');
        
        expect(recoveredMsg1?.status).toBe('processed');
        expect(recoveredMsg2?.status).toBe('processed');
        
        // Cleanup
        await recoveredQueue.cleanup();
        await recoveryPersistenceManager.close();
        await networkQueue.cleanup();
    });
});