# Mandatory Task Header Template

## Task Reception Validation
```
Roo: CODE
PROJECT: [Project Name]
RECEIVED FROM: TASKMANAGER - [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Sprint/Release Name] - [Milestone Description]
IMPLEMENTATION PHASE: [TDD/IMPLEMENTATION/VALIDATION]
COVERAGE REQUIREMENTS: [Percentage]

TASK VALIDATION:
✓ Source: TASKMANAGER verified
✓ Task Reference: [BRQ-YEAR-NUMBER] confirmed
✓ Documentation: Task exists in project docs

SCOPE BOUNDARIES:
Authorized Files:
- [List of specific files]
- [Test files]
- [Documentation files]

Authorized Changes:
- [Specific feature implementation]
- [Test coverage requirements]
- [Documentation updates]

NOT Authorized:
- Files outside task scope
- Unrelated improvements
- Coverage fixes for other components

QUALITY REQUIREMENTS:
- Coverage Threshold: [X]%
- Quality Gates: [List of gates]
- Performance Metrics: [Requirements]

VALIDATION STATUS: [APPROVED/REJECTED]
If REJECTED:
- Reason: [Explanation]
- Action: Return to TASKMANAGER
```

## Task Execution Header
```
IMPLEMENTATION TRACKING:
Current File: [File being modified]
Scope Check:
- [ ] Within authorized files
- [ ] Within feature scope
- [ ] Within coverage scope

On Scope Conflict:
1. Stop implementation
2. Document issue
3. Report to TASKMANAGER
4. Await instructions
```

## Task Completion Header
```
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
RETURNING TO: TASKMANAGER
MILESTONE: [Sprint/Release Name]
IMPLEMENTATION STATUS: [COMPLETED/IN_PROGRESS]
TEST COVERAGE: [Percentage]
QUALITY GATES: [PASSED/FAILED]

SCOPE COMPLIANCE:
- Files Modified: [List of modified files]
- Changes Made: [List of implemented features]
- Coverage Changes: [Coverage delta]

BOUNDARY VERIFICATION:
- [ ] All changes within scope
- [ ] No unauthorized modifications
- [ ] No scope creep detected
```

## Elevation Header
```
TASK ELEVATION NOTICE:
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
ELEVATION TO: TASKMANAGER
REASON: [Scope/Coverage/Security/Performance]

ISSUE DETAILS:
- Component: [Affected component]
- Current State: [Description]
- Required Change: [Description]
- Impact: [Assessment]

REQUESTED ACTION:
- [ ] Scope expansion
- [ ] Coverage exception
- [ ] Additional authorization
- [ ] Other: [Specify]

STATUS: AWAITING TASKMANAGER RESPONSE
```

IMPORTANT:
- ALL headers MUST be completed before proceeding
- ANY missing information results in automatic rejection
- NO implementation without complete validation
- IMMEDIATE elevation of scope conflicts