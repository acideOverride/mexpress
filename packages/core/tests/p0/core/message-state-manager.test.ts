import { EventHandler } from '../../../../src/core/event-system/event-handler';
import { MessageStateManager } from '../../../../src/core/message-queue/message-state-manager';
import { QueuedMessage, MessageStatus } from '../../../../src/core/message-queue/types';

describe('MessageStateManager', () => {
    let stateManager: MessageStateManager;
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
        stateManager = new MessageStateManager(eventHandler);
    });

    describe('State Transitions', () => {
        const testMessage: QueuedMessage = {
            id: 'test-1',
            type: 'test',
            payload: {},
            status: 'pending'
        };

        beforeEach(async () => {
            await stateManager.updateCache(testMessage.id, testMessage);
        });

        test('should transition from pending to processing', async () => {
            const result = await stateManager.transitionToProcessing(testMessage);
            expect(result.success).toBe(true);
            expect(result.message?.status).toBe('processing');
            
            const cached = stateManager.getCachedMessage(testMessage.id);
            expect(cached?.status).toBe('processing');
            
            expect(events).toHaveLength(1);
            expect(events[0].event).toBe('state-transition');
            expect(events[0].data.fromState).toBe('pending');
            expect(events[0].data.toState).toBe('processing');
        });

        test('should handle retry with remaining attempts', async () => {
            await stateManager.transitionToProcessing(testMessage);
            const error = new Error('Test error');
            const result = await stateManager.transitionToRetry(testMessage, error);

            expect(result.success).toBe(true);
            expect(result.message?.status).toBe('retry');
            expect(result.message?.retryCount).toBe(1);
            expect(stateManager.isInRetryQueue(testMessage.id)).toBe(true);

            const cached = stateManager.getCachedMessage(testMessage.id);
            expect(cached?.status).toBe('retry');
            expect(cached?.retryCount).toBe(1);
            expect(cached?.error).toBe(error.message);

            expect(events).toHaveLength(3); // state-transition to processing, state-transition to retry, message-retry
            expect(events[2].event).toBe('message-retry');
            expect(events[2].data.retryCount).toBe(1);
        });

        test('should transition to failed when max retries exceeded', async () => {
            await stateManager.transitionToProcessing(testMessage);
            const error = new Error('Test error');

            // Simulate max retries
            for (let i = 0; i < 3; i++) {
                await stateManager.transitionToRetry(testMessage, error);
                await stateManager.transitionToProcessing(testMessage);
            }

            // Set retry count to max and status to processing
            const updatedMessage = {
                ...testMessage,
                status: 'processing' as MessageStatus,
                retryCount: 3 // maxRetries is 3
            };
            await stateManager.updateCache(testMessage.id, updatedMessage);

            // Next retry should transition to failed
            const result = await stateManager.transitionToRetry(updatedMessage, error);
            expect(result.success).toBe(true);
            expect(result.message?.status).toBe('failed');
            expect(stateManager.isInRetryQueue(testMessage.id)).toBe(false);

            const cached = stateManager.getCachedMessage(testMessage.id);
            expect(cached?.status).toBe('failed');
            expect(cached?.failedAt).toBeDefined();
            expect(cached?.error).toBe(error.message);

            const errorEvents = events.filter(e => e.event === 'message-error');
            expect(errorEvents).toHaveLength(1);
        });

        test('should transition to processed state', async () => {
            await stateManager.transitionToProcessing(testMessage);
            const result = await stateManager.transitionToProcessed(testMessage);

            expect(result.success).toBe(true);
            expect(result.message?.status).toBe('processed');
            expect(result.message?.processedAt).toBeDefined();
            expect(stateManager.isInRetryQueue(testMessage.id)).toBe(false);

            const cached = stateManager.getCachedMessage(testMessage.id);
            expect(cached?.status).toBe('processed');
            expect(cached?.processedAt).toBeDefined();

            const processedEvents = events.filter(e => e.event === 'message-processed');
            expect(processedEvents).toHaveLength(1);
        });

        test('should prevent invalid state transitions', async () => {
            // Try to transition to processed without processing first
            const result = await stateManager.transitionToProcessed(testMessage);
            expect(result.success).toBe(false);
            expect(result.error?.message).toContain('Invalid state transition');

            const cached = stateManager.getCachedMessage(testMessage.id);
            expect(cached?.status).toBe('pending');
        });

        test('should handle concurrent state transitions', async () => {
            // Start multiple transitions
            const transitions = [
                stateManager.transitionToProcessing(testMessage),
                stateManager.transitionToProcessing(testMessage),
                stateManager.transitionToProcessing(testMessage)
            ];

            const results = await Promise.all(transitions);
            const successCount = results.filter(r => r.success).length;
            expect(successCount).toBe(1); // Only one should succeed

            const cached = stateManager.getCachedMessage(testMessage.id);
            expect(cached?.status).toBe('processing');
        });
    });
});