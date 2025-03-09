module.exports = {
    testRunner: "jest-circus/runner",
  displayName: 'montpc_crm-frontend',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowJs: true
      }
    }]
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
    '@testing-library/jest-dom'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/tests/**/*.test.{ts,tsx}',
    '<rootDir>/p0/**/*.test.{ts,tsx}',
    '<rootDir>/p1/**/*.test.{ts,tsx}',
    '<rootDir>/p2/**/*.test.{ts,tsx}',
    '<rootDir>/p3/**/*.test.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ]
};