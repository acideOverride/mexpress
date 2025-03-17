# Implementation Checklist: TASK-GIAN-{TASK-NUMBER} {Next Task Name}

<!-- 
══════════════════════════════════════════════════════════════════════════════
⚠️ DO NOT MODIFY SECTION ⚠️
══════════════════════════════════════════════════════════════════════════════

Checklist documents track task implementation steps and verification.
They are highly mutable during implementation but should follow a strict format.

CHECKLIST COMPLIANCE RULES:

1. Every checklist MUST follow the TDD three-phase structure:
   - 🔴 RED PHASE: Test creation and verification of test failure
   - 🟢 GREEN PHASE: Implementation to make tests pass
   - 🔵 REFACTOR PHASE: Optimization while maintaining passing tests

2. All implementation MUST adhere to the standards-lite framework:
   - /opt/mExpress/docs/standards/lite/COMPONENT_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/API_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/TS_CODE_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/JEST_CONFIGURATION_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/DOCUMENTATION_STANDARDS.md
   - /opt/mExpress/docs/standards/lite/DIRECTORY_STRUCTURE.md
   - /opt/mExpress/docs/standards/lite/TDD_WORKFLOW.md
   - /opt/mExpress/docs/standards/lite/CI_CD_STANDARDS.md

3. Upon task completion, this checklist MUST be archived to:
   - /opt/mExpress/docs/giandra_photos/checklist_history/CHECKLIST-{TASK-ID}-{Task-Name}-{YYYYMMDD}.md

4. This checklist MUST be updated after each implementation step with:
   - ✅ for completed items
   - ⏭️ for deferred items
   - Debugging notes and observations

These rules are immutable and form the foundation for the implementation process.

══════════════════════════════════════════════════════════════════════════════
-->

## Current Documentation Status
- **A**: ARCHITECTURE.md - [Section to be determined based on next task]
- **M**: MILESTONES.md - [Milestone to be determined based on next task]
- **T**: TASKS.md - [Task to be determined when assigned]
- **Test Status**: See [TESTS_STATUS_ENHANCED.md](/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md)

## Previous Implementation Reference
- [ ] Check checklist history: `/opt/mExpress/docs/giandra_photos/checklist_history/`
- [ ] Search command: `grep -r "[keyword]" /opt/mExpress/docs/giandra_photos/checklist_history/`
- [ ] Relevant history files:
  - [List any relevant history files here]

## Git Setup (FIRST STEP)
- [ ] Create feature branch from appropriate milestone branch:
  ```bash
  git checkout milestone/MS-GIAN-{MILESTONE-NUMBER}-{milestone-name}
  git checkout -b feature/GIAN-2025-{NUMBER}-{COMPONENT}-{component-name}
  ```
- [ ] Initial commit with CHECKLIST.md creation:
  ```bash
  git add docs/giandra_photos/TASKS.md docs/giandra_photos/CHECKLIST.md
  git commit -m "task(TASK-GIAN-{TASK-NUMBER}): start {task-name} implementation"
  ```

## Component Registry Check (FIRST STEP)
- [ ] Check `/opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md` for existing component entries
- [ ] Search command: `grep -i "[search terms]" /opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md`
- [ ] List reusable components already in registry:
  - [Component 1] ([Status]) - Already in registry
  - [Component 2] ([Status]) - Already in registry
  - [Component 3] ([Status]) - Already in registry
- [ ] Check `/opt/mExpress/docs/mexpress/SHARED_COMPONENTS.md` for quick reference

## 📋 MANDATORY TESTING STANDARDS

The following standards documents MUST be followed for all test creation and execution:

- [ ] Review `/opt/mExpress/docs/__claude__/prompts/CLAUDE_TEST_PROMPT.md` for test creation instructions
- [ ] Follow `/opt/mExpress/docs/standards/lite/JEST_CONFIGURATION_STANDARDS.md` for Jest configuration
- [ ] Implement tests according to `/opt/mExpress/docs/standards/lite/TDD_WORKFLOW.md` TDD workflow
- [ ] Ensure code complies with `/opt/mExpress/docs/standards/lite/TS_CODE_STANDARDS.md` TypeScript standards

