import { EventHandler } from '../../../../src/core/event-system/event-handler';
import { MessageQueue } from '../../../../src/core/message-queue/message-queue-v2';
import { QueuedMessage } from '../../../../src/core/message-queue/types';
import { QueuePersistenceManager } from '../../../../src/core/message-queue/queue-persistence-manager';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Message Queue Stress Tests
 * MEXP-2025-003-BE: Message Queue System
 * 
 * These tests verify the queue's performance and stability under high load
 * and stress conditions, including large message volumes, concurrent operations,
 * and resource-intensive processing.
 */
describe('Message Queue Stress Tests', () => {
    const testStoragePath = path.join(__dirname, '../../../../temp/queue-stress-test');
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
        
        // Create persistence manager optimized for stress testing
        persistenceManager = new QueuePersistenceManager({
            storagePath: testStoragePath,
            flushInterval: 500, // 500ms flush interval to reduce disk I/O
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
    
    test('should handle high volume message batches', async () => {
        // Create a large number of messages (1000)
        const highVolumeCount = 1000;
        const messages: QueuedMessage[] = [];
        
        for (let i = 0; i < highVolumeCount; i++) {
            messages.push({
                id: `high-volume-${i}`,
                type: 'test',
                payload: { data: `Test data ${i}` },
                priority: Math.floor(Math.random() * 3) + 1 // Random priority 1-3
            });
        }
        
        // Start the benchmark timer
        const enqueueBenchStart = Date.now();
        
        // Enqueue all messages in smaller batches to avoid memory spikes
        const batchSize = 100;
        for (let i = 0; i < highVolumeCount; i += batchSize) {
            const batch = messages.slice(i, i + batchSize);
            await Promise.all(batch.map(msg => messageQueue.enqueue(msg)));
        }
        
        // Calculate enqueue performance
        const enqueueTime = Date.now() - enqueueBenchStart;
        const enqueueRate = highVolumeCount / (enqueueTime / 1000);
        
        // Performance assertion - should enqueue at least 500 messages per second
        expect(enqueueRate).toBeGreaterThan(500);
        
        // Start the benchmark timer for processing
        const processBenchStart = Date.now();
        
        // Process the queue
        await messageQueue.processQueue();
        
        // Calculate processing performance
        const processTime = Date.now() - processBenchStart;
        const processRate = highVolumeCount / (processTime / 1000);
        
        // Performance assertion - should process at least 200 messages per second
        expect(processRate).toBeGreaterThan(200);
        
        // Verify all messages were processed
        let processedCount = 0;
        for (let i = 0; i < highVolumeCount; i++) {
            const message = await messageQueue.getCachedMessage(`high-volume-${i}`);
            if (message?.status === 'processed') {
                processedCount++;
            }
        }
        
        // All messages should be processed
        expect(processedCount).toBe(highVolumeCount);
        
        // Verify processed events count
        const processedEvents = events.filter(e => e.event === 'message-processed');
        expect(processedEvents.length).toBe(highVolumeCount);
    });
    
    test('should handle concurrent queue operations', async () => {
        // Create multiple queues sharing the same persistence manager
        const queueCount = 3;
        const queues: MessageQueue[] = [];
        
        for (let i = 0; i < queueCount; i++) {
            queues.push(new MessageQueue(eventHandler, persistenceManager));
        }
        
        // Create messages for each queue
        const messagesPerQueue = 100;
        const enqueuePromises: Promise<void>[] = [];
        
        for (let q = 0; q < queueCount; q++) {
            for (let i = 0; i < messagesPerQueue; i++) {
                const message: QueuedMessage = {
                    id: `concurrent-${q}-${i}`,
                    type: 'test',
                    payload: { data: `Queue ${q}, Message ${i}` },
                    priority: Math.floor(Math.random() * 3) + 1 // Random priority 1-3
                };
                
                enqueuePromises.push(queues[q].enqueue(message));
            }
        }
        
        // Enqueue all messages concurrently
        await Promise.all(enqueuePromises);
        
        // Process all queues concurrently
        await Promise.all(queues.map(queue => queue.processQueue()));
        
        // Verify all messages were processed
        let processedCount = 0;
        
        for (let q = 0; q < queueCount; q++) {
            for (let i = 0; i < messagesPerQueue; i++) {
                const message = await queues[q].getCachedMessage(`concurrent-${q}-${i}`);
                if (message?.status === 'processed') {
                    processedCount++;
                }
            }
        }
        
        // All messages should be processed
        const totalMessages = queueCount * messagesPerQueue;
        expect(processedCount).toBe(totalMessages);
        
        // Verify persistence manager has all messages
        const allPersistedMessages = persistenceManager.getMessages();
        expect(allPersistedMessages.size).toBeGreaterThanOrEqual(totalMessages);
        
        // Cleanup all queues
        for (const queue of queues) {
            await queue.cleanup();
        }
    });
    
    test('should handle long message processing', async () => {
        // Create messages with simulated long processing
        const longProcessingMessages: QueuedMessage[] = [];
        const messageCount = 10;
        
        for (let i = 0; i < messageCount; i++) {
            longProcessingMessages.push({
                id: `long-processing-${i}`,
                type: 'long-process',
                payload: {
                    processingTime: 100, // milliseconds per message
                    data: `Long processing test ${i}`
                }
            });
        }
        
        // Create a custom event handler that adds processing delay
        const delayedEventHandler = {
            emit: jest.fn().mockImplementation(async (event, data) => {
                events.push({ event, data });
                
                // Simulate long processing for specific event type
                if (event === 'long-process' && data.processingTime) {
                    await new Promise(resolve => setTimeout(resolve, data.processingTime));
                }
                
                return Promise.resolve();
            })
        } as any;
        
        // Create queue with delayed event handler
        const longProcessingQueue = new MessageQueue(delayedEventHandler, persistenceManager);
        
        // Enqueue all messages
        await Promise.all(longProcessingMessages.map(msg => longProcessingQueue.enqueue(msg)));
        
        // Start the benchmark timer
        const processBenchStart = Date.now();
        
        // Process the queue
        await longProcessingQueue.processQueue();
        
        // Calculate processing time
        const processTime = Date.now() - processBenchStart;
        
        // Processing should take at least the sum of all processing times
        // but with some concurrency, not the full sum
        const minExpectedTime = messageCount * 100 * 0.5; // 50% of sequential time due to concurrency
        expect(processTime).toBeGreaterThan(minExpectedTime);
        
        // Verify all messages were processed
        for (let i = 0; i < messageCount; i++) {
            const message = await longProcessingQueue.getCachedMessage(`long-processing-${i}`);
            expect(message?.status).toBe('processed');
        }
        
        // Cleanup
        await longProcessingQueue.cleanup();
    });
    
    test('should handle message processing with confirmation timeouts', async () => {
        // Create messages requiring delivery confirmation but with varying timeout behavior
        const messages: QueuedMessage[] = [
            // Messages with successful confirmation
            {
                id: 'confirm-timeout-1',
                type: 'confirm-delivery',
                payload: {
                    requireConfirmation: true,
                    confirmationTimeout: 500, // 500ms timeout
                    confirmationDelay: 200, // 200ms delay before confirmation
                    data: 'Test with successful confirmation'
                }
            },
            {
                id: 'confirm-timeout-2',
                type: 'confirm-delivery',
                payload: {
                    requireConfirmation: true,
                    confirmationTimeout: 500,
                    confirmationDelay: 300,
                    data: 'Test with successful confirmation'
                }
            },
            // Message with timeout (delay > timeout)
            {
                id: 'confirm-timeout-3',
                type: 'confirm-delivery',
                payload: {
                    requireConfirmation: true,
                    confirmationTimeout: 200,
                    confirmationDelay: 300, // Will cause timeout
                    data: 'Test with confirmation timeout'
                }
            }
        ];
        
        // Create custom event handler that simulates delayed confirmation
        const confirmationEvents: string[] = [];
        let confirmationQueue: MessageQueue;
        
        const confirmationHandler = {
            emit: jest.fn().mockImplementation(async (event, data) => {
                events.push({ event, data });
                
                // For confirmation events, delay the confirmation based on message payload
                if (event === 'confirm-delivery' && data.confirmationDelay) {
                    const delay = data.confirmationDelay;
                    const messageId = messages.find(m => m.payload.data === data.data)?.id;
                    
                    if (messageId) {
                        // Schedule the confirmation after the specified delay
                        setTimeout(() => {
                            confirmationEvents.push(messageId);
                            confirmationQueue.on('message-processed', async (message) => {
                                if (message.id === messageId) {
                                    await confirmationQueue.getCachedMessage(messageId);
                                }
                            });
                        }, delay);
                    }
                }
                
                return Promise.resolve();
            })
        } as any;
        
        // Create queue with confirmation handler
        confirmationQueue = new MessageQueue(confirmationHandler, persistenceManager);
        
        // Enqueue all messages
        await Promise.all(messages.map(msg => confirmationQueue.enqueue(msg)));
        
        // Process the queue - this will handle both successful confirmations and timeouts
        await confirmationQueue.processQueue();
        
        // Allow time for all confirmation delays to complete
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Check message statuses
        const msg1 = await confirmationQueue.getCachedMessage('confirm-timeout-1');
        const msg2 = await confirmationQueue.getCachedMessage('confirm-timeout-2');
        const msg3 = await confirmationQueue.getCachedMessage('confirm-timeout-3');
        
        // Messages with confirmation before timeout should be processed
        expect(msg1?.status).toBe('processed');
        expect(msg2?.status).toBe('processed');
        
        // Message with timeout should be in retry state
        expect(msg3?.status).toBe('retry');
        expect(msg3?.retryCount).toBeGreaterThan(0);
        
        // Cleanup
        await confirmationQueue.cleanup();
    });
});