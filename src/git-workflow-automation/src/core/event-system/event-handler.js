/**
 * EventHandler class for managing event-driven operations
 * Part of BRQ-2025-003 Git Workflow Automation
 */
class EventHandler {
    constructor() {
        this.handlers = new Map();
    }

    /**
     * Validate event name
     * @private
     * @param {string} eventName - Name of the event to validate
     * @returns {boolean} True if event name is valid
     */
    _validateEventName(eventName) {
        return eventName && typeof eventName === 'string' && eventName.trim() !== '';
    }

    /**
     * Register an event handler
     * @param {string} eventName - Name of the event to handle
     * @param {Function} handler - Function to handle the event
     * @throws {Error} If eventName is missing or handler is not a function
     */
    on(eventName, handler) {
        if (!this._validateEventName(eventName)) {
            throw new Error('Event name is required');
        }
        if (typeof handler !== 'function') {
            throw new Error('Event handler must be a function');
        }

        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, new Set());
        }
        this.handlers.get(eventName).add(handler);
    }

    /**
     * Unregister an event handler
     * @param {string} eventName - Name of the event to unregister
     * @param {Function} handler - Handler function to remove
     */
    off(eventName, handler) {
        // Silently handle invalid inputs
        if (!this._validateEventName(eventName) || !handler || !this.handlers.has(eventName)) {
            return;
        }

        const handlers = this.handlers.get(eventName);
        handlers.delete(handler);
        
        // Clean up empty handler sets
        if (handlers.size === 0) {
            this.handlers.delete(eventName);
        }
    }

    /**
     * Check if an event has any registered handlers
     * @param {string} eventName - Name of the event to check
     * @returns {boolean} True if the event has handlers
     */
    hasHandler(eventName) {
        return this.handlers.has(eventName) && this.handlers.get(eventName).size > 0;
    }

    /**
     * Emit an event with data to all registered handlers
     * @param {string} eventName - Name of the event to emit
     * @param {*} data - Data to pass to the handlers
     * @returns {Promise<void>} Promise that resolves when all handlers complete
     * @throws {Error} If eventName is missing
     */
    async emit(eventName, data) {
        if (!this._validateEventName(eventName)) {
            throw new Error('Event name is required');
        }

        if (!this.handlers.has(eventName)) {
            return;
        }

        const handlers = this.handlers.get(eventName);
        const promises = Array.from(handlers).map(handler => handler(data));
        await Promise.all(promises);
    }
}

module.exports = { EventHandler };