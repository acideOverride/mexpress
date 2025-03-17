# mExpress Coding Assistant Guidelines

<!-- 
══════════════════════════════════════════════════════════════════════════════
IMPORTANT: WORKFLOW INSTRUCTIONS FOR CLAUDE
══════════════════════════════════════════════════════════════════════════════

AT THE START OF EACH SESSION, THE USER SHOULD TYPE:
"Please review the WORKFLOW INSTRUCTIONS section in CLAUDE.md before we begin"

WHEN SHOWN THESE INSTRUCTIONS, CLAUDE MUST RESPOND:
"I've reviewed the WORKFLOW INSTRUCTIONS. I will strictly follow the combined AMTC and TDD 
workflow with component registry checks. This means I will check for existing components first,
create tests, implement features until tests pass, maintain the CHECKLIST.md file, and update
the component registry when appropriate."

REQUIRED WORKFLOW STEPS COMBINING TDD AND AMTC:

Component Registry Checks:
1. Before any architecture or planning work:
   - ALWAYS check COMPONENT_REGISTRY.md first for existing components
   - Search with: `grep -i "[keyword]" /opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md`
   - Identify reusable components before proposing new ones
   - Include component registry checks in CHECKLIST.md

TDD (Test-Driven Development) Core Steps:
1. Before implementation begins:
   - Create tests first for new features/components following standardized project structure:
     - For MontPC CRM Vue components: `projects/montpc_crm/tests/frontend/{priority}/{feature-name}.test.ts`
     - Follow all test structure rules in "Test Standards" and "Test Location Templates" sections
     - Organize by priority (P0-P3) in the correct directory
     - Use proper test frameworks (Jest/Vitest for Vue components)
   - Verify tests fail initially (red phase)
   - Only then proceed to implementation (green phase) 
   - Finally, refactor while ensuring tests continue to pass

AMTC Workflow Steps:
1. When starting a task from TASKS.md:
   - Change task status to "In Progress" in TASKS.md
   - Create or update CHECKLIST.md with technical implementation steps
   - INCLUDE COMPONENT REGISTRY CHECK at the beginning of CHECKLIST.md
   - Ensure CHECKLIST.md includes specific test creation steps BEFORE implementation steps
   - Review current test status in `/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md`
   - Update CHECKLIST.md header to reference current AMTC documents and relevant test status

2. During implementation:
   - First create tests following TDD principles
   - Then implement features until tests pass
   - Mark items as completed in CHECKLIST.md as they are implemented
   - Add debugging notes and practical observations
   - Monitor test status using TESTS_STATUS_ENHANCED.md

3. When completing a task:
   - Verify all tests are passing in TESTS_STATUS_ENHANCED.md
   - If implementing a UI component or reusable service:
     1. UPDATE `/opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md` with your component details
     2. UPDATE `/opt/mExpress/docs/mexpress/SHARED_COMPONENTS.md` with quick-reference info
     3. Include both files in the same commit as your implementation code
   - ALWAYS archive the completed CHECKLIST.md to checklist_history with:
     `cp CHECKLIST.md checklist_history/CHECKLIST-{TASK-ID}-{Task-Name}-{YYYYMMDD}.md`
   - Mark the task as "Completed" in TASKS.md with completion date
   - Update the corresponding milestone in MILESTONES.md

This strict workflow combining TDD, AMTC, and Component Registry management MUST be 
followed for ALL tasks regardless of session length or complexity.
══════════════════════════════════════════════════════════════════════════════
-->

<!-- 
██████╗  ██████╗     ███╗   ██╗ ██████╗ ████████╗    ███╗   ███╗ ██████╗ ██████╗ ██╗███████╗██╗   ██╗
██╔══██╗██╔═══██╗    ████╗  ██║██╔═══██╗╚══██╔══╝    ████╗ ████║██╔═══██╗██╔══██╗██║██╔════╝╚██╗ ██╔╝
██║  ██║██║   ██║    ██╔██╗ ██║██║   ██║   ██║       ██╔████╔██║██║   ██║██║  ██║██║█████╗   ╚████╔╝ 
██║  ██║██║   ██║    ██║╚██╗██║██║   ██║   ██║       ██║╚██╔╝██║██║   ██║██║  ██║██║██╔══╝    ╚██╔╝  
██████╔╝╚██████╔╝    ██║ ╚████║╚██████╔╝   ██║       ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║██║        ██║   
╚═════╝  ╚═════╝     ╚═╝  ╚═══╝ ╚═════╝    ╚═╝       ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝        ╚═╝   
                                                                                                      
