/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    testTimeout: 120000, // Increased timeout for retry tests
    slowTestThreshold: 60000, // Increased threshold for slow tests
    maxWorkers: 1, // Run tests sequentially to avoid timing issues
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx)',
        '**/?(*.)+(spec|test).+(ts|tsx)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            diagnostics: {
                ignoreCodes: ['TS2571']
            },
            isolatedModules: true
        }]
    },
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
        '!src/**/*.d.ts'
    ],
    coverageThreshold: {
        global: {
            statements: 95,
            branches: 95,
            functions: 95,
            lines: 95
        }
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    }
};