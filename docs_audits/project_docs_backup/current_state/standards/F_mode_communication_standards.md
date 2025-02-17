# Mode Communication Standards

## 1. Mandatory Headers

### TASKMANAGER Mode Header
```
Roo: TASKMANAGER
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
PRIORITY: [High/Medium/Low]
ASSIGNED TO: [Mode Name]
TIMELINE: [Start-End Dates]
GIT CONTEXT: [Branch/Commit Reference]
```

### CODE Mode Header
```
Roo: CODE
PROJECT: [Project Name]
TASK: [Task Name] - [BRQ-YEAR-NUMBER]
STATUS: [IN_PROGRESS/COMPLETED/BLOCKED]
PROGRESS: [Percentage]
BLOCKERS: [If Any]
NEXT ACTIONS: [Required Steps]
GIT STATUS: [COMMITTED/PENDING]
```

### ARCHITECT Mode Header
```
Roo: ARCHITECT
PROJECT: [Project Name]
DECISION: [Decision Name] - [BRQ-YEAR-NUMBER]
IMPACT: [High/Medium/Low]
SCOPE: [System/Component]
RATIONALE: [Brief Explanation]
GIT CONTEXT: [Branch/Commit Reference]
```

### GPM Mode Header
```
Roo: GPM
PROJECT: [Project Name]
MILESTONE: [Milestone Name] - [BRQ-YEAR-NUMBER]
STATUS: [PLANNED/IN_PROGRESS/COMPLETED]
PROGRESS: [Percentage]
BLOCKERS: [If Any]
NEXT ACTIONS: [Required Steps]
GIT STATUS: [COMMITTED/PENDING]
```

## 2. Mode Transition Protocol

### Handoff Requirements
1. Current Mode
   - Complete current task/phase
   - Document state
   - Prepare handoff package
   - Update status

2. Transition
   - Use switch_mode tool
   - Include clear reason
   - Reference task/decision
   - Maintain context

3. Receiving Mode
   - Acknowledge receipt
   - Verify handoff package
   - Confirm understanding
   - Begin assigned work

### Example Handoff
```
Roo: TASKMANAGER
PROJECT: Example Project
TASK: Handoff to CODE - BRQ-2025-XXX
STATUS: COMPLETED
PROGRESS: 100%
NEXT ACTIONS: Switch to CODE mode
GIT STATUS: COMMITTED

<switch_mode>
<mode_slug>code</mode_slug>
<reason>Task fully specified and ready for implementation</reason>
</switch_mode>
```

## 3. Quality Gates

### Header Validation
- All required fields present
- Correct format used
- Proper references included
- Status accurately reflected

### State Preservation
- Document current state
- Include all references
- Maintain context
- Track progress

### Documentation Requirements
- Update relevant docs
- Cross-reference decisions
- Maintain task links
- Track changes

## 4. Error Prevention

### Common Mistakes
1. Missing Headers
   ❌ Starting without proper header
   ✅ Always include mode-specific header

2. Incomplete Information
   ❌ Partial task references
   ✅ Complete BRQ numbers and context

3. Poor Handoffs
   ❌ Direct mode switching
   ✅ Proper handoff documentation

4. Lost Context
   ❌ Missing references
   ✅ Complete context preservation

### Enforcement
1. Automated Checks
   - Header presence
   - Format validation
   - Reference verification
   - State tracking

2. Manual Reviews
   - Context completeness
   - Information accuracy
   - Proper transitions
   - Documentation updates

## 5. Implementation

### For Team Members
1. Before Starting
   - Review mode requirements
   - Check current context
   - Verify task assignment
   - Prepare header

2. During Work
   - Maintain proper headers
   - Document progress
   - Update status
   - Track changes

3. Before Transitions
   - Complete current work
   - Document state
   - Prepare handoff
   - Verify requirements

### For Reviewers
1. Check Headers
   - Proper format
   - Complete information
   - Accurate status
   - Correct references

2. Verify Transitions
   - Complete handoff
   - Clear reasoning
   - Preserved context
   - Proper documentation

## References
- A_foundation.md
- B_architecture.md
- C_development_principles.md
- D_quality_security.md
- E_process_workflow.md