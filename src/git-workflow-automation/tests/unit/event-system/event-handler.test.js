const { EventHandler } = require('../../../src/core/event-system/event-handler');

describe('EventHandler', () => {
    describe('Event Registration', () => {
        test('should register an event handler successfully', () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventHandler = jest.fn();

            // Act
            handler.on(eventName, eventHandler);

            // Assert
            expect(handler.hasHandler(eventName)).toBe(true);
        });

        test('should throw error when registering handler without event name', () => {
            // Arrange
            const handler = new EventHandler();
            const eventHandler = jest.fn();

            // Act & Assert
            expect(() => handler.on(null, eventHandler))
                .toThrow('Event name is required');
        });

        test('should throw error when registering invalid handler', () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';

            // Act & Assert
            expect(() => handler.on(eventName, null))
                .toThrow('Event handler must be a function');
        });

        test('should throw error when registering with empty event name', () => {
            // Arrange
            const handler = new EventHandler();
            const eventHandler = jest.fn();

            // Act & Assert
            expect(() => handler.on('', eventHandler))
                .toThrow('Event name is required');
        });

        test('should throw error when registering with whitespace event name', () => {
            // Arrange
            const handler = new EventHandler();
            const eventHandler = jest.fn();

            // Act & Assert
            expect(() => handler.on('   ', eventHandler))
                .toThrow('Event name is required');
        });
    });

    describe('Event Emission', () => {
        test('should emit event to registered handler', async () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);

            // Act
            await handler.emit(eventName, eventData);

            // Assert
            expect(eventHandler).toHaveBeenCalledWith(eventData);
        });

        test('should handle multiple handlers for same event', async () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventData = { test: 'data' };
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            handler.on(eventName, handler1);
            handler.on(eventName, handler2);

            // Act
            await handler.emit(eventName, eventData);

            // Assert
            expect(handler1).toHaveBeenCalledWith(eventData);
            expect(handler2).toHaveBeenCalledWith(eventData);
        });

        test('should handle emission of event with no handlers', async () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventData = { test: 'data' };

            // Act & Assert
            await expect(handler.emit(eventName, eventData)).resolves.toBeUndefined();
        });

        test('should handle emission of event with undefined data', async () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);

            // Act
            await handler.emit(eventName, undefined);

            // Assert
            expect(eventHandler).toHaveBeenCalledWith(undefined);
        });

        test('should throw error when emitting with invalid event name', async () => {
            // Arrange
            const handler = new EventHandler();

            // Act & Assert
            await expect(handler.emit(null, {}))
                .rejects.toThrow('Event name is required');
        });

        test('should throw error when emitting with whitespace event name', async () => {
            // Arrange
            const handler = new EventHandler();

            // Act & Assert
            await expect(handler.emit('   ', {}))
                .rejects.toThrow('Event name is required');
        });
    });

    describe('Handler Management', () => {
        test('should return false for hasHandler with non-existent event', () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'non.existent';

            // Act & Assert
            expect(handler.hasHandler(eventName)).toBe(false);
        });

        test('should handle removal of event handler', () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventHandler = jest.fn();
            handler.on(eventName, eventHandler);

            // Act
            handler.off(eventName, eventHandler);

            // Assert
            expect(handler.hasHandler(eventName)).toBe(false);
        });

        test('should handle removal of non-existent handler', () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const eventHandler = jest.fn();

            // Act & Assert
            expect(() => handler.off(eventName, eventHandler)).not.toThrow();
        });

        test('should handle removal with invalid event name', () => {
            // Arrange
            const handler = new EventHandler();
            const eventHandler = jest.fn();

            // Act & Assert
            expect(() => handler.off(null, eventHandler)).not.toThrow();
        });

        test('should handle multiple handler removals correctly', () => {
            // Arrange
            const handler = new EventHandler();
            const eventName = 'test.event';
            const handler1 = jest.fn();
            const handler2 = jest.fn();
            handler.on(eventName, handler1);
            handler.on(eventName, handler2);

            // Act
            handler.off(eventName, handler1);

            // Assert
            expect(handler.hasHandler(eventName)).toBe(true);
            handler.off(eventName, handler2);
            expect(handler.hasHandler(eventName)).toBe(false);
        });
    });
});