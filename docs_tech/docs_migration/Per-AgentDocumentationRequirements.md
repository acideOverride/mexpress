Per-Agent Documentation Requirements:
Each agent needs clear definition of:

Read permissions (which folders/files)
Write permissions (which folders/files)
Acknowledgment requirements
Validation responsibilities
QA integration points



Next Steps:
Create documentation audit task
Map current agent behaviors
Design new folder structure
Define per-agent documentation rules
Plan incremental implementation



Project Structure and Responsibility:

1. Root Level Structure:
```
/opt/mExpress/docs/
├── standards/                    # Global standards/templates
└── projects/                    # All projects root
    ├── mexpress_framework/      # Core framework project
    │   ├── core_setup/         # Core framework setup
    │   ├── service_mesh/       # Service mesh implementation
    │   └── message_queue/      # Message queue system
    │
    ├── montpc_crm/             # Client project
    │   └── [Full structure]    # As defined below
    └── rental_bike/            # Client project
        └── [Full structure]    # As defined below
```

2. Project Creation Process:
- ASK agent is responsible for:
  * Creating new project directory with standardized name
  * Initial project setup
  * Creating business/ directory with initial docs
  * Triggering project structure creation

3. Project Naming Convention:
```
For Framework Components:
{component_name}/
Examples:
- core_setup/
- service_mesh/
- message_queue/

For Client Projects:
{client}_{purpose}/
Examples:
- montpc_crm/
- rental_bike/
- hospital_scheduling/
```

4. File Naming Convention:
```
{COMPONENT}-{TYPE}-{STATUS}.md

Where:
COMPONENT: Descriptive name (CORE, MVP, FRAMEWORK, etc.)
TYPE: SPEC, ARCH, IMPL, GIT, etc.
STATUS: APPROVED, COMPLETED, REVISED, etc.

Examples:
- CORE-SPEC-APPROVED.md
- MVP-IMPL-COMPLETED.md
- FRAMEWORK-ARCH-REVISED.md
```

2. Project Creation Process:
- ASK agent is responsible for:
  * Creating new project directory with standardized name
  * Initial project setup
  * Creating business/ directory with initial docs
  * Triggering project structure creation

3. Project Naming Convention:
```
{client}_{purpose}
Examples:
- montpc_crm
- rental_bike
- hospital_scheduling
```

4. Project Creation Steps by ASK:
1. Receive business request
2. Create project directory
3. Initialize structure
4. Create initial business docs
5. Hand off to next agent (UXUI or ARCHITECT)

This ensures:
- Clear project separation
- Consistent naming
- Single point of creation
- Proper initialization
- Clean structure




Complete Component Structure

Example for core_setup component:

