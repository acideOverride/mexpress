module.exports = {
    testRunner: "jest-circus/runner",
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '../..',
    testMatch: [
        '<rootDir>/tests/integration/**/*.test.ts'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true
        }]
    },
    setupFilesAfterEnv: [
        '<rootDir>/jest/jest.mongodb.setup.js',
        '<rootDir>/jest/jest.console-redirect.js'
    ],
    globals: {},
    // Map paths for proper module resolution
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
    }
};