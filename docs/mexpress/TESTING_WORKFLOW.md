# mExpress Testing Workflow

This document outlines the recommended test-driven development (TDD) workflow for the mExpress platform. Following these steps ensures proper test documentation, implementation, and tracking.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test-Driven Development Workflow](#test-driven-development-workflow)
3. [Test Documentation Process](#test-documentation-process)
4. [Test Organization](#test-organization)
5. [Test Status Management](#test-status-management)
6. [Common Testing Patterns](#common-testing-patterns)

## Testing Philosophy

The mExpress platform follows these testing principles:

1. **Test First**: Write tests before implementing features.
2. **Comprehensive Coverage**: Aim for 80%+ test coverage for all components.
3. **Priority-Based Testing**: Organize tests by priority (P0-P3) based on criticality.
4. **BRQ Mapping**: Every test should map to a specific Business Requirement Query (BRQ).
5. **Automated Verification**: Tests should be automated and repeatable.
6. **Documentation Driven**: Test status should be tracked in documentation.

## Test-Driven Development Workflow

### Full TDD Workflow

1. **Document First**
   - Add test entry to TESTS.md with status "Planned" (📅)
   - Include metadata (priority, BRQ mapping, location)
   - Specify expected behavior and acceptance criteria

2. **Test Second**
   - Create test file in canonical location (/tests/packages/...)
   - Implement test for expected behavior
   - Run test to verify it fails (confirms test is working)

3. **Implement Third**
   - Implement the feature or fix the bug
   - Focus on making the test pass, not perfect code

4. **Refactor Fourth**
   - Improve implementation while keeping tests passing
   - Optimize, simplify, and clean up code

5. **Document Fifth**
   - Update TESTS.md with new status (Passing ✅ or Failing ❌)
   - Add any notes or issues encountered
   - Update test metadata if needed

### Quick Workflow for Bug Fixes

For urgent bug fixes:

1. Create test that reproduces the bug
2. Fix the bug so the test passes
3. Update documentation afterwards

## Test Documentation Process

### Recording a New Test

Add the following to TESTS.md **before** creating the test:

```markdown
## Component/Feature Name

status | file | location | issue
-------|------|----------|-------
📅 | tests/packages/core/unit/component/component-name.test.ts | 📍 | Not implemented
```

Include the test in the appropriate BRQ section:

```markdown
### In Progress BRQs (partial completion)
| BRQ ID | Description | Tests | Priority | Success Rate |
|--------|-------------|-------|----------|-------------|
| MEXP-2025-XXX-YY | Component Name | 3 | P1 | 66.7% |
```

### Updating Test Status

After the test is implemented and passing, update TESTS.md:

```markdown
## Component/Feature Name

status | file | location | issue
-------|------|----------|-------
✅ | tests/packages/core/unit/component/component-name.test.ts | 📍 | PASSED
```

Update the BRQ summary:

```markdown
### Completed BRQs (100%)
| BRQ ID | Description | Tests | Priority | Success Rate |
|--------|-------------|-------|----------|-------------|
| MEXP-2025-XXX-YY | Component Name | 3 | P1 | 100% |
```

### Test Grouping

Group tests in TESTS.md by:
1. BRQ status (Completed, In Progress, Not Started)
2. Component or feature area
3. Priority level (P0-P3)

## Test Organization

### Directory Structure

- Place tests in the canonical location from the start:

```
/tests/
├── packages/
│   ├── core/
│   │   ├── integration/      # Integration tests
│   │   └── unit/             # Unit tests
│   ├── ui-components/        # UI component tests
│   └── utils/                # Utility tests
└── projects/
    └── montpc_crm/           # Project-specific tests
```

### Priority Levels

When adding tests, assign the appropriate priority:

- **P0**: Critical path tests for core functionality
- **P1**: Important features essential for milestone delivery
- **P2**: Secondary features and edge cases
- **P3**: Performance, stress tests, and non-functional requirements

The priority should be reflected in both the file path and TESTS.md.

## Test Status Management

### Status Indicators

Use these status indicators consistently:

- ✅ Passing - Test is passing and validated
- ❌ Failing - Test is failing and needs attention
- ❓ Hanging - Test times out or doesn't complete
- 📅 Planned - Test is documented but not implemented
- ⏩ Skipped - Test is skipped with documented reason

### Location Indicators

- 📍 Canonical - Test is in the correct location
- 🔄 Move Needed - Test needs to be moved to canonical location

## Common Testing Patterns

### Unit Test Template

```typescript
import { describe, it, expect } from 'vitest'
import { ComponentName } from './component-name'

describe('ComponentName', () => {
  it('should have expected behavior', () => {
    // Arrange
    const component = new ComponentName()
    
    // Act
    const result = component.method()
    
    // Assert
    expect(result).toBe(expectedValue)
  })
})
```

### Vue Component Test Template

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ComponentName from './ComponentName.vue'

describe('ComponentName', () => {
  it('renders correctly', () => {
    const wrapper = mount(ComponentName, {
      props: {
        propName: 'value'
      }
    })
    
    expect(wrapper.text()).toContain('Expected text')
  })
})
```

### API Test Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { apiFunction } from './api'

describe('API Function', () => {
  const server = setupServer(
    rest.get('/api/endpoint', (req, res, ctx) => {
      return res(ctx.json({ data: 'test' }))
    })
  )
  
  beforeEach(() => server.listen())
  afterEach(() => server.resetHandlers())
  
  it('fetches data correctly', async () => {
    const result = await apiFunction()
    expect(result).toEqual({ data: 'test' })
  })
})
```

## Test Automation

### Running Tests

Use these commands for running tests:

```bash
# Run all tests
npm run test

# Run tests by priority
npm run test:p0
npm run test:p1

# Run a specific test with output redirection
npx jest path/to/test.test.ts > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"
```

### CI Integration

- Tests are automatically run in CI pipeline
- Test status is reported to dashboard
- Failed tests block PR merges

## Conclusion

Following this testing workflow ensures:

1. Comprehensive test coverage
2. Clear test documentation
3. Consistent test organization
4. Reliable test status tracking
5. Test-driven development principles

Remember: **Document, Test, Implement, Refactor, Document** is the core workflow.