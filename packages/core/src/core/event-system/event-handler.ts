/**
 * Event Handler System for the mExpress platform
 * Provides a pub-sub pattern implementation with support for async event handlers
 */

type EventHandlerFunction = (data?: any) => any;

export class EventHandler {
  private handlers: Map<string, Set<EventHandlerFunction>> = new Map();

  /**
   * Register an event handler
   * @param eventName Name of the event to listen for
   * @param handler Function to execute when event is emitted
   */
  public on(eventName: string, handler: EventHandlerFunction): void {
    this.validateEventName(eventName);
    this.validateHandler(handler);

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Set());
    }

    this.handlers.get(eventName)!.add(handler);
  }

  /**
   * Unregister an event handler
   * @param eventName Name of the event
   * @param handler Function to remove
   */
  public off(eventName: string, handler: EventHandlerFunction): void {
    // For removal, we don't need to throw errors if inputs are invalid
    if (!eventName || typeof eventName !== 'string' || !handler || typeof handler !== 'function') {
      return;
    }
    
    const eventHandlers = this.handlers.get(eventName);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      
      // Clean up the map if no handlers left
      if (eventHandlers.size === 0) {
        this.handlers.delete(eventName);
      }
    }
  }

  /**
   * Emit an event to all registered handlers
   * @param eventName Name of the event to emit
   * @param data Data to pass to event handlers
   * @returns Promise that resolves when all handlers have executed
   */
  public async emit(eventName: string, data?: any): Promise<void> {
    this.validateEventName(eventName);

    const eventHandlers = this.handlers.get(eventName);
    if (!eventHandlers || eventHandlers.size === 0) {
      return;
    }

    // Execute all handlers and wait for them to complete
    const promises = Array.from(eventHandlers).map(handler => {
      try {
        const result = handler(data);
        return result instanceof Promise ? result : Promise.resolve(result);
      } catch (error) {
        return Promise.reject(error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Check if an event has any registered handlers
   * @param eventName Name of the event to check
   * @returns true if event has handlers, false otherwise
   */
  public hasHandler(eventName: string): boolean {
    const handlers = this.handlers.get(eventName);
    return !!handlers && handlers.size > 0;
  }

  /**
   * Validate event name
   * @param eventName Event name to validate
   * @throws Error if event name is invalid
   */
  private validateEventName(eventName: string): void {
    if (!eventName || typeof eventName !== 'string' || eventName.trim() === '') {
      throw new Error('Event name is required');
    }
  }

  /**
   * Validate event handler function
   * @param handler Handler function to validate
   * @throws Error if handler is invalid
   */
  private validateHandler(handler: EventHandlerFunction): void {
    if (!handler || typeof handler !== 'function') {
      throw new Error('Event handler must be a function');
    }
  }
}