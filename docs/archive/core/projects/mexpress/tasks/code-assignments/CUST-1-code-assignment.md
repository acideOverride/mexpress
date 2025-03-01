Roo: TASKMANAGER
PROJECT: mExpress
TASK: Complete customer validation logic - CUST-1
PRIORITY: HIGH
ASSIGNED TO: CODE
TIMELINE: Feb 26-27, 2025
GIT CONTEXT: feature/CUST-1-customer-validation-logic
SOURCE STATUS: TASKMANAGER-Verified

REQUIREMENTS:
  Implement comprehensive validation logic for customer data model with the following specifications:
    
  1. Field validations:
     - name: required, string, max length 100
     - email: required, valid email format, unique
     - phone: optional, valid phone format if provided
     - address: optional object with validation for sub-fields
     - status: required, enum of valid statuses
     - created_date: system-generated, ISO date
     - updated_date: system-generated, ISO date
     - notes: optional, string, max length 1000
    
  2. Business rules:
     - Customer must have at least one contact method (email or phone)
     - Customer name must not contain special characters except hyphens and apostrophes
     - Email must be unique in the system
     - Status must be one of: ACTIVE, INACTIVE, PENDING, BLOCKED
    
  3. Validation approach:
     - Create validation functions for each field
     - Implement comprehensive validator that runs all validations
     - Support both creation and update scenarios
     - Sanitize input data before validation
     - Return structured validation results with clear error messages

QUALITY GATES:
  - Unit test coverage >= 90%
  - All validation rules tested including edge cases
  - Documentation updated for all rules
  - Code passes ESLint with no warnings
  - Performance meets requirements (validation < 50ms)

EVIDENCE NEEDS:
  - Test coverage report
  - Documentation updates
  - Code review completion
  - Performance metrics

NEXT ACTIONS:
  - Implement validation functions
  - Write unit tests
  - Update documentation
  - Submit for code review
  - Address feedback
  - Submit for QA verification

FILE LOCATIONS:
  - Primary: `/opt/mExpress/packages/core/src/models/customer.ts`
  - Validation: `/opt/mExpress/packages/core/src/validation/customerValidation.ts`
  - Tests: `/opt/mExpress/packages/core/tests/unit/validation/customerValidation.test.ts`

For detailed specifications, refer to:
[CUST-1 Task Assignment](/opt/mExpress/docs/core/projects/mexpress/tasks/CUST-1-task-assignment.md)