import '@jest/globals';
import type { MessageQueue } from '../src/core/message-queue/message-queue';
import type { EventHandler } from '../src/core/event-system/event-handler';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            expect: typeof expect;
            testMessageQueue: MessageQueue | undefined;
            activeTimeouts: Set<NodeJS.Timeout>;
            activeIntervals: Set<NodeJS.Timeout>;
        }
    }

    var testMessageQueue: MessageQueue | undefined;
    var activeTimeouts: Set<NodeJS.Timeout>;
    var activeIntervals: Set<NodeJS.Timeout>;
}

// Export Jest globals
export { expect, jest, test, describe, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

// Initialize global resource tracking
global.activeTimeouts = new Set();
global.activeIntervals = new Set();

// Override timer functions to track resources
const originalSetTimeout = global.setTimeout;
const originalSetInterval = global.setInterval;
const originalClearTimeout = global.clearTimeout;
const originalClearInterval = global.clearInterval;

type TimerCallback = (...args: any[]) => void;

const trackingSetTimeout = function(callback: TimerCallback, ms?: number, ...args: any[]): NodeJS.Timeout {
    const timeout = originalSetTimeout(callback, ms, ...args);
    global.activeTimeouts.add(timeout);
    return timeout;
} as typeof global.setTimeout;

const trackingSetInterval = function(callback: TimerCallback, ms?: number, ...args: any[]): NodeJS.Timeout {
    const interval = originalSetInterval(callback, ms, ...args);
    global.activeIntervals.add(interval);
    return interval;
} as typeof global.setInterval;

const trackingClearTimeout = function(timeoutId: NodeJS.Timeout | number | string | undefined): void {
    if (timeoutId) {
        if (timeoutId instanceof Object) {
            global.activeTimeouts.delete(timeoutId as NodeJS.Timeout);
        }
    }
    originalClearTimeout(timeoutId);
} as typeof global.clearTimeout;

const trackingClearInterval = function(intervalId: NodeJS.Timeout | number | string | undefined): void {
    if (intervalId) {
        if (intervalId instanceof Object) {
            global.activeIntervals.delete(intervalId as NodeJS.Timeout);
        }
    }
    originalClearInterval(intervalId);
} as typeof global.clearInterval;

global.setTimeout = trackingSetTimeout;
global.setInterval = trackingSetInterval;
global.clearTimeout = trackingClearTimeout;
global.clearInterval = trackingClearInterval;

// Message Queue Test Utilities
export const setupMessageQueueTest = async (eventHandler?: EventHandler): Promise<MessageQueue> => {
    await cleanupMessageQueueTest(); // Ensure cleanup before setup
    
    // Using require instead of import for runtime loading of implementation
    const { MessageQueue: MessageQueueImpl } = require('../src/core/message-queue/message-queue');
    const queue = new MessageQueueImpl(eventHandler);
    
    try {
        if (typeof queue.initialize === 'function') {
            await queue.initialize();
        }
        global.testMessageQueue = queue;
        return queue;
    } catch (error) {
        await cleanupMessageQueueTest(); // Cleanup on error
        throw error;
    }
};

export const cleanupMessageQueueTest = async (): Promise<void> => {
    const queue = global.testMessageQueue;
    if (queue) {
        try {
            await queue.cleanup();
        } catch (error) {
            console.error('Error during queue cleanup:', error);
        } finally {
            global.testMessageQueue = undefined;
        }
    }

    // Cleanup all tracked resources
    global.activeTimeouts.forEach(timeout => {
        try {
            clearTimeout(timeout);
        } catch (error) {
            console.error('Error clearing timeout:', error);
        }
    });
    global.activeTimeouts.clear();

    global.activeIntervals.forEach(interval => {
        try {
            clearInterval(interval);
        } catch (error) {
            console.error('Error clearing interval:', error);
        }
    });
    global.activeIntervals.clear();
};

// Global test setup
beforeEach(async () => {
    await cleanupMessageQueueTest();
});

afterEach(async () => {
    await cleanupMessageQueueTest();
});

// Cleanup after all tests
afterAll(async () => {
    await cleanupMessageQueueTest();
});

// Error handlers
process.on('unhandledRejection', (error: Error) => {
    console.error('Unhandled Promise Rejection:', error);
    cleanupMessageQueueTest().finally(() => process.exit(1));
});

process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    cleanupMessageQueueTest().finally(() => process.exit(1));
});