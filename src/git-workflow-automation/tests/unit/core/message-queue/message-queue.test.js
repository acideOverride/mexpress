const { MessageQueue } = require('../../../../src/core/message-queue/message-queue');
const { EventHandler } = require('../../../../src/core/event-system/event-handler');

describe('MessageQueue', () => {
    let messageQueue;
    let eventHandler;

    beforeEach(() => {
        eventHandler = new EventHandler();
        messageQueue = new MessageQueue(eventHandler);
    });

    afterEach(async () => {
        await messageQueue.cleanup();
    });

    afterAll(async () => {
        await messageQueue?.cleanup();
    });

    describe('Queue Operations', () => {
        test('should enqueue a message with correct priority', async () => {
            const message = {
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
            const messages = [
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

            await messageQueue.enqueue(messages[0]);
            await messageQueue.enqueue(messages[1]);

            const processedMessages = [];
            messageQueue.on('message-processed', (msg) => {
                processedMessages.push(msg);
            });

            await messageQueue.processQueue();

            expect(processedMessages).toHaveLength(2);
            expect(processedMessages[0].id).toBe('msg-2'); // Higher priority (1) processed first
            expect(processedMessages[1].id).toBe('msg-1');
        });

        test('should handle concurrent message processing', async () => {
            const messages = Array.from({ length: 5 }, (_, i) => ({
                id: `msg-${i}`,
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            }));

            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            
            const processedMessages = [];
            messageQueue.on('message-processed', (msg) => {
                processedMessages.push(msg);
            });

            await messageQueue.processQueue();

            expect(processedMessages).toHaveLength(messages.length);
            expect(new Set(processedMessages.map(m => m.id)).size).toBe(messages.length);
        });

        test('should process messages within 100ms', async () => {
            const message = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            const start = Date.now();
            await messageQueue.enqueue(message);
            await messageQueue.processQueue();
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(100);
        });
    });

    describe('Event Integration', () => {
        test('should emit events through EventHandler', async () => {
            const message = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            const eventPromise = new Promise(resolve => {
                eventHandler.on('git-operation', (data) => {
                    resolve(data);
                });
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const eventData = await eventPromise;
            expect(eventData).toMatchObject(message.payload);
        });
    });

    describe('Cache Integration', () => {
        test('should store message state in distributed cache', async () => {
            const message = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            await messageQueue.enqueue(message);
            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage).toMatchObject(message);
        });

        test('should update message state in cache after processing', async () => {
            const message = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();
            
            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage.status).toBe('processed');
        });
    });

    describe('Error Handling', () => {
        test('should handle message processing failures', async () => {
            const message = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'invalid' },
                priority: 1
            };

            const errorPromise = new Promise(resolve => {
                messageQueue.on('message-error', (error) => resolve(error));
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const errorEvent = await errorPromise;
            expect(errorEvent).not.toBeNull();
            expect(errorEvent.messageId).toBe(message.id);

            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage.status).toBe('failed');
        });

        test('should retry failed messages with backoff', async () => {
            const message = {
                id: 'msg-1',
                type: 'git-operation',
                payload: { operation: 'commit' },
                priority: 1
            };

            let attempts = 0;
            const processPromise = new Promise((resolve, reject) => {
                messageQueue.on('message-processing', () => {
                    attempts++;
                    if (attempts === 1) {
                        throw new Error('Temporary failure');
                    }
                    resolve();
                });
            });

            const processedPromise = new Promise(resolve => {
                messageQueue.on('message-processed', () => resolve());
            });

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();
            await Promise.race([
                processPromise,
                processedPromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);

            expect(attempts).toBe(2);
            const cachedMessage = await messageQueue.getCachedMessage(message.id);
            expect(cachedMessage.status).toBe('processed');
        });
    });
});