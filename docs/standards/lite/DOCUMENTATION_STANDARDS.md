# Documentation Standards (Lite Version)

This document outlines the essential standards for documentation across all mExpress projects, focusing on the AMTC workflow, TDD documentation, and code documentation.

## AMTC Documentation Structure

The AMTC (Architecture, Milestones, Tasks, Checklist) documentation framework is the backbone of our project documentation:

### A: ARCHITECTURE.md

- **Purpose**: Blueprint of the system design
- **Nature**: Semi-immutable, changes require careful consideration
- **Content**:
  - System architecture overview
  - Component relationships
  - Data flow diagrams
  - Technical decisions and rationales
  - Integration points
  - Security model

```markdown
# MontPC CRM Architecture

## 1. System Overview
[High-level description of the system]

## 2. Component Architecture
[Component diagram with descriptions]

## 3. Data Model
[Entity-relationship diagrams and descriptions]

## 4. API Design
[API endpoints and interaction patterns]

## 5. Security Model
[Authentication, authorization, and data protection]

## 6. Integration Points
[External system integrations]

## 7. Performance Considerations
[Performance requirements and strategies]
```

### M: MILESTONES.md

- **Purpose**: Track project progress at a high level
- **Nature**: Semi-mutable, updated when milestones change
- **Content**:
  - Major project milestones
  - Acceptance criteria
  - Timeline information
  - Current status and progress percentage
  - Dependencies between milestones

```markdown
# MontPC CRM Milestones

## MS-MONT-001: Foundation Setup
- **Status**: Completed (2025-01-15)
- **Progress**: 100%
- **Description**: Set up the basic project structure and core libraries
- **Acceptance Criteria**:
  - Project repository initialized
  - Core dependencies installed
  - Basic build pipeline working
  - Development environment documentation

## MS-MONT-002: Authentication System
- **Status**: In Progress
- **Progress**: 75%
- **Description**: Implement user authentication and authorization
- **Acceptance Criteria**:
  - Login/logout functionality
  - Role-based permissions
  - Password reset flow
  - JWT token implementation
- **Dependencies**: MS-MONT-001
```

### T: TASKS.md

- **Purpose**: Detailed task tracking
- **Nature**: Highly mutable, updated frequently
- **Content**:
  - Individual implementation tasks
  - Task status (Not Started, In Progress, Completed)
  - Assignees
  - Start and completion dates
  - Related milestone references

```markdown
# MontPC CRM Tasks

## TASK-MONT-101: Implement Login Component
- **Status**: Completed
- **Assigned To**: [Name]
- **Started**: 2025-02-01
- **Completed**: 2025-02-03
- **Milestone**: MS-MONT-002
- **Description**: Create Vue.js login form component with validation
- **Implementation Details**:
  - Created LoginForm.vue with email/password fields
  - Added form validation with Vuelidate
  - Implemented error handling
  - Added remember me functionality
  - Connected to authentication API

## TASK-MONT-102: Create User Session Management
- **Status**: In Progress
- **Assigned To**: [Name]
- **Started**: 2025-02-04
- **Milestone**: MS-MONT-002
- **Description**: Implement session management using JWT tokens
```

### C: CHECKLIST.md

- **Purpose**: Technical implementation verification
- **Nature**: Highly mutable, reflects current task implementation
- **Content**:
  - TDD workflow phases (RED, GREEN, REFACTOR)
  - Specific technical implementation steps
  - Verification checkboxes
  - Implementation notes and observations
  - Test status references

```markdown
# Authentication Implementation Checklist

## Current Documentation Status:
- A: ARCHITECTURE.md - Section 5.2 Authentication System
- M: MILESTONES.md - MS-MONT-002 Authentication System
- T: TASKS.md - TASK-MONT-102 Create User Session Management

## Implementation Tasks

## 🔴 RED PHASE: Test Creation

> **Standards Compliance:**
> - All tests must follow Jest configuration standards
> - All test code must comply with TypeScript standards
> - Tests must be placed in appropriate priority directories

### Authentication Tests
- [ ] **Create auth.service.test.ts**
  - [ ] Test login functionality
  - [ ] Test token validation
  - [ ] Test token refresh flow
  - [ ] Test authorization checks

## 🟢 GREEN PHASE: Implementation

### Authentication Service
- [ ] **Create AuthService**
  - [ ] Implement login method
  - [ ] Add token validation
  - [ ] Create token refresh mechanism
  - [ ] Add logout functionality
  
### Token Management
- [ ] **JWT Implementation**
  - [ ] Generate tokens with appropriate claims
  - [ ] Implement token storage strategy
  - [ ] Add token expiration handling
  - [ ] Create refresh token rotation

## 🔵 REFACTOR PHASE: Optimization and Testing

### Test Verification
- [ ] **Run and Verify Tests**
  - [ ] Run all authentication tests
  - [ ] Fix any failing assertions
  - [ ] Ensure 90%+ test coverage

### Code Optimization
- [ ] **Optimize Authentication Flow**
  - [ ] Review and optimize token validation
  - [ ] Improve error handling
```

## TDD Documentation in CHECKLIST.md

Every CHECKLIST.md file must follow the TDD approach with three distinct phases:

### 1. RED PHASE Documentation

- List all tests to be created before implementation
- Organize tests by component or feature
- Include specifics of what each test should verify
- Reference test standards and locations