```
/opt/mExpress/docs/projects/mexpress_framework/core_setup/
├── business/
│   ├── CORE-SPEC-DRAFT.md           # Created by: ASK
│   ├── CORE-REQ-APPROVED.md         # Created by: ASK
│   ├── CORE-VALUE-APPROVED.md       # Created by: ASK
│   ├── CORE-STATUS-CURRENT.md       # Created by: ASK
│   └── handoff/
│       ├── CORE-HANDOFF-UXUI.md     # Created by: ASK -> UXUI
│       └── CORE-HANDOFF-ARCH.md     # Created by: ASK -> ARCHITECT
│
├── uxui/
│   ├── CORE-DESIGN-SPEC.md        # Created by: UXUI
│   ├── CORE-COMP-SPEC.md          # Created by: UXUI
│   ├── CORE-DESIGN-STATUS.md      # Created by: UXUI
│   ├── qa/
│   │   ├── CORE-DESIGN-QA.md      # Created by: QA
│   │   ├── CORE-USABILITY-QA.md   # Created by: QA
│   │   └── CORE-QA-DECISION.md    # Created by: QA (ACCEPTED/REJECTED)
│   └── handoff/
│       └── CORE-HANDOFF-ARCH.md   # Created by: UXUI -> ARCHITECT
│
├── architecture/
│   ├── CORE-TECH-SPEC.md         # Created by: ARCHITECT
│   ├── CORE-DESIGN-DEC.md        # Created by: ARCHITECT
│   ├── CORE-ARCH-STATUS.md       # Created by: ARCHITECT
│   ├── qa/
│   │   ├── CORE-ARCH-QA.md       # Created by: QA
│   │   ├── CORE-TECH-QA.md       # Created by: QA
│   │   └── CORE-QA-DECISION.md   # Created by: QA (ACCEPTED/REJECTED)
│   └── handoff/
│       └── CORE-HANDOFF-GPM.md   # Created by: ARCHITECT -> GPM
│
├── project/
│   ├── CORE-MILESTONE-SPEC.md     # Created by: GPM
│   ├── CORE-RESOURCE-PLAN.md      # Created by: GPM
│   ├── CORE-TIMELINE-SPEC.md      # Created by: GPM
│   ├── CORE-PROJECT-STATUS.md     # Created by: GPM
│   ├── qa/
│   │   ├── CORE-GPM-QA.md        # Created by: QA
│   │   ├── CORE-PLAN-QA.md       # Created by: QA
│   │   └── CORE-QA-DECISION.md   # Created by: QA (ACCEPTED/REJECTED)
│   └── handoff/
│       └── CORE-HANDOFF-TM.md    # Created by: GPM -> TASKMANAGER
│
├── tasks/
│   ├── CORE-TASK-BREAKDOWN.md    # Created by: TASKMANAGER
│   ├── CORE-TASK-ASSIGN.md       # Created by: TASKMANAGER
│   ├── CORE-TASK-DEPS.md         # Created by: TASKMANAGER
│   ├── CORE-TASK-STATUS.md       # Created by: TASKMANAGER
│   ├── qa/
│   │   ├── CORE-TASK-QA.md       # Created by: QA
│   │   ├── CORE-COVERAGE-QA.md   # Created by: QA
│   │   └── CORE-QA-DECISION.md   # Created by: QA (ACCEPTED/REJECTED)
│   └── handoff/
│       └── CORE-HANDOFF-CODE.md  # Created by: TASKMANAGER -> CODE
│
├── implementation/
│   ├── CORE-IMPL-PROGRESS.md     # Created by: CODE
│   ├── CORE-IMPL-BLOCKERS.md     # Created by: CODE
│   ├── CORE-IMPL-COMPLETE.md     # Created by: CODE
│   ├── CORE-IMPL-STATUS.md       # Created by: CODE
│   ├── qa/
│   │   ├── CORE-CODE-QA.md       # Created by: QA
│   │   ├── CORE-TEST-QA.md       # Created by: QA
│   │   └── CORE-QA-DECISION.md   # Created by: QA (ACCEPTED/REJECTED)
│   └── handoff/
│       ├── CORE-HANDOFF-DEBUG.md # Created by: CODE -> DEBUG
│       └── CORE-HANDOFF-GIT.md   # Created by: CODE -> GIT
│
├── debug/
│   ├── CORE-DEBUG-ISSUES.md      # Created by: DEBUG
│   ├── CORE-DEBUG-ANALYSIS.md    # Created by: DEBUG
│   ├── CORE-DEBUG-FIXES.md       # Created by: DEBUG
│   ├── CORE-DEBUG-STATUS.md      # Created by: DEBUG
│   ├── qa/
│   │   ├── CORE-DEBUG-QA.md      # Created by: QA
│   │   ├── CORE-FIX-QA.md        # Created by: QA
│   │   └── CORE-QA-DECISION.md   # Created by: QA (ACCEPTED/REJECTED)
│   └── handoff/
│       └── CORE-HANDOFF-GIT.md   # Created by: DEBUG -> GIT
│
└── git/
    ├── CORE-GIT-VERSION.md       # Created by: GIT
    ├── CORE-GIT-BRANCHES.md      # Created by: GIT
    ├── CORE-GIT-MERGES.md        # Created by: GIT
    ├── CORE-GIT-STATUS.md        # Created by: GIT
    └── completion/
        ├── CORE-GIT-FINAL.md     # Created by: GIT
        └── CORE-GIT-ARCHIVE.md   # Created by: GIT

```

