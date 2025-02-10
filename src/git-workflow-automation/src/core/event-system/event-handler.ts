/**
 * Event Handler Interface
 * 
 * Provides a type-safe event handling system for the application.
 * Supports asynchronous event emission and handling.
 */

export interface EventHandlerInterface {
    emit(event: string, data: unknown): Promise<void>;
    on(event: string, handler: (data: unknown) => void | Promise<void>): void;
    off(event: string, handler: (data: unknown) => void | Promise<void>): void;
    hasHandler(event: string): boolean;
}

export class EventHandler implements EventHandlerInterface {
    private handlers: Map<string, Set<(data: unknown) => void | Promise<void>>> = new Map();

    /**
     * Validate event name
     * @private
     * @param event - Name of the event to validate
     * @returns True if event name is valid
     */
    private _validateEventName(event: string): boolean {
        return Boolean(event && typeof event === 'string' && event.trim() !== '');
    }

    /**
     * Emit an event with associated data
     * 
     * @param event - The event name to emit
     * @param data - The data to pass to event handlers
     * @throws {Error} If event name is missing or invalid
     */
    async emit(event: string, data: unknown): Promise<void> {
        if (!this._validateEventName(event)) {
            throw new Error('Event name is required');
        }

        const eventHandlers = this.handlers.get(event);
        if (!eventHandlers) return;

        const promises = Array.from(eventHandlers).map(handler => handler(data));
        await Promise.all(promises);
    }

    /**
     * Register an event handler
     * 
     * @param event - The event name to listen for
     * @param handler - The handler function to call when event is emitted
     * @throws {Error} If event name is missing or handler is not a function
     */
    on(event: string, handler: (data: unknown) => void | Promise<void>): void {
        if (!this._validateEventName(event)) {
            throw new Error('Event name is required');
        }
        if (typeof handler !== 'function') {
            throw new Error('Event handler must be a function');
        }

        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);
    }

    /**
     * Remove an event handler
     * 
     * @param event - The event name to remove handler from
     * @param handler - The handler function to remove
     */
    off(event: string, handler: (data: unknown) => void | Promise<void>): void {
        // Silently handle invalid inputs
        if (!this._validateEventName(event) || !handler || !this.handlers.has(event)) {
            return;
        }

        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.delete(handler);
            // Clean up empty handler sets
            if (handlers.size === 0) {
                this.handlers.delete(event);
            }
        }
    }

    /**
     * Check if an event has any registered handlers
     * 
     * @param event - The event name to check
     * @returns True if the event has handlers
     */
    hasHandler(event: string): boolean {
        return this.handlers.has(event) && this.handlers.get(event)!.size > 0;
    }
}