### Key Testing Requirements
- [ ] Tests MUST be organized by priority (P0-P3) in appropriate directories
- [ ] All Jest configurations MUST extend from `/opt/mExpress/jest.preset.js`
- [ ] Test file locations MUST follow standard patterns:
  - **Frontend Components**: `projects/giandra_photos/tests/frontend/{priority}/{component-name}.test.tsx`
  - **Backend Services**: `projects/giandra_photos/tests/backend/{priority}/services/{service-name}.service.test.ts`
  - **API Tests**: `projects/giandra_photos/tests/api/{priority}/{endpoint-name}.api.test.ts`
- [ ] NEVER create tests in source code directories (e.g., `/src/components/{component-name}/__tests__/`)
- [ ] Use standardized test commands:
  - Priority-based: `PRIORITY=p0 npx jest --config=projects/giandra_photos/jest.config.js`
  - Type-based: `TEST_TYPE=integration npx jest --config=projects/giandra_photos/jest.config.js`
  - Package-specific: `./scripts/test_scripts/run-all-tests.sh --giandra --p0`
- [ ] Redirect large test outputs: `{test-command} > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"`

## 🔴 RED PHASE: Test Creation

### Test Planning
- [ ] **Define test strategy for component/feature**
  - [ ] Determine test types needed (unit, integration, e2e)
  - [ ] Identify test priorities (P0, P1, P2, P3)
  - [ ] Plan test directory structure following standards
  - [ ] Define test coverage requirements

### Test Structure Setup
- [ ] **Create test directory structure**
  - [ ] Create test files in appropriate locations:
    - P0 tests: [P0 test path]
    - P1 tests: [P1 test path]
    - Integration tests: [Integration test path]

### Unit Test Creation
- [ ] **Implement unit tests**
  - [ ] Create test file: [test file path]
  - [ ] Implement test suite structure with describe blocks
  - [ ] Write test for functionality 1
  - [ ] Write test for functionality 2
  - [ ] Write test for functionality 3
  - [ ] Add edge case tests
  - [ ] Add error handling tests

### Integration Test Creation
- [ ] **Implement integration tests**
  - [ ] Create test file: [test file path]
  - [ ] Set up test fixtures and mocks
  - [ ] Write test for integration scenario 1
  - [ ] Write test for integration scenario 2

### Test Execution (RED)
- [ ] **Verify tests fail correctly**
  - [ ] Run P0 tests: `PRIORITY=p0 npx jest --config=projects/giandra_photos/jest.config.js`
  - [ ] Run P1 tests: `PRIORITY=p1 npx jest --config=projects/giandra_photos/jest.config.js`
  - [ ] Run integration tests: `TEST_TYPE=integration npx jest --config=projects/giandra_photos/jest.config.js`
  - [ ] Confirm all tests fail for expected reasons
  - [ ] Verify test output matches expected format
  - [ ] Document failures in TESTS_STATUS_ENHANCED.md

- [ ] **Commit test files**:
  - [ ] Stage test files: `git add projects/giandra_photos/tests/`
  - [ ] Commit: `git commit -m "test({component}): add tests for {feature}"`

## 🟢 GREEN PHASE: Implementation

### Environment Setup
- [ ] **Configure development environment**
  - [ ] Install necessary dependencies
  - [ ] Set up build configuration
  - [ ] Configure linting and formatting

### Core Implementation
- [ ] **Implement component/feature**
  - [ ] Create file structure: [file path]
  - [ ] Implement functionality 1
  - [ ] Implement functionality 2
  - [ ] Implement functionality 3
  - [ ] Add error handling
  - [ ] Add validation

### Integration Implementation
- [ ] **Connect with other components**
  - [ ] Implement integration with component 1
  - [ ] Implement integration with component 2
  - [ ] Set up event handling between components

### Test Execution (GREEN)
- [ ] **Verify tests pass**
  - [ ] Run P0 tests: `PRIORITY=p0 npx jest --config=projects/giandra_photos/jest.config.js`
  - [ ] Run P1 tests: `PRIORITY=p1 npx jest --config=projects/giandra_photos/jest.config.js`
  - [ ] Run integration tests: `TEST_TYPE=integration npx jest --config=projects/giandra_photos/jest.config.js`
  - [ ] Confirm all tests now pass
  - [ ] Verify test coverage meets requirements
  - [ ] Update TESTS_STATUS_ENHANCED.md with passing status