This section contains protected/locked content that should NOT be modified by Claude.
Only the user may update this section directly.
-->

## 🔒 LOCKED SECTION: CORE PROJECT SETTINGS

### Project Hierarchy
- **mExpress**: Core foundation platform with shared components (Base layer)
  - **MontPC CRM**: Customer management system for PC repair business
  - **Giandra Photos**: Photo management and selling platform
  - **Jerome Bikes**: Bike rental and reservation management system

### Master Documentation Structure
- `/docs/{project}/ARCHITECTURE.md`: Single source of architectural truth (immutable)
- `/docs/{project}/MILESTONES.md`: Milestone tracking (semi-mutable)
- `/docs/{project}/TASKS.md`: Task tracking (mutable)

### TDD Implementation Workflow
1. Add features to ARCHITECTURE.md (blueprint)
2. Define milestones in MILESTONES.md
3. Break down into tasks in TASKS.md 
4. Create tests first, verify they fail
5. Implement features until tests pass
6. Commit changes

  ## 📋 AMTC Documentation Workflow

  When implementing features or fixing bugs, maintain the following documentation files in order:

  ### AMTC Documentation Structure
  - **A: ARCHITECTURE.md** - Architectural blueprint (semi-immutable)
  - **M: MILESTONES.md** - Project milestones and progress (semi-mutable)
  - **T: TASKS.md** - Task tracking and implementation details (mutable)
  - **C: CHECKLIST.md** - Technical implementation verification (highly mutable)

  ### CHECKLIST.md Maintenance and History Tracking
  - CHECKLIST.md should be created/updated at the beginning of each new task from TASKS.md
  - Start each CHECKLIST.md with headers showing the current status of other AMTC documents
  - Always include a reference to the latest test status information from `/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md`
  - When completing a task, archive the current CHECKLIST.md with the pattern:
    ```
    /opt/mExpress/docs/{project}/checklist_history/CHECKLIST-{TASK-ID}-{Task-Name}-{YYYYMMDD}.md
    ```
  - Only after archiving the completed checklist, create a new CHECKLIST.md for the next task
  - This ensures a complete historical record of all task implementations is preserved


    Current Documentation Status:
  - A: ARCHITECTURE.md - [relevant section, e.g., "Section 6.2.1 UI Components"]
  - M: MILESTONES.md - [current milestone, e.g., "MS-MEXP-014 - UI Component Library"]
  - T: TASKS.md - [current task, e.g., "TASK-MEXP-078 - Table Component"]
  - Organize CHECKLIST.md by technical component, not by business requirement
  - Include specific technical verification steps with checkboxes
  - Mark steps as ✅ when completed or ⏭️ when deferred
  - Include debugging notes and troubleshooting steps

  ### AMTC Update Order
  1. First update ARCHITECTURE.md if the implementation affects system design
  2. Check MILESTONES.md to ensure alignment with current milestone
  3. Update TASKS.md with implementation details and status
  4. Review `/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md` for current test status
  5. Create or update CHECKLIST.md with technical steps and verification, including relevant test status information

  ### Technical vs. Business Documentation
  - ARCHITECTURE.md and MILESTONES.md focus on business requirements and system design
  - TASKS.md bridges business requirements and technical implementation
  - CHECKLIST.md is purely technical and focused on implementation details


## 🛠️ Build Commands

- Build all: `npm run build`
- Lint: `npm run lint`

### Standardized Test Commands

#### Using Master Test Script
- Test all packages: `./scripts/test_scripts/run-all-tests.sh`
- Test by priority: `./scripts/test_scripts/run-all-tests.sh --p0` or `./scripts/test_scripts/run-all-tests.sh --p1` or `./scripts/test_scripts/run-all-tests.sh --p2`
- Test by test type: `./scripts/test_scripts/run-all-tests.sh --integration` or `./scripts/test_scripts/run-all-tests.sh --frontend`
- Test specific package: `./scripts/test_scripts/run-all-tests.sh --core` or `./scripts/test_scripts/run-all-tests.sh --utils` or `./scripts/test_scripts/run-all-tests.sh --montpc`
- Combination options: `./scripts/test_scripts/run-all-tests.sh --p1 --core --coverage`

