/** @type {import('jest').Config} */
module.exports = {
    testRunner: "jest-circus/runner",
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        "target": "ES2018",
        "module": "CommonJS",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node"
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: [
    "<rootDir>/../../../.."
  ],
  modulePaths: [
    "<rootDir>/../../../.."
  ],
  collectCoverage: false
};