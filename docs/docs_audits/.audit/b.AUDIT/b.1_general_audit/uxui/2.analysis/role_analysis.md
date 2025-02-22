# UXUI Agent Role Analysis

## Core Responsibilities

### Primary Functions
```yaml
design_patterns:
  - Component design
  - Interaction models
  - Visual hierarchy
  - Responsive layouts
  - Accessibility patterns

quality_attributes:
  - User experience
  - Accessibility
  - Usability
  - Performance
  - Visual consistency

research_integration:
  - User needs
  - Behavior patterns
  - Success metrics
  - Feedback analysis
  - Validation results
```

### Design Process
```yaml
incremental_design:
  rules:
    - One component at a time
    - Validate each design
    - Document incrementally
    - Track dependencies
    - Assess impact
  validation:
    required: true
    blocking: true
  documentation:
    - Design details
    - Component status
    - Pattern impact
    - Dependencies affected
    - Progress tracking
```

## Quality Standards

### Design Validation
```yaml
usability_requirements:
  - Validate user flows
  - Test interactions
  - Verify task completion
  - Check error handling
  - Monitor user satisfaction

accessibility_validation:
  - WCAG compliance
  - Screen reader testing
  - Keyboard navigation
  - Color contrast
  - Focus management

quality_gates:
  design_system:
    - Component consistency
    - Pattern documentation
    - Accessibility compliance
    - Responsive design
    - Visual harmony
  
  user_experience:
    - Usability validation
    - Research integration
    - Task completion
    - User satisfaction
    - Error prevention
```

## Process Controls

### Error Handling
```yaml
required_actions:
  - Document design issues
  - Update research logs
  - Create usability reports
  - Link to related documentation
  - Track resolution status

error_types:
  usability_issue:
    severity: high
    actions:
      - Document feedback
      - Update design
      - Retest with users
  
  accessibility_failure:
    severity: high
    actions:
      - Document violation
      - Implement fix
      - Verify compliance
  
  design_inconsistency:
    severity: medium
    actions:
      - Update design system
      - Apply changes
      - Verify consistency
```

### State Management
```yaml
required_actions:
  - Read state from previous mode
  - Update state during execution
  - Document state changes
  - Verify state before handoff
  - Maintain state history

state_tracking:
  design:
    fields:
      - phase
      - status
      - components
      - validation
    validation: required
  
  research:
    fields:
      - findings
      - feedback
      - metrics
    validation: required
```

## Integration Points

### Communication Protocol
```yaml
design_reception:
  from_ask:
    content:
      - Business requirements
      - User research
      - Success criteria
      - Value propositions

design_handoff:
  to_architect:
    content:
      - Design system updates
      - Component specifications
      - Interaction patterns
      - Technical constraints
      - Implementation guidelines

chain_rules:
  - Receive requirements from ASK
  - Report designs to ARCHITECT
  - Follow hierarchical chain
  - No cross-chain communication
  - Maintain design context
```

## Gaps Identified

1. Design Process
   - Lack of detailed design metrics
   - Missing design timeouts
   - No explicit chunking strategy
   - Limited dependency tracking

2. Research Management
   - No research size limits
   - Missing retention policy
   - Limited research validation
   - No storage strategy

3. Documentation
   - No version control requirements
   - Missing size limits
   - No update frequency defined
   - Limited change tracking

4. Integration
   - Limited error recovery procedures
   - Missing state transition guards
   - No emergency protocols
   - Limited rollback procedures

## Recommendations

1. Design Process
   - Add design metrics
   - Define timeout handling
   - Implement chunking strategy
   - Add dependency tracking

2. Research Management
   - Add size limits
   - Define retention policy
   - Enhance validation
   - Create storage strategy

3. Documentation Updates
   - Add version control
   - Define size limits
   - Specify update frequency
   - Implement change tracking

4. Integration Enhancements
   - Add recovery procedures
   - Implement transition guards
   - Add emergency protocols
   - Define rollback procedures