#### Using Environment Variables
- Test all: `npm run test`
- Test by priority: `PRIORITY=p0 npm run test`, `PRIORITY=p1 npm run test`, `PRIORITY=p2 npm run test`
- Integration tests: `TEST_TYPE=integration npm run test`
- Frontend tests: `TEST_TYPE=frontend npm run test`

#### Package-Specific Tests
- Core package: `cd packages/core && ../../scripts/test_scripts/run-p0-tests.sh`
- UI components package: `./scripts/test_scripts/run-all-tests.sh --ui-components --p0`
- Vue components package: `./scripts/test_scripts/run-vue-component-tests.sh --p0`
- Single file test: `PRIORITY=p0 npx jest --config=packages/core/jest.config.js packages/core/tests/p0/specific/test.test.ts > /dev/null 2>&1 && echo "PASSED: [test_name]" || echo "FAILED: [test_name]"`

#### Test Output Management
- Redirect test output to reduce noise: `./scripts/test_scripts/run-all-tests.sh --p0 > /dev/null 2>&1 && echo "PASSED" || echo "FAILED"`
- Redirect specific test output: `./scripts/test_scripts/run-vue-component-tests.sh --p0 --output /tmp/test-output.log`

⚠️ IMPORTANT: For use with Claude, redirect large test outputs to /dev/null to prevent Claude from hanging with large outputs. Use the exit code to determine pass/fail status.

## 📊 Testing & Dashboard

### Test Status Tracking
- Current test status is maintained in `/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md`
- This file provides a real-time view of all tests across the codebase with:
  - Pass/fail status with appropriate icons (✅/❌)
  - Test type information (unit, integration, e2e)
  - Execution time metrics
  - Component area categorization
  - Error type details for failing tests
  - File type and migration status tracking
- Always reference this file when working on test fixes or implementations
- **IMPORTANT**: This file must be included in all CHECKLIST.md documents

### Test Organization
- Tests are organized by priority level (P0-P3)
  - **P0**: Critical path tests - must pass for core functionality
  - **P1**: Important features - essential for milestone delivery
  - **P2**: Secondary features and edge cases
  - **P3**: Performance, stress tests, and non-functional requirements
- Each test maps to a specific BRQ (Business Requirement Query)
- Test results are stored in `/tests/results/test-runs`

### Jest Configuration Standards
- All Jest configurations MUST extend from `/opt/mExpress/jest.preset.js` 
- Always use ts-jest, not Babel, for TypeScript tests
- Follow the simplified configuration structure:
  1. Root preset: `/jest.preset.js` - Base configuration all others extend from
  2. Utilities: `/jest.utils.js` - Dynamic configuration generation functions
  3. Package-level config: `/packages/{package}/jest.config.js` - One config per package
  4. Project-level config: `/projects/{project}/jest.config.js` - One config per project
- Dynamic configuration using environment variables:
  - `PRIORITY=p0|p1|p2|p3`: Specify which priority level tests to run
  - `TEST_TYPE=unit|integration|frontend|react|vue`: Specify which type of tests to run
- Standard test invocation:
  - All tests in package: `npx jest --config packages/{package}/jest.config.js`
  - P1 tests only: `PRIORITY=p1 npx jest --config packages/{package}/jest.config.js`
  - Integration tests: `TEST_TYPE=integration npx jest --config packages/{package}/jest.config.js`
  - Single test: `npx jest --preset=ts-jest --no-cache {path-to-test}`
  - MongoDB tests: `MONGODB_URI=mongodb://localhost:27017/mexpress_test npx jest --config {config-file}`
- Common Jest settings:
  - `--runInBand`: Run tests sequentially for better stability
  - `--verbose`: For detailed output
  - `--preset=ts-jest`: Ensure TypeScript compatibility
  - `--no-cache`: Prevent stale cache issues
