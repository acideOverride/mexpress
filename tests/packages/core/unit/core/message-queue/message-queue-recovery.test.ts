import { EventHandler } from '../../../../src/git-workflow-automation/src/core/event-system/event-handler';
import { MessageQueue } from '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2';
import { QueuedMessage } from '../../../../src/git-workflow-automation/src/core/message-queue/types';
import { QueuePersistenceManager } from '../../../../src/git-workflow-automation/src/core/message-queue/queue-persistence-manager';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Message Queue Recovery Mechanism Tests
 * MEXP-2025-003-BE: Message Queue System
 * 
 * These tests verify the queue's ability to recover from various failure scenarios,
 * including process crashes, network failures, and storage issues.
 */
describe('Message Queue Recovery Mechanisms', () => {
    const testStoragePath = path.join(__dirname, '../../../../temp/queue-recovery-test');
    let messageQueue: MessageQueue;
    let eventHandler: EventHandler;
    let persistenceManager: QueuePersistenceManager;
    let events: any[] = [];
    
    beforeEach(() => {
        // Setup test directory
        if (!fs.existsSync(path.dirname(testStoragePath))) {
            fs.mkdirSync(path.dirname(testStoragePath), { recursive: true });
        }
        
        // Clear test storage
        if (fs.existsSync(testStoragePath)) {
            // Clear all files in directory
            const files = fs.readdirSync(testStoragePath);
            for (const file of files) {
                fs.unlinkSync(path.join(testStoragePath, file));
            }
        } else {
            fs.mkdirSync(testStoragePath, { recursive: true });
        }
        
        // Create event handler for testing
        events = [];
        eventHandler = {
            emit: jest.fn().mockImplementation((event, data) => {
                events.push({ event, data });
                return Promise.resolve();
            })
        } as any;
        
        // Create persistence manager
        persistenceManager = new QueuePersistenceManager({
            storagePath: testStoragePath,
            flushInterval: 100, // 100ms flush for faster testing
            maxRetries: 3,
            retryDelay: 50
        });
        
        // Create message queue with persistence
        messageQueue = new MessageQueue(eventHandler, persistenceManager);
    });
    
    afterEach(async () => {
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
        
        // Create new instances (simulating process restart)
        const newPersistenceManager = new QueuePersistenceManager({
            storagePath: testStoragePath,
            flushInterval: 100,
            maxRetries: 3,
            retryDelay: 50
        });
        
        const newQueue = new MessageQueue(eventHandler, newPersistenceManager);
        
        // Allow time for recovery
        await new Promise(resolve => setTimeout(resolve, 200));
        
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
        
        // Verify priorities are maintained
        expect(recoveredMessages[0].id).toBe('recover-crash-1');
        expect(recoveredMessages[0].priority).toBe(1);
        expect(recoveredMessages[1].id).toBe('recover-crash-3');
        expect(recoveredMessages[1].priority).toBe(1);
        expect(recoveredMessages[2].id).toBe('recover-crash-2');
        expect(recoveredMessages[2].priority).toBe(2);
        
        // Verify recovery events
        const restoredEvents = events.filter(e => e.event === 'queue-restored');
        expect(restoredEvents.length).toBe(1);
        expect(restoredEvents[0].data.messageCount).toBe(3);
        
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
        
        // Close without cleanup (simulate crash)
        await persistenceManager.close();
        
        // Create new instances (simulating process restart)
        const newPersistenceManager = new QueuePersistenceManager({
            storagePath: testStoragePath,
            flushInterval: 100,
            maxRetries: 3,
            retryDelay: 50
        });
        
        const newQueue = new MessageQueue(eventHandler, newPersistenceManager);
        
        // Allow time for recovery
        await new Promise(resolve => setTimeout(resolve, 200));
        
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
        
        // Corrupt the queue state file
        const queueStateFile = path.join(testStoragePath, 'queue-state.json');
        fs.writeFileSync(queueStateFile, '{not valid json', 'utf8');
        
        // Create recovery mechanism with custom error handler
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
        
        // Create new instances with corrupted files
        const corruptedPersistenceManager = new QueuePersistenceManager({
            storagePath: testStoragePath,
            flushInterval: 100,
            maxRetries: 3,
            retryDelay: 50
        });
        
        const recoveryQueue = new MessageQueue(errorHandler, corruptedPersistenceManager);
        
        // Allow time for recovery attempt
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Check for appropriate error events
        const persistenceErrors = events.filter(e => e.event === 'persistence-error');
        expect(persistenceErrors.length).toBeGreaterThan(0);
        
        // Queue should still be operational despite corrupted files
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
        
        // Force flush to disk
        await persistenceManager.flush();
        
        // Simulate shutdown and restart
        await networkQueue.cleanup();
        
        // Create new queue with working network
        shouldFailNetworkRequests = false;
        const recoveredQueue = new MessageQueue(networkErrorHandler, persistenceManager);
        
        // Allow time for recovery
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Process queue again with working network
        await recoveredQueue.processQueue();
        
        // Check message states - should be processed successfully
        const recoveredMsg1 = await recoveredQueue.getCachedMessage('recover-network-1');
        const recoveredMsg2 = await recoveredQueue.getCachedMessage('recover-network-2');
        
        expect(recoveredMsg1?.status).toBe('processed');
        expect(recoveredMsg2?.status).toBe('processed');
        
        // Cleanup
        await recoveredQueue.cleanup();
    });
});