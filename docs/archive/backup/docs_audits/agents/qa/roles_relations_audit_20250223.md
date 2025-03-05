# QA Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Verification Reports

### A. QA/CODE REPORT
**Reception Format**:
```
Roo: QA/CODE REPORT
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
RECEIVED FROM: CODE
SCOPE: [Component/Module/System]

MONOREPO CONTEXT:
  Package: [Package Name/System-Wide]
  Version: [Package Version]
  Dependencies: [Dependencies]
  API_Status: [Breaking/Non-Breaking]
  Integration: [Integration Status]
```

**Response Format**:
```
Roo: QA/CODE REPORT
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
STATUS: [ACCEPTED/REJECTED]
DESTINATION: [TASKMANAGER/CODE]

IMPLEMENTATION VERIFICATION:
  Quality Assessment:
    - Package Implementation: [Quality Status]
    - API Compatibility: [API Status]
    - Dependencies: [Dependency Status]
    - Integration: [Integration Status]
```

### B. QA/TASKMANAGER REPORT
**Reception Format**:
```
Roo: QA/TASKMANAGER REPORT
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
RECEIVED FROM: TASKMANAGER
SCOPE: [Project/Phase/Sprint]

TASK STATUS:
  Completion:
    - Tasks: [Completion Status]
    - Resources: [Resource Status]
    - Timeline: [Timeline Status]
    - Quality: [Quality Status]
```

**Response Format**:
```
Roo: QA/TASKMANAGER REPORT
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
STATUS: [ACCEPTED/REJECTED]
DESTINATION: [GPM/TASKMANAGER]

TASK VERIFICATION:
  Completion Assessment:
    - Tasks: [Completion Status]
    - Resources: [Resource Status]
    - Timeline: [Timeline Status]
    - Quality: [Quality Status]
```

### C. QA/GPM REPORT
**Reception Format**:
```
Roo: QA/GPM REPORT
PROJECT: [Project Name]
MILESTONE: [Milestone] - [BRQ-YEAR-NUMBER]
RECEIVED FROM: GPM
SCOPE: [Project/Milestone/Phase]

PROJECT STATUS:
  Progress:
    - Milestones: [Achievement Status]
    - Progress: [Progress Status]
    - Resources: [Resource Status]
    - Quality: [Quality Status]
```

**Response Format**:
```
Roo: QA/GPM REPORT
PROJECT: [Project Name]
MILESTONE: [Milestone] - [BRQ-YEAR-NUMBER]
STATUS: [ACCEPTED/REJECTED]
DESTINATION: [UXUI/GPM]

PROJECT VERIFICATION:
  Progress Assessment:
    - Milestones: [Achievement Status]
    - Progress: [Progress Status]
    - Resources: [Resource Status]
    - Quality: [Quality Status]
```

## 2. Flow Control Protocols

### A. Progress Monitoring
1. Metrics Collection
   - Task/Process completion rates
   - Milestone achievement rates
   - Flow velocity metrics
   - Blocker counts and age
   - Stage transition times
   - Frequency: Hourly updates

2. Health Monitoring
   - Flow efficiency rates
   - Pipeline throughput
   - Blocker resolution times
   - Return flow rates
   - Stage occupancy times
   - Frequency: Daily updates

### B. Alert Handling
1. Progress Alerts
   - Low completion rate alerts
   - Stage time threshold alerts
   - Milestone misalignment alerts
   - Action: Notify previous stage

2. Health Alerts
   - Multiple blocker alerts
   - Low efficiency alerts
   - High return rate alerts
   - Action: Escalate to flow manager

## 3. Evidence Management

### A. Package Requirements
1. Implementation Evidence
   - Code quality metrics
   - Test coverage reports
   - Documentation status
   - Standards compliance proof
   - Verification chain state

2. Task Evidence
   - Task completion proof
   - Resource usage data
   - Timeline tracking
   - Quality measurements
   - Verification chain state

3. Project Evidence
   - Milestone evidence
   - Progress metrics
   - Resource efficiency data
   - Quality achievement proof
   - Verification chain state

### B. Chain Preservation
- Maintain verification history
- Track decision points
- Preserve evidence links
- Document flow state
- Enable traceability

## 4. Agent Relationships

### A. Primary Relationships
1. With CODE
   - Receives implementation for verification
   - Validates quality and standards
   - Manages evidence collection
   - Returns verification decisions

2. With TASKMANAGER
   - Receives tasks for verification
   - Validates completion and resources
   - Manages evidence collection
   - Returns verification decisions

3. With GPM
   - Receives milestones for verification
   - Validates progress and achievements
   - Manages evidence collection
   - Returns verification decisions

### B. Secondary Relationships
1. With GIT
   - Version control integration
   - Change tracking
   - History preservation
   - State management

2. With UXUI
   - Project verification handoff
   - Quality assurance coordination
   - Progress validation
   - Evidence chain maintenance

## 5. Flow Management

### A. Flow States
1. Reception State
   - Task completion status
   - Milestone alignment
   - Progress status
   - Flow state
   - Pipeline position

2. Verification State
   - Progress metrics
   - Flow health
   - Blocker status
   - Transition readiness
   - Stage metrics

### B. Transition Management
1. Forward Flow
   - Progress verification
   - Flow state
   - Pipeline position
   - Documentation
   - Next steps

2. Return Flow
   - Blocker details
   - Progress gaps
   - Resolution required
   - Flow guidance
   - Return instructions

## 6. Quality Standards

### A. Verification Thresholds
1. Progress Thresholds
   - Warning: < 70% completion rate
   - Critical: < 50% completion rate
   - Alert: > 24h in stage

2. Health Thresholds
   - Warning: > 3 active blockers
   - Critical: > 5 active blockers
   - Alert: > 48h blocker age

3. Pipeline Thresholds
   - Warning: < 70% flow efficiency
   - Critical: < 50% flow efficiency
   - Alert: > 30% return rate

### B. Evidence Requirements
1. Package Level
   - API compatibility verified
   - Breaking changes validated
   - Version requirements met
   - Dependencies resolved
   - Integration points verified

2. System Level
   - Build configuration valid
   - Shared resources optimized
   - Cross-package deps resolved
   - Integration patterns valid
   - Versions properly aligned