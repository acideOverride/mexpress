/**
 * Main Jest configuration file for mExpress core package
 * This configuration sets up the test environment for all tests
 */
module.exports = {
    displayName: 'core',
    preset: '../../jest.preset.js',
    // Define projects for all priority levels
    projects: [
        '<rootDir>/tests/p0/jest.config.js',
        '<rootDir>/tests/p1/jest.config.js',
        '<rootDir>/tests/p2/jest.config.js',
        '<rootDir>/tests/p3/jest.config.js',
        '<rootDir>/tests/integration/jest.config.js'
    ],
    testEnvironment: 'node',
    // Legacy test paths - keep for backward compatibility
    testMatch: [
        '<rootDir>/tests/unit/**/*.test.ts',
        '<rootDir>/tests/integration/**/*.test.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/jest/jest.mongodb.setup.js',
        '<rootDir>/jest/jest.console-redirect.js'
    ],
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '\!src/**/*.d.ts',
        '\!src/**/index.ts',
        '\!**/node_modules/**',
        '\!**/__tests__/**'
    ],
    coverageDirectory: '<rootDir>/tests/results/coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    // Add reporters for better output
    reporters: [
        'default',
        ['<rootDir>/jest/jest.simplified.reporter.js', {}]
    ],
    // Resource monitoring
    watchPlugins: ['<rootDir>/jest/jest.resource-monitor.js'],
    // Test execution settings
    silent: false,
    verbose: true,
    maxWorkers: 1,
    // MongoDB specific settings
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    testTimeout: 10000
};
