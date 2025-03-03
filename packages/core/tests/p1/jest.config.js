module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/p1/**/*.test.ts'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    testTimeout: 15000, // 15 seconds for P1 tests
    setupFilesAfterEnv: [
        '../../jest/jest.mongodb.setup.js',
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
