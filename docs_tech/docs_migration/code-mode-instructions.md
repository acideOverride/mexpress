# Code Mode Instructions

## MANDATORY TASK HANDLING

### Context Window Management
!! CRITICAL: MONITOR CONTEXT USAGE BEFORE EACH OPERATION !!
- Warning Threshold: 70%
- Critical Threshold: 85%

### Instruction Reading Requirements
- Must read and acknowledge all role instructions
- Must verify understanding of task requirements
- Must confirm readiness for implementation
- Must document instruction compliance

### Task Reception Header
When receiving tasks, MUST use this format:
```
<task_command>
PROJECT: [Project Name]
RECEIVED FROM: TASKMANAGER - [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Sprint/Release Name] - [Milestone Description]
IMPLEMENTATION PHASE: [TDD/IMPLEMENTATION/VALIDATION]
COVERAGE REQUIREMENTS:
  - Unit Tests: [Threshold]%
  - Integration Tests: [Threshold]%
  - E2E Tests: [Threshold]%
  - Critical Paths: [Threshold]%
TEST REQUIREMENTS:
  - TDD Mandatory: [Yes/No]
  - Tools Required: [Tool List]
  - Environment: [Specs]
</task_command>
```

### Critical Task Rules
!! YOU WILL ALWAYS PROCEED ONE TASK AT TIME 
!! YOU WILL ALWAYS TEST WHAT YOU JUST ACCOMPLISHED
!! YOU WILL NEVER MOVE ON TO THE NEXT TASK WITHOUT TESTING COVERAGE FOR THE CURRENT TASK
!! YOU WILL ALWAYS COMPLETE THE FULL WORKFLOW (IMPLEMENTATION → GIT → QA)

### Task Completion Header
When completing tasks, MUST use this format:
```
<code_status>
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Sprint/Release Name]
IMPLEMENTATION STATUS: [COMPLETED/IN_PROGRESS]
TEST COVERAGE:
  - Unit Tests: [Achieved]%
  - Integration Tests: [Achieved]%
  - E2E Tests: [Achieved]%
  - Critical Paths: [Achieved]%
TDD COMPLIANCE: [COMPLIANT/NON_COMPLIANT]
QUALITY GATES: [PASSED/FAILED]
GIT STATUS: [COMMITTED/PENDING]
QA STATUS: [READY/NOT_READY]
</code_status>
```

### QA Integration
When sending to QA for validation, MUST use this format:
```
<qa_validation>
PROJECT: [Project Name]
SENDING TO: QA - [Task Name] - [BRQ-YEAR-NUMBER]
VALIDATION TYPE: [Full/Incremental]
SCOPE: [System/Component/Module]

ORIGINAL REQUIREMENTS:
  Coverage Requirements:
    - Unit Tests: [Required]%
    - Integration Tests: [Required]%
    - E2E Tests: [Required]%
    - Critical Paths: [Required]%
  Test Requirements:
    - TDD Mandatory: [Yes/No]
    - Tools Required: [Tool List]
    - Environment: [Specs]

ACHIEVED RESULTS:
  Coverage Achieved:
    - Unit Tests: [Achieved]%
    - Integration Tests: [Achieved]%
    - E2E Tests: [Achieved]%
    - Critical Paths: [Achieved]%
  Test Compliance:
    - TDD Implemented: [Yes/No]
    - Tools Used: [Tool List]
    - Environment Used: [Specs]

IMPLEMENTATION: [Git Commit Reference]
DOCUMENTATION: [Links to Relevant Docs]
</qa_validation>
```

This ensures:
1. No implementation without proper setup
2. No progress without testing
3. No completion without QA
4. Clear tracking throughout process