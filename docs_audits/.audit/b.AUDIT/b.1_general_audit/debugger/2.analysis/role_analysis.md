# DEBUGGER Agent Role Analysis

## Core Responsibilities

### Primary Functions
```yaml
analysis_patterns:
  - Systematic debugging
  - Error pattern analysis
  - State investigation
  - Performance profiling
  - Security assessment
  - Version tracking

quality_attributes:
  - Resolution accuracy
  - Test coverage
  - Performance impact
  - Security validation
  - Documentation completeness
  - Version control

technical_patterns:
  - Debugging strategies
  - Testing approaches
  - Resolution patterns
  - Prevention methods
  - Validation techniques
  - Git integration
```

### Debug Process
```yaml
incremental_debugging:
  rules:
    - One issue aspect at a time
    - Validate each fix
    - Document incrementally
    - Track dependencies
    - Assess impact
  validation:
    required: true
    blocking: true
  documentation:
    - Debug details
    - Fix status
    - Test results
    - Dependencies affected
    - Progress tracking
```

## Quality Standards

### Debug Validation
```yaml
analysis_requirements:
  - Verify reproduction steps
  - Analyze error patterns
  - Identify root cause
  - Document system state
  - Track performance metrics
  - Version changes

resolution_validation:
  - Verify fix implementation
  - Run regression tests
  - Check performance impact
  - Validate security
  - Document prevention
  - Control versions

quality_gates:
  issue_analysis:
    - Reproduction verified
    - Root cause identified
    - System state documented
    - Impact assessed
    - Context captured
    - Changes tracked
  
  resolution:
    - Fix implemented
    - Tests passing
    - Performance validated
    - Security verified
    - Prevention documented
    - Version controlled
```

## Process Controls

### Error Handling
```yaml
context_aware_actions:
  - Monitor context percentage before loading logs
  - Check thresholds before stack trace analysis
  - Use incremental log loading
  - Clear processed debug data
  - Track context usage during debugging
  - Force commits at warning threshold (70%)
  - Stop operations at critical threshold (85%)

error_types:
  standard_debug:
    - Debug failures
    - Test regressions
    - Performance issues
    - Security problems
    - Documentation gaps
    - Version control errors
    - State corruption
    - Mode switching failures

  context_management:
    - Context threshold violations
    - Log loading context overflow
    - Stack trace context limit reached
    - Debug session context exceeded
    - Context warning threshold reached
    - Context critical threshold reached
    - Debug data chunking failure
    - Incremental loading failure
```

### State Management
```yaml
required_actions:
  - Track debug state
  - Monitor fix status
  - Document changes
  - Preserve git context
  - Manage transitions
  - Handle errors
  - Maintain history
  - Enable recovery

state_tracking:
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
```

## Integration Points

### Git Integration
```yaml
git_workflow:
  triggers:
    - Fix implementation
    - Test updates
    - Documentation changes
    - Prevention measures
    - Configuration updates
    - Any debug changes

  validation_requirements:
    - Fix verified
    - Tests passing
    - No regressions
    - Documentation updated
    - Prevention documented
    - State preserved
    - Source tracked
    - Return handled
    - Next action clear
    - Workflow continued

  mode_switching:
    outbound:
      - Store source state
      - Validate changes
      - Prepare commit
      - Switch to GIT
      - Create commit
      - Await return
```

## Gaps Identified

1. Debug Process
   - Lack of detailed debug metrics
   - Missing debug timeouts
   - No explicit chunking strategy
   - Limited dependency tracking

2. Evidence Management
   - No evidence size limits
   - Missing retention policy
   - Limited evidence validation
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

1. Debug Process
   - Add debug metrics
   - Define timeout handling
   - Implement chunking strategy
   - Add dependency tracking

2. Evidence Management
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