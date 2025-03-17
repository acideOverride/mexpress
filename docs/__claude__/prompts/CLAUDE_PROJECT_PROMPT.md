# mExpress Project Assistant Prompt

## Project Context
I'm working on the mExpress platform and its projects (particularly MontPC CRM), which is transitioning from React to Vue.js while maintaining a TypeScript-first approach.

## Current Issues to Address
1. **Mixed JS/TS Codebase**: The project currently has a mix of JavaScript and TypeScript files, which causes inconsistency and type safety issues.
2. **Application Setup Challenges**: Multiple conflicting scripts make it difficult to reliably run the application.
3. **React to Vue Migration**: We're transitioning frontend components from React to Vue.js.
4. **Inconsistent Project Structure**: Files and directories need reorganization to follow TypeScript best practices.

## AMT Reference Documents
To understand the current status and next steps, ALWAYS check these documents first:
- **Architecture** (`/opt/mExpress/docs/mexpress/ARCHITECTURE.md` and `/opt/mExpress/docs/montpc_crm/ARCHITECTURE.md`): System vision and components
- **Milestones** (`/opt/mExpress/docs/mexpress/MILESTONES.md` and `/opt/mExpress/docs/montpc_crm/MILESTONES.md`): Major deliverable tracking
- **Tasks** (`/opt/mExpress/docs/mexpress/TASKS.md` and `/opt/mExpress/docs/montpc_crm/TASKS.md`): Implementation work items

## Test Status Verification
BEFORE implementing any new component or feature, ALWAYS check:
- `/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md` to see if it already exists
- If a component already exists, focus on fixing and improving rather than rebuilding

## New Implementation Approach
1. **Frontend-First Iterative Development**:
   - I will specify what frontend component or feature we need next
   - You will log this requirement in the appropriate TASKS.md file
   - We will proceed with implementation following TDD principles
   - Focus on making it work correctly the first time

2. **Practical Implementation Guidelines**:
   - Write TypeScript code exclusively for all new development
   - Use Vue.js for all new frontend components
   - Ensure each component is testable and tested
   - Create consolidated startup scripts that work reliably

## Standards to Follow
1. **Test-Driven Development**:
   - Write tests before implementation
   - Tests must be in canonical locations by priority (P0-P3)
   - Update TESTS_STATUS_ENHANCED.md after fixes

2. **TypeScript Standards** (`/opt/mExpress/docs/standards/TS_CODE_STANDARDS.md`):
   - Use TypeScript for all new code (.ts, .tsx, .vue)
   - Use explicit return types for functions
   - Avoid 'any' - use proper types or generics
   - Follow naming conventions (kebab-case files, PascalCase components)
   - Use path aliases instead of deep relative imports

3. **Jest Configuration** (`/opt/mExpress/docs/standards/JEST_CONFIGURATION_STANDARDS.md`):
   - All configs extend from /jest.preset.js
   - Use ts-jest for TypeScript tests
   - Follow priority-based execution (P0-P3)
   - Use environment variables for test configuration

4. **Vue.js Migration** (`/opt/mExpress/docs/mexpress/VUE_MIGRATION_GUIDE.md`):
   - Follow phased migration approach
   - Convert React patterns to Vue equivalents
   - Use Vue Test Utils for component testing
   - Follow Vue project structure conventions

## Working Process
1. Check if the component already exists in test status document
2. Create task entry in appropriate TASKS.md if needed
3. Write test file first (following TDD)
4. Implement component/feature until test passes
5. Ensure the component can be properly used in the application
6. Update test status documentation
7. Run linting and type-checking
8. Wait for the next frontend component or feature request

## Application Startup
When creating a startup script, ensure it:
1. Starts MongoDB first (verify it's installed and running)
2. Starts the Express API server (TypeScript-based if possible)
3. Starts the Vue.js frontend development server
4. Provides clear instructions on accessing each service
5. Handles proper shutdown of all services when interrupted

## Commands to Run
- Linting: `npm run lint`
- Type checking: `npm run typecheck`
- Testing: `./scripts/test_scripts/run-all-tests.sh --{priority} --{package}`
- Vue component tests: `./scripts/test_scripts/run-vue-component-tests.sh --{priority}`

For each task, I'll tell you what frontend component or feature we need next, and you will implement it following this structured approach.