Key Improvements:
1. Standardized File Naming Convention:
   - Format: {COMPONENT}-{TYPE}-{STATUS}.md
   - COMPONENT: Project component (e.g., CORE, UI, API)
   - TYPE: Document type (e.g., SPEC, QA, HANDOFF)
   - STATUS: Current state (e.g., DRAFT, APPROVED, COMPLETE)

2. Clear Ownership and Flow:
   - Each file clearly indicates creator and owner
   - Handoff files show clear progression
   - QA integration at each major step
   - Status tracking throughout workflow

3. Consistent Structure:
   - Same structure across all components
   - Standardized QA integration
   - Uniform handoff documentation
   - Clear validation points





Acknowledgment Requirements By Agent:

1. ASK Agent Must Acknowledge:
```
Before Starting:
- Business request completeness
- Project scope clarity
- Resource availability
- Timeline constraints

Create Acknowledgment In:
└── projects/{client}_{purpose}/business/
    └── acknowledgments/
        ├── request-review.md      # Confirms request understanding
        ├── scope-acceptance.md    # Confirms scope is clear
        └── handoff-checklist.md   # Pre-handoff verification
```

2. UXUI Agent Must Acknowledge:
```
Before Starting:
- Business requirements
- Design constraints
- Technical limitations
- Brand guidelines

Create Acknowledgment In:
└── projects/{client}_{purpose}/uxui/
    └── acknowledgments/
        ├── requirements-review.md  # Confirms understanding requirements
        ├── constraints-check.md    # Confirms understanding limitations
        └── handoff-checklist.md    # Pre-handoff verification
```

3. ARCHITECT Agent Must Acknowledge:
```
Before Starting:
- Business requirements
- UXUI design decisions
- Technical constraints
- System dependencies

Create Acknowledgment In:
└── projects/{client}_{purpose}/architecture/
    └── acknowledgments/
        ├── requirements-review.md  # Confirms understanding requirements
        ├── design-review.md        # Confirms UXUI review
        └── handoff-checklist.md    # Pre-handoff verification
```

4. GPM Agent Must Acknowledge:
```
Before Starting:
- Architecture decisions
- Resource requirements
- Timeline constraints
- Dependencies

Create Acknowledgment In:
└── projects/{client}_{purpose}/project/
    └── acknowledgments/
        ├── architecture-review.md  # Confirms architecture understanding
        ├── resource-check.md       # Confirms resource availability
        └── handoff-checklist.md    # Pre-handoff verification
```

5. TASKMANAGER Agent Must Acknowledge:
```
Before Starting:
- Project plan
- Resource allocation
- Technical requirements
- Timeline constraints

Create Acknowledgment In:
└── projects/{client}_{purpose}/tasks/
    └── acknowledgments/
        ├── plan-review.md         # Confirms project plan understanding
        ├── resource-check.md      # Confirms resource allocation
        └── handoff-checklist.md   # Pre-handoff verification
```

6. CODE Agent Must Acknowledge:
```
Before Starting:
- Task requirements
- Technical specifications
- Quality standards
- Test requirements

Create Acknowledgment In:
└── projects/{client}_{purpose}/implementation/
    └── acknowledgments/
        ├── task-review.md         # Confirms task understanding
        ├── standards-check.md     # Confirms understanding of standards
        └── handoff-checklist.md   # Pre-handoff verification
```

7. DEBUG Agent Must Acknowledge:
```
Before Starting:
- Issue reports
- System context
- Test results
- Performance requirements

Create Acknowledgment In:
└── projects/{client}_{purpose}/debug/
    └── acknowledgments/
        ├── issue-review.md        # Confirms issue understanding
        ├── context-check.md       # Confirms system context understanding
        └── handoff-checklist.md   # Pre-handoff verification
```

