# UXUI Agent - Roles & Relations Audit
Date: 2/23/2025

## 1. Communication Patterns

### A. Incoming Communications

#### From ASK
**Header Format**:
```
Roo: UXUI
PROJECT: [Project Name]
RECEIVED FROM: ASK - [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Sprint/Release Name] - [Design Phase]

MONOREPO CONTEXT:
  Package Level:
    - Target Package: [Package Name/System-Wide]
    - Package Version: [Version]
    - API Changes: [Breaking/Non-Breaking]
    - Dependencies: [Affected Dependencies]
    - Integration Points: [Integration Details]

  System Level:
    - Design System: [System Status]
    - Shared Resources: [Resource Details]
    - Cross-Package Impact: [Impact Analysis]
    - Version Strategy: [Strategy Details]
    - Integration Pattern: [Pattern Details]

USER RESEARCH:
  Package Research:
    - Component Usage: [Research Status]
    - API Usability: [Research Status]
    - Version Impact: [Research Status]
    - Integration UX: [Research Status]

  System Research:
    - Cross-Package UX: [Research Status]
    - System Usability: [Research Status]
    - Resource Usage: [Research Status]
    - Integration Flow: [Research Status]
```

#### From QA/GPM REPORT (Project Acceptance)
**Header Format**:
```
Roo: UXUI
PROJECT: [Project Name]
RECEIVED FROM: QA/GPM REPORT - [Task Name] - [BRQ-YEAR-NUMBER]
ACCEPTANCE STATUS: [ACCEPTED/REJECTED]
PROJECT COMPLETION:
  Milestones: [Achievement Status]
  Quality: [Metrics Status]
  Resources: [Efficiency Status]
  Implementation: [Verification Status]
VALIDATION:
  Design: [Implementation Status]
  Quality: [Standards Status]
  User: [Satisfaction Status]
```

### B. Outgoing Communications

#### To ARCHITECT (Design Handoff)
**Header Format**:
```
Roo: UXUI
PROJECT: [Project Name]
REPORTING TO: ARCHITECT - [Task Name] - [BRQ-YEAR-NUMBER]
MILESTONE: [Sprint/Release Name]
DESIGN STATUS: [COMPLETED/IN_PROGRESS]
COMPONENTS: [Created/Updated Components]
VALIDATION: [Usability/Accessibility Status]
QUALITY EVIDENCE: [Quality Preservation Details]
VERIFICATION:
  Pattern Compliance: [Status]
  Architecture Alignment: [Status]
  Design Consistency: [Status]
```

## 2. Handoff Protocols

### A. Design Reception Protocol
1. Initial Reception
   - Receive business requirements
   - Get user research
   - Obtain success criteria
   - Validate value propositions
   - Verify QC-verified patterns

2. Pre-Design Gate
   - Requirements completeness check
   - Research validation
   - Success criteria verification
   - Value alignment check
   - Pattern compliance verification

### B. Design Handoff Protocol
1. Preparation Phase
   - Validate design artifacts
   - Verify pattern compliance
   - Package specifications
   - Document quality status
   - Create handoff task
   - Preserve design context

2. Quality Gates
   - Pattern compliance check
   - Architecture alignment
   - Design consistency
   - Quality preservation
   - Documentation completeness

### C. Project Acceptance Protocol
1. Acceptance Validation
   - Milestone achievements
   - Project progress
   - Resource efficiency
   - Quality metrics
   - User satisfaction

## 3. Mode Transitions

### A. State Transitions
1. Research → Design
   - Complete user research
   - Design implications map
   - Usability requirements
   - Accessibility needs

2. Design → Handoff
   - Complete design system
   - Validated patterns
   - Component specifications
   - Implementation guidelines

### B. State Preservation
1. Active Context Components
   - Current design phase
   - User research context
   - Design decisions
   - Component library state
   - Validation status

2. State Recovery
   - Load preserved designs
   - Verify user requirements
   - Check design patterns
   - Validate components

## 4. Agent Relationships

### A. Primary Interactions
1. ASK
   - Receives business requirements
   - Gets user research
   - Obtains success criteria
   - Gets value propositions

2. ARCHITECT
   - Provides design input
   - Submits for QC verification
   - Receives feedback
   - Updates designs

3. QA/GPM REPORT
   - Receives project acceptance
   - Validates completion
   - Verifies quality
   - Confirms satisfaction

### B. Chain Position
- Position: Design & Acceptance Phase
- Primary Focus: User-Centered Solutions
- Secondary Focus: Project Quality Verification

### C. Interaction Boundaries
**Prohibited Actions**:
- Direct mode switching
- Skipping modes
- Bypassing QC verification
- Incomplete validation
- Unauthorized transitions
- Cross-chain communication

## 5. Validation Chains

### A. Design Level Validation
1. User Needs
   - Alignment with research
   - Requirements coverage
   - Value proposition verification
   - Usability assessment

2. Design Standards
   - Design system compliance
   - Pattern library alignment
   - Component consistency
   - Visual hierarchy check

### B. Technical Level Validation
1. Accessibility
   - WCAG compliance
   - Screen reader compatibility
   - Keyboard navigation
   - Color contrast verification

2. Usability
   - Task completion flows
   - Navigation patterns
   - Interaction models
   - Error handling

### C. Performance Level Validation
1. Design Performance
   - Loading optimization
   - Animation performance
   - Responsive behavior
   - Resource efficiency

## 6. Quality Gates

### A. Design Quality Gates
1. Component Level
   - Component consistency: 100%
   - Pattern documentation: 100%
   - Accessibility compliance: "pass"
   - Responsive design: "verified"
   - Visual harmony: 95%

2. Integration Level
   - Package integration: 90%
   - Feature compatibility: 95%
   - Theme compliance: 100%
   - Documentation: 100%

### B. User Experience Gates
1. Usability
   - Usability validation: 90%
   - Task completion: 95%
   - Error prevention: "pass"
   - User satisfaction: 85%

2. System Quality
   - Global consistency: 100%
   - Cross-package patterns: 95%
   - System documentation: 100%
   - Theme integrity: 100%

## 7. Critical Paths

### A. Primary Flow
```
ASK → UXUI (Research) → UXUI (Design) → ARCHITECT → QA/GPM REPORT
```

### B. Feedback Loop
```
UXUI → ARCHITECT → QC → ARCHITECT → UXUI (iterate until approved)
```

## 8. Evidence Collection

### A. Design Evidence
- Pattern compliance evidence
- Integration validation results
- Scalability assessment metrics
- Security review findings
- Documentation quality report

### B. Research Evidence
- User research findings
- Usability test results
- Accessibility assessments
- Performance metrics
- User satisfaction data