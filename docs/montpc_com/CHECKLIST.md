# Implementation Checklist: TASK-MONT-001 Vue.js Project Structure Setup

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
   - /opt/mExpress/docs/montpc_com/checklist_history/CHECKLIST-TASK-MONT-001-Vue-js-Project-Structure-Setup-YYYYMMDD.md

4. This checklist MUST be updated after each implementation step with:
   - ✅ for completed items
   - ⏭️ for deferred items
   - Debugging notes and observations

These rules are immutable and form the foundation for the implementation process.

══════════════════════════════════════════════════════════════════════════════
-->

## Current Documentation Status
- **A**: ARCHITECTURE.md - Section 1.3 Technology Stack
- **M**: MILESTONES.md - MS-MONT-001 - Website Foundation
- **T**: TASKS.md - TASK-MONT-001 - Vue.js Project Structure Setup
- **Test Status**: See [TESTS_STATUS_ENHANCED.md](/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md)

## Previous Implementation Reference
- [ ] Check checklist history: `/opt/mExpress/docs/montpc_com/checklist_history/`
- [ ] Search command: `grep -r "Vue.js" /opt/mExpress/docs/montpc_crm/checklist_history/`
- [ ] Relevant history files:
  - `/opt/mExpress/docs/montpc_crm/checklist_history/CHECKLIST-TASK-MONT-104-Dashboard-Components-20250316.md`
  - `/opt/mExpress/docs/montpc_crm/checklist_history/CHECKLIST-TASK-MONT-105-Component-Registry-Update-20250316.md`
- [ ] Implementation patterns to follow:
  - Use Vue 3 Composition API for all components
  - Follow TypeScript standards for typing
  - Implement Tailwind CSS with theme variables
  - Ensure dark/light mode compatibility

## Git Setup (FIRST STEP)
- [ ] Create feature branch from appropriate milestone branch:
  ```bash
  git checkout milestone/MS-MONT-001-website-foundation
  git checkout -b feature/MONT-2025-001-FE-vuejs-setup
  ```
- [ ] Initial commit with CHECKLIST.md creation:
  ```bash
  git add docs/montpc_com/TASKS.md docs/montpc_com/CHECKLIST.md
  git commit -m "task(TASK-MONT-001): start Vue.js project structure setup"
  ```

## Component Registry Check (FIRST STEP)
- [ ] Check `/opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md` for existing component entries
- [ ] Search command: `grep -i "theme|layout|toggle" /opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md`
- [ ] List reusable components already in registry:
  - ThemeToggle (✅) - Already in registry, can be reused
  - AppLayout (✅) - Already in registry, can be reused
  - MasterLayout (🟡) - In progress, might need customization
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
  - **Frontend Components**: `projects/montpc_com/tests/frontend/{priority}/components/{component-name}.test.ts`
  - **Layout Components**: `projects/montpc_com/tests/frontend/{priority}/layout/{layout-name}.test.ts`
  - **Theme Service**: `projects/montpc_com/tests/frontend/{priority}/services/theme.service.test.ts`
- [ ] NEVER create tests in source code directories (e.g., `/src/components/{component-name}/__tests__/`)
- [ ] Use standardized test commands:
  - Priority-based: `PRIORITY=p0 npx jest --config projects/montpc_com/jest.config.js`
  - Type-based: `TEST_TYPE=frontend npx jest --config projects/montpc_com/jest.config.js`
  - Vue-specific: `./scripts/test_scripts/run-vue-component-tests.sh --p0`
- [ ] Redirect large test outputs: `{test-command} > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"`

## 🔴 RED PHASE: Test Creation

### Test Planning
- [ ] **Define test strategy for Vue.js project structure and core components**
  - [ ] Determine test types needed (unit tests for core components and services)
  - [ ] Identify test priorities (P0 for core layout and theme toggle)
  - [ ] Plan test directory structure following platform standards
  - [ ] Define test coverage requirements (minimum 80%)

### Test Structure Setup
- [ ] **Create test directory structure**
  - [ ] Create `projects/montpc_com/tests` directory
  - [ ] Create priority-based test directories:
    - [ ] `projects/montpc_com/tests/frontend/p0/`
    - [ ] `projects/montpc_com/tests/frontend/p1/`
  - [ ] Create test subdirectories:
    - [ ] `projects/montpc_com/tests/frontend/p0/layout/`
    - [ ] `projects/montpc_com/tests/frontend/p0/services/`
    - [ ] `projects/montpc_com/tests/frontend/p0/components/`

