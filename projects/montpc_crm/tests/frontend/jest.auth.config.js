/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  displayName: 'montpc-auth',
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  rootDir: "../../",
  setupFilesAfterEnv: [
    "<rootDir>/frontend/src/setupTests.ts"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "<rootDir>/frontend/tsconfig.json",
      isolatedModules: true
    }]
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/frontend/src/$1"
  },
  testMatch: [
    "**/tests/frontend/**/*.test.tsx"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules", "<rootDir>/frontend/node_modules", "<rootDir>/node_modules"],
  verbose: true
};