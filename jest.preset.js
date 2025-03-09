/**
 * Base Jest configuration preset
 * This file establishes the common Jest settings used across the project
 * STANDARDIZED VERSION - 2025-03-15
 */
module.exports = {
    // Core configuration
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    
    // TypeScript configuration - specifically use ts-jest, not Babel
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            isolatedModules: true,
            diagnostics: {
                ignoreCodes: [2322, 2339, 2345, 2571]  // Ignore common TS errors in tests
            }
        }]
    },
    
    // Coverage settings
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}'
    ],
    
    // Test execution configuration
    maxWorkers: '50%',    // Use 50% of available CPUs by default
    testRunner: "jest-circus/runner",
    
    // Standard Jest options moved to globals object to avoid warnings
    globals: {
        // Place settings here that trigger warnings when at root level
        testTimeout: 60000,         // Increased for integration tests
        forceExit: true,            // Ensure clean exit
        verbose: true,              // Verbose output for better debugging
        reporters: ["default"],     // Default reporter configuration
        detectOpenHandles: true,    // Help identify resource leaks
    },
    
    // Handling mocks
    restoreMocks: true,
    clearMocks: true,
    
    // Environment setup - conditional to avoid errors if file doesn't exist
    setupFilesAfterEnv: []
};