- Standardized timeouts based on priority:
  - P0 tests: 30 seconds
  - P1 tests: 60 seconds
  - P2 tests: 60 seconds
  - P3 tests: 120 seconds
  - Integration tests: 120 seconds
- Full documentation at:
  - Full standards: `/docs/standards/JEST_CONFIGURATION_STANDARDS.md`
  - Lite standards: `/docs/standards/lite/JEST_CONFIGURATION_STANDARDS.md`
- Implementation status at `/tests/validation/unified/JEST_STANDARDISATION.md`
- Benefits of this approach:
  1. Drastically reduced maintenance (45+ files → ~10 files)
  2. Consistent test execution across environments
  3. Dynamic configuration through environment variables
  4. Better type safety with TypeScript interfaces
  5. Simplified commands and execution patterns

### Vue Components Testing
The Vue components package supports both Jest and Vitest for testing:

#### Using Jest
- Run all tests: `./scripts/test_scripts/run-vue-component-tests.sh`
- Run priority tests: `./scripts/test_scripts/run-vue-component-tests.sh --p0`
- Run with coverage: `./scripts/test_scripts/run-vue-component-tests.sh --coverage`

#### Using Vitest
- Run all tests: `./scripts/test_scripts/run-vue-component-tests.sh --vitest`
- Run in watch mode: `./scripts/test_scripts/run-vue-component-tests.sh --vitest --watch`

#### NPM Scripts
- Default test: `cd packages/vue-components && npm test`
- Jest testing: `cd packages/vue-components && npm run test:jest`
- Vitest testing: `cd packages/vue-components && npm run test:vitest`


### Test Standards
- All tests MUST follow organization and structure defined in:
  - Full standards: `/docs/standards/C4_test_standards.md` 
  - Lite standards: `/docs/standards/lite/TDD_WORKFLOW.md` and `/docs/standards/lite/JEST_CONFIGURATION_STANDARDS.md`
- ALWAYS use project-specific test directories (e.g., `projects/montpc_crm/tests/`, `packages/core/tests/`)
- NEVER scatter test files across source directories (e.g., `src/components/Button/Button.test.tsx`)
- All tests MUST be organized by priority (P0-P3) within their project-specific test folders:
  - Example: `projects/montpc_crm/tests/frontend/p0/` for critical frontend tests
  - Example: `packages/core/tests/backend/p1/` for important backend tests
- ALL test output MUST be redirected to files as specified in test standards

### Test Location Templates
When creating new tests, ALWAYS follow these location templates:

#### Core Package Tests
- **Frontend Components**: `packages/core/tests/frontend/{priority}/components/{component-name}.test.tsx`
- **Backend Services**: `packages/core/tests/backend/{priority}/services/{service-name}.service.test.ts`
- **API Tests**: `packages/core/tests/api/{priority}/{endpoint-name}.api.test.ts`

#### Project Tests
- **MontPC CRM Frontend**: `projects/montpc_crm/tests/frontend/{priority}/{feature-name}.test.tsx`
- **MontPC CRM Backend**: `projects/montpc_crm/tests/backend/{priority}/{service-name}.test.ts`
- **Giandra Photos**: `projects/giandra_photos/tests/{test-type}/{priority}/{test-name}.test.ts`

#### Never Create Tests In These Locations
- ❌ `/src/components/{component-name}/__tests__/`
- ❌ `/src/{feature}/tests/`
- ❌ `/tests/packages/core/...` (centralized structure)
- ❌ Any location within source code directories

## 🧩 Project Structure & Coding Standards

### Project Structure
- `/packages`: Core reusable packages (core, ui-components, utils)
  - `/packages/core/tests`: Tests for core functionality organized by priority (p0-p3)
  - `/packages/ui-components/tests`: Tests for UI components organized by priority
- `/projects`: Client-specific projects
  - `/projects/montpc_crm/tests`: Tests for MontPC CRM organized by priority
  - `/projects/giandra_photos/tests`: Tests for Giandra Photos organized by priority
  - `/projects/jerome_bikes/tests`: Tests for Jerome Bikes organized by priority
- `/docs`: Documentation (core and project-specific)
  - `/docs/standards/lite`: Lightweight, practical standards
