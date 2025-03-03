# mExpress Test Instructions

This document provides a guide for running tests in the mExpress project.

## Test Organization

Tests are organized by priority levels:

- **P0**: Critical path tests (essential for core functionality)
- **P1**: Important feature tests (need to pass for milestone delivery)
- **P2**: Secondary features and edge cases
- **P3**: Performance, stress, and non-functional tests

## Recent Assessment

As of March 1, 2025:
- 7 of 40 tests are passing (17.5%)
- All API tests are working (100%)
- 1 of 4 customer management tests are working (25%)
- Other components (message queue, product catalog, infrastructure) need fixes

## Running Tests

### Standard Test Commands

```bash
# Run all tests
npm run test

# Run tests by priority
npm run test:p0
npm run test:p1
npm run test:p2
npm run test:p3

# Run a specific test file
npx jest --config packages/core/jest.config.js path/to/test.test.ts
```

### Simplified Test Configuration

For tests with path resolution issues, we've created a simplified Jest configuration:

```bash
# Run with simplified configuration
npx jest --config packages/core/jest.simplified.config.js path/to/test.test.ts
```

### Running Specific Components

We have scripts to run tests for specific components:

```bash
# Run API tests
packages/core/scripts/run-individual-tests.sh "packages/core/tests/p0/api/*.test.ts"

# Run message queue tests
packages/core/scripts/run-individual-tests.sh "packages/core/tests/p?/core/message*.test.ts"

# Run customer service tests
packages/core/scripts/run-individual-tests.sh "packages/core/tests/p?/services/customer*.test.ts"
```

## Test Results

All test results are now consolidated in:
`/opt/mExpress/tests/results/test-runs/`

The current test status is documented in:
`/opt/mExpress/tests/validation/test-status.md`

## Common Issues and Fixes

### Import Path Issues

The most common test failures are related to incorrect import paths. These typically manifest as:

```
Cannot find module '../../../../src/git-workflow-automation/src/core/message-queue/message-queue-v2'
```

To fix these:
1. Update the import paths to use module aliases where possible
2. Make sure Jest moduleNameMapper is correctly configured

### Module Not Found Errors

Many tests fail with:

```
Cannot find module '@mexpress/core/lib/monitoring'
```

These can be fixed by:
1. Ensuring the module exists in the specified path
2. Updating the Jest configuration to correctly map module aliases
3. Creating proper mock implementations

## Transaction Tests

For running transaction-related tests, use the dedicated script with increased timeout:

```bash
chmod +x packages/core/scripts/run-single-test.sh
packages/core/scripts/run-single-test.sh packages/core/tests/p0/core/transaction-rollback.test.ts
```

### Transaction Test Fixes

Key fixes for transaction tests:
- Always use array syntax for create operations with sessions: `Model.create([doc], { session })`
- Make sure to await all transaction operations
- Properly handle aborted transactions
- Use MongoDB replica set for transaction support (even in test environment)