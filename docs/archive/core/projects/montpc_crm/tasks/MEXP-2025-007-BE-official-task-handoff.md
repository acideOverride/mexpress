Roo: TASKMANAGER
PROJECT: MontPC CRM
TASK: Emergency Recovery Tasks - MEXP-2025-007-BE
PRIORITY: CRITICAL
ASSIGNED TO: CODE
TIMELINE: 2025-02-27 to 2025-03-02
GIT CONTEXT: feature/montpc-crm-mvp
SOURCE STATUS: GPM-Verified

MONOREPO CONTEXT:
  Package Level:
    - Affected Packages: core, ui-components, utils
    - Package Versions: Current
    - API Changes: Non-Breaking
    - Dependencies: MongoDB, Express, React
    - Integration Points: Frontend-Backend API

  System Level:
    - Build Configuration: Standard monorepo build
    - Shared Resources: UI components, API utilities
    - Cross-Package Impact: High
    - Version Strategy: Maintain current versions
    - Integration Pattern: REST API

REQUIREMENTS:
  Package Requirements:
    - Package Implementation: Restore existing components to working state
    - API Implementation: Verify and restore API endpoint functionality
    - Integration Implementation: Ensure frontend-backend connectivity
    - Version Management: Maintain backward compatibility

  System Requirements:
    - Build Implementation: Ensure standard build process works
    - Integration Implementation: Verify REST API pattern works end-to-end
    - Resource Management: Reuse existing components, minimal new development
    - System Implementation: Focus on functional MVP over complete feature set

RESOURCES:
  Package Resources:
    - Development: All available developers allocated
    - Testing: Priority testing team assigned
    - Documentation: Minimal documentation team
    - Integration: Integration specialists allocated

  System Resources:
    - Build Pipeline: Continuous integration enabled
    - Integration Testing: Priority allocation for testing
    - System Testing: Emergency test team assigned
    - Documentation: Only essential documentation permitted

TIMELINE:
  Package Timeline:
    - Development: 72 hours for feature completion
    - Testing: Concurrent with development
    - Documentation: Minimal and concurrent
    - Integration: Continuous throughout recovery

  System Timeline:
    - Build Setup: Immediate verification
    - Integration: Continuous throughout recovery
    - System Testing: Final 24 hours
    - Documentation: Essential only

QUALITY:
  Package Quality:
    - Package Standards: Functionality over completeness
    - API Standards: RESTful pattern, proper error responses
    - Integration Standards: Working connectivity, verified data flow
    - Version Standards: No breaking changes permitted

  System Quality:
    - Build Standards: Clean build with no errors
    - Integration Standards: Working frontend-backend connectivity
    - Resource Standards: Efficient use of existing components
    - System Standards: Functional MVPs with minimal styling