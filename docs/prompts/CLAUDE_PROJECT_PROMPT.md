   # mExpress Project Assistant Prompt

  ## Project Context
  I'm working on the mExpress platform, a TypeScript-first project that's migrating from React to Vue.js. Please help me maintain AMT alignment, follow TDD, and adhere to our standards.

  ## AMT Reference
  To understand the current status and next steps, please check these documents:
  - Architecture (/opt/mExpress/docs/mexpress/ARCHITECTURE.md): Defines system vision and components
  - Milestones (/opt/mExpress/docs/mexpress/MILESTONES.md): Tracks progress on major deliverables
  - Tasks (/opt/mExpress/docs/mexpress/TASKS.md): Lists day-to-day implementation work

  When starting a session, please analyze these documents to understand:
  1. Current project status
  2. Current and upcoming milestones
  3. Active tasks and their priorities
  4. Next tasks after completion

  ## Standards to Follow
  1. **Test-Driven Development**:
     - Write tests before implementation
     - Tests must be in canonical locations by priority (P0-P3)
     - Update TESTS_STATUS_ENHANCED.md after fixes

  2. **TypeScript Standards** (/opt/mExpress/docs/standards/TS_CODE_STANDARDS.md):
     - Use TypeScript for all new code (.ts, .tsx, .vue)
     - Use explicit return types for functions
     - Avoid 'any' - use proper types or generics
     - Follow naming conventions (kebab-case files, PascalCase components)
     - Use path aliases instead of deep relative imports

  3. **Jest Configuration** (/opt/mExpress/docs/standards/JEST_CONFIGURATION_STANDARDS.md):
     - All configs extend from /jest.preset.js
     - Use ts-jest for TypeScript tests
     - Follow priority-based execution (P0-P3)
     - Use environment variables for test configuration

  4. **Vue.js Migration** (/opt/mExpress/docs/mexpress/VUE_MIGRATION_GUIDE.md):
     - Follow phased migration approach
     - Convert React patterns to Vue equivalents
     - Use Vue Test Utils for component testing
     - Follow Vue project structure conventions

  ## Working Process
  1. Check task context in AMT documents
  2. Create test file first (following TDD)
  3. Document test in TESTS.md before implementation
  4. Implement component/feature until test passes
  5. Update test status in TESTS.md
  6. Run linting and type-checking with appropriate commands
  7. Update AMT documents with progress
  8. Identify next task from TASKS.md

  ## Commands to Run
  - Linting: `npm run lint`
  - Type checking: `npm run typecheck`
  - Testing: `./scripts/test_scripts/run-all-tests.sh --{priority} --{package}`
  - Vue component tests: `./scripts/test_scripts/run-vue-component-tests.sh --{priority}`

  For each task, please help me follow TDD practices, maintain AMT alignment, and adhere to our coding standards.