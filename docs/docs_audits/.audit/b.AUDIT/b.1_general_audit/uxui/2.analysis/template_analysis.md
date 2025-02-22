# UXUI Agent Template Analysis

## Core Configuration Analysis

### Primary Responsibilities
```yaml
core_focus:
  - Design system management
  - User experience design
  - Accessibility compliance
  - Usability validation
  - Pattern documentation
  - Component creation
  - Research integration
  - Design validation
```

### Documentation Structure
```yaml
required_documents:
  design_system:
    - Component Library
    - Pattern Documentation
    - Visual Guidelines
    - Interaction Models
    - Accessibility Standards
    - Responsive Patterns
    - Design Tokens
    - Implementation Guidelines

  user_research:
    - Research Findings
    - User Needs
    - Personas
    - User Journeys
    - Pain Points
    - Success Metrics
    - Feedback Analysis
    - Validation Results

  interaction_patterns:
    - User Flows
    - Interaction Models
    - Navigation Patterns
    - Form Patterns
    - Error Handling
    - Loading States
    - Feedback Patterns
    - State Management

  accessibility_compliance:
    - WCAG Compliance
    - Accessibility Tests
    - Screen Reader Support
    - Keyboard Navigation
    - Color Contrast
    - Focus Management
    - ARIA Implementation
    - Accessibility Documentation
```

### Design Protocol
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

### Quality Standards
```yaml
design_validation:
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

## Integration Points

### Mode Chain Position
```yaml
hierarchical_workflow:
  position: "Design phase"
  receives_from: "ASK"
  reports_to: "ARCHITECT"
  chain_role: "User Experience Design"
  focus: "User-Centered Solutions"

mode_transition_rules:
  prohibited:
    - Direct mode switching
    - Skipping modes
    - Bypassing approvals
    - Incomplete validation
    - Unauthorized transitions
    - Cross-chain communication

  required:
    - Complete design validation
    - Ensure accessibility
    - Meet usability standards
    - Document patterns
    - Maintain design system
    - Follow hierarchical chain
```

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

## State Management

### State Tracking
```yaml
state_management:
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

  accessibility:
    fields:
      - compliance
      - tests
      - status
    validation: required
```

## Recommendations

1. Design System Management
   - Add design metrics tracking
   - Enhance component management
   - Implement design chunking
   - Add dependency tracking

2. User Experience
   - Add research metrics
   - Enhance validation strategy
   - Implement feedback loops
   - Add usability checkpoints

3. Documentation
   - Add version tracking
   - Implement size limits
   - Add change tracking
   - Enhance linking validation

4. Integration
   - Add emergency protocols
   - Enhance state transitions
   - Implement recovery procedures
   - Add validation gates

5. Accessibility
   - Add compliance metrics
   - Enhance testing strategy
   - Implement validation checks
   - Add monitoring points