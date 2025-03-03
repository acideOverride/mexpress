# mExpress Core Test Suite

This directory contains the test suite for the mExpress Core package. The tests are organized by priority level (P0-P3) and mapped to BRQ milestones for tracking and reporting.

## Test Structure

Tests are organized in the following directory structure:

```
tests/
  ├── p0/           # Highest priority tests - critical functionality
  ├── p1/           # High priority tests - important functionality
  ├── p2/           # Medium priority tests - secondary functionality
  ├── p3/           # Low priority tests - edge cases and performance
  ├── integration/  # Cross-component integration tests
  ├── results/      # Test result output and reports
  │   ├── p0/       # P0 test results
  │   ├── p1/       # P1 test results
  │   ├── p2/       # P2 test results
  │   ├── p3/       # P3 test results
  │   └── summary/  # Summary reports
  └── __mocks__/    # Mock implementations for testing
```

## Milestone Mapping

Each test file should include a header comment that maps it to a specific BRQ milestone using the following format:

```typescript
/**
 * Component Name Tests
 * MEXP-YYYY-NNN-COMP: Feature Name
 * 
 * Test description and purpose...
 */
```

Where:
- `YYYY` is the year (e.g., 2025)
- `NNN` is the milestone number (e.g., 003)
- `COMP` is the component (BE, FE, API, FULL, INFRA, DOC)

## Running Tests

### Running All Tests

```
npm test
```

### Running Tests by Priority

```
npm run test:p0  # Run P0 tests
npm run test:p1  # Run P1 tests
npm run test:p2  # Run P2 tests
npm run test:p3  # Run P3 tests
```

### Verifying Milestone Mapping

```
npm run test:verify-mapping
```

This will scan all test files and verify that they are properly mapped to milestones, generating a report in `tests/results/summary/`.

## Test Configuration

Each priority level has its own Jest configuration file:

- `tests/p0/jest.config.js`
- `tests/p1/jest.config.js`
- `tests/p2/jest.config.js`
- `tests/p3/jest.config.js`

These configurations set up the appropriate test environment, timeouts, and reporters for each priority level.

## MongoDB Setup

Database tests use MongoDB Memory Server for running tests in an isolated environment. The setup is handled in `jest/jest.mongodb.setup.js`.

## Test Reports

Test results are stored in the `tests/results/` directory, organized by priority level and milestone. Summary reports are generated in `tests/results/summary/`.

## Adding New Tests

When adding new tests:

1. Determine the appropriate priority level (P0-P3)
2. Add the test file to the corresponding directory
3. Include the milestone mapping header
4. Run the verification script to ensure proper mapping

Example test file:

```typescript
/**
 * Customer Service Tests
 * MEXP-2025-004-BE: Core CRUD Functionality
 * 
 * These tests verify the basic CRUD operations for customer management.
 */
describe('Customer Service', () => {
  // Test implementation...
});
```