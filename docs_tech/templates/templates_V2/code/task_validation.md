# Task Validation Template for Code Mode

## Initial Task Validation
```
TASK VALIDATION CHECKLIST:

1. Source Verification
   [ ] Task received from TASKMANAGER
   [ ] Valid BRQ-YEAR-NUMBER reference
   [ ] Task exists in project documentation

2. Scope Definition
   [ ] Clear task boundaries defined
   [ ] File modification list provided
   [ ] Coverage requirements specified
   [ ] Quality gates identified

3. Authorization Check
   [ ] Task officially assigned
   [ ] Required access levels granted
   [ ] Dependencies cleared
   [ ] Resources allocated
```

## Scope Boundary Check
```
SCOPE VERIFICATION:

1. File Access Scope
   Files authorized for modification:
   - [ ] List provided by TASKMANAGER
   - [ ] Within implementation directory
   - [ ] Coverage-related files
   - [ ] Test files for new features

2. Implementation Scope
   Authorized changes:
   - [ ] Feature implementation
   - [ ] Test creation/modification
   - [ ] Documentation updates
   - [ ] Coverage improvements

3. Quality Requirements
   - [ ] Coverage threshold defined
   - [ ] Quality gates specified
   - [ ] Performance metrics set
   - [ ] Security requirements listed
```

## Task Execution Protocol
```
EXECUTION CHECKLIST:

1. Before Implementation
   [ ] Validate task source
   [ ] Verify scope boundaries
   [ ] Check authorization
   [ ] Review dependencies

2. During Implementation
   [ ] Stay within scope
   [ ] Track modifications
   [ ] Document changes
   [ ] Monitor boundaries

3. On Scope Conflict
   [ ] Stop implementation
   [ ] Document issue
   [ ] Report to TASKMANAGER
   [ ] Await instructions
```

## Response Templates

### 1. Task Rejection
```
TASK REJECTION NOTICE:
Cannot proceed with task execution:
- Source: [Source of task]
- Reason: Task not assigned by TASKMANAGER
- Action: Please route request through TASKMANAGER
- Status: REJECTED
```

### 2. Scope Violation
```
SCOPE VIOLATION ALERT:
Implementation stopped due to scope conflict:
- Task: [BRQ-YEAR-NUMBER]
- Issue: [Description of scope violation]
- Impact: [Affected components]
- Status: ELEVATED TO TASKMANAGER
```

### 3. Coverage Issue
```
COVERAGE ESCALATION:
Coverage issue detected outside task scope:
- Task: [BRQ-YEAR-NUMBER]
- Location: [File/Component]
- Coverage: [Current/Required]
- Status: AWAITING TASKMANAGER DIRECTION
```

### 4. Task Elevation
```
TASK ELEVATION REQUEST:
Task requires scope adjustment:
- Current Scope: [Description]
- Required Change: [Details]
- Reason: [Justification]
- Status: PENDING TASKMANAGER APPROVAL
```

## Implementation Rules
```
STRICT ENFORCEMENT:

1. Task Acceptance
   - ONLY from TASKMANAGER
   - MUST have complete specifications
   - MUST have clear boundaries

2. Implementation Boundaries
   - NO scope expansion
   - NO unauthorized fixes
   - NO unrelated improvements

3. Issue Handling
   - MUST elevate out-of-scope issues
   - MUST await TASKMANAGER approval
   - MUST document all decisions
```

This template MUST be applied at the start of every task to ensure proper boundaries and authorization.