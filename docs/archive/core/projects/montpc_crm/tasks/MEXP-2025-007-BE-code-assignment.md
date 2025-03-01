# MontPC CRM - Emergency Recovery Task Assignment

Roo: TASKMANAGER
PROJECT: MontPC CRM
TASK: Emergency Recovery Tasks - MEXP-2025-007-BE
PRIORITY: CRITICAL
ASSIGNED TO: CODE
TIMELINE: 2025-02-27 to 2025-03-02 (96 hours)
GIT CONTEXT: feature/montpc-crm-mvp
SOURCE STATUS: GPM-Verified

## EMERGENCY SITUATION

The MontPC CRM implementation has encountered critical issues requiring immediate corrective action. Based on ARCHITECT assessment, the current implementation:

1. Failed to leverage existing functional components
2. Prioritized documentation over working functionality
3. Created a non-functional user interface despite existing working components
4. Deviated from the "Function Over Form" directive

This emergency recovery assignment focuses on restoring and enhancing existing functional components rather than creating new ones, with an urgent 96-hour timeline.

## MONOREPO CONTEXT

### Package Level:
- Affected Packages: core, ui-components, utils
- Package Versions: Current
- API Changes: Non-Breaking
- Dependencies: MongoDB, Express, React
- Integration Points: Frontend-Backend API

### System Level:
- Build Configuration: Standard monorepo build
- Shared Resources: UI components, API utilities
- Cross-Package Impact: High
- Version Strategy: Maintain current versions
- Integration Pattern: REST API

## ARCHITECTURE

### Package Architecture:
- Package Design: Maintain existing architecture
- API Design: Restore functionality with minimal changes
- Integration Design: Ensure component compatibility
- Version Strategy: No breaking changes

### System Architecture:
- Build Architecture: Standard monorepo build
- Integration Architecture: REST API pattern
- Resource Architecture: Shared UI components
- System Design: Focus on functional integration

## REQUIREMENTS

### Package Requirements:
- Package Implementation: Restore existing components
- API Implementation: Verify and fix endpoints
- Integration Implementation: Ensure frontend-backend connectivity
- Version Management: Maintain compatibility

### System Requirements:
- Build Implementation: Standard build process
- Integration Implementation: Maintain REST pattern
- Resource Management: Reuse existing components
- System Implementation: Focus on functional MVP

## RESOURCES

### Package Resources:
- Development: All available developers
- Testing: Priority testing team
- Documentation: Minimal documentation team
- Integration: Integration specialists

### System Resources:
- Build Pipeline: Continuous integration
- Integration Testing: Priority allocation
- System Testing: Emergency test team
- Documentation: Essential documentation only

## TIMELINE

### Package Timeline:
- Development: 72 hours for feature completion
- Testing: Concurrent with development
- Documentation: Minimal, focused on functionality
- Integration: Continuous throughout recovery

### System Timeline:
- Build Setup: Immediate verification
- Integration: Continuous throughout recovery
- System Testing: Final 24 hours
- Documentation: Essential only, as needed

## QUALITY

### Package Quality:
- Package Standards: Functionality over completeness
- API Standards: RESTful pattern, proper responses
- Integration Standards: Verified connectivity
- Version Standards: Backward compatibility

### System Quality:
- Build Standards: Successful build without errors
- Integration Standards: Working frontend-backend
- Resource Standards: Efficient resource usage
- System Standards: Functional MVP over perfection

## ASSIGNED TASKS - MILESTONE 1 (24 HOURS)

| Task ID | Task Name | Priority | Timeline | Dependencies |
|---------|-----------|----------|----------|--------------|
| T-007-01 | Customer UI Component Recovery | Critical | Feb 27 (0-8h) | None |
| T-007-02 | API Endpoint Verification | Critical | Feb 27 (0-8h) | None |
| T-007-03 | Ticket UI Component Inventory | High | Feb 27 (8-16h) | T-007-01 |
| T-007-04 | Integration Assessment | High | Feb 27 (8-16h) | T-007-02 |
| T-007-05 | Component Recovery Testing | Critical | Feb 27 (16-24h) | T-007-01, T-007-02 |

The detailed requirements for each task are documented in their respective task files. This assignment is for Milestone 1 only; subsequent milestones will be assigned based on the successful completion of this milestone.

## CRITICAL SUCCESS FACTORS

1. **Functionality First**: All recovery efforts must prioritize working functionality over visual appearance or documentation.

2. **Component Reuse**: No component shall be reimplemented if a functional version exists. Modifications to existing components must preserve functionality.

3. **Focus on MVP**: Implement only what is required for the MVP. NO ADDITIONAL FEATURES beyond the core requirements are authorized.

4. **Daily Verification**: Each day must end with a functional demonstration of recovered components.

## COMMUNICATION REQUIREMENTS

- Morning Alignment (9:00 AM): 15-minute standup to review priorities and blockers
- Functional Demo (4:00 PM): Daily demonstration of working functionality
- Status Reporting (5:00 PM): Component status update and progress report
- Immediate Escalation: Any blockers must be reported immediately

## TRACKING AND REPORTING

All task progress and component status must be tracked in the recovery tracking document:
`/opt/mExpress/docs/core/projects/montpc_crm/tasks/MEXP-2025-007-BE-recovery-tracking.md`

The component status tracker must be updated at least twice daily (midday and end of day).

## ESCALATION PROTOCOL

Any issues that threaten the recovery timeline must be escalated immediately:
1. Technical Issues: Immediate escalation to ARCHITECT
2. Resource Issues: Immediate escalation to GPM
3. Integration Issues: Joint escalation to ARCHITECT and Integration Lead
4. Quality Issues: Escalation to QA Lead and ARCHITECT

## STANDARDS COMPLIANCE

This recovery effort must adhere to:
- [Architecture Standards](/opt/mExpress/docs/core/standards/B_architecture.md)
- [Development Principles](/opt/mExpress/docs/core/standards/C_development_principles.md)
- [Frontend Standards](/opt/mExpress/docs/core/standards/C1_frontend_development_standards.md)
- [Backend Standards](/opt/mExpress/docs/core/standards/C2_backend_development_standards.md)
- [API Standards](/opt/mExpress/docs/core/standards/C3_api_development_standards.md)
- [Test Standards](/opt/mExpress/docs/core/standards/C4_test_standards.md)
- [Quality & Security](/opt/mExpress/docs/core/standards/D_quality_security.md)

Due to the emergency nature of this recovery, documentation requirements are REDUCED to only what is essential for implementation and maintenance.

---

This task assignment is effective immediately. All assigned tasks must be completed within their specified timelines. Daily verification meetings are mandatory.

Roo: TASKMANAGER
PROJECT: MontPC CRM
STATUS: EMERGENCY IMPLEMENTATION
DATE: February 27, 2025