Roo: TASKMANAGER
PROJECT: mExpress
TASK: Complete customer validation logic - BRQ-2025-037-CUST-1
PRIORITY: HIGH
ASSIGNED TO: CODE
TIMELINE: Feb 26-27, 2025
GIT CONTEXT: feature/CUST-1-customer-validation-logic
SOURCE STATUS: GPM-Verified

MONOREPO CONTEXT:
  Package Level:
    - Affected Package: @mexpress/core
    - Package Version: 1.0.0
    - API Changes: Non-Breaking
    - Dependencies: None for this task
    - Integration Points: Will be used by API endpoints and UI components

  System Level:
    - Build Configuration: Standard TypeScript configuration
    - Shared Resources: Validation utilities
    - Cross-Package Impact: Minimal - internal validation logic
    - Version Strategy: Maintain backward compatibility
    - Integration Pattern: Modular validation with clear interfaces

REQUIREMENTS:
  Implementation Details:
    1. Implement validation for all customer fields:
       - name (required, string, max length 100)
       - email (required, valid email format, unique)
       - phone (optional, valid phone format if provided)
       - address (optional object with validation for each sub-field)
       - status (required, enum of valid statuses)
       - created_date (system-generated, ISO date)
       - updated_date (system-generated, ISO date)
       - notes (optional, string, max length 1000)
       
    2. Create validation functions for each field with appropriate error messages
    
    3. Implement business rules:
       - Customer must have at least one contact method (email or phone)
       - Customer name must not contain special characters except hyphens and apostrophes
       - Email must be unique in the system
       - Status must be one of: ACTIVE, INACTIVE, PENDING, BLOCKED
    
    4. Create a comprehensive validation function that runs all validations and returns:
       - Success: {valid: true}
       - Failure: {valid: false, errors: {field1: 'error message', field2: 'error message'}}
       
    5. Support both creation and update validation scenarios
    
    6. Implement a function to sanitize input data before validation
    
    7. Create helpers for common validation patterns that can be reused

QUALITY GATES:
  1. Unit test coverage must be at least 90% for all validation logic
  2. All validation rules must have corresponding tests
  3. Edge cases must be tested (empty values, invalid formats, etc.)
  4. Performance testing for validation of large objects
  5. Documentation must be updated to reflect all validation rules
  6. Code must pass ESLint checks with no warnings
  7. Pull request must be reviewed by at least one team member

EVIDENCE NEEDS:
  1. Unit test results showing coverage >= 90%
  2. Performance test results for validation functions
  3. Documentation updates
  4. Code review comments and resolution
  5. ESLint check results
  6. Example validation scenarios and their results

TECHNICAL GUIDANCE:
  1. File Locations:
     - Primary: `/opt/mExpress/packages/core/src/models/customer.ts`
     - Validation: `/opt/mExpress/packages/core/src/validation/customerValidation.ts`
     - Tests: `/opt/mExpress/packages/core/tests/unit/validation/customerValidation.test.ts`
  
  2. Utility Functions:
     - Use validation utilities from `/opt/mExpress/packages/utils/src/validation.ts`
     - For email validation, use existing email validator
     - For phone validation, use existing phone validator with country code support
  
  3. Patterns to Follow:
     - Use functional programming approach for validation functions
     - Each validation function should be pure and return boolean or error object
     - Compose smaller validation functions into comprehensive validator
     - Use descriptive error messages that can be displayed to users
  
  4. Avoid:
     - Blocking validation (use async validation where needed)
     - Hardcoded error messages (use constants for i18n support)
     - Tight coupling with database or UI
     - Duplicating validation logic that exists in utilities

ACCEPTANCE CRITERIA:
  1. All required validations implemented correctly
  2. Unit tests passing with >= 90% coverage
  3. Documentation updated
  4. Code review completed with all issues addressed
  5. Integration with customer model verified
  6. Performance meets requirements (validation completes in < 50ms)
  7. ESLint passing with no warnings
  8. Examples provided for common validation scenarios

REFERENCES:
  1. Implementation Plan: `/opt/mExpress/docs/core/projects/mexpress/project/gpm-implementation-plan.md`
  2. Task Matrix: `/opt/mExpress/docs/core/projects/mexpress/project/task-assignment-matrix.md`
  3. Customer Data Model: `/opt/mExpress/packages/core/src/models/customer.ts`
  4. Validation Utilities: `/opt/mExpress/packages/utils/src/validation.ts`
  5. MontPC CRM Specs: `/opt/mExpress/docs/core/projects/montpc_crm/specifications/mvp-definition.md`

DEPENDENCIES:
  1. None for this task (this is a starting task)

BLOCKS:
  1. Blocks CUST-3 (Implement customer creation form)
  2. Blocks CUST-4 (Add customer update functionality)

QA HANDOFF INSTRUCTIONS:
  When complete, notify QA with:
  1. Branch name
  2. Test coverage report
  3. Examples of validation scenarios
  4. Documentation of validation rules
  5. Any known limitations or edge cases

TASK COMPLETION:
  To mark task as complete:
  1. Create pull request
  2. Add reviewers: Team Lead, QA
  3. Provide evidence of all quality gates being met
  4. Update task status in project management system
  5. Send completion notification to TASKMANAGER