# Debugger Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Communication Patterns

### A. Incoming Communications

#### From CODE (Issue Reception)
**Header Format**:
```
Roo: DEBUGGER
PROJECT: [Project Name]
RECEIVED FROM: CODE - [Task Name] - [BRQ-YEAR-NUMBER]

MONOREPO CONTEXT:
  Package: [Package Name/System-Wide]
  Version: [Package Version]
  Dependencies: [Affected Dependencies]
  API_Status: [Breaking/Non-Breaking]
  Integration: [Integration Status]

ISSUE TYPE: [Bug/Performance/Security]
SEVERITY: [Critical/High/Medium/Low]

SCOPE:
  Level: [Package/Monorepo/System]
  Component: [Component Name]
  Integration Points: [Integration Details]
  Breaking Changes: [Yes/No]
```

### B. Outgoing Communications

#### To CODE (Issue Resolution)
**Header Format**:
```
Roo: DEBUGGER
PROJECT: [Project Name]
REPORTING TO: CODE - [Task Name] - [BRQ-YEAR-NUMBER]

ISSUE STATUS: [RESOLVED/NEEDS_MORE_INFO]

ROOT CAUSE:
  Package Level: [Package-specific Issues]
  System Level: [Cross-package Issues]
  Description: [Detailed Analysis]

RESOLUTION:
  Package Changes: [Package-level Fixes]
  System Changes: [Cross-package Fixes]
  Integration Updates: [Integration Fixes]
  Description: [Fix Description]

PREVENTION:
  Package Level: [Package Prevention Steps]
  System Level: [System Prevention Steps]
  Integration: [Integration Prevention]
  Future Steps: [Prevention Strategy]
```

## 2. Support Protocols

### A. Implementation Support
1. Error Resolution
   - Issue analysis
   - Root cause identification
   - Fix implementation support
   - Resolution validation
   - Evidence collection

2. Performance Optimization
   - Performance profiling
   - Bottleneck identification
   - Optimization guidance
   - Metrics collection
   - Evidence documentation

3. Quality Maintenance
   - Code quality analysis
   - Test coverage support
   - Standards compliance
   - Prevention planning
   - Evidence preservation

### B. Evidence Management
1. Collection Points
   - During debugging
   - After resolutions
   - During optimization
   - After improvements

2. Evidence Types
   - Debug logs
   - Resolution docs
   - Performance data
   - Quality metrics

## 3. Mode Transitions

### A. Code to Debugger
1. Requirements
   - Complete issue description
   - Reproduction steps
   - Technical context
   - System state

2. Validation Steps
   - Verify issue description
   - Check reproduction steps
   - Validate context
   - Confirm system state

### B. Debugger to Git
1. Requirements
   - Fix implementation complete
   - All tests passing
   - Documentation updated
   - Root cause documented
   - Prevention measures defined

2. Transition Steps
   - Store current debug state
   - Prepare fix for commit
   - Document fix rationale
   - Validate fix completeness
   - Switch to GIT mode

## 4. Agent Relationships

### A. Primary Support Loop
1. With CODE
   - Bidirectional support relationship
   - Direct implementation assistance
   - Continuous feedback loop
   - Evidence contribution
   - Quality maintenance

2. Support Types
   - Error resolution support
   - Performance optimization
   - Quality maintenance
   - Evidence collection
   - Prevention planning

### B. Secondary Relationships
1. With GIT
   - Version control integration
   - Change tracking
   - History preservation
   - State management

2. With QA
   - Evidence contribution
   - Quality verification
   - Standards compliance
   - Metrics tracking

## 5. Context Management

### A. Debug Context
1. Core Components
   - Current debug phase
   - Issue context
   - System state
   - Debug findings
   - Resolution status

2. State Tracking
   - Debug progress
   - Test results
   - System changes
   - Performance metrics

### B. Resource Management
1. Debug Data
   - Load logs incrementally
   - Process stack traces in chunks
   - Stream system state data
   - Use pagination for large outputs
   - Clear non-essential context

2. Thresholds
   - Warning: 70% context usage
   - Critical: 85% context usage
   - Force commits at warning
   - Stop operations at critical

## 6. Evidence Framework

### A. Collection Framework
1. Package Level
   - API issues
   - Breaking changes
   - Version compatibility
   - Package dependencies
   - Integration points

2. System Level
   - Build system issues
   - Shared resources
   - Cross-package dependencies
   - Integration patterns
   - Version alignment

### B. Documentation Framework
1. Issue Documentation
   - Issue description
   - Technical context
   - Root cause analysis
   - Impact assessment
   - Resolution steps

2. Evidence Documentation
   - Debug logs
   - Performance metrics
   - Test results
   - Quality measurements
   - Prevention measures

## 7. Critical Paths

### A. Debug Path
```
CODE → DEBUGGER (Analysis) → DEBUGGER (Resolution) → CODE
```

### B. Evidence Path
```
DEBUGGER (Collection) → QA/CODE REPORT (Contribution)
```

## 8. Resource Control

### A. Output Management
1. Test Output
   - Silent execution mode
   - File-based output
   - Size limits per type
   - Regular cleanup
   - Directory hierarchy

2. Log Management
   - Per test type: 5MB max
   - Per directory: 20MB max
   - Error logs: 1MB max
   - Daily rotation
   - Structured archival