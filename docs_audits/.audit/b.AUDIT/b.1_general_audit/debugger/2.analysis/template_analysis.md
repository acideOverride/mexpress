# DEBUGGER Agent Template Analysis

## Core Configuration Analysis

### Primary Responsibilities
```yaml
core_focus:
  - Issue analysis
  - Root cause identification
  - Resolution validation
  - Regression testing
  - Performance profiling
  - Security verification
  - Prevention planning
  - Documentation maintenance
  - Version control integration
  - Fix tracking
```

### Debug Session Management
```yaml
debug_session:
  organization:
    - Session boundaries
    - Context preservation
    - Resource cleanup
  tracking:
    - Active sessions
    - Resource usage
    - Context limits
  cleanup:
    - Session termination
    - Resource release
    - Context reset
  validation:
    required: true
    blocking: true
```

### Evidence Collection
```yaml
evidence_framework:
  collection_points:
    - Issue reproduction
    - Root cause analysis
    - Fix validation
  storage:
    - Evidence location
    - Retention policy
    - Access control
  validation:
    - Evidence completeness
    - Chain integrity
    - Accessibility
```

### Documentation Structure
```yaml
required_documents:
  issue_analysis:
    - Issue Description
    - Reproduction Steps
    - System State
    - Error Patterns
    - Performance Metrics
    - Security Impact
    - Technical Context
    - Dependencies
    - Version History

  root_cause_analysis:
    - Analysis Methodology
    - System Investigation
    - Error Patterns
    - State Analysis
    - Performance Profiling
    - Security Assessment
    - Impact Analysis
    - Technical Findings
    - Change History

  resolution_documentation:
    - Fix Implementation
    - Validation Steps
    - Regression Tests
    - Performance Impact
    - Security Validation
    - Prevention Measures
    - Documentation Updates
    - Future Recommendations
    - Version Control
```

## Integration Points

### Mode Chain Position
```yaml
hierarchical_workflow:
  position: "Debug phase"
  receives_from: "CODE"
  reports_to: "CODE"
  validates_with: "GIT"
  chain_role: "Issue Resolution"
  focus: "Technical Problem-Solving"

mode_transition_rules:
  prohibited:
    - Direct mode switching
    - Skipping modes
    - Bypassing approvals
    - Incomplete validation
    - Unauthorized transitions
    - Cross-chain communication
    - Missing commits
    - State loss
    - Ignoring context thresholds

  required:
    - Complete issue analysis
    - Verify root cause
    - Validate resolution
    - Run regression tests
    - Document process
    - Track changes
    - Create commits
    - Preserve state
```

### Context Management
```yaml
context_management:
  thresholds:
    warning: 70
    critical: 85

  monitoring_points:
    - Before loading debug logs
    - Before stack trace analysis
    - Before loading system state
    - After each debug operation
    - Before state transitions

  debug_specific_rules:
    - Load logs incrementally
    - Process stack traces in chunks
    - Stream system state data
    - Use pagination for large outputs
    - Clear non-essential context regularly

  required_actions:
    - Check context before loading debug data
    - Monitor environment_details context size
    - Break large debug sessions into chunks
    - Use incremental analysis
    - Force commits at warning threshold
    - Stop operations at critical threshold
    - Clear debug logs after analysis
```

## State Management

### State Tracking
```yaml
state_management:
  source:
    fields:
      - agent
      - status
      - next_action
      - workflow
    validation: required
    preservation: mandatory

  debug:
    fields:
      - issue
      - fix
      - validation
      - return_readiness
    validation: required

  testing:
    fields:
      - regression
      - coverage
      - performance
    validation: required

  git:
    fields:
      - changes
      - commit
      - state
      - return_status
      - next_action
    validation: required
```

## Recommendations

1. Debug Session Management
   - Add session metrics tracking
   - Enhance resource management
   - Implement session chunking
   - Add dependency tracking

2. Evidence Collection
   - Add collection metrics
   - Enhance storage strategy
   - Implement retention rules
   - Add validation checkpoints

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

5. Context Management
   - Add context metrics
   - Enhance preservation
   - Implement recovery
   - Add validation checks