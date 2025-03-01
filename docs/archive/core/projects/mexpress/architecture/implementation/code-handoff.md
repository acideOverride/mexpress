Roo: ARCHITECT
PROJECT: mExpress
SENDING TO: CODE
TASK: Implement Reconciliation Sprint Tools - MEXP-2025-025-INFRA-RS-IMPL
STATUS: READY_FOR_IMPLEMENTATION

MONOREPO CONTEXT:
  Package: System-Wide
  Version: 1.0.0
  Dependencies: All packages
  Cross-Package Impact: Yes
  Integration Status: Starting Implementation

IMPLEMENTATION DETAILS:
  Package Implementation:
    - Package: Core
    - Version: Current
    - Dependencies: To Be Verified
    - API Changes: Non-Breaking
    - Integration Impact: Tools Only

  Cross-Package Impact:
    - Affected Packages: Core, Utils
    - Version Alignment: None Required
    - Integration Changes: None Required
    - Breaking Changes: No
    - Migration Path: Not Required

STANDARDS COMPLIANCE:
  Package Standards: Met
  Monorepo Standards: Met
  Integration Standards: Met

# Code Implementation Handoff: Reconciliation Sprint Tools

## Overview
This document provides implementation instructions for the Code agent to create the initial tooling needed for the reconciliation sprint. These tools will support the team in verifying the actual implementation status of components and tracking the gaps between documentation and reality.

## Implementation Scope

The implementation should focus on creating the following tools:

1. **Feature-Reality Matrix Tracker**
   - Tool to track component status
   - Store verification evidence
   - Track gaps and actions
   - Generate status reports

2. **Verification Helper Tools**
   - Component scanning utilities
   - Test result analyzers
   - Documentation parsers
   - Status classifier

3. **Sprint Dashboard**
   - Progress visualization
   - Status reporting
   - Task tracking
   - Blocker identification

## Technical Requirements

### Feature-Reality Matrix Tracker

Implement a tool that:

1. Reads and writes to a structured data file (JSON/YAML) that tracks:
   - Component names
   - Documented status
   - Actual status
   - Gap description
   - Priority
   - Owner
   - Timeline
   - Evidence links

2. Provides functions to:
   - Add/update component status
   - Calculate reconciliation progress
   - Generate status reports
   - Filter by various criteria

3. Example data structure:
```typescript
interface ComponentStatus {
  name: string;
  documentedStatus: 'COMPLETE' | 'PARTIAL' | 'MINIMAL' | 'PLANNED' | 'MISSING';
  actualStatus: 'COMPLETE' | 'PARTIAL' | 'MINIMAL' | 'PLANNED' | 'MISSING';
  gapDescription: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  targetDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  evidenceLinks: string[];
}

interface FeatureRealityMatrix {
  components: ComponentStatus[];
  lastUpdated: string;
  progress: {
    total: number;
    verified: number;
    reconciled: number;
  };
}
```

### Verification Helper Tools

Implement utilities to:

1. **Component Scanner**
   - Scan codebase for component implementations
   - Match against documentation claims
   - Generate verification reports

2. **Test Analyzer**
   - Parse test results
   - Calculate coverage metrics
   - Match tests to documented features
   - Identify testing gaps

3. **Documentation Parser**
   - Extract claims from documentation
   - Parse feature descriptions
   - Create verification checklist

4. **Status Classifier**
   - Apply status classification rules
   - Suggest component status based on evidence
   - Track status changes

### Sprint Dashboard

Implement a simple terminal-based dashboard that shows:

1. **Overall Progress**
   - Components verified
   - Documentation updated
   - Issues identified
   - Blockers

2. **Team Status**
   - Tasks by owner
   - Completion status
   - Priority items
   - Blockers

3. **Timeline View**
   - Sprint day tracking
   - Milestone progress
   - Critical path status

## Implementation Guidelines

1. **Technology Stack**
   - Node.js (available in project)
   - TypeScript (available in project)
   - Command-line interfaces
   - File-based storage (JSON/YAML)

2. **Location**
   - Create all tools in `/opt/mExpress/packages/core/src/reconciliation-tools/`
   - Create a simple CLI interface in `/opt/mExpress/packages/core/src/reconciliation-tools/cli.ts`

3. **Code Standards**
   - Follow existing project coding standards
   - Include comprehensive tests
   - Add proper documentation
   - Create usage examples

4. **User Experience**
   - Simple command-line interface
   - Clear, actionable outputs
   - Reasonable defaults
   - Helpful error messages

## Implementation Steps

1. **Initial Setup**
   - Create directory structure
   - Set up core modules
   - Define interfaces
   - Establish file storage

2. **Core Functionality**
   - Implement matrix tracker
   - Create verification helpers
   - Build status classifier
   - Develop reporter

3. **CLI Interface**
   - Create command structure
   - Implement user interaction
   - Build help and examples
   - Test user workflows

4. **Documentation**
   - Create usage guide
   - Document code
   - Provide examples
   - Add troubleshooting

## Deliverables

1. **Code**
   - Complete, tested implementation
   - CLI interface
   - Utility functions
   - Storage mechanisms

2. **Documentation**
   - Usage guide
   - Code documentation
   - Examples
   - Setup instructions

3. **Tests**
   - Unit tests
   - Integration tests
   - Example workflows

## Next Steps After Implementation

1. Team onboarding to tools
2. Begin using tools in reconciliation sprint
3. Collect feedback for improvements
4. Expand tools as needed during sprint

## References
- Reconciliation Plan: `/opt/mExpress/docs/core/projects/mexpress/architecture/reconciliation-plan.md`
- Feature-Reality Matrix: `/opt/mExpress/docs/core/projects/mexpress/architecture/feature-reality-matrix.md`
- Sprint Kickoff: `/opt/mExpress/docs/core/projects/mexpress/architecture/implementation/reconciliation-sprint-kickoff.md`

---

This handoff document provides clear instructions for the Code agent to implement the initial tooling needed for the reconciliation sprint. Once these tools are implemented, the reconciliation sprint can begin effectively.