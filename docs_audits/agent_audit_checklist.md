# Agent Core File Audit Checklist

## Base Structure (from .clinerules)
Every agent must have:

### 1. Core Configuration
- [ ] Mode declaration (mode: agent_name)
- [ ] Description string
- [ ] Version number (1.0.0)
- [ ] Core responsibilities list
- [ ] Documentation path

### 2. Documentation Standards
- [ ] Required documents section
- [ ] Document paths defined
- [ ] Section requirements
- [ ] Linking conventions
- [ ] Terminology controls
- [ ] File permissions

### 3. Quality Controls
- [ ] Quality standards defined
- [ ] Success metrics listed
- [ ] Review process specified
- [ ] Validation requirements

### 4. Transition Management
- [ ] Mode transition requirements
- [ ] Version control requirements
- [ ] Transition checklist
- [ ] State preservation rules

## Handoff Protocol Standards

### 1. Upstream Handoffs
- [ ] Receives from defined
- [ ] Input validation rules
- [ ] State preservation
- [ ] Context management

### 2. Downstream Handoffs
- [ ] Reports to defined
- [ ] Output format rules
- [ ] State transfer
- [ ] Context handling

### 3. Quality Gates
- [ ] Entry criteria
- [ ] Exit criteria
- [ ] Validation points
- [ ] Blocking rules

## Payload Format Standards

### 1. Input Payloads
- [ ] Structure defined
- [ ] Required fields
- [ ] Validation rules
- [ ] Error handling

### 2. Output Payloads
- [ ] Structure defined
- [ ] Required fields
- [ ] Format rules
- [ ] Success criteria

### 3. State Payloads
- [ ] State structure
- [ ] Required fields
- [ ] Preservation rules
- [ ] Recovery procedures

## Context Management Standards

### 1. Thresholds
- [ ] Warning level (70%)
- [ ] Critical level (85%)
- [ ] Action triggers
- [ ] Recovery procedures

### 2. Monitoring Points
- [ ] Operation checkpoints
- [ ] State transitions
- [ ] File operations
- [ ] Documentation updates

### 3. Required Actions
- [ ] Context checks
- [ ] Size monitoring
- [ ] Chunking rules
- [ ] State preservation

### 4. Prohibited Actions
- [ ] Threshold violations
- [ ] Operation restrictions
- [ ] State corruption prevention
- [ ] Context overflow prevention

## Documentation Structure Standards

### 1. Required Sections
- [ ] Configuration
- [ ] Responsibilities
- [ ] Workflows
- [ ] Quality gates
- [ ] State management
- [ ] Error handling

### 2. Format Rules
- [ ] YAML structure
- [ ] Indentation
- [ ] Section ordering
- [ ] Comments style

### 3. Content Rules
- [ ] Terminology consistency
- [ ] Detail requirements
- [ ] Cross-references
- [ ] Version tracking

## Implementation Notes:
1. Use .clinerules as the base template
2. Maintain consistent structure across all agents
3. Adapt content for agent-specific roles
4. Preserve all functionality while standardizing format
5. Ensure backward compatibility
6. Document any deviations

## Audit Process:
1. Check each agent against this list
2. Document any inconsistencies
3. Create standardization plan
4. Make incremental updates
5. Verify functionality
6. Update documentation