### Unit Test Creation
- [ ] **Implement unit tests for core components and services**
  - [ ] Create test file: `projects/montpc_com/tests/frontend/p0/layout/AppLayout.test.ts`
    - [ ] Test layout renders correctly
    - [ ] Test header, footer and content areas exist
    - [ ] Test responsive behavior with different screen sizes
  - [ ] Create test file: `projects/montpc_com/tests/frontend/p0/services/ThemeService.test.ts`
    - [ ] Test theme initialization
    - [ ] Test theme switching
    - [ ] Test persistence to localStorage
    - [ ] Test system preference detection
  - [ ] Create test file: `projects/montpc_com/tests/frontend/p0/components/ThemeToggle.test.ts`
    - [ ] Test toggle renders correctly
    - [ ] Test click behavior changes theme
    - [ ] Test accessibility features
  - [ ] Create test file: `projects/montpc_com/tests/frontend/p0/router/Router.test.ts`
    - [ ] Test routes are correctly defined
    - [ ] Test navigation works between routes

### Jest Configuration Setup
- [ ] **Create Jest configuration for MontPC Website**
  - [ ] Create `projects/montpc_com/jest.config.js` extending from root preset
  - [ ] Configure TypeScript and Vue test environment
  - [ ] Set up test coverage thresholds
  - [ ] Configure module aliases and transformers

### Test Execution (RED)
- [ ] **Verify tests fail correctly**
  - [ ] Run P0 tests: `PRIORITY=p0 npx jest --config projects/montpc_com/jest.config.js`
  - [ ] Confirm all tests fail because components are not yet implemented
  - [ ] Verify test output matches expected format
  - [ ] Document failures in TESTS_STATUS_ENHANCED.md

- [ ] **Commit test files**:
  - [ ] Stage test files: `git add projects/montpc_com/tests/`
  - [ ] Commit: `git commit -m "test(vuejs): add tests for Vue.js project structure"`

## 🟢 GREEN PHASE: Implementation

### Environment Setup
- [ ] **Configure development environment**
  - [ ] Create Vue.js project with Vue CLI or Vite
    - [ ] Command: `npm create vite@latest projects/montpc_com/frontend -- --template vue-ts`
  - [ ] Install TypeScript and configure `tsconfig.json`
  - [ ] Install Tailwind CSS and configure
  - [ ] Install Vue Router for navigation
  - [ ] Install Pinia for state management
  - [ ] Install testing libraries (Jest, Vue Test Utils)
  - [ ] Configure ESLint and Prettier for code quality

### Directory Structure Implementation
- [ ] **Set up project directory structure**
  - [ ] Create `src/components` for UI components
  - [ ] Create `src/layouts` for layout components
  - [ ] Create `src/services` for business logic
  - [ ] Create `src/assets` for static resources
  - [ ] Create `src/router` for routing configuration
  - [ ] Create `src/stores` for Pinia state management
  - [ ] Create `src/types` for TypeScript interfaces

### Core Implementation
- [ ] **Implement core components and services**
  - [ ] Create layout components:
    - [ ] `src/layouts/AppLayout.vue` - Main application layout
    - [ ] `src/components/Header.vue` - Header with navigation
    - [ ] `src/components/Footer.vue` - Footer with sections
  - [ ] Create theme service:
    - [ ] `src/services/themeService.ts` - Theme management
  - [ ] Create theme toggle component:
    - [ ] `src/components/ThemeToggle.vue` - Light/dark mode toggle
  - [ ] Set up routing:
    - [ ] `src/router/index.ts` - Route definitions
  - [ ] Configure state management:
    - [ ] `src/stores/themeStore.ts` - Theme state

### MontPC CRM API Integration
- [ ] **Establish connection with MontPC CRM backend**
  - [ ] Create API client:
    - [ ] `src/services/apiService.ts` - API connection handling
  - [ ] Create authentication service:
    - [ ] `src/services/authService.ts` - Handle user authentication
  - [ ] Create data services:
    - [ ] `src/services/dataService.ts` - Data retrieval and manipulation

### Tailwind CSS Setup
- [ ] **Configure Tailwind CSS with theme support**
  - [ ] Create `tailwind.config.js` with custom theme variables
  - [ ] Define color scheme variables for light/dark modes
  - [ ] Set up typography configuration
  - [ ] Configure responsive breakpoints

### Test Execution (GREEN)
- [ ] **Verify tests pass with implementation**
  - [ ] Run P0 tests: `PRIORITY=p0 npx jest --config projects/montpc_com/jest.config.js`
  - [ ] Confirm all tests now pass
  - [ ] Run coverage check: `PRIORITY=p0 npx jest --config projects/montpc_com/jest.config.js --coverage`
  - [ ] Verify coverage meets minimum threshold
  - [ ] Update TESTS_STATUS_ENHANCED.md with passing status

