import { EventHandler } from '../../../../src/core/event-system/event-handler';
import type { MessageQueue, QueuedMessage } from '../../../../src/core/message-queue/message-queue';
import { setupMessageQueueTest, cleanupMessageQueueTest } from '../../../../test/setup';

interface MessageQueueEvents {
    'message-processed': QueuedMessage;
    'message-error': { messageId: string; error: Error; message: QueuedMessage };
    'message-retry': { messageId: string; error: Error; retryCount: number; message: QueuedMessage };
    'message-processing': QueuedMessage;
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
        test('should enqueue a message with correct priority', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            await messageQueue.enqueue(message);
            const pendingMessages = await messageQueue.getPendingMessages();
            expect(pendingMessages).toHaveLength(1);
            expect(pendingMessages[0]).toMatchObject(message);
        });

        test('should process messages in priority order', async () => {
            const messages: QueuedMessage[] = [
                {
                    id: 'msg-1',
                    type: 'git-operation',
                    payload: { operation: 'commit' },
                    priority: 2
                },
                {
                    id: 'msg-2',
                    type: 'git-operation',
                    payload: { operation: 'push' },
                    priority: 1
                }
            ];

            const processedMessages: QueuedMessage[] = [];
            const processedPromise = new Promise<void>((resolve) => {
                let count = 0;
                const processedHandler = (msg: MessageQueueEvents['message-processed']) => {
                    processedMessages.push(msg);
                    count++;
                    if (count === messages.length) {
                        messageQueue.handlers.get('message-processed')?.delete(processedHandler);
                        resolve();
                    }
                };
                messageQueue.on('message-processed', processedHandler);
            });

            // Enqueue messages in reverse priority order
            await messageQueue.enqueue(messages[0]); // Lower priority (2)
            await messageQueue.enqueue(messages[1]); // Higher priority (1)

            await messageQueue.processQueue();
            await processedPromise;

            expect(processedMessages).toHaveLength(2);
            expect(processedMessages[0].id).toBe('msg-2'); // Higher priority (1) processed first
            expect(processedMessages[1].id).toBe('msg-1');
        });

        test('should handle concurrent message processing', async () => {
            const messages: QueuedMessage[] = Array.from({ length: 5 }, (_, i) => ({
                id: `msg-${i}`,
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            }));

            const processedMessages: QueuedMessage[] = [];
            const processedPromise = new Promise<void>((resolve) => {
                let count = 0;
                const processedHandler = (msg: MessageQueueEvents['message-processed']) => {
                    processedMessages.push(msg);
                    count++;
                    if (count === messages.length) {
                        messageQueue.handlers.get('message-processed')?.delete(processedHandler);
                        resolve();
                    }
                };
                messageQueue.on('message-processed', processedHandler);
            });

            // Enqueue all messages concurrently
            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            await messageQueue.processQueue();
            await processedPromise;

            expect(processedMessages).toHaveLength(messages.length);
            expect(new Set(processedMessages.map(m => m.id)).size).toBe(messages.length);
        });
    });

    describe('Event Integration', () => {
        test('should emit events through EventHandler', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            const eventPromise = new Promise<any>((resolve, reject) => {
                let timeoutId: NodeJS.Timeout;
                const handler = (data: any) => {
                    console.log('Event handler received:', data);
                    clearTimeout(timeoutId);
                    eventHandler.off('git-operation', handler);
                    resolve(data);
                };

                console.log('Registering event handler');
                eventHandler.on('git-operation', handler);
                
                timeoutId = setTimeout(() => {
                    console.log('Event handler timeout');
                    eventHandler.off('git-operation', handler);
                    reject(new Error('Event handler timeout'));
                }, 10000);
            });

            const processedPromise = new Promise<void>((resolve, reject) => {
                let timeoutId: NodeJS.Timeout;
                const processedHandler = () => {
                    console.log('Process handler received message');
                    clearTimeout(timeoutId);
                    messageQueue.handlers.get('message-processed')?.delete(processedHandler);
                    resolve();
                };

                console.log('Registering process handler');
                messageQueue.on('message-processed', processedHandler);
                
                timeoutId = setTimeout(() => {
                    console.log('Process handler timeout');
                    messageQueue.handlers.get('message-processed')?.delete(processedHandler);
                    reject(new Error('Process handler timeout'));
                }, 10000);
            });

            try {
                console.log('Enqueueing message');
                await messageQueue.enqueue(message);
                console.log('Processing queue');
                await messageQueue.processQueue();

                console.log('Waiting for promises');
                const [eventData] = await Promise.all([
                    eventPromise.catch(error => {
                        console.error('Event promise error:', error);
                        throw error;
                    }),
                    processedPromise.catch(error => {
                        console.error('Process promise error:', error);
                        throw error;
                    })
                ]);

                console.log('Promises resolved');
                expect(eventData).toMatchObject(message.payload);
            } catch (error) {
                console.error('Test error:', error);
                // Clean up handlers in case of error
                messageQueue.handlers.clear();
                throw error;
            }
        }, 10000);
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle message processing failures', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'invalid' },
                priority: 1
            };

            const errorPromise = new Promise<MessageQueueEvents['message-error']>((resolve) => {
                const errorHandler = (error: MessageQueueEvents['message-error']) => {
                    messageQueue.handlers.get('message-error')?.delete(errorHandler);
                    resolve(error);
                };
                messageQueue.on('message-error', errorHandler);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const errorEvent = await errorPromise;
            expect(errorEvent.messageId).toBe(message.id);

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('failed');
        });

        test('should retry failed messages with backoff', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            let attempts = 0;
            const retryEvents: MessageQueueEvents['message-retry'][] = [];
            
            const handlers = {
                processing: (msg: MessageQueueEvents['message-processing']) => {
                    attempts++;
                    if (attempts === 1) {
                        throw new Error('Temporary failure');
                    }
                },
                retry: (event: MessageQueueEvents['message-retry']) => {
                    retryEvents.push(event);
                }
            };

            const processedPromise = new Promise<void>((resolve) => {
                const processedHandler = () => {
                    // Cleanup handlers
                    messageQueue.handlers.get('message-processing')?.delete(handlers.processing);
                    messageQueue.handlers.get('message-retry')?.delete(handlers.retry);
                    messageQueue.handlers.get('message-processed')?.delete(processedHandler);
                    resolve();
                };
                
                messageQueue.on('message-processing', handlers.processing);
                messageQueue.on('message-retry', handlers.retry);
                messageQueue.on('message-processed', processedHandler);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();
            await processedPromise;

            expect(attempts).toBe(2);
            expect(retryEvents).toHaveLength(1);
            expect(retryEvents[0].retryCount).toBe(1);
            
            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('processed');
        });

        test('should handle retry delays in test environment', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'invalid' },
                priority: 1
            };

            const retryEvents: MessageQueueEvents['message-retry'][] = [];
            const failedPromise = new Promise<void>((resolve) => {
                const handlers = {
                    retry: (event: MessageQueueEvents['message-retry']) => {
                        retryEvents.push(event);
                    },
                    error: () => {
                        // Cleanup handlers
                        messageQueue.handlers.get('message-retry')?.delete(handlers.retry);
                        messageQueue.handlers.get('message-error')?.delete(handlers.error);
                        resolve();
                    }
                };

                messageQueue.on('message-retry', handlers.retry);
                messageQueue.on('message-error', handlers.error);
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();
            await failedPromise;

            expect(retryEvents.length).toBeGreaterThan(0);
            expect(retryEvents[0].retryCount).toBe(1);
            
            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage?.status).toBe('failed');
        });

        test('should handle concurrent messages with different priorities', async () => {
            const messages: QueuedMessage[] = [
                { id: 'msg-1', type: 'git-operation', payload: { operation: 'commit' }, priority: 2 },
                { id: 'msg-2', type: 'git-operation', payload: { operation: 'push' }, priority: 1 },
                { id: 'msg-3', type: 'git-operation', payload: { operation: 'merge' }, priority: -1 }
            ];

            const processedOrder: string[] = [];
            const processedPromise = new Promise<void>((resolve) => {
                let count = 0;
                const processedHandler = (msg: MessageQueueEvents['message-processed']) => {
                    processedOrder.push(msg.id);
                    count++;
                    if (count === messages.length) {
                        messageQueue.handlers.get('message-processed')?.delete(processedHandler);
                        resolve();
                    }
                };
                messageQueue.on('message-processed', processedHandler);
            });

            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            await messageQueue.processQueue();
            await processedPromise;

            expect(processedOrder).toEqual(['msg-3', 'msg-2', 'msg-1']);
        });

        test('should safely process empty queue', async () => {
            const processPromise = messageQueue.processQueue();
            await expect(processPromise).resolves.toBeUndefined();
        });
    });
});