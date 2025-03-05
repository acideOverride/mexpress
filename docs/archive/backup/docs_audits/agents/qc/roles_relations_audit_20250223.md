# QC Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Communication Patterns

### A. Incoming Communications

#### From ARCHITECT
**Header Format**:
```
Roo: QC
PROJECT: ${project_name}
RECEIVED FROM: ARCHITECT - ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name} - ${milestone_description}
VERIFICATION PHASE: ${phase}
```

**Required Content**:
- Package Architecture Details
  * API Design
  * Breaking Changes
  * Version Strategy
  * Dependencies
  * Integration Points
  * Package Documentation
- Monorepo Architecture Details
  * Build System
  * Shared Resources
  * Cross-Package Dependencies
  * Integration Patterns
  * Version Alignment
  * System Documentation
- Core Architecture Details
  * Architecture Design
  * Design Patterns
  * Integration Approach
  * Scalability Design
  * Security Architecture
  * Documentation Package

### B. Outgoing Communications

#### To ARCHITECT (Feedback)
**Header Format**:
```
Roo: QC
PROJECT: ${project_name}
TASK: ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name}
VERIFICATION STATUS: ${status}
```

**Required Content**:
- Package Architecture Findings
- Monorepo Architecture Findings
- Core Architecture Findings
- Detailed Analysis
- Evidence Package
- Recommendations

## 2. Handoff Protocols

### A. Reception Protocol
1. Initial Reception Phase
   - Receive architecture package
   - Review quality criteria
   - Plan verification approach
   - Set up verification points
   - Prepare evidence collection

2. Pre-verification Gate
   - Complete architecture package received
   - Quality criteria understood
   - Verification plan prepared
   - Evidence collection ready
   - Tools configured

### B. Verification Protocol
1. Verification Phase
   - Execute pattern verification
   - Validate integration approach
   - Assess scalability design
   - Review security architecture
   - Verify documentation quality

2. Analysis Phase
   - Compile verification findings
   - Document identified issues
   - Assess overall quality
   - Prepare feedback package
   - Create evidence package

### C. Return Protocol
1. Feedback Preparation
   - Present detailed findings
   - Document verification status
   - Provide improvement guidance
   - Include evidence package
   - Track feedback acceptance

2. Quality Gates
   - Complete verification coverage
   - Evidence package completeness
   - Finding documentation quality
   - Recommendation clarity
   - Package organization

## 3. Mode Transitions

### A. State Transitions
1. Reception → Verification
   - Pre-verification gate passed
   - Resources allocated
   - Tools ready

2. Verification → Analysis
   - Verification execution gate passed
   - All checks completed
   - Evidence collected

3. Analysis → Feedback
   - Analysis complete gate passed
   - Findings documented
   - Recommendations ready

4. Feedback → Complete
   - Feedback ready gate passed
   - Package validated
   - Status confirmed

### B. State Preservation
1. Active Context Components
   - Current verification phase
   - Architecture package state
   - Evidence collection status
   - Verification findings
   - QC process state
   - Feedback preparation status

2. State Recovery
   - Load last valid checkpoint
   - Verify package integrity
   - Check evidence chain
   - Validate findings
   - Restore process state

## 4. Agent Relationships

### A. Primary Interaction
- Direct interaction with ARCHITECT only
- No direct CODE team interaction
- No direct TASKMANAGER interaction
- Clear workflow boundaries

### B. Workflow Position
- Receives from: ARCHITECT
- Reports to: ARCHITECT
- Focus: Architecture Verification
- Role: Quality Control

### C. Interaction Boundaries
**Allowed Interactions**:
- ARCHITECT

**Prohibited Interactions**:
- CODE
- TASKMANAGER
- QA
- GPM

## 5. Validation Chains

### A. Package Level Validation
1. Package Architecture
   - Package boundaries verified
   - API design validated
   - Dependencies reviewed
   - Cross-package communication checked
   - Version strategy confirmed

2. Package Documentation
   - Package docs complete
   - API documentation verified
   - Integration points documented
   - Version strategy documented
   - Cross-package impacts noted

### B. Monorepo Level Validation
1. Repository Structure
   - Repository structure validated
   - Package organization verified
   - Build configs checked
   - Integration patterns confirmed
   - Shared code reviewed

2. System Integration
   - Monorepo docs complete
   - Build process documented
   - Integration flows described
   - Shared code guidelines verified
   - Cross-package protocols documented

### C. Architecture Level Validation
1. Design Patterns
   - Complete architecture review
   - Pattern validation complete
   - Standards compliance checked
   - System integration verified
   - Security review completed

2. Documentation Quality
   - All sections completed
   - Clear findings presented
   - Standards referenced
   - Issues tracked
   - Status documented

## 6. Evidence Collection

### A. Package Evidence
- API design pattern validation
- Breaking changes impact analysis
- Version compatibility matrix
- Package dependency graphs
- Integration point verification
- Package isolation proof
- Package documentation review

### B. Monorepo Evidence
- Build system architecture validation
- Shared resource usage patterns
- Cross-package dependency maps
- Integration pattern verification
- Version alignment proof
- Resource allocation efficiency
- System documentation coverage

### C. Implementation Evidence
- Pattern compliance evidence
- Integration validation results
- Scalability assessment metrics
- Security review findings
- Documentation quality report

## 7. Critical Paths

### A. Primary Flow
```
ARCHITECT → QC (Verification) → QC (Analysis) → QC (Feedback) → ARCHITECT
```

### B. Evidence Chain
```
Reception → Evidence Collection → Analysis → Documentation → Validation → Return
```

## 8. Quality Gates

### A. Verification Gates
1. Pre-verification Gate
2. Verification Execution Gate
3. Analysis Complete Gate
4. Feedback Ready Gate

### B. Evidence Gates
1. Evidence Collection Complete
2. Evidence Chain Integrity
3. Evidence Documentation Quality
4. Evidence Package Readiness

### C. Documentation Gates
1. Finding Documentation Complete
2. Recommendation Quality
3. Package Organization
4. Status Documentation