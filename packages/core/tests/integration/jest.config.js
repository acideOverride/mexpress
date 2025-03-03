module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '../..',
    testMatch: [
        '<rootDir>/tests/integration/**/*.test.ts'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    setupFilesAfterEnv: [
        '<rootDir>/jest/jest.mongodb.setup.js',
        '<rootDir>/jest/jest.console-redirect.js'
    ],
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    testTimeout: 30000, // 30 seconds for integration tests
    silent: false,
    verbose: true,
    // Use the simplified reporter for consistent output
    reporters: [
        'default',
        '<rootDir>/jest/jest.simplified.reporter.js'
    ],
    // Add the resource monitor to track memory usage
    watchPlugins: [
        '<rootDir>/jest/jest.resource-monitor.js'
    ],
    // Map paths for proper module resolution
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
    }
};
