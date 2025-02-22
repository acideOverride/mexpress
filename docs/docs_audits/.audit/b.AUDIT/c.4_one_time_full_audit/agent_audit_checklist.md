# Agent Synchronization Audit Checklist

## Core File Structure Audit
For each agent, verify:

### 1. File Naming Convention
- [ ] .clinerules-[agent]
- [ ] [agent]_role.md
- [ ] [agent]_template_v3.md

### 2. File Content Structure
.clinerules:
- [ ] mode and version defined
- [ ] responsibilities listed
- [ ] docs_path correct
- [ ] tool groups specified
- [ ] vocabulary control present

role.md:
- [ ] clear purpose statement
- [ ] core responsibilities
- [ ] workflow position
- [ ] required capabilities
- [ ] standard operating procedures

template_v3.md:
- [ ] configuration section
- [ ] standard sections
- [ ] response templates
- [ ] handoff formats

## Workflow Integration Audit

### 1. Chain Position Verification
- [ ] Correct "receives from" agents
- [ ] Correct "reports to" agents
- [ ] Proper validation partners
- [ ] Clear chain role
- [ ] Consistent focus

### 2. Communication Format Check
- [ ] Task reception format
- [ ] Task completion format
- [ ] Error reporting format
- [ ] Status update format
- [ ] Handoff format

### 3. State Management
- [ ] State tracking defined
- [ ] Context preservation rules
- [ ] Error recovery procedures
- [ ] History maintenance
- [ ] Workflow continuity

## Quality Control Integration

### 1. QA Process
- [ ] Quality gates defined
- [ ] Evidence collection methods
- [ ] Validation points specified
- [ ] Standards compliance checks
- [ ] Process validation steps

### 2. QC Integration
- [ ] Verification chain defined
- [ ] Quality context maintenance
- [ ] Validation history tracking
- [ ] Evidence preservation
- [ ] Chain state management

## Agent-Specific Standards

### ARCHITECT
- [ ] Technical strategy focus
- [ ] Architecture validation
- [ ] QC verification integration
- [ ] Git workflow integration

### ASK
- [ ] Business analysis focus
- [ ] Requirements validation
- [ ] QC package preparation
- [ ] Chain initiation

### CODE
- [ ] Implementation focus
- [ ] TDD approach
- [ ] Coverage requirements
- [ ] QA integration

### DEBUGGER
- [ ] Issue resolution focus
- [ ] Debug session management
- [ ] Evidence collection
- [ ] Error filtering

### GIT
- [ ] Version control focus
- [ ] Commit management
- [ ] Branch management
- [ ] State preservation

### GPM
- [ ] Project management focus
- [ ] Milestone tracking
- [ ] Task creation
- [ ] Quality oversight

### QA
- [ ] Quality assurance focus
- [ ] Test validation
- [ ] Coverage verification
- [ ] Evidence collection

### QC
- [ ] Quality control focus
- [ ] Verification chain
- [ ] Quality context
- [ ] Chain preservation

### TASKMANAGER
- [ ] Workflow management focus
- [ ] Mode transition handling
- [ ] Chain tracking
- [ ] State preservation

### UXUI
- [ ] Design system focus
- [ ] Accessibility requirements
- [ ] Component management
- [ ] Design validation

## Cross-Agent Integration

### 1. Workflow Synchronization
- [ ] Clear handoff points
- [ ] Consistent state preservation
- [ ] Error handling coordination
- [ ] Quality chain maintenance

### 2. Documentation Standards
- [ ] Consistent file structure
- [ ] Standard naming conventions
- [ ] Clear responsibility boundaries
- [ ] Proper version control

### 3. Quality Framework
- [ ] Unified quality gates
- [ ] Consistent evidence requirements
- [ ] Standard validation points
- [ ] Clear verification chain

## Implementation Readiness

### 1. Core Files
- [ ] All files present
- [ ] Correct structure
- [ ] Standard formatting
- [ ] Version consistency

### 2. Integration Points
- [ ] Clear workflows
- [ ] Defined handoffs
- [ ] Error handling
- [ ] State management

### 3. Quality Controls
- [ ] Quality gates
- [ ] Evidence collection
- [ ] Validation points
- [ ] Chain preservation

## Audit Prompt

When auditing an agent, follow this sequence:

1. Core File Check:
   "Does the agent have all required files with correct naming and structure?"

2. Workflow Position:
   "Is the agent correctly positioned in the chain with proper input/output connections?"

3. Communication Standards:
   "Does the agent use standard communication formats for all interactions?"

4. Quality Integration:
   "Are quality gates, evidence collection, and validation points properly defined?"

5. State Management:
   "Does the agent properly handle state preservation and workflow continuity?"

6. Agent-Specific Requirements:
   "Does the agent fulfill its specific role requirements while maintaining team integration?"

7. Cross-Agent Compatibility:
   "Do the agent's interactions align with connected agents' expectations?"

8. Implementation Readiness:
   "Is the agent ready for implementation with all standards met?"

## Success Criteria

An agent is considered properly aligned when:
1. All core files are present and correctly structured
2. Workflow position and interactions are clearly defined
3. Communication formats follow standards
4. Quality framework is properly integrated
5. State management is comprehensive
6. Role-specific requirements are met
7. Cross-agent interactions are synchronized
8. Implementation readiness is confirmed

## Remediation Steps

If gaps are found:
1. Document the specific standard violation
2. Identify affected interaction points
3. Create update plan following standard templates
4. Test changes in isolation
5. Verify workflow integrity
6. Update documentation
7. Confirm cross-agent compatibility