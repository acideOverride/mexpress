"use strict";

// Import test
const testPath = './core/message-queue-recovery.test.ts';

// Custom debug wrapper to see test failures
beforeEach(() => {
  global._currentTest = expect.getState().currentTestName;
  console.log(`Running test: ${global._currentTest}`);
});

afterEach(() => {
  const result = expect.getState().assertionCalls;
  const failures = expect.getState().assertionCallsError;
  console.log(`Test: ${global._currentTest}`);
  console.log(`Assertions: ${result}, Failures: ${failures.length}`);
  
  if (failures.length > 0) {
    console.log('Failure details:');
    failures.forEach((failure, i) => {
      console.log(`  ${i+1}. Expected: ${failure.expected}, Received: ${failure.actual}`);
      console.log(`     Message: ${failure.message}`);
    });
  }
});

// Import the actual test
require(testPath);