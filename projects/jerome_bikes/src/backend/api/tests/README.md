# Jerome Bikes API Testing Guide

This document provides a comprehensive guide for testing the Jerome Bikes API. It covers test setup, writing tests, and running the test suite.

## Table of Contents

1. [Test Architecture](#test-architecture)
2. [Setting Up Tests](#setting-up-tests)
3. [Writing Tests](#writing-tests)
4. [Running Tests](#running-tests)
5. [Test Reports](#test-reports)
6. [Best Practices](#best-practices)

## Test Architecture

The Jerome Bikes API test suite uses the following technologies:

- **Jest**: Test runner and assertion library
- **Supertest**: HTTP request testing
- **MongoDB Memory Server**: In-memory MongoDB for isolation
- **Jest HTML Reporter**: Visual test results

The tests are organized as follows:

```
/api/tests/
├── helpers.ts            # Test helper functions
├── jest.config.js        # Jest configuration
├── jest.setup.ts         # Global test setup
├── setup.ts              # Test environment setup
├── README.md             # This documentation
└── unit/                 # Unit tests for API components
    ├── controllers/      # Controller tests
    ├── middleware/       # Middleware tests
    └── utils/            # Utility function tests
└── integration/          # Integration tests
    ├── routes/           # Route integration tests
    └── services/         # Service integration tests
└── e2e/                  # End-to-end API tests
```

## Setting Up Tests

### Prerequisites

- Node.js 18+
- npm 7+

### Installation

Run the following command to install dependencies:

```bash
npm install
```

### Environment Configuration

Tests use the `.env.test` configuration. Make sure this file is properly configured for testing.

## Writing Tests

### Test Types

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test interactions between components
3. **E2E Tests**: Test complete API flows

### Test File Structure

Each test file should follow this structure:

```typescript
import { setupApiTest, teardownApiTest } from '../../setup';
import { SuperTest, Test } from 'supertest';
import { Express } from 'express';

describe('Component Name', () => {
  let app: Express;
  let request: SuperTest<Test>;

  beforeAll(async () => {
    // Setup test environment
    const setup = await setupApiTest();
    app = setup.app;
    request = setup.request;
  });

  afterAll(async () => {
    // Cleanup test environment
    await teardownApiTest();
  });

  describe('Function or endpoint name', () => {
    test('should do something specific', async () => {
      // Test code
    });
  });
});
```

### Example Test

Here's an example of a simple API endpoint test:

```typescript
describe('GET /api/v1/bikes', () => {
  test('should return a list of bikes', async () => {
    // 1. Setup test data
    const bike = new Bike({
      name: 'Test Bike',
      type: 'Mountain',
      status: 'available'
    });
    await bike.save();

    // 2. Make request
    const response = await request
      .get('/api/v1/bikes')
      .expect(200);
    
    // 3. Assertions
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThan(0);
    
    // 4. Specific data validation
    const bikes = response.body.data;
    const testBike = bikes.find(b => b.name === 'Test Bike');
    expect(testBike).toBeDefined();
    expect(testBike.type).toBe('Mountain');
  });
});
```

## Running Tests

### All Tests

```bash
npm run test:api
```

### Specific Tests

```bash
# Run unit tests only
npm run test:api -- --testPathPattern=unit

# Run a specific test file
npm run test:api -- --testPathPattern=routes/bike.test.ts

# Run tests with a specific name pattern
npm run test:api -- -t "GET /api/v1/bikes"
```

### Watch Mode

```bash
npm run test:api -- --watch
```

## Test Reports

After running tests, reports are generated in the following locations:

- **HTML Report**: `/test-results/api/test-report.html`
- **JUnit XML**: `/test-results/api/junit.xml`
- **Coverage Report**: `/coverage/api/lcov-report/index.html`

## Best Practices

1. **Isolation**: Tests should be independent and not depend on each other
2. **Mock External Services**: Use mocks for external APIs
3. **Test Coverage**: Aim for at least 80% code coverage
4. **Clean Up**: Always clean up test data and connections after tests
5. **Descriptive Names**: Use clear test names that describe expected behavior
6. **Test Edge Cases**: Include tests for error scenarios and edge cases
7. **Consistent Structure**: Follow the established test structure
8. **Use Test Helpers**: Reuse setup code in helper functions
9. **Keep Tests Fast**: Optimize tests to run quickly
10. **Use Test Database**: Never run tests against production databases