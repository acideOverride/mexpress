module.exports = {
    testRunner: "jest-circus/runner",
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '\\.test\\.tsx?$',
};