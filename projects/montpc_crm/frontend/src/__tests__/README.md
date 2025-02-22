# Frontend Test Organization

This directory contains frontend tests organized by priority levels as defined in our testing standards.

## Priority Categories

### P0 - Critical Tests
- Location: `p0/`
- Purpose: Core UI functionality and critical user flows
- Resource Limits:
  * Max Duration: 5 seconds
  * Max Memory: 512MB
  * Concurrency: Sequential execution

### P1 - High Priority Tests
- Location: `p1/`
- Purpose: High-impact user interactions and business flows
- Resource Limits:
  * Max Duration: 10 seconds
  * Max Memory: 1GB
  * Concurrency: 2 concurrent tests

### P2 - Medium Priority Tests
- Location: `p2/`
- Purpose: Important UI features and components
- Resource Limits:
  * Max Duration: 20 seconds
  * Max Memory: 1.5GB
  * Concurrency: 3 concurrent tests

### P3 - Low Priority Tests
- Location: `p3/`
- Purpose: Edge cases and visual refinements
- Resource Limits:
  * Max Duration: 30 seconds
  * Max Memory: 2GB
  * Concurrency: 4 concurrent tests

## Directory Structure
```
__tests__/
  ├── p0/
  │   ├── core/       # Core UI functionality tests
  │   ├── flows/      # Critical user flow tests
  │   └── forms/      # Critical form validation tests
  │
  ├── p1/
  │   ├── business/   # Business logic tests
  │   └── integration/# Component integration tests
  │
  ├── p2/
  │   ├── features/   # Feature tests
  │   └── components/ # Individual component tests
  │
  └── p3/
      ├── edge/       # Edge cases
      ├── visual/     # Visual regression tests
      └── performance/# Non-critical performance tests
```

## Test Execution
Tests are executed based on their priority level, with P0 tests running first and sequentially. Resource monitoring and performance baselines are enforced through Jest configuration.

## Frontend-Specific Notes
- DOM cleanup is enforced after each test
- Memory monitoring includes DOM node count
- Visual tests use screenshot comparison
- Performance tests include render timing