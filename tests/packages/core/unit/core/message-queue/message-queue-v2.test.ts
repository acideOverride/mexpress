import { EventHandler } from '../../../../src/core/event-system/event-handler';
import { MessageQueue } from '../../../../src/core/message-queue/message-queue-v2';
import { QueuedMessage } from '../../../../src/core/message-queue/types';

describe('MessageQueue V2', () => {
    let messageQueue: MessageQueue;
    let eventHandler: EventHandler;
    let events: any[] = [];

    beforeEach(() => {
        events = [];
        eventHandler = {
            emit: jest.fn().mockImplementation((event, data) => {
                events.push({ event, data });
                return Promise.resolve();
            })
        } as any;
        messageQueue = new MessageQueue(eventHandler);
    });

    afterEach(async () => {
        await messageQueue.cleanup();
    });

    describe('Queue Operations', () => {
        test('should process messages successfully', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'test',
                payload: {}
            };

            await messageQueue.enqueue(message);
            await messageQueue.processQueue();

            const cached = await messageQueue.getCachedMessage(message.id);
            expect(cached?.status).toBe('processed');
            expect(cached?.processedAt).toBeDefined();

            const processedEvents = events.filter(e => e.event === 'message-processed');
            expect(processedEvents).toHaveLength(1);
        });

        test('should handle max retries exceeded', async () => {
            const message: QueuedMessage = {
                id: 'msg-1',
                type: 'test',
                payload: { operation: 'invalid' }
            };

            await messageQueue.enqueue(message);

            // Process multiple times to exceed retries
            for (let i = 0; i < 4; i++) {
                await messageQueue.processQueue();
            }

            const cached = await messageQueue.getCachedMessage(message.id);
            expect(cached?.status).toBe('failed');
            expect(cached?.failedAt).toBeDefined();
            expect(cached?.error).toBe('Invalid operation');

            const errorEvents = events.filter(e => e.event === 'message-error');
            expect(errorEvents).toHaveLength(1);
        });

        test('should handle concurrent processing with failures', async () => {
            const messages: QueuedMessage[] = [
                { id: 'msg-1', type: 'test', payload: {} },
                { id: 'msg-2', type: 'test', payload: { operation: 'invalid' } },
                { id: 'msg-3', type: 'test', payload: {} },
                { id: 'msg-4', type: 'test', payload: { operation: 'invalid' } },
                { id: 'msg-5', type: 'test', payload: {} }
            ];

            // Enqueue all messages
            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));

            // Process queue multiple times
            for (let i = 0; i < 4; i++) {
                await messageQueue.processQueue();
            }

            // Verify successful messages
            const successIds = ['msg-1', 'msg-3', 'msg-5'];
            for (const id of successIds) {
                const msg = await messageQueue.getCachedMessage(id);
                expect(msg?.status).toBe('processed');
            }

            // Verify failed messages
            const failedIds = ['msg-2', 'msg-4'];
            for (const id of failedIds) {
                const msg = await messageQueue.getCachedMessage(id);
                expect(msg?.status).toBe('failed');
            }

            const processedEvents = events.filter(e => e.event === 'message-processed');
            expect(processedEvents).toHaveLength(3);

            const errorEvents = events.filter(e => e.event === 'message-error');
            expect(errorEvents).toHaveLength(2);
        });

        test('should handle message priorities', async () => {
            const messages: QueuedMessage[] = [
                { id: 'msg-1', type: 'test', payload: {}, priority: 2 },
                { id: 'msg-2', type: 'test', payload: {}, priority: 1 },
                { id: 'msg-3', type: 'test', payload: {}, priority: 3 }
            ];

            // Enqueue all messages
            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));

            const pendingMessages = await messageQueue.getPendingMessages();
            expect(pendingMessages[0].id).toBe('msg-2'); // Priority 1
            expect(pendingMessages[1].id).toBe('msg-1'); // Priority 2
            expect(pendingMessages[2].id).toBe('msg-3'); // Priority 3
        });

        test('should handle cleanup properly', async () => {
            const messages: QueuedMessage[] = [
                { id: 'msg-1', type: 'test', payload: {} },
                { id: 'msg-2', type: 'test', payload: { operation: 'invalid' } }
            ];

            // Enqueue and start processing
            await Promise.all(messages.map(msg => messageQueue.enqueue(msg)));
            await messageQueue.processQueue();

            // Cleanup
            await messageQueue.cleanup();

            // Verify all messages are processed
            for (const msg of messages) {
                const cached = await messageQueue.getCachedMessage(msg.id);
                expect(cached?.status).toBe('processed');
            }

            // Verify queue is empty
            const pendingMessages = await messageQueue.getPendingMessages();
            expect(pendingMessages).toHaveLength(0);
        });
    });
});
