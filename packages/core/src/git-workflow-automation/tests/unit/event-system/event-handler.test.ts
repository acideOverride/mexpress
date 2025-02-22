import { EventHandler } from '../../../src/core/event-system/event-handler';

describe('EventHandler', () => {
    let handler: EventHandler;

    beforeEach(() => {
        handler = new EventHandler();
    });

    describe('Event Registration', () => {
        test('should register an event handler successfully', () => {
            const eventName = 'test.event';
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);
            expect(handler.hasHandler(eventName)).toBe(true);
        });

        test('should throw error when registering handler without event name', () => {
            const eventHandler = jest.fn();
            expect(() => handler.on('', eventHandler))
                .toThrow('Event name is required');
        });

        test('should throw error when registering with null event name', () => {
            const eventHandler = jest.fn();
            expect(() => handler.on(null as any, eventHandler))
                .toThrow('Event name is required');
        });

        test('should throw error when registering with undefined event name', () => {
            const eventHandler = jest.fn();
            expect(() => handler.on(undefined as any, eventHandler))
                .toThrow('Event name is required');
        });

        test('should throw error when registering invalid handler', () => {
            const eventName = 'test.event';
            expect(() => handler.on(eventName, null as any))
                .toThrow('Event handler must be a function');
            expect(() => handler.on(eventName, undefined as any))
                .toThrow('Event handler must be a function');
            expect(() => handler.on(eventName, 'not a function' as any))
                .toThrow('Event handler must be a function');
        });

        test('should throw error when registering with empty event name', () => {
            const eventHandler = jest.fn();
            expect(() => handler.on('', eventHandler))
                .toThrow('Event name is required');
        });

        test('should throw error when registering with whitespace event name', () => {
            const eventHandler = jest.fn();
            expect(() => handler.on('   ', eventHandler))
                .toThrow('Event name is required');
        });

        test('should allow multiple handlers for same event', () => {
            const eventName = 'test.event';
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            
            handler.on(eventName, handler1);
            handler.on(eventName, handler2);
            
            expect(handler.hasHandler(eventName)).toBe(true);
        });
    });

    describe('Event Emission', () => {
        test('should emit event to registered handler', async () => {
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);

            await handler.emit(eventName, eventData);
            expect(eventHandler).toHaveBeenCalledWith(eventData);
        });

        test('should handle multiple handlers for same event', async () => {
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            handler.on(eventName, handler1);
            handler.on(eventName, handler2);

            await handler.emit(eventName, eventData);
            expect(handler1).toHaveBeenCalledWith(eventData);
            expect(handler2).toHaveBeenCalledWith(eventData);
        });

        test('should handle emission of event with no handlers', async () => {
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            await expect(handler.emit(eventName, eventData)).resolves.toBeUndefined();
        });

        test('should handle emission of event with undefined data', async () => {
            const eventName = 'test.event';
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);

            await handler.emit(eventName, undefined);
            expect(eventHandler).toHaveBeenCalledWith(undefined);
        });

        test('should throw error when emitting with invalid event name', async () => {
            await expect(handler.emit(null as any, {}))
                .rejects.toThrow('Event name is required');
            await expect(handler.emit(undefined as any, {}))
                .rejects.toThrow('Event name is required');
            await expect(handler.emit('', {}))
                .rejects.toThrow('Event name is required');
            await expect(handler.emit('   ', {}))
                .rejects.toThrow('Event name is required');
        });

        test('should handle async event handlers', async () => {
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            const result = { processed: true };
            const asyncHandler = jest.fn().mockResolvedValue(result);
            handler.on(eventName, asyncHandler);

            await handler.emit(eventName, eventData);
            expect(asyncHandler).toHaveBeenCalledWith(eventData);
        });

        test('should handle mixed sync and async handlers', async () => {
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            const syncHandler = jest.fn();
            const asyncHandler = jest.fn().mockResolvedValue({ processed: true });
            
            handler.on(eventName, syncHandler);
            handler.on(eventName, asyncHandler);

            await handler.emit(eventName, eventData);
            expect(syncHandler).toHaveBeenCalledWith(eventData);
            expect(asyncHandler).toHaveBeenCalledWith(eventData);
        });
    });

    describe('Handler Management', () => {
        test('should return false for hasHandler with non-existent event', () => {
            const eventName = 'non.existent';
            expect(handler.hasHandler(eventName)).toBe(false);
        });

        test('should handle removal of event handler', () => {
            const eventName = 'test.event';
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);
            handler.off(eventName, eventHandler);
            expect(handler.hasHandler(eventName)).toBe(false);
        });

        test('should handle removal of non-existent handler', () => {
            const eventName = 'test.event';
            const eventHandler = jest.fn();
            expect(() => handler.off(eventName, eventHandler)).not.toThrow();
        });

        test('should handle removal with invalid event name', () => {
            const eventHandler = jest.fn();
            expect(() => handler.off(null as any, eventHandler)).not.toThrow();
            expect(() => handler.off(undefined as any, eventHandler)).not.toThrow();
            expect(() => handler.off('', eventHandler)).not.toThrow();
            expect(() => handler.off('   ', eventHandler)).not.toThrow();
        });

        test('should handle removal with invalid handler', () => {
            const eventName = 'test.event';
            expect(() => handler.off(eventName, null as any)).not.toThrow();
            expect(() => handler.off(eventName, undefined as any)).not.toThrow();
            expect(() => handler.off(eventName, 'not a function' as any)).not.toThrow();
        });

        test('should handle multiple handler removals correctly', () => {
            const eventName = 'test.event';
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            handler.on(eventName, handler1);
            handler.on(eventName, handler2);

            handler.off(eventName, handler1);
            expect(handler.hasHandler(eventName)).toBe(true);
            
            handler.off(eventName, handler2);
            expect(handler.hasHandler(eventName)).toBe(false);
        });

        test('should handle removal of specific handler when multiple exist', () => {
            const eventName = 'test.event';
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            const handler3 = jest.fn();
            
            handler.on(eventName, handler1);
            handler.on(eventName, handler2);
            handler.on(eventName, handler3);

            handler.off(eventName, handler2);
            
            expect(handler.hasHandler(eventName)).toBe(true);
            return handler.emit(eventName, {}).then(() => {
                expect(handler1).toHaveBeenCalled();
                expect(handler2).not.toHaveBeenCalled();
                expect(handler3).toHaveBeenCalled();
            });
        });
    });
});