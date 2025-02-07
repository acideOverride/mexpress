/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: false // Disable verbose diagnostics
    }]
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*'
  ],
  coverageDirectory: 'logs', // Changed from 'coverage' to 'logs' per protocol
  coverageReporters: ['text-summary'], // Simplified reporters for token efficiency
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  verbose: false, // Disable verbose output
  silent: true, // Enable silent mode
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}