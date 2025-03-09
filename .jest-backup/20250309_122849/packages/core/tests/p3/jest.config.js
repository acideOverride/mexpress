module.exports = {
    testRunner: "jest-circus/runner",
    testEnvironment: 'node',
    testMatch: [
        '**/p3/**/*.test.ts'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globals: {},
    setupFilesAfterEnv: [
        '../../jest/jest.mongodb.setup.js',
        '../../jest/jest.console-redirect.js'
    ],
    // Map paths for proper module resolution
    moduleNameMapper: {
        '^@mexpress/core/(.*)$': '<rootDir>/../../src/$1'
    }
};