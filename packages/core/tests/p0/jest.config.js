module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/p0/**/*.test.ts',
        '**/p0/**/*.test.js'
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
    testTimeout: 30000, // 30 seconds for P0 tests
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
    // Fix module resolution with comprehensive mappings
    moduleNameMapper: {
        // Core module path aliases
        '^@mexpress/core/(.*)$': '<rootDir>/../../src/$1',
        // Direct path mappings to main implementation
        '^../../../../src/core/event-system/(.*)$': '<rootDir>/../../src/core/event-system/$1',
        '^../../../../src/core/message-queue/(.*)$': '<rootDir>/../../src/core/message-queue/$1',
        // Fix API import paths
        '^../../../src/api/(.*)$': '<rootDir>/../../src/api/$1',
        // Fix service import paths
        '^../../../../src/services/(.*)$': '<rootDir>/../../src/services/$1',
        '^../../../services/(.*)$': '<rootDir>/../../src/services/$1',
        '^../../services/(.*)$': '<rootDir>/../../services/$1',
        // Fix model import paths
        '^../../../../src/models/(.*)$': '<rootDir>/../../src/models/$1',
        '^../../models/(.*)$': '<rootDir>/../../src/models/$1',
        // Fix utils import paths
        '^../../../../src/utils/(.*)$': '<rootDir>/../../src/utils/$1',
        // Fix client lib import paths
        '^../../../../src/lib/(.*)$': '<rootDir>/../../src/lib/$1',
        '^../../../lib/(.*)$': '<rootDir>/../../lib/$1',
        '^../../lib/(.*)$': '<rootDir>/../../lib/$1'
    },
    rootDir: './',
    moduleDirectories: ['node_modules', '../../src', '../../node_modules'],
    // Adjusting the test environment
    testEnvironmentOptions: {
        mongodbMemoryServerOptions: {
            instance: {
                dbName: 'mexpress_test',
                port: 27017,
                ip: '127.0.0.1'
            },
            binary: {
                version: '4.4.1', // Use a specific MongoDB version
                skipMD5: true
            },
            autoStart: false
        }
    }
};