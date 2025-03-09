/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testRunner: "jest-circus/runner",
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '.*.test.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};