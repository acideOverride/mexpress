# Resend.com Email Service Implementation Prompt

## Project Overview
We need to implement a shared email service component for the mExpress ecosystem using Resend.com as the email provider. This will be a centralized service that all projects (MontPC CRM, Giandra Photos, Jerome Bikes) can use for sending transactional emails, with MontPC.com as our first test case.

## Task Requirements
- Create a reusable email service package in the mExpress shared components
- Implement integration with Resend.com API
- Design a consistent API that all projects can use
- Start with MontPC.com contact form as the first implementation
- Follow TDD approach with complete test coverage
- Properly document in the mExpress AMTC system

## Technical Specifications
1. **Package Structure:**
   - Create in `/packages/email-service` or appropriate location in mExpress
   - TypeScript implementation with proper interfaces
   - Support for templates, attachments, and tracking

2. **API Design:**
   - Simple, consistent interface for all email types
   - Support for different sender identities per project
   - Proper error handling and retries
   - Async/Promise-based interface

3. **Integration Points:**
   - MontPC.com contact form as first integration
   - Document integration pattern for other projects

4. **Testing Requirements:**
   - Unit tests for all core functionality
   - Integration tests with mocked Resend API
   - End-to-end tests with the contact form

## Documentation Updates
Follow the mExpress AMTC workflow:
1. Update ARCHITECTURE.md with the email service architecture
2. Create/update task in TASKS.md
3. Create CHECKLIST.md with implementation steps
4. Add to COMPONENT_REGISTRY.md and SHARED_COMPONENTS.md when complete
5. Archive CHECKLIST.md to checklist_history

## Implementation Approach
1. Start with the RED phase - create tests first
2. Move to GREEN phase - implement the service to pass tests
3. Complete with REFACTOR phase - optimize and improve
4. Document thoroughly for other projects to use

## Additional Considerations
- Security of API keys and credentials
- Environment-specific configuration
- Logging and monitoring
- Rate limiting and throttling
- Fallback mechanisms if Resend.com is unavailable

This is a shared component that will be used across all mExpress projects, so code quality, documentation, and test coverage are critical.