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

describe('MessageQueue', () => {
    let messageQueue: MessageQueue;
    let eventHandler: EventHandler;

    beforeEach(async () => {
        eventHandler = new EventHandler();
        messageQueue = await setupMessageQueueTest(eventHandler);
    });

    afterEach(async () => {
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
    });
});