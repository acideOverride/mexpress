// Temporary fix to make the test pass
const fs = require('fs');
const path = require('path');

// Define the correct paths
const testPath = '/opt/mExpress/packages/utils/tests/p1/lib/resilience/retry-strategy.test.ts';
const utilsPath = '/opt/mExpress/packages/utils/src/lib/resilience/retry-strategy.ts';

// Read the source file and the test file
const sourceFile = fs.readFileSync(utilsPath, 'utf8');
const testFile = fs.readFileSync(testPath, 'utf8');

// Fix the import in the test file
const fixedTestFile = testFile.replace(
  /^import \{ RetryStrategy \} from .*$/m,
  `import { RetryStrategy } from '../../../../src/lib/resilience/retry-strategy';`
);

// Write the fixed file
fs.writeFileSync(testPath, fixedTestFile);

// Output success
console.log('Fixed retry-strategy.test.ts');