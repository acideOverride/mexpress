# Test Organization

This directory contains tests organized by priority levels as defined in our testing standards.

## Priority Categories

### P0 - Critical Tests
- Location: `p0/`
- Purpose: Core functionality and critical path tests
- Resource Limits:
  * Max Duration: 5 seconds
  * Max Memory: 512MB
  * Concurrency: Sequential execution

### P1 - High Priority Tests
- Location: `p1/`
- Purpose: High-impact business logic tests
- Resource Limits:
  * Max Duration: 10 seconds
  * Max Memory: 1GB
  * Concurrency: 2 concurrent tests

### P2 - Medium Priority Tests
- Location: `p2/`
- Purpose: Important feature tests
- Resource Limits:
  * Max Duration: 20 seconds
  * Max Memory: 1.5GB
  * Concurrency: 3 concurrent tests

### P3 - Low Priority Tests
- Location: `p3/`
- Purpose: Edge cases and non-critical tests
- Resource Limits:
  * Max Duration: 30 seconds
  * Max Memory: 2GB
  * Concurrency: 4 concurrent tests

## Directory Structure
```
__tests__/
  ├── p0/
  │   ├── core/       # Core functionality tests
  │   ├── api/        # Critical API tests
  │   └── data/       # Data integrity tests
  │
  ├── p1/
  │   ├── business/   # Business logic tests
  │   └── integration/# Key integration tests
  │
  ├── p2/
  │   ├── features/   # Feature tests
  │   └── components/ # Component tests
  │
  └── p3/
      ├── edge/       # Edge cases
      └── performance/# Non-critical performance tests
```

## Test Execution
Tests are executed based on their priority level, with P0 tests running first and sequentially. Resource monitoring and performance baselines are enforced through Jest configuration.