```markdown
## 🔴 RED PHASE: Test Creation

> **Standards Compliance:**
> - All tests must follow Jest configuration standards
> - All test code must comply with TypeScript standards

### Component Tests
- [ ] **Create component.test.ts**
  - [ ] Test initialization with default props
  - [ ] Test event handling
  - [ ] Test conditional rendering
  - [ ] Test accessibility
```

### 2. GREEN PHASE Documentation

- Detail implementation steps after tests are created
- Organize by feature or component
- Include specific requirements for each step
- Reference design mockups or specifications

```markdown
## 🟢 GREEN PHASE: Implementation

### Component Implementation
- [ ] **Create basic structure**
  - [ ] Define component props interface
  - [ ] Set up component skeleton
  - [ ] Implement render function
- [ ] **Add functionality**
  - [ ] Implement event handlers
  - [ ] Connect to services
  - [ ] Add state management
```

### 3. REFACTOR PHASE Documentation

- Include optimization steps after initial implementation
- Add test verification steps
- Document performance improvements
- Include accessibility enhancements

```markdown
## 🔵 REFACTOR PHASE: Optimization and Testing

### Test Verification
- [ ] **Run all tests**
  - [ ] Fix any failing tests
  - [ ] Ensure code coverage meets standards

### Optimization
- [ ] **Performance improvements**
  - [ ] Optimize rendering
  - [ ] Reduce unnecessary calculations
- [ ] **Accessibility enhancements**
  - [ ] Add ARIA attributes
  - [ ] Ensure keyboard navigation
```

## Checklist History

Completed CHECKLIST.md files must be archived to maintain a historical record:

```
/docs/{project}/checklist_history/CHECKLIST-{TASK-ID}-{Task-Name}-{YYYYMMDD}.md
```

Example:
```
/docs/montpc_crm/checklist_history/CHECKLIST-TASK-MONT-102-User-Session-Management-20250204.md
```

## Code Documentation

### TypeScript/JavaScript Comments

- Use JSDoc format for all functions, classes, and interfaces
- Include parameter types and descriptions
- Document return values
- Include examples for complex functions

```typescript
/**
 * Authenticates a user and returns a JWT token
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @param {boolean} [rememberMe=false] - Whether to issue a long-lived token
 * @returns {Promise<string>} A JWT token for the authenticated user
 * @throws {AuthenticationError} If credentials are invalid
 *
 * @example
 * const token = await authenticateUser('user@example.com', 'password123');
 */
async function authenticateUser(
  email: string, 
  password: string, 
  rememberMe: boolean = false
): Promise<string> {
  // Implementation
}
```

### Vue Component Documentation

- Use JSDoc format for component definitions
- Document props, events, and slots
- Include examples of component usage

```typescript
/**
 * A button component with various styles and states
 *
 * @component
 *
 * @prop {string} [variant='primary'] - Button style variant (primary, secondary, text)
 * @prop {string} [size='medium'] - Button size (small, medium, large)
 * @prop {boolean} [disabled=false] - Whether the button is disabled
 *
 * @emits {click} - Emitted when the button is clicked
 * @emits {focus} - Emitted when the button gains focus
 *
 * @slot default - Button content
 * @slot icon - Icon to display before the content
 *
 * @example
 * <Button variant="primary" size="large" @click="handleClick">
 *   Submit Form
 * </Button>
 */
```

### API Documentation

- Document all API endpoints
- Include request and response formats
- Document error responses
- Include authentication requirements

```typescript
/**
 * @api {post} /api/auth/login User Login
 * @apiName LoginUser
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email User's email address
 * @apiParam {String} password User's password
 * @apiParam {Boolean} [rememberMe=false] Whether to issue a long-lived token
 *
 * @apiSuccess {String} token JWT token for authentication
 * @apiSuccess {String} refreshToken Token to refresh the JWT
 * @apiSuccess {Object} user User information
 * @apiSuccess {String} user.id User's unique identifier
 * @apiSuccess {String} user.email User's email address
 * @apiSuccess {String} user.name User's display name
 * @apiSuccess {String[]} user.roles User's assigned roles
 *
 * @apiError {Object} error Error information
 * @apiError {String} error.code Error code
 * @apiError {String} error.message Error message
 *
 * @apiErrorExample {json} Invalid Credentials:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": {
 *         "code": "INVALID_CREDENTIALS",
 *         "message": "Invalid email or password"
 *       }
 *     }
 */
```

## README Files

Every project and significant directory should include a README.md file:

### Project README

```markdown
# Project Name

## Overview
Brief description of the project

## Getting Started
Instructions for setting up the project

### Prerequisites
Required software and dependencies

### Installation
Step-by-step installation guide

## Development
Information for developers

### Project Structure
Overview of key directories and files

### Available Scripts
Description of npm scripts

### Testing
How to run and write tests

## Documentation
Links to more detailed documentation
```

### Directory README

```markdown
# Directory Name

## Purpose
What this directory contains

## Structure
Key files and subdirectories

## Usage Guidelines
How to use or contribute to this area
```

## File Headers

Include a standard header in all source files:

```typescript
/**
 * @file User authentication service
 * @description Handles user authentication, token management, and authorization
 * @module services/auth
 * @requires jsonwebtoken
 * @requires bcrypt
 */
```

## Documentation Principles

1. **Keep it up to date**: Documentation that's out of date is worse than no documentation
2. **Document why, not just what**: Explain the reasoning behind design decisions
3. **Be concise**: Use clear, concise language without unnecessary verbosity
4. **Use examples**: Provide usage examples for complex concepts
5. **Follow a consistent structure**: Use the same format across all documentation