- `/tests/results`: Consolidated test results
- `/tests/validation`: Test status and reporting
- `/scripts`: All scripts must be placed in the appropriate subdirectory:
  - `/scripts/package_scripts/`: Scripts for core packages
  - `/scripts/project_scripts/`: Scripts for specific projects
  - `/scripts/test_scripts/`: Test runner scripts
  - `/scripts/utility_scripts/`: Utility and maintenance scripts
  - `/scripts/setup_scripts/`: Database and application setup scripts
  - `/scripts/testScripts/`: Legacy test scripting (maintained for compatibility)

For detailed directory structure standards:
- Full standards: Original detailed documentation
- Lite standards: `/docs/standards/lite/DIRECTORY_STRUCTURE.md`

### Starting MontPC CRM Application
To start the entire MontPC CRM application with MongoDB, API server, and frontend:
```
cd /opt/mExpress/projects/montpc_crm
./start-app.sh
```

This script starts:
1. In-memory MongoDB database server
2. Express API server connected to MongoDB
3. Vue.js frontend development server

All services will be accessible at:
- Frontend: http://localhost:5173
- API: http://localhost:3000/api
- MongoDB: mongodb://localhost:27017/montpc_crm

Use Ctrl+C to stop all services.

### Code Style
- **Formatting**: Prettier with singleQuote=true, tabWidth=2, printWidth=80
- **TypeScript**: Strict mode, explicit return types, avoid `any`
- **Imports**: Path aliases (@mexpress/core), organize by package source
- **Naming**: kebab-case (files), PascalCase (classes), camelCase (functions), UPPER_SNAKE_CASE (constants)
- **Error Handling**: Typed errors extending AppError, log then throw
- **Testing**: Priority-based (P0-P3), 80%+ coverage, mock dependencies
- **Detailed standards**:
  - Full standards: Original detailed documentation
  - Lite standards: 
    - `/docs/standards/lite/TS_CODE_STANDARDS.md` for TypeScript
    - `/docs/standards/lite/COMPONENT_STANDARDS.md` for Vue/React components
    - `/docs/standards/lite/API_STANDARDS.md` for API endpoints

## 📝 Documentation Standards

### BRQ Naming Convention
- Format: `[PROJ]-[YEAR]-[NUM]-[COMPONENT]`
  - **PROJ**: 4-letter project code (MEXP, MONT)
  - **YEAR**: 4-digit year (2025)
  - **NUM**: 3-digit sequential number (001, 002)
  - **COMPONENT**: FE, BE, FULL, API, INFRA, DOC

### Documentation Organization
- Keep documentation focused on a single topic
- Minimize file nesting (prefer flat structures where possible)
- Group by feature rather than by process
- For detailed standards:
  - Full standards: `/docs/standards/`
  - Lite standards: `/docs/standards/lite/DOCUMENTATION_STANDARDS.md`

## 🔄 Version Control Workflow

### Commit Workflow
1. Fix a test or implement a feature based on a BRQ
2. Run tests repeatedly until CONFIRMED to pass
3. Commit the changes immediately
4. Push to the remote repository
5. Move to the next test/feature

For CI/CD standards, see `/docs/standards/lite/CI_CD_STANDARDS.md`

 ### Branch Naming Conventions
  - Format: `feature/[BRQ-ID]-[component-name]`
    - **BRQ-ID**: Full BRQ identifier (e.g., MEXP-2025-050-FE)
    - **component-name**: Specific component or feature being implemented (e.g., table-component)
  - Examples:
    - `feature/MEXP-2025-050-FE-table-component` (for UI table component implementation)
    - `feature/MEXP-2025-030-API-external-integrations` (for API integrations)
    - `feature/MEXP-2025-002-FE-foundation` (for frontend foundation)
  - Always tie branches to BRQs rather than individual task IDs
  - For broader initiatives not tied to a specific BRQ, use descriptive names:
    - `feature/major-project-restructure`
    - `feature/test-phase`
    - `feature/kubernetes-config-test`
  - When creating branches for bug fixes, use:
    - `fix/[BRQ-ID]-[brief-description]`
  - Branch lifecycle:
    1. Create branch from main/develop for a specific BRQ feature
    2. Complete all related tasks and tests for that BRQ
    3. Create PR when all tests pass
    4. After review and merge, delete the branch