- [ ] **Commit implementation**:
  - [ ] Stage implementation files: `git add projects/montpc_com/frontend/`
  - [ ] Commit: `git commit -m "feat(vuejs): implement Vue.js project structure"`

## 🔵 REFACTOR PHASE: Optimization

### Code Quality Improvements
- [ ] **Refactor code for maintainability and reusability**
  - [ ] Review and improve component compositions
  - [ ] Extract common functionality into composables
  - [ ] Ensure consistent naming conventions
  - [ ] Add documentation comments for components and functions
  - [ ] Optimize imports and dependencies

### Performance Optimization
- [ ] **Optimize for performance**
  - [ ] Implement lazy loading for routes
  - [ ] Optimize asset loading
  - [ ] Implement code splitting
  - [ ] Set up Webpack/Vite bundle analyzer to track bundle size
  - [ ] Reduce unnecessary re-renders

### Integration Check
- [ ] **Verify integration with MontPC CRM**
  - [ ] Test API connections
  - [ ] Verify authentication flow
  - [ ] Test data retrieval and display
  - [ ] Ensure consistent behavior between systems

### Final Verification
- [ ] **Final test suite execution**
  - [ ] Run all tests: `./scripts/test_scripts/run-vue-component-tests.sh --p0`
  - [ ] Verify all tests still pass after refactoring
  - [ ] Check that code coverage remains above threshold
  - [ ] Run linting: `npm run lint`
  - [ ] Ensure no TypeScript errors: `npm run typecheck`

- [ ] **Commit refactoring**:
  - [ ] Stage refactored files: `git add projects/montpc_com/frontend/`
  - [ ] Commit: `git commit -m "refactor(vuejs): optimize Vue.js project structure"`

### Documentation Updates
- [ ] **Update documentation**
  - [ ] Document project structure
  - [ ] Add component usage examples
  - [ ] Document API integration
  - [ ] Update TASKS.md with implementation details

### Component Registry Update
- [ ] **Update component registry (if applicable)**
  - [ ] Add new reusable components to COMPONENT_REGISTRY.md
  - [ ] Update SHARED_COMPONENTS.md with quick reference
  - [ ] Document component status and usage

## Implementation Notes

1. Project setup will follow the same Vue.js pattern as MontPC CRM for consistency and component reuse
2. Theme toggle implementation will leverage existing components from registry where possible
3. Special attention needed for responsive design as website mockups show complex layout with animations
4. Will need to coordinate with MontPC CRM team on API integration and authentication flow

## Test Execution Reference

### Standard Test Commands
```bash
# Run all P0 tests
PRIORITY=p0 npx jest --config=projects/montpc_com/jest.config.js

# Run frontend tests
TEST_TYPE=frontend npx jest --config=projects/montpc_com/jest.config.js

# Run Vue component tests
./scripts/test_scripts/run-vue-component-tests.sh --p0

# Run single test file
npx jest --preset=ts-jest --no-cache projects/montpc_com/tests/frontend/p0/components/ThemeToggle.test.ts

# Run tests with coverage
PRIORITY=p0 npx jest --config=projects/montpc_com/jest.config.js --coverage
```

### Test Output Redirection
For use with Claude and to prevent context overflow, redirect test outputs:
```bash
# Redirect all test output
PRIORITY=p0 npx jest --config=projects/montpc_com/jest.config.js > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"

# Redirect to log file
PRIORITY=p0 npx jest --config=projects/montpc_com/jest.config.js > /tmp/montpc-com-tests.log 2>&1 && echo "PASSED" || echo "FAILED"
```

## Progress Tracking

- [ ] 🔴 RED PHASE: Test Creation - 0% complete
- [ ] 🟢 GREEN PHASE: Implementation - 0% complete
- [ ] 🔵 REFACTOR PHASE: Optimization - 0% complete

## Task Completion Git Steps

- [ ] **Final updates**:
  - [ ] Archive CHECKLIST.md to checklist_history:
    ```bash
    cp docs/montpc_com/CHECKLIST.md docs/montpc_com/checklist_history/CHECKLIST-TASK-MONT-001-Vue-js-Project-Structure-Setup-$(date +%Y%m%d).md
    ```
  - [ ] Update TASKS.md status to "Completed"
  - [ ] Update MILESTONES.md progress if needed
  - [ ] Commit completion:
    ```bash
    git add docs/montpc_com/checklist_history/* docs/montpc_com/TASKS.md docs/montpc_com/MILESTONES.md
    git commit -m "complete(TASK-MONT-001): finish Vue.js project structure setup"
    ```
  - [ ] Push branch and prepare for PR:
    ```bash
    git push -u origin feature/MONT-2025-001-FE-vuejs-setup
    ```