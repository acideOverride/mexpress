# TDD Workflow Standards (Lite Version)

This document outlines the essential standards for Test-Driven Development (TDD) workflow across all mExpress projects.

## Core TDD Principles

1. **Tests First**: Write tests before implementing code
2. **RED → GREEN → REFACTOR**: Follow the three-phase TDD cycle
3. **Small Increments**: Work in small, verifiable increments
4. **Test Quality**: Tests should be readable, reliable, and meaningful
5. **Consistent Approach**: Apply TDD to all development work

## TDD Workflow Phases

### 1. 🔴 RED Phase

In this phase, you write a failing test that defines the behavior you want to implement.

#### RED Phase Steps

1. **Identify the Requirement**
   - Understand the feature or fix needed
   - Break it down into testable behaviors
   - Determine acceptance criteria

2. **Create a Test File**
   - Place in the appropriate priority directory:
     - `projects/{project}/tests/{test-type}/{priority}/{feature-name}.test.ts`
   - Follow test naming conventions:
     - `ComponentName.test.ts` for components
     - `service-name.service.test.ts` for services
     - `feature-name.integration.test.ts` for integration tests

3. **Write the Test**
   - Describe the expected behavior
   - Include setup, execution, and assertions
   - Use descriptive test names that explain behavior
   - Test should initially fail because implementation doesn't exist

```typescript
// UserAvatar.test.ts
import { mount } from '@vue/test-utils';
import UserAvatar from '@/components/UserAvatar.vue';

describe('UserAvatar.vue', () => {
  it('should display user initials when no image is provided', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        }
      }
    });
    
    expect(wrapper.find('.avatar-initials').text()).toBe('JD');
  });
});
```

4. **Verify Test Failure**
   - Run the test and confirm it fails
   - Understand why it fails
   - Ensure it fails for the expected reason

### 2. 🟢 GREEN Phase

In this phase, you write the minimal implementation code to make the test pass.

#### GREEN Phase Steps

1. **Implement Minimal Code**
   - Write just enough code to pass the test
   - Don't worry about elegance or optimization yet
   - Focus solely on making the test pass

```vue
<!-- UserAvatar.vue -->
<template>
  <div class="avatar">
    <div class="avatar-initials">
      {{ initials }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const initials = computed(() => {
      return `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`;
    });
    
    return {
      initials
    };
  }
});
</script>
```

2. **Run Tests**
   - Execute tests to verify they pass
   - If tests still fail, adjust implementation
   - Do not add functionality beyond what's required by tests

3. **Commit Initial Implementation**
   - Once tests pass, commit your changes
   - Include both test and implementation in the commit
   - Use a descriptive commit message

### 3. 🔵 REFACTOR Phase

In this phase, you improve your code while keeping the tests passing.

#### REFACTOR Phase Steps

1. **Identify Improvements**
   - Look for code duplication
   - Improve naming and readability
   - Optimize performance if needed
   - Enhance structure and organization

2. **Refactor Code**
   - Make improvements one at a time
   - Run tests after each change to ensure they still pass
   - Focus on code quality, not adding new functionality

```vue
<!-- UserAvatar.vue (Refactored) -->
<template>
  <div class="avatar" :class="{ 'has-image': hasImage }">
    <img v-if="hasImage" class="avatar-image" :src="user.imageUrl" :alt="userName" />
    <div v-else class="avatar-initials" :style="{ backgroundColor: avatarColor }">
      {{ initials }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { generateAvatarColor } from '@/utils/colors';

export default defineComponent({
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const hasImage = computed(() => Boolean(props.user.imageUrl));
    
    const userName = computed(() => 
      `${props.user.firstName} ${props.user.lastName}`
    );
    
    const initials = computed(() => 
      `${props.user.firstName.charAt(0)}${props.user.lastName.charAt(0)}`
    );
    
    const avatarColor = computed(() => 
      generateAvatarColor(props.user.email)
    );
    
    return {
      hasImage,
      userName,
      initials,
      avatarColor
    };
  }
});
</script>
```

3. **Additional Tests**
   - Add edge case tests
   - Test error scenarios
   - Add performance tests if needed

4. **Final Commit**
   - Commit refactored code
   - Include additional tests
   - Document significant refactorings

## CHECKLIST.md Documentation

Document your TDD workflow in the CHECKLIST.md file, organizing tasks by TDD phase:

