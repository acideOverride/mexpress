module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
      jsx: 'react-jsx'
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/../../../frontend/src/$1'
  },
  modulePaths: ['<rootDir>/../../../frontend/src/'],
  moduleDirectories: ['node_modules', '<rootDir>/../../../frontend/src/'],
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '.*.test.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true
};