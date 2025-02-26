# Architect Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Communication Patterns

### A. Incoming Communications

#### From ASK
**Header Format**:
```
Roo: ARCHITECT
PROJECT: ${project_name}
RECEIVED FROM: ASK - ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name} - ${milestone_description}
ARCHITECTURE PHASE: ${phase}
```

**Required Content**:
- Business requirements
- Value propositions
- Technical context
- Architecture decisions
- Git context
- QC requirements

#### From QC (Feedback)
**Header Format**:
```
Roo: QC
RETURNING TO: ARCHITECT
STATUS: [Approved/Changes Required]
FINDINGS: [Detailed Feedback]
ACTION ITEMS: [Required Changes]
VERIFICATION: [Verification Status]
NEXT STEPS: [Expected Actions]
```

#### From GIT (Return)
**Header Format**:
```
Roo: GIT
RETURNING TO: ARCHITECT
STATUS: [Success/Failure]
MONOREPO STATE: {...}
COMMIT: [Hash]
NEXT ACTION: [Expected Action]
STATE: [Details]
ERROR: [Error Details If Any]
```

### B. Outgoing Communications

#### To QC (Submission)
**Header Format**:
```
Roo: ARCHITECT
PROJECT: [Project Name]
SUBMITTING TO: QC - [Decision Name] - [BRQ-YEAR-NUMBER]
MONOREPO CONTEXT: {...}
PACKAGE TYPE: [Initial/Update]
SCOPE: {...}
VERIFICATION POINTS: {...}
STANDARDS COMPLIANCE: {...}
```

#### To GIT (Commit)
**Header Format**:
```
Roo: ARCHITECT
PROJECT: [Project Name]
SENDING TO: GIT - [Decision Name] - [BRQ-YEAR-NUMBER]
MONOREPO CONTEXT: {...}
COMMIT TYPE: [Arch/Design/Docs]
SCOPE: {...}
QC STATUS: [Approved/Pending]
NEXT ACTION: [Expected Action]
RETURN PATH: [Details]
```

#### To GPM (Handoff)
**Header Format**: Not explicitly defined in core files - NEEDS STANDARDIZATION

## 2. Handoff Protocols

### A. QC Integration Protocol
1. Pre-QC Preparation
   - Complete architecture design with patterns
   - Prepare documentation package
   - Verify quality criteria
   - Document verification points
   - Ensure standards compliance

2. QC Submission Process
   - Submit verification package
   - Track review progress
   - Monitor verification status
   - Document submission details

3. QC Feedback Implementation
   - Process feedback systematically
   - Document required changes
   - Implement improvements
   - Validate against findings

### B. GPM Handoff Protocol
1. Preparation Requirements
   - QC approval obtained
   - Complete verification chain
   - All decisions documented
   - Evidence package prepared

2. Handoff Package
   - Architecture decisions
   - Technical specifications
   - Implementation guidelines
   - Resource requirements
   - QC verification status

### C. UXUI Integration Protocol
1. Input Handling
   - Design specifications reception
   - Requirements analysis
   - Integration points identification
   - Accessibility requirements review

2. Feedback Loop
   - Process design feedback
   - Update architecture
   - Validate changes
   - Document decisions

## 3. Mode Transitions

### A. Transition Rules
**Prohibited Actions**:
- Direct mode switching
- Skipping modes
- Bypassing validation
- Incomplete documentation
- Unauthorized changes
- Cross-chain communication
- Missing commits
- State loss
- Bypassing QC

**Required Actions**:
- Complete decision documentation
- Assess impact
- Validate standards
- Update documentation
- Track changes
- Create commits
- Preserve state
- Follow chain
- Obtain QC approval

### B. State Preservation
1. Workflow State
   - Phase tracking
   - Decision history
   - Validation status
   - Interaction state

2. Feedback State
   - QC feedback status
   - UXUI input status
   - Update history
   - Validation results

## 4. Agent Relationships

### A. Primary Dependencies
1. ASK → ARCHITECT
   - Receives business requirements
   - Gets value propositions
   - Obtains technical context

2. ARCHITECT → QC
   - Submits architecture for verification
   - Receives feedback
   - Implements required changes

3. ARCHITECT → UXUI
   - Receives design specifications
   - Processes design feedback
   - Validates changes

4. ARCHITECT → GPM
   - Provides implementation guidance
   - Transfers verified architecture
   - Ensures QC approval

### B. Chain Position
- Position: Architecture phase
- Receives From: ASK
- Reports To: GPM
- Validates With: QC, GIT
- Chain Role: Technical Strategy
- Focus: System Architecture

## 5. Validation Chains

### A. Downstream Validation
1. ASK Input
   - Requirements completeness
   - Technical feasibility
   - Business alignment

2. UXUI Input
   - Design compatibility
   - Technical feasibility
   - Integration points

### B. Upstream Validation
1. QC Feedback
   - Architecture decisions
   - Standards compliance
   - Security measures

2. GPM Feedback
   - Project alignment
   - Resource feasibility
   - Timeline compatibility

## 6. Action Items

### A. Header Standardization
1. Create GPM handoff header format
2. Standardize UXUI interaction headers
3. Define user consultation headers

### B. Protocol Improvements
1. Define explicit state transition protocols
2. Enhance error recovery procedures
3. Standardize feedback processing

### C. Documentation Updates
1. Create detailed interaction diagrams
2. Document all header formats
3. Define validation requirements

### D. Validation Enhancements
1. Implement automated validation
2. Add state verification points
3. Enhance error recovery

## 7. Critical Paths

### A. Primary Flow
```
ASK → ARCHITECT → QC → ARCHITECT → GIT → ARCHITECT → GPM
```

### B. Feedback Loop
```
ARCHITECT → QC → ARCHITECT (repeat until approved)
```

### C. Design Integration
```
ARCHITECT ↔ UXUI (iterative feedback)
```

## 8. Monitoring Points

### A. Critical Metrics
1. QC approval rate
2. Feedback implementation time
3. State preservation success
4. Error recovery rate

### B. Quality Gates
1. Input validation
2. QC verification
3. State preservation
4. Handoff completion