### Commit Message Format
```
fix(tests): fix [test-name] in [location]

- Problem: [brief description of the issue]
- Solution: [what was changed to fix it]
- BRQ: [related BRQ id]
```

  ### AMTC-Git Integration Workflow

  1. **Milestone Branch Management**:
     - Create milestone branches at the start of a new milestone:
       ```
       git checkout main
       git pull
       git checkout -b milestone/MS-MEXP-014-ui-component-library
       ```
     - Use milestone branches as integration points for related feature branches
     - Only merge milestone branches to main when entire milestone is complete

  2. **Task Branch Creation**:
     - Create a new feature branch IMMEDIATELY when selecting a task from TASKS.md:
       ```
       git checkout milestone/MS-MEXP-014-ui-component-library
       git checkout -b feature/MEXP-2025-050-FE-table-component
       ```
     - Update TASKS.md status and create CHECKLIST.md as first commit:
       ```
       git add docs/{project}/TASKS.md docs/{project}/CHECKLIST.md
       git commit -m "task(TASK-MEXP-078): start table component implementation"
       ```

  3. **TDD Phase Commits**:
     - RED Phase (Test Creation):
       ```
       git add {test-files}
       git commit -m "test(component): add tests for feature"
       ```
     - GREEN Phase (Implementation):
       ```
       git add {implementation-files}
       git commit -m "feat(component): implement feature"
       ```
     - REFACTOR Phase:
       ```
       git add {refactored-files}
       git commit -m "refactor(component): optimize feature"
       ```

  4. **Task Completion Process**:
     - Component Registry Update (if applicable):
       ```
       git add docs/mexpress/COMPONENT_REGISTRY.md docs/mexpress/SHARED_COMPONENTS.md
       git commit -m "docs(registry): add component to registry"
       ```
     - Archive CHECKLIST.md and Update Status:
       ```
       # Archive CHECKLIST.md to history and update TASKS.md
       git add docs/{project}/checklist_history/* docs/{project}/TASKS.md
  docs/{project}/MILESTONES.md
       git commit -m "complete(TASK-ID): finish implementation"
       ```
     - Push and Create PR:
       ```
       git push -u origin feature/MEXP-2025-050-FE-table-component
       ```

  5. **CHECKLIST.md Git Integration**:
     - Every CHECKLIST.md must include these git-related steps:
       - At beginning: "[ ] Create feature branch:
  `feature/[BRQ-ID]-[component-name]`"
       - After RED phase: "[ ] Commit test files: `git commit -m \"test(component):
  add tests for feature\"`"
       - After GREEN phase: "[ ] Commit implementation: `git commit -m
  \"feat(component): implement feature\"`"
       - After REFACTOR phase: "[ ] Commit optimizations: `git commit -m
  \"refactor(component): optimize feature\"`"
       - At end: "[ ] Archive CHECKLIST.md and commit completion: `git commit -m
  \"complete(TASK-ID): finish implementation\"`"

## 📋 Assistant Memory

This section is for the Claude Code assistant to maintain context about important commands, 
configurations, and preferences that apply to all projects in the mExpress ecosystem.
This helps Claude remember essential information across sessions without tracking
project-specific progress that belongs in project documentation.

### General Commands for All Projects
- Run all tests: `./scripts/test_scripts/run-all-tests.sh`
- Run priority tests: `./scripts/test_scripts/run-all-tests.sh --p0`
- Vue component tests: `./scripts/test_scripts/run-vue-component-tests.sh`
- Lint checks: `npm run lint`
- Build all: `npm run build`

### Project Startup Commands
- MontPC CRM: `cd /opt/mExpress/projects/montpc_crm && ./start-app.sh`
- Giandra Photos: `cd /opt/mExpress/projects/giandra_photos && ./start-app.sh`
- Jerome Bikes: `cd /opt/mExpress/projects/jerome_bikes && ./start-app.sh`

