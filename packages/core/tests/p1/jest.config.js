module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/p1/**/*.test.{ts,tsx}'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
                esModuleInterop: true
            }
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testTimeout: 15000, // 15 seconds for P1 tests
    setupFilesAfterEnv: [
        '../../jest/jest.console-redirect.js',
        '<rootDir>/setupTests.ts'
    ],
    // Use the simplified reporter for consistent output
    reporters: [
        'default',
        '../../jest/jest.simplified.reporter.js'
    ],
    // Add the resource monitor to track memory usage
    watchPlugins: [
        '../../jest/jest.resource-monitor.js'
    ],
    // Map paths for proper module resolution
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/../../src/$1'
    }
};
