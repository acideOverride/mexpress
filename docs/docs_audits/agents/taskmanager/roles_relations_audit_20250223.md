# TaskManager Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Communication Patterns

### A. Downstream Communications

#### From GPM (Milestone Reception)
**Header Format**:
```
Roo: GPM
PROJECT: [Project Name]
MILESTONE: [Milestone Name] - [BRQ-YEAR-NUMBER]
SOURCE STATUS: [GPM-Verified]

MONOREPO CONTEXT:
  Package Level:
    - Affected Packages: [List]
    - Package Versions: [Version Details]
    - API Changes: [Breaking/Non-Breaking]
    - Dependencies: [Package Dependencies]
    - Integration Points: [Integration Details]

  System Level:
    - Build Configuration: [Build Details]
    - Shared Resources: [Resource Details]
    - Cross-Package Impact: [Impact Analysis]
    - Version Strategy: [Strategy Details]
    - Integration Pattern: [Pattern Details]
```

#### To CODE (Task Assignment)
**Header Format**:
```
Roo: TASKMANAGER
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
PRIORITY: [High/Medium/Low]
ASSIGNED TO: CODE
TIMELINE: [Start-End Dates]
GIT CONTEXT: [Branch/Commit Reference]
SOURCE STATUS: [GPM-Verified]
REQUIREMENTS: [Implementation Details]
QUALITY GATES: [Required Gates]
EVIDENCE NEEDS: [Required Evidence]
```

### B. Upstream Communications

#### From QA/CODE REPORT
**Header Format**:
```
Roo: QA/CODE REPORT
RETURNING TO: TASKMANAGER
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
STATUS: [ACCEPTED/REJECTED]
IMPLEMENTATION:
  Quality: [Implementation Quality]
  Coverage: [Test Coverage]
  Documentation: [Documentation Status]
  Standards: [Standards Compliance]
EVIDENCE:
  Package: [Evidence Package]
  Validation: [Evidence Status]
```

#### To QA/TASKMANAGER REPORT
**Header Format**:
```
Roo: TASKMANAGER
SUBMITTING TO: QA/TASKMANAGER REPORT
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
VERIFICATION:
  Completion: [Task Completion Status]
  Resources: [Resource Utilization]
  Timeline: [Timeline Adherence]
  Quality: [Quality Metrics]
EVIDENCE:
  Package: [Evidence Package]
  Chain: [Evidence Chain Status]
```

## 2. Workflow Protocols

### A. Milestone Processing
1. Reception Analysis
   - Verify GPM source
   - Check architecture
   - Review requirements
   - Plan breakdown

2. Task Organization
   - Break down milestone
   - Create git tasks
   - Create code tasks
   - Define requirements

### B. Task Management
1. Assignment Process
   - Set quality gates
   - Define evidence needs
   - Plan metrics collection
   - Prepare tracking

2. QA Feedback Processing
   - Process QA reviews
   - Update task status
   - Track metrics
   - Plan next steps

## 3. Quality Framework

### A. Downstream Gates
1. GPM Planning Verification
   - GPM-verified source
   - Resource allocation
   - Timeline planning
   - Quality requirements

2. Task Creation Quality
   - Task breakdown
   - Implementation requirements
   - Quality criteria
   - Evidence needs

### B. Upstream Gates
1. Code Report Verification
   - Implementation quality
   - Test coverage
   - Documentation
   - Standards compliance

2. TaskManager Report Quality
   - Task completion
   - Resource efficiency
   - Timeline adherence
   - Quality metrics

## 4. Agent Relationships

### A. Primary Relationships
1. With GPM
   - Receives milestones
   - Validates planning
   - Manages resources
   - Tracks progress

2. With CODE
   - Assigns tasks
   - Sets requirements
   - Defines quality gates
   - Tracks implementation

### B. Secondary Relationships
1. With QA
   - Processes feedback
   - Verifies quality
   - Maintains evidence
   - Tracks metrics

2. With GIT
   - Creates tasks
   - Tracks changes
   - Maintains history
   - Preserves context

## 5. State Management

### A. Task State
1. Core Components
   - Current task status
   - Git task reference
   - Code task reference
   - Phase tracking
   - Validation status

2. Queue Management
   - Pending tasks
   - Active tasks
   - Completed tasks
   - QA feedback pending

### B. Workflow State
1. Context Management
   - Milestone reference
   - Resource assignments
   - Quality gates
   - Timeline tracking

2. QA Context
   - Feedback status
   - Verification chain
   - Evidence package
   - Standards compliance

## 6. Evidence Framework

### A. Collection Framework
1. Implementation Evidence
   - Quality metrics
   - Test coverage
   - Documentation status
   - Standards compliance

2. Task Evidence
   - Completion status
   - Resource utilization
   - Timeline adherence
   - Quality metrics

### B. Chain Management
1. Evidence Preservation
   - Package evidence
   - Chain status
   - Validation history
   - Quality context

2. Documentation
   - Task specifications
   - Quality requirements
   - Evidence collection
   - Feedback processing

## 7. Critical Paths

### A. Downstream Path
```
GPM → TASKMANAGER (Analysis) → TASKMANAGER (Creation) → CODE
```

### B. Upstream Path
```
QA/CODE REPORT → TASKMANAGER → QA/TASKMANAGER REPORT → GPM
```

## 8. Resource Control

### A. Task Queue
1. Management
   - Prioritize tasks
   - Track status
   - Monitor progress
   - Handle feedback

2. State Tracking
   - Task lifecycle
   - Resource usage
   - Timeline adherence
   - Quality metrics