### Standard Documentation Paths
- Architecture blueprints: `/docs/{project}/ARCHITECTURE.md`
- Milestone tracking: `/docs/{project}/MILESTONES.md`
- Task management: `/docs/{project}/TASKS.md`
- Implementation steps: `/docs/{project}/CHECKLIST.md`
- Test status: `/opt/mExpress/tests/validation/unified/TESTS_STATUS_ENHANCED.md`
- Component registry: `/docs/mexpress/COMPONENT_REGISTRY.md`
- Component quick reference: `/docs/mexpress/SHARED_COMPONENTS.md`

### Component Registry Workflow

1. **Pre-Architecture Check**:
   - Before creating or updating ARCHITECTURE.md, I will first check COMPONENT_REGISTRY.md
   - I will search for existing components that meet requirements before proposing new ones
   - Command: `grep -i "[keyword]" /opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md`
   - When architecting new features, I will explicitly list reusable components found

2. **Registry Update Process**:
   - **Who**: Developer implementing the component
   - **When**: As the final step before marking a task as completed
   - **Files to Update**:
     1. `/opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md` - Main detailed registry
     2. `/opt/mExpress/docs/mexpress/SHARED_COMPONENTS.md` - Quick reference guide
   - **How**: Update both files in the same commit as the implementation code
   - **Workflow Position**: This is the LAST step before archiving CHECKLIST.md

3. **COMPONENT_REGISTRY.md Updates**:
   - Add component to appropriate section table with:
     - Component name
     - Status (✅/🟡/🟠/⚠️)
     - Projects using it
     - Location
     - Description
   - Update "Component Status Summary" table counts
   - Update "Project Usage" table percentages

4. **SHARED_COMPONENTS.md Updates**:
   - Add to "Most Used Components" if appropriate
   - Add to "Component Quick Search" section
   - Add to "Recent Additions" section with today's date

5. **Integration with CHECKLIST.md**:
   - All CHECKLIST.md files for component work must include:
     - At beginning: "✅ Check COMPONENT_REGISTRY.md for existing components" 
     - At end: "✅ Update COMPONENT_REGISTRY.md and SHARED_COMPONENTS.md"
   - Registry update is the FINAL technical step before archiving CHECKLIST.md

6. **Component Criteria**:
   - Components must be used in at least 2 projects to be promoted to shared status
   - Components must have 90%+ test coverage
   - Components must have proper documentation
   - Components must follow shared API patterns

### Testing Locations by Project
- Core package: `packages/core/tests/{test-type}/{priority}/{test-name}.test.ts`
- MontPC CRM: `projects/montpc_crm/tests/{test-type}/{priority}/{test-name}.test.ts`
- Giandra Photos: `projects/giandra_photos/tests/{test-type}/{priority}/{test-name}.test.ts`
- Jerome Bikes: `projects/jerome_bikes/tests/{test-type}/{priority}/{test-name}.test.ts`

### Coding Standards for All Projects
- Frontend: TypeScript with appropriate framework (Vue 3 Composition API or React)
- Files: kebab-case for filenames, PascalCase for components/classes
- Testing: Always follow TDD workflow (red-green-refactor) for all new features
  - See `/docs/standards/lite/TDD_WORKFLOW.md` for detailed TDD guidelines
- Documentation: Use structured CHECKLIST.md with three distinct TDD phases:
  1. RED PHASE: Test creation steps
  2. GREEN PHASE: Implementation steps
  3. REFACTOR PHASE: Cleanup steps
- Always reference project documentation for implementation details rather than duplicating in CLAUDE.md

### Session Context
- Remember to check which project is currently active
- Refer to project-specific documents for current status and priorities
- Maintain CHECKLIST.md structured with TDD phases
- Keep implementation focused on requirements in project documentation

### Checklist History Reference
- When working on related features, always check checklist history:
  - Path: `/opt/mExpress/docs/{project}/checklist_history/`
  - Naming: `CHECKLIST-{TASK-ID}-{Task-Name}-{YYYYMMDD}.md`
- Use checklist history to:
  - Understand past implementation decisions
  - Follow established patterns
  - Identify related components
  - Learn from previous challenges
- Search history with: `grep -r "keyword" /opt/mExpress/docs/{project}/checklist_history/`
- Reference relevant history findings in new CHECKLIST.md files
- Include "Previous Implementation Reference" section when building on existing work

<!-- END OF LOCKED SECTION -->