8. GIT Agent Must Acknowledge:
```
Before Starting:
- Code completeness
- Test coverage
- QA approval
- Release requirements

Create Acknowledgment In:
└── projects/{client}_{purpose}/git/
    └── acknowledgments/
        ├── code-review.md         # Confirms code completeness
        ├── qa-check.md           # Confirms QA approval
        └── handoff-checklist.md   # Pre-handoff verification
```

Standard Acknowledgment Format:
```markdown
# Acknowledgment Document

## Document Information
- Type: [Review/Check/Handoff]
- Date: [Timestamp]
- Agent: [Agent Name]
- Project: [Project Name]

## Items Acknowledged
1. [Item 1]
   - Status: [Reviewed/Accepted/Rejected]
   - Notes: [Any specific notes]

2. [Item 2]
   - Status: [Reviewed/Accepted/Rejected]
   - Notes: [Any specific notes]

## Dependencies Checked
- [Dependency 1]: [Status]
- [Dependency 2]: [Status]

## Confirmation
- [ ] All required documents reviewed
- [ ] All requirements understood
- [ ] All dependencies checked
- [ ] Ready to proceed

## Sign-off
Agent: [Digital Signature]
Date: [Timestamp]
```

Key Features:
1. Clear acknowledgment points
2. Standardized format
3. Traceable confirmations
4. Dependency checking
5. Digital sign-off



Validation Responsibilities By Agent:

1. ASK Agent Validates:
```
Business Requirements:
- Completeness of requirements
- Clarity of objectives
- Stakeholder alignment
- Business value proposition

Validation Points:
└── projects/{client}_{purpose}/business/validation/
    ├── requirements-validation.md
    │   - All requirements are SMART
    │   - No conflicting requirements
    │   - All stakeholders identified
    │   - Clear success criteria
    │
    ├── value-validation.md
    │   - Clear business value
    │   - ROI assessment
    │   - Risk assessment
    │   - Market alignment
    │
    └── handoff-validation.md
        - All required docs present
        - All sections complete
        - All approvals obtained
```

2. UXUI Agent Validates:
```
Design Requirements:
- User experience flow
- Design system compliance
- Accessibility standards
- Brand guidelines

Validation Points:
└── projects/{client}_{purpose}/uxui/validation/
    ├── design-validation.md
    │   - Design system compliance
    │   - Component consistency
    │   - Layout standards
    │   - Responsive design
    │
    ├── accessibility-validation.md
    │   - WCAG compliance
    │   - Screen reader support
    │   - Color contrast
    │   - Keyboard navigation
    │
    └── handoff-validation.md
        - Design specs complete
        - Assets prepared
        - Documentation ready
```

3. ARCHITECT Agent Validates:
```
Technical Requirements:
- System design
- Technical feasibility
- Performance requirements
- Security standards

Validation Points:
└── projects/{client}_{purpose}/architecture/validation/
    ├── design-validation.md
    │   - Architecture patterns
    │   - System scalability
    │   - Integration points
    │   - Security measures
    │
    ├── feasibility-validation.md
    │   - Technical constraints
    │   - Resource requirements
    │   - Timeline feasibility
    │   - Risk assessment
    │
    └── handoff-validation.md
        - All diagrams complete
        - All decisions documented
        - All standards met
```

4. GPM Agent Validates:
```
Project Requirements:
- Resource allocation
- Timeline feasibility
- Budget alignment
- Risk management

Validation Points:
└── projects/{client}_{purpose}/project/validation/
    ├── resource-validation.md
    │   - Team availability
    │   - Skill requirements
    │   - Tool availability
    │   - Budget allocation
    │
    ├── timeline-validation.md
    │   - Milestone feasibility
    │   - Dependencies mapped
    │   - Critical path analyzed
    │   - Buffer allocation
    │
    └── handoff-validation.md
        - All plans approved
        - All resources confirmed
        - All risks documented
```

