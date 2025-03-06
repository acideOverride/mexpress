module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/p2/**/*.test.{ts,tsx,js}'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: '<rootDir>/../../tsconfig.json',
            jsx: 'react'
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    testTimeout: 20000, // 20 seconds for P2 tests
    setupFilesAfterEnv: [
        '../../jest/jest.react.setup.js',
        '../../jest/jest.console-redirect.js'
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