- [ ] **Commit implementation**:
  - [ ] Stage implementation files: `git add projects/giandra_photos/src/`
  - [ ] Commit: `git commit -m "feat({component}): implement {feature}"`

## 🔵 REFACTOR PHASE: Optimization

### Code Quality Improvements
- [ ] **Refactor for readability and maintainability**
  - [ ] Review variable and function naming
  - [ ] Extract repeated logic into helper methods
  - [ ] Simplify complex conditional logic
  - [ ] Remove unnecessary code and comments

### Performance Optimization
- [ ] **Optimize for performance**
  - [ ] Identify performance bottlenecks
  - [ ] Optimize expensive operations
  - [ ] Reduce unnecessary re-renders (for UI components)
  - [ ] Implement caching where appropriate

### Final Verification
- [ ] **Final test suite execution**
  - [ ] Run all tests: `./scripts/test_scripts/run-all-tests.sh --giandra --p0 --p1`
  - [ ] Verify all tests still pass after refactoring
  - [ ] Measure and document performance improvements
  - [ ] Confirm test output is redirected properly
  - [ ] Verify test status is correctly recorded in TESTS_STATUS_ENHANCED.md

- [ ] **Commit refactoring**:
  - [ ] Stage refactored files: `git add projects/giandra_photos/src/`
  - [ ] Commit: `git commit -m "refactor({component}): optimize {feature}"`

### Documentation Updates
- [ ] **Update documentation**
  - [ ] Add component usage examples
  - [ ] Document API interfaces
  - [ ] Update README if necessary
  - [ ] Update TASKS.md with implementation details

### Component Registry Update
- [ ] **Update component registry (if applicable)**
  - [ ] Add new component to COMPONENT_REGISTRY.md
  - [ ] Update SHARED_COMPONENTS.md with quick reference
  - [ ] Document component status and usage

## Implementation Notes

1. [Implementation Note 1]
2. [Implementation Note 2]
3. [Implementation Note 3]

## Test Execution Reference

### Standard Test Commands
```bash
# Run all P0 tests
PRIORITY=p0 npx jest --config=projects/giandra_photos/jest.config.js

# Run integration tests
TEST_TYPE=integration npx jest --config=projects/giandra_photos/jest.config.js

# Run package-specific tests
./scripts/test_scripts/run-all-tests.sh --giandra --p0

# Run Vue component tests in Giandra Photos
./scripts/test_scripts/run-vue-component-tests.sh --giandra --p0

# Run single test file
npx jest --preset=ts-jest --no-cache projects/giandra_photos/tests/p0/components/example.test.ts

# Redirect test output (for large outputs)
./scripts/test_scripts/run-all-tests.sh --giandra --p0 > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"
```

### Test Output Redirection
For use with Claude and to prevent context overflow, redirect test outputs:
```bash
# Redirect all test output
{test-command} > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"

# Redirect to log file
{test-command} > /tmp/test-output.log 2>&1 && echo "PASSED" || echo "FAILED"
```

## Progress Tracking

- [ ] 🔴 RED PHASE: Test Creation - 0% complete
- [ ] 🟢 GREEN PHASE: Implementation - 0% complete
- [ ] 🔵 REFACTOR PHASE: Optimization - 0% complete

## Task Completion Git Steps

- [ ] **Final updates**:
  - [ ] Archive CHECKLIST.md to checklist_history:
    ```bash
    cp docs/giandra_photos/CHECKLIST.md docs/giandra_photos/checklist_history/CHECKLIST-TASK-GIAN-{TASK-NUMBER}-{Task-Name}-$(date +%Y%m%d).md
    ```
  - [ ] Update TASKS.md status to "Completed"
  - [ ] Update MILESTONES.md progress if needed
  - [ ] Update component registry files (if applicable)
  - [ ] Commit completion:
    ```bash
    git add docs/giandra_photos/checklist_history/* docs/giandra_photos/TASKS.md docs/giandra_photos/MILESTONES.md docs/mexpress/COMPONENT_REGISTRY.md docs/mexpress/SHARED_COMPONENTS.md
    git commit -m "complete(TASK-GIAN-{TASK-NUMBER}): finish {task-name} implementation"
    ```
  - [ ] Push branch and prepare for PR:
    ```bash
    git push -u origin feature/GIAN-2025-{NUMBER}-{COMPONENT}-{component-name}
    ```