5. TASKMANAGER Agent Validates:
```
Task Requirements:
- Task breakdown
- Resource assignment
- Dependencies
- Delivery timeline

Validation Points:
└── projects/{client}_{purpose}/tasks/validation/
    ├── task-validation.md
    │   - Task completeness
    │   - Effort estimation
    │   - Priority assignment
    │   - Dependency mapping
    │
    ├── assignment-validation.md
    │   - Resource availability
    │   - Skill matching
    │   - Workload balance
    │   - Timeline alignment
    │
    └── handoff-validation.md
        - All tasks defined
        - All assignments made
        - All dependencies resolved
```

6. CODE Agent Validates:
```
Implementation Requirements:
- Code standards
- Test coverage
- Performance metrics
- Documentation

Validation Points:
└── projects/{client}_{purpose}/implementation/validation/
    ├── code-validation.md
    │   - Coding standards
    │   - Best practices
    │   - Error handling
    │   - Security measures
    │
    ├── test-validation.md
    │   - Unit tests
    │   - Integration tests
    │   - Performance tests
    │   - Security tests
    │
    └── handoff-validation.md
        - All tests passing
        - Coverage requirements met
        - Documentation complete
```

7. DEBUG Agent Validates:
```
Debug Requirements:
- Issue resolution
- Fix implementation
- Regression testing
- Performance impact

Validation Points:
└── projects/{client}_{purpose}/debug/validation/
    ├── fix-validation.md
    │   - Issue resolution
    │   - Code quality
    │   - Performance impact
    │   - Side effects
    │
    ├── regression-validation.md
    │   - Test coverage
    │   - System stability
    │   - Integration points
    │   - Performance metrics
    │
    └── handoff-validation.md
        - All issues resolved
        - All tests passing
        - No regressions
```

8. GIT Agent Validates:
```
Version Control Requirements:
- Branch strategy
- Merge conflicts
- Release readiness
- Documentation

Validation Points:
└── projects/{client}_{purpose}/git/validation/
    ├── branch-validation.md
    │   - Branch naming
    │   - Commit messages
    │   - Code reviews
    │   - Merge conflicts
    │
    ├── release-validation.md
    │   - Version tagging
    │   - Release notes
    │   - Deployment checks
    │   - Rollback plan
    │
    └── completion-validation.md
        - All merges complete
        - All tags applied
        - All docs updated
```

Standard Validation Format:
```markdown
# Validation Document

## Validation Information
- Type: [Code/Design/Process]
- Date: [Timestamp]
- Agent: [Agent Name]
- Project: [Project Name]

## Validation Checklist
1. [Requirement 1]
   - Criteria: [Specific criteria]
   - Status: [Pass/Fail/Partial]
   - Evidence: [Link/Reference]
   - Notes: [Details]

2. [Requirement 2]
   - Criteria: [Specific criteria]
   - Status: [Pass/Fail/Partial]
   - Evidence: [Link/Reference]
   - Notes: [Details]

## Issues Found
- [Issue 1]: [Description]
  * Severity: [High/Medium/Low]
  * Resolution: [Required action]

## Validation Result
- Overall Status: [Approved/Rejected]
- Blocking Issues: [Count]
- Required Actions: [List]

## Sign-off
Validator: [Digital Signature]
Date: [Timestamp]
```

QA Integration Points:

1. QA/GPM Integration:
```
Location: /projects/{client}_{purpose}/project/qa/
├── quality-gates/
│   ├── QG1-planning.md
│   │   - Resource allocation check
│   │   - Timeline feasibility
│   │   - Risk assessment
│   │   - Budget validation
│   │
│   └── QG2-milestone.md
│       - Milestone definition check
│       - Dependency mapping
│       - Critical path analysis
│       - Buffer allocation
│
├── reports/
│   ├── planning-qa-report.md
│   │   - Planning completeness
│   │   - Resource availability
│   │   - Risk mitigation
│   │   - Timeline feasibility
│   │
│   └── milestone-qa-report.md
│       - Milestone clarity
│       - Resource alignment
│       - Timeline realism
│       - Risk coverage
│
└── decisions/
    ├── planning-decision.md
    │   Status: [ACCEPTED/REJECTED]
    │   Blockers: [List]
    │   Actions: [Required fixes]
    │
    └── milestone-decision.md
        Status: [ACCEPTED/REJECTED]
        Blockers: [List]
        Actions: [Required fixes]
```

