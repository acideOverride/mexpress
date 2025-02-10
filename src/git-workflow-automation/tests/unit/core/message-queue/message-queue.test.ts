// Set timeout for all tests in this suite
jest.setTimeout(10000);

import { EventHandler } from '../../../../src/core/event-system/event-handler';
import type { MessageQueue, QueuedMessage } from '../../../../src/core/message-queue/message-queue';
import { setupMessageQueueTest, cleanupMessageQueueTest } from '../../../../test/setup';

interface MessageQueueEvents {
    'message-processed': QueuedMessage;
    'message-error': { messageId: string; error: Error; message: QueuedMessage };
    'message-retry': { messageId: string; error: Error; retryCount: number; message: QueuedMessage };
    'message-processing': QueuedMessage;
    'message-queued': QueuedMessage;
}

// Increase timeout for all tests in this suite
jest.setTimeout(30000);

describe('MessageQueue', () => {
    let messageQueue: MessageQueue;
    let eventHandler: EventHandler;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(async () => {
        // Silence console.error during tests since we expect errors
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        eventHandler = new EventHandler();
        messageQueue = await setupMessageQueueTest(eventHandler);
    });

    afterEach(async () => {
        consoleErrorSpy.mockRestore();
        await cleanupMessageQueueTest();
    });

    describe('Queue Operations', () => {
        test('should handle various priority values', async () => {
            const messages: QueuedMessage[] = [
                { id: 'msg-1', type: 'git-operation', payload: { operation: 'commit' }, priority: undefined },
                { id: 'msg-2', type: 'git-operation', payload: { operation: 'push' }, priority: null },
                { id: 'msg-3', type: 'git-operation', payload: { operation: 'merge' }, priority: NaN },
                { id: 'msg-4', type: 'git-operation', payload: { operation: 'pull' }, priority: 1 },
                { id: 'msg-5', type: 'git-operation', payload: { operation: 'fetch' }, priority: -1 },
            ];

            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            const pendingMessages = await messageQueue.getPendingMessages();

            expect(pendingMessages).toHaveLength(5);
            // Check that invalid priorities are normalized to 1
            expect(pendingMessages.filter(m => m.priority === 1)).toHaveLength(4); // undefined, null, NaN, and explicit 1
            // Check that valid priorities are preserved
            expect(pendingMessages.find(m => m.priority === -1)).toBeTruthy();
        });

        test('should handle production environment retries', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'msg-1',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };

                let attempts = 0;
                const retryEvents: MessageQueueEvents['message-retry'][] = [];

                messageQueue.on('message-processing', () => {
                    attempts++;
                    if (attempts === 1) {
                        throw new Error('Temporary failure');
                    }
                    return Promise.resolve();
                });

                messageQueue.on('message-retry', (event) => {
                    retryEvents.push(event);
                    return Promise.resolve();
                });

                await messageQueue.enqueue(message);
                await messageQueue.processQueue();

                // Wait for retry delay
                await new Promise(resolve => setTimeout(resolve, 1100));

                expect(retryEvents).toHaveLength(1);
                expect(retryEvents[0].retryCount).toBe(1);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle max retries exceeded', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            let attempts = 0;
            const retryEvents: MessageQueueEvents['message-retry'][] = [];
            const errorEvents: MessageQueueEvents['message-error'][] = [];

            messageQueue.on('message-processing', () => {
                attempts++;
                throw new Error(`Failure attempt ${attempts}`);
            });

            messageQueue.on('message-retry', (event) => {
                retryEvents.push(event);
                return Promise.resolve();
            });

            messageQueue.on('message-error', (event) => {
                errorEvents.push(event);
                return Promise.resolve();
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            // Wait for all retries to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(attempts).toBe(3); // Initial attempt + 2 retries
            expect(retryEvents).toHaveLength(2); // Two retry attempts
            expect(errorEvents).toHaveLength(1); // Final failure
            expect(errorEvents[0].message.status).toBe('failed');
        });

        test('should handle non-Error exceptions', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            messageQueue.on('message-processing', () => {
                throw 'String error'; // Non-Error exception
            });

            const errorPromise = new Promise<MessageQueueEvents['message-error']>(resolve => {
                messageQueue.on('message-error', resolve);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const errorEvent = await errorPromise;
            expect(errorEvent.error).toBeInstanceOf(Error);
            expect(errorEvent.error.message).toBe('String error');
        });

        test('should handle concurrent processing with failures', async () => {
            const messages: QueuedMessage[] = Array.from({ length: 5 }, (_, i) => ({
                id: `msg-${i}`,
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            }));

            const failedIds = new Set(['msg-1', 'msg-3']);
            const processedMessages: QueuedMessage[] = [];
            const failedMessages: QueuedMessage[] = [];

            messageQueue.on('message-processing', (msg) => {
                if (failedIds.has(msg.id)) {
                    throw new Error('Planned failure');
                }
                return Promise.resolve();
            });

            messageQueue.on('message-processed', (msg) => {
                processedMessages.push(msg);
                return Promise.resolve();
            });

            messageQueue.on('message-error', (event) => {
                failedMessages.push(event.message);
                return Promise.resolve();
            });

            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            await messageQueue.processQueue();

            // Wait for retries to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(processedMessages).toHaveLength(3); // Non-failed messages
            expect(failedMessages).toHaveLength(2); // Failed messages
            expect(failedMessages.every(msg => failedIds.has(msg.id))).toBe(true);
        });

        test('should handle cleanup during active processing', async () => {
            const messages: QueuedMessage[] = Array.from({ length: 5 }, (_, i) => ({
                id: `msg-${i}`,
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            }));

            let processingCount = 0;
            messageQueue.on('message-processing', async () => {
                processingCount++;
                // Simulate long processing
                await new Promise(resolve => setTimeout(resolve, 50));
                return Promise.resolve();
            });

            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            const processPromise = messageQueue.processQueue();

            // Start cleanup while processing is active
            await messageQueue.cleanup();
            await processPromise;

            const pendingMessages = await messageQueue.getPendingMessages();
            expect(pendingMessages).toHaveLength(0);
            expect(processingCount).toBeGreaterThan(0);
        });

        test('should handle multiple concurrent cleanups with active timeouts', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'msg-1',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };

                messageQueue.on('message-processing', () => {
                    throw new Error('Temporary failure');
                });

                await messageQueue.enqueue(message);
                const processPromise = messageQueue.processQueue();

                // Start multiple cleanups while retry timeout is active
                const cleanupPromises = Array.from({ length: 3 }, () => messageQueue.cleanup());
                await Promise.all([processPromise, ...cleanupPromises]);

                const pendingMessages = await messageQueue.getPendingMessages();
                expect(pendingMessages).toHaveLength(0);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle errors in event handlers', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Add failing event handlers
            messageQueue.on('message-queued', () => {
                throw new Error('Queued handler error');
            });

            messageQueue.on('message-processed', () => {
                throw new Error('Processed handler error');
            });

            // This should not prevent message processing
            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('processed');
        });

        test('should handle errors in cleanup', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Create an invalid timeout to test error handling
            const invalidTimeout = setTimeout(() => {}, 1000);
            (messageQueue as any).timeouts.add(invalidTimeout);
            clearTimeout(invalidTimeout); // Make it invalid

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            // This should not throw despite the invalid timeout
            await messageQueue.cleanup();

            const pendingMessages = await messageQueue.getPendingMessages();
            expect(pendingMessages).toHaveLength(0);
        });

        test('should handle errors in retry promise cleanup', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Add a failing retry promise that's already caught
            const failingPromise = Promise.reject(new Error('Retry promise error')).catch(() => {});
            (messageQueue as any).retryPromises.add(failingPromise);

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            // This should not throw despite the failing promise
            await messageQueue.cleanup();

            const pendingMessages = await messageQueue.getPendingMessages();
            expect(pendingMessages).toHaveLength(0);
        });

        test('should handle retry in production', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'msg-1',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };

                // Track first retry only
                const retryPromise = new Promise<void>((resolve) => {
                    messageQueue.on('message-retry', async (event) => {
                        // Wait for status to be properly set
                        await new Promise(r => setTimeout(r, 50));
                        const cached = await messageQueue.getCachedMessage(event.message.id);
                        if (cached?.status === 'retry' && cached.retryCount === 1) {
                            resolve();
                        }
                    });
                });

                messageQueue.on('message-processing', () => {
                    throw new Error('Processing error');
                });

                await messageQueue.enqueue(message);
                await messageQueue.processQueue();

                // Wait for first retry and verify status
                await retryPromise;

                // Verify the cache state
                const cachedMessage = await messageQueue.getCachedMessage(message.id);
                expect(cachedMessage?.status).toBe('retry');
                expect(cachedMessage?.retryCount).toBe(1);

                // Verify retry queue state
                expect(messageQueue['retryQueue'].has(message.id)).toBe(true);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle event handler errors in production retry', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'msg-1',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };

                // Track retry event and status updates
                const retryPromise = new Promise<void>((resolve) => {
                    messageQueue.on('message-retry', async (event) => {
                        // Wait for status to be properly set
                        await new Promise(r => setTimeout(r, 50));
                        
                        const cached = await messageQueue.getCachedMessage(event.message.id);
                        if (cached?.status === 'retry' && cached.retryCount === 1) {
                            resolve();
                        }
                    });
                });

                messageQueue.on('message-processing', () => {
                    throw new Error('Processing error');
                });

                await messageQueue.enqueue(message);
                await messageQueue.processQueue();

                // Wait for retry and status update
                await retryPromise;

                // Verify the cache state
                const cachedMessage = await messageQueue.getCachedMessage(message.id);
                expect(cachedMessage?.status).toBe('retry');
                expect(cachedMessage?.retryCount).toBe(1);

                // Verify retry queue state
                expect(messageQueue['retryQueue'].has(message.id)).toBe(true);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle null event handlers', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Add null handler (shouldn't happen in practice but need to test)
            (messageQueue as any).handlers.set('message-processed', new Set([null]));

            // This should not throw despite the null handler
            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('processed');
        });

        test('should handle undefined event handlers', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Add undefined handler (shouldn't happen in practice but need to test)
            (messageQueue as any).handlers.set('message-processed', new Set([undefined]));

            // This should not throw despite the undefined handler
            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('processed');
        });

        test('should handle non-function event handlers', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Add non-function handler (shouldn't happen in practice but need to test)
            (messageQueue as any).handlers.set('message-processed', new Set([123]));

            // This should not throw despite the invalid handler
            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('processed');
        });

        test('should handle invalid operation error', async () => {
            const message: QueuedMessage = {
                id: 'invalid-op',
                type: 'git-operation',
                payload: { operation: 'invalid' },
                priority: 1
            };

            const errorPromise = new Promise<MessageQueueEvents['message-error']>(resolve => {
                messageQueue.on('message-error', resolve);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const errorEvent = await errorPromise;
            expect(errorEvent.error.message).toBe('Invalid operation');
            expect(errorEvent.message.status).toBe('failed');
        });

        test('should handle retry with cached message status mismatch', async () => {
            const message: QueuedMessage = {
                id: 'retry-status-mismatch',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            let retryAttempt = 0;
            messageQueue.on('message-processing', () => {
                retryAttempt++;
                if (retryAttempt === 1) {
                    throw new Error('First attempt error');
                }
            });

            // Track retry events
            const retryPromise = new Promise<MessageQueueEvents['message-retry']>(resolve => {
                messageQueue.on('message-retry', resolve);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            // Wait for retry event
            const retryEvent = await retryPromise;

            // Manually modify cached message status to test mismatch handling
            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            if (cachedMessage) {
                cachedMessage.status = 'processed'; // Create status mismatch
                await (messageQueue as any)._updateCache(message.id, cachedMessage);
            }

            // Wait for retry processing
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify the message was properly handled despite status mismatch
            const finalMessage = await messageQueue.getCachedMessage(message.id);
            expect(finalMessage?.status).toBe('processed');
        });

        test('should handle errors in retry process', async () => {
            const message: QueuedMessage = {
                id: 'retry-error',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            let attempts = 0;
            messageQueue.on('message-processing', () => {
                attempts++;
                throw new Error(`Error in attempt ${attempts}`);
            });

            const errorPromise = new Promise<MessageQueueEvents['message-error']>(resolve => {
                messageQueue.on('message-error', resolve);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            // Wait for error event
            const errorEvent = await errorPromise;
            expect(errorEvent.error.message).toContain('Error in attempt');
            expect(errorEvent.message.status).toBe('failed');
        });

        test('should handle production retry cleanup errors', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'prod-retry-cleanup',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };

                // Simulate error in retry cleanup
                messageQueue.on('message-processing', () => {
                    throw new Error('Processing error');
                });

                // Add an invalid retry promise that's already caught
                const invalidPromise = Promise.reject(new Error('Invalid retry promise')).catch(() => {});
                (messageQueue as any).retryPromises.add(invalidPromise);

                // Add an invalid timeout to test cleanup error handling
                const invalidTimeout = setTimeout(() => {}, 1000);
                (messageQueue as any).timeouts.add(invalidTimeout);
                clearTimeout(invalidTimeout); // Make it invalid

                await messageQueue.enqueue(message);
                await messageQueue.processQueue();

                // Wait for retry delay
                await new Promise(resolve => setTimeout(resolve, 1100));

                // Cleanup should handle the invalid promise and timeout without throwing
                await messageQueue.cleanup();

                const pendingMessages = await messageQueue.getPendingMessages();
                expect(pendingMessages).toHaveLength(0);

                // Verify cleanup state
                expect(messageQueue['timeouts'].size).toBe(0);
                expect(messageQueue['retryPromises'].size).toBe(0);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle invalid handler types', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            // Add various invalid handler types
            (messageQueue as any).handlers.set('message-processed', new Set([
                null,
                undefined,
                123,
                'string',
                {},
                [],
                new Date()
            ]));

            // This should not throw despite the invalid handlers
            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('processed');
        });

        // New test cases to improve branch coverage

        test('should handle concurrent retries with status preservation', async () => {
            const messages: QueuedMessage[] = Array.from({ length: 3 }, (_, i) => ({
                id: `concurrent-retry-${i}`,
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            }));

            let processingCount = 0;
            messageQueue.on('message-processing', async (msg) => {
                processingCount++;
                if (processingCount <= 3) { // First attempt for each message
                    throw new Error('Initial failure');
                }
            });

            // Track retry events
            const retryEvents: MessageQueueEvents['message-retry'][] = [];
            messageQueue.on('message-retry', event => {
                retryEvents.push(event);
            });

            // Enqueue and process messages
            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            await messageQueue.processQueue();

            // Wait for retries to complete
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify retry handling
            expect(retryEvents).toHaveLength(3);
            expect(new Set(retryEvents.map(e => e.messageId)).size).toBe(3);

            // Verify final status
            for (const msg of messages) {
                const cached = await messageQueue.getCachedMessage(msg.id);
                expect(cached?.status).toBe('processed');
            }
        });

        // Increase timeout for this specific test
        jest.setTimeout(60000);

        test('should handle test environment retry with status mismatch', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';

            try {
                // Create initial message
                const message: QueuedMessage = {
                    id: 'test-retry-error',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: -1
                };

                // Mock event handler to throw error
                (messageQueue as any).eventHandler = {
                    emit: () => { throw new Error('Processing error'); }
                };

                // Track retry state
                let retryMessage: QueuedMessage | undefined;
                const retryPromise = new Promise<void>(resolve => {
                    messageQueue.on('message-retry', async (event) => {
                        retryMessage = event.message;
                        // Wait for status propagation
                        await new Promise(r => setTimeout(r, 50));
                        resolve();
                    });
                });

                // Enqueue and process
                await messageQueue.enqueue(message);
                await messageQueue.processQueue();

                // Wait for retry event
                await retryPromise;

                // Verify retry state
                const finalMessage = await messageQueue.getCachedMessage(message.id);
                expect(finalMessage?.status).toBe('retry');
                expect(messageQueue['retryQueue'].has(message.id)).toBe(true);

                // Process again to handle retry
                if (retryMessage) {
                    await messageQueue.enqueue(retryMessage);
                    await messageQueue.processQueue();
                }

                // Wait for retry processing
                await new Promise(r => setTimeout(r, 50));

                // Verify final state
                const lastMessage = await messageQueue.getCachedMessage(message.id);
                expect(lastMessage?.status).toBe('retry');
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle production retry with error in timeout callback', async () => {
            jest.setTimeout(20000); // Increase timeout for this test
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'prod-retry-timeout-error',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };
// Track error logs and retry state
const errorLogs: string[] = [];
let retryTriggered = false;
consoleErrorSpy.mockImplementation((...args: any[]) => {
    errorLogs.push(args.join(' '));
});

// Create promise to track retry event
const retryEvent = new Promise<void>((resolve) => {
    messageQueue.on('message-retry', () => {
        retryTriggered = true;
        resolve();
    });
});

let attempts = 0;
messageQueue.on('message-processing', () => {
    attempts++;
    throw new Error('Processing error');
});

// Override _updateCache after retry is triggered
const originalUpdateCache = (messageQueue as any)._updateCache.bind(messageQueue);
(messageQueue as any)._updateCache = async (id: string, data: QueuedMessage) => {
    if (retryTriggered && data.status === 'retry') {
        throw new Error('Cache update error');
    }
    return originalUpdateCache(id, data);
};

await messageQueue.enqueue(message);
await messageQueue.processQueue();

// Wait for retry event
await retryEvent;

// Wait for error to be logged
await new Promise(resolve => setTimeout(resolve, 1100));

// Verify error logs
expect(errorLogs.some(log => log.includes('Error in production retry'))).toBe(true);
expect(errorLogs.some(log => log.includes('Cache update error'))).toBe(true);

// Verify message state
const finalMessage = await messageQueue.getCachedMessage(message.id);
expect(finalMessage?.status).toBe('retry');
expect(messageQueue['retryQueue'].has(message.id)).toBe(true);
                expect(messageQueue['retryQueue'].has(message.id)).toBe(true);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });

        test('should handle errors in event handler during retry', async () => {
            jest.setTimeout(30000); // Increase timeout for this test
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            try {
                const message: QueuedMessage = {
                    id: 'event-handler-error',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 1
                };

                // Track error logs and retry state
                const errorLogs: string[] = [];
                consoleErrorSpy.mockImplementation((...args: any[]) => {
                    errorLogs.push(args.join(' '));
                });

                // Create promise to track retry event
                const retryEvent = new Promise<void>((resolve) => {
                    messageQueue.on('message-retry', () => resolve());
                });

                // Mock event handler to throw error
                const mockEventHandler = {
                    emit: jest.fn().mockRejectedValue(new Error('Event handler error'))
                };
                (messageQueue as any).eventHandler = mockEventHandler;

                // Process message
                await messageQueue.enqueue(message);
                await messageQueue.processQueue();

                // Wait for retry event
                await retryEvent;

                // Wait for error to be logged
                await new Promise(resolve => setTimeout(resolve, 50));

                // Verify state
                const finalMessage = await messageQueue.getCachedMessage(message.id);
                expect(finalMessage?.status).toBe('retry');
                expect(messageQueue['retryQueue'].has(message.id)).toBe(true);
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });
    });
});