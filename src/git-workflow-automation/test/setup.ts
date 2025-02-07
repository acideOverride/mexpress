import '@jest/globals';

// Extend global with Jest types
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            expect: typeof expect;
        }
    }
}

// Export Jest globals
export { expect, jest, test, describe, beforeEach, afterEach } from '@jest/globals';