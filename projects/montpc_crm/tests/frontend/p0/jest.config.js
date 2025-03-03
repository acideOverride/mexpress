/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "../../../frontend/tsconfig.json"
    }]
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/../../../frontend/src/$1"
  },
  testRegex: ".*\\.test\\.[jt]sx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  verbose: true
};