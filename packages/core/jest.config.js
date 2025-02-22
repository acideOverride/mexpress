module.exports = {
    displayName: 'core',
    preset: '../../jest.preset.js',
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/tests/unit/**/*.test.ts',
        '<rootDir>/tests/integration/**/*.test.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/jest/jest.mongodb.setup.js'
    ],
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    // Test execution settings
    silent: true,
    verbose: false,
    maxWorkers: 1,
    // MongoDB specific settings
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    testTimeout: 10000
};