Roo: TASKMANAGER
PROJECT: mExpress
TASK: Finalize customer listing component - BRQ-2025-037-CUST-2
PRIORITY: HIGH
ASSIGNED TO: CODE
TIMELINE: Feb 26-27, 2025
GIT CONTEXT: feature/CUST-2-customer-listing-component
SOURCE STATUS: GPM-Verified

MONOREPO CONTEXT:
  Package Level:
    - Affected Package: @mexpress/ui-components and montpc_crm frontend
    - Package Version: 1.0.0
    - API Changes: Non-Breaking
    - Dependencies: Customer API endpoints (existing)
    - Integration Points: Will be used in customer management screens

  System Level:
    - Build Configuration: React + TypeScript + Webpack
    - Shared Resources: UI components library, design system
    - Cross-Package Impact: Minimal - frontend component
    - Version Strategy: Maintain backward compatibility
    - Integration Pattern: Component composition with clear props interface

REQUIREMENTS:
  Implementation Details:
    1. Complete the customer list component with the following features:
       - Display of customer records in a tabular format
       - Columns: Name, Email, Phone, Status, Created Date, Actions
       - Configurable column visibility and ordering
       - Row selection (single and multi-select)
       - Contextual actions for selected rows
       
    2. Implement filtering functionality:
       - Text search across name, email, and phone
       - Status filter (dropdown with status options)
       - Date range filter for created date
       - Filter persistence between sessions
       
    3. Implement sorting functionality:
       - Sortable columns: Name, Email, Status, Created Date
       - Sort direction toggle (ascending/descending)
       - Multi-column sorting (primary, secondary)
       - Sort persistence between sessions
       
    4. Implement pagination:
       - Page size options (10, 25, 50, 100)
       - Page navigation controls
       - Current page indicator
       - Total records count
       - Pagination persistence between sessions
       
    5. Implement UI states:
       - Loading state with shimmer effect
       - Empty state with appropriate messaging
       - Error state with retry option
       - Filter applied indicator
       
    6. Implement responsive behavior:
       - Desktop-optimized layout
       - Column prioritization on smaller screens
       - Responsive action buttons
       
    7. Implement accessibility features:
       - Keyboard navigation
       - Screen reader support
       - Proper ARIA attributes
       - Focus management

QUALITY GATES:
  1. Unit test coverage must be at least 80% for component logic
  2. Component renders correctly in all states (loading, empty, error, with data)
  3. Filtering, sorting, and pagination function correctly
  4. UI is responsive and functional on desktop
  5. Accessibility requirements are met (keyboard navigation, screen reader support)
  6. Performance testing shows component renders and updates efficiently
  7. Code must pass ESLint checks with no warnings
  8. Pull request must be reviewed by at least one team member

EVIDENCE NEEDS:
  1. Unit test results showing coverage >= 80%
  2. Screenshots of component in various states
  3. Performance test results
  4. Accessibility audit results
  5. Code review comments and resolution
  6. ESLint check results
  7. Demonstration of filtering, sorting, and pagination functionality

TECHNICAL GUIDANCE:
  1. File Locations:
     - Component: `/opt/mExpress/projects/montpc_crm/frontend/src/components/customers/CustomerList.tsx`
     - Tests: `/opt/mExpress/projects/montpc_crm/frontend/src/components/customers/__tests__/CustomerList.test.tsx`
     - Styles: `/opt/mExpress/projects/montpc_crm/frontend/src/components/customers/CustomerList.styles.ts` (if using styled-components)
     - Types: `/opt/mExpress/projects/montpc_crm/frontend/src/types/customer.ts`
  
  2. Utility Functions:
     - Use data fetching hooks from `/opt/mExpress/packages/ui-components/src/hooks/useFetch.ts`
     - For filtering, sorting, and pagination, use utilities from `/opt/mExpress/packages/ui-components/src/utils/tableUtils.ts`
     - For date formatting, use functions from `/opt/mExpress/packages/utils/src/dateUtils.ts`
  
  3. UI Components:
     - Use Table component from UI library
     - Use Filter components from UI library
     - Use Pagination component from UI library
     - Use Button and Icon components for actions
  
  4. Patterns to Follow:
     - Use React Query for data fetching and caching
     - Implement controlled component pattern for filters
     - Use React context for filter/sort/pagination state if complex
     - Extract complex logic to custom hooks
     - Use virtualization for large datasets
  
  5. Avoid:
     - Direct DOM manipulation
     - Inline styles (use styled-components or CSS modules)
     - Duplicate state management
     - Implementing features already available in UI library
     - Complex logic in render function

ACCEPTANCE CRITERIA:
  1. Customer list component displays data correctly
  2. All filtering options work as expected
  3. All sorting options work as expected
  4. Pagination works correctly
  5. All UI states (loading, empty, error) display correctly
  6. Component is responsive on desktop
  7. Accessibility requirements are met
  8. Unit tests pass with >= 80% coverage
  9. Code review completed with all issues addressed
  10. Performance metrics are within acceptable limits

REFERENCES:
  1. Implementation Plan: `/opt/mExpress/docs/core/projects/mexpress/project/gpm-implementation-plan.md`
  2. Task Matrix: `/opt/mExpress/docs/core/projects/mexpress/project/task-assignment-matrix.md`
  3. UI Component Library: `/opt/mExpress/packages/ui-components/README.md`
  4. Design System: `/opt/mExpress/docs/design-system/components/tables.md`
  5. API Endpoints: `/opt/mExpress/packages/core/src/controllers/customerController.ts`
  6. MontPC CRM Specs: `/opt/mExpress/docs/core/projects/montpc_crm/specifications/mvp-definition.md`

DEPENDENCIES:
  1. Customer API endpoints (existing)
  2. UI component library (existing)
  3. Design system (existing)

BLOCKS:
  1. Blocks CUST-7 (Add customer search & filtering)
  2. Partially blocks CUST-3 (Implement customer creation form) for integration

QA HANDOFF INSTRUCTIONS:
  When complete, notify QA with:
  1. Branch name
  2. Test coverage report
  3. Screenshots of component in various states
  4. Instructions for testing filtering, sorting, and pagination
  5. Any known limitations or edge cases

TASK COMPLETION:
  To mark task as complete:
  1. Create pull request
  2. Add reviewers: Team Lead, UX Designer, QA
  3. Provide evidence of all quality gates being met
  4. Update task status in project management system
  5. Send completion notification to TASKMANAGER