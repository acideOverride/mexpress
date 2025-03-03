// Core package Jest configuration
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'core',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  
  // Test matching
  testMatch: [
    '<rootDir>/unit/**/*.test.ts',
    '<rootDir>/unit/**/*.test.tsx',
    '<rootDir>/unit/**/*.spec.ts',
    '<rootDir>/unit/**/*.spec.tsx',
    '<rootDir>/integration/**/*.test.ts'
  ],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/helpers/setup.ts'
  ],
  
  // Module name mapping
  moduleNameMapper: {
    // Map package imports to source files
    '^@mexpress/core/(.*)$': '<rootDir>/../../../packages/core/src/$1',
    '^@/(.*)$': '<rootDir>/../../../packages/core/src/$1',
    
    // Handle static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 
      '<rootDir>/__mocks__/styleMock.js'
  },
  
  // Transform settings
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: false
    }]
  },
  
  // Extensions to use
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Coverage collection
  collectCoverageFrom: [
    '../../../packages/core/src/**/*.{ts,tsx}',
    '!../../../packages/core/src/**/*.d.ts',
    '!../../../packages/core/src/**/*.stories.{ts,tsx}'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Performance settings
  maxWorkers: '50%',
  
  // Error handling
  errorOnDeprecated: true
};