2. QA/Task Manager Integration:
```
Location: /projects/{client}_{purpose}/tasks/qa/
├── quality-gates/
│   ├── QG1-breakdown.md
│   │   - Task completeness
│   │   - Effort estimation
│   │   - Resource matching
│   │   - Timeline alignment
│   │
│   └── QG2-assignment.md
│       - Resource availability
│       - Skill requirements
│       - Workload balance
│       - Dependency resolution
│
├── reports/
│   ├── breakdown-qa-report.md
│   │   - Task structure
│   │   - Coverage analysis
│   │   - Estimation accuracy
│   │   - Risk assessment
│   │
│   └── assignment-qa-report.md
│       - Resource allocation
│       - Timeline feasibility
│       - Dependency management
│       - Risk mitigation
│
└── decisions/
    ├── breakdown-decision.md
    │   Status: [ACCEPTED/REJECTED]
    │   Blockers: [List]
    │   Actions: [Required fixes]
    │
    └── assignment-decision.md
        Status: [ACCEPTED/REJECTED]
        Blockers: [List]
        Actions: [Required fixes]
```

3. QA/Code Integration:
```
Location: /projects/{client}_{purpose}/implementation/qa/
├── quality-gates/
│   ├── QG1-implementation.md
│   │   - Code standards check
│   │   - Best practices review
│   │   - Security assessment
│   │   - Performance review
│   │
│   └── QG2-testing.md
│       - Test coverage check
│       - Test quality review
│       - Integration testing
│       - Performance testing
│
├── reports/
│   ├── implementation-qa-report.md
│   │   - Code quality metrics
│   │   - Standards compliance
│   │   - Security assessment
│   │   - Performance metrics
│   │
│   └── testing-qa-report.md
│       - Test coverage metrics
│       - Test results analysis
│       - Integration status
│       - Performance results
│
└── decisions/
    ├── implementation-decision.md
    │   Status: [ACCEPTED/REJECTED]
    │   Blockers: [List]
    │   Actions: [Required fixes]
    │
    └── testing-decision.md
        Status: [ACCEPTED/REJECTED]
        Blockers: [List]
        Actions: [Required fixes]
```

Standard QA Report Format:
```markdown
# QA Report

## Report Information
- Type: [GPM/Task/Code]
- Phase: [Planning/Implementation/Testing]
- Date: [Timestamp]
- QA Agent: [Name]
- Project: [Project Name]

## Quality Gate Checklist
1. [Requirement 1]
   - Criteria: [Specific criteria]
   - Status: [Pass/Fail/Partial]
   - Evidence: [Link/Reference]
   - Impact: [High/Medium/Low]

2. [Requirement 2]
   - Criteria: [Specific criteria]
   - Status: [Pass/Fail/Partial]
   - Evidence: [Link/Reference]
   - Impact: [High/Medium/Low]

## Issues Found
- [Issue 1]
  * Severity: [Critical/High/Medium/Low]
  * Impact: [Description]
  * Required Action: [Fix details]
  * Timeline: [Expected fix time]

## Metrics
- [Metric 1]: [Value]
- [Metric 2]: [Value]

## Decision
- Status: [ACCEPTED/REJECTED]
- Blocking Issues: [Count]
- Required Actions: [List]
- Re-review Required: [Yes/No]

## Sign-off
QA Agent: [Digital Signature]
Date: [Timestamp]
```

Key Features:
1. Two quality gates per integration point
2. Detailed metrics and criteria
3. Clear decision points
4. Action tracking
5. Evidence requirements
6. Impact assessment
7. Standardized format

Would you like me to detail any specific quality gate criteria further?