```markdown
# Component Implementation Checklist

## Current Documentation Status:
- A: ARCHITECTURE.md - Section 6.2 UI Components
- M: MILESTONES.md - MS-PROJ-003 User Interface
- T: TASKS.md - TASK-PROJ-042 Implement User Avatar

## Implementation Tasks

## 🔴 RED PHASE: Test Creation

- [✅] **Create UserAvatar.test.ts**
  - [✅] Test initials display
  - [✅] Test image display when available
  - [✅] Test avatar color generation
  - [✅] Test accessibility attributes

## 🟢 GREEN PHASE: Implementation

- [✅] **Create UserAvatar component**
  - [✅] Implement basic avatar structure
  - [✅] Add initials display logic
  - [✅] Add image display support
  - [✅] Implement conditional rendering

## 🔵 REFACTOR PHASE: Optimization and Testing

- [✅] **Optimize component**
  - [✅] Extract reusable logic to composables
  - [✅] Improve color generation algorithm
  - [✅] Add responsive sizing
- [✅] **Enhance tests**
  - [✅] Add edge case tests
  - [✅] Test accessibility
```

## Testing Principles

### Test Quality

- **Readability**: Tests should be easy to understand
- **Independence**: Tests should not depend on each other
- **Speed**: Tests should execute quickly
- **Consistency**: Tests should produce the same results every time
- **Coverage**: Tests should cover all critical paths

### Test Organization

- **Priority-Based**: Organize tests by priority (p0-p3)
- **Type-Based**: Separate unit, integration, and E2E tests
- **Feature-Based**: Group tests by feature or component

### Test Naming

- **Description**: Test names should describe the behavior being tested
- **Conditions**: Include conditions being tested
- **Expected Results**: Clarify expected outcomes

```typescript
// Good test names
it('should display user initials when no image is provided', () => {});
it('should apply error state when validation fails', () => {});
it('should emit selection-change event when an item is selected', () => {});

// Poor test names
it('initials test', () => {});
it('tests the component', () => {});
it('works correctly', () => {});
```

## TDD in Different Contexts

### Vue Component TDD

1. **Test Component Props**
   - Test default values
   - Test prop validation
   - Test reactivity to prop changes

2. **Test Component Rendering**
   - Test conditional rendering
   - Test dynamic content
   - Test component structure

3. **Test Component Behavior**
   - Test event handling
   - Test user interactions
   - Test side effects

### Service TDD

1. **Test Service Interface**
   - Test method signatures
   - Test parameter validation
   - Test return values

2. **Test Service Logic**
   - Test business rules
   - Test error handling
   - Test edge cases

3. **Test Service Integration**
   - Test interactions with other services
   - Test external API calls
   - Test error propagation

### API Endpoint TDD

1. **Test Request Handling**
   - Test parameter validation
   - Test authentication/authorization
   - Test content type handling

2. **Test Response Handling**
   - Test success responses
   - Test error responses
   - Test status codes

3. **Test Business Logic**
   - Test endpoint-specific logic
   - Test integration with services
   - Test data transformation

## Common TDD Pitfalls

1. **Skipping the RED Phase**
   - Always write a failing test first
   - Verify that the test fails for the expected reason
   - Do not implement code before having a failing test

2. **Implementing Too Much**
   - Write only enough code to pass the test
   - Avoid adding features not covered by tests
   - Add functionality incrementally

3. **Weak Assertions**
   - Use specific assertions
   - Test actual behavior, not implementation details
   - Ensure tests would fail if behavior breaks

4. **Brittle Tests**
   - Avoid testing implementation details
   - Test behavior, not internal structure
   - Use test doubles appropriately

5. **Ignoring the REFACTOR Phase**
   - Always take time to improve code quality
   - Refactor both production code and test code
   - Run tests frequently during refactoring

## Test Fixtures and Mocks

### Test Data

- Create realistic test data
- Use factories for complex objects
- Share common test data across related tests

```typescript
// User factory for tests
function createTestUser(overrides = {}) {
  return {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roles: ['user'],
    ...overrides
  };
}

// In tests
const user = createTestUser({ roles: ['admin', 'user'] });
```

### Mocks and Stubs

- Mock external dependencies
- Use typed mocks
- Only mock what's necessary

```typescript
// Typed mock for a service
const userServiceMock: jest.Mocked<UserService> = {
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

// Stub specific method behavior
userServiceMock.getUser.mockResolvedValue(createTestUser());
```

## Integration with CI/CD

- Run tests automatically on code changes
- Fail builds when tests fail
- Include test coverage reports
- Track TDD compliance through metrics