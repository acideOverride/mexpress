# CODE Agent Template Analysis

## Core Configuration Analysis

### Primary Responsibilities
```yaml
core_focus:
  - Implementation (context-aware)
  - Test-first development
  - Coverage maintenance
  - Documentation
  - Quality assurance
  - Error handling
  - Performance optimization
  - Security implementation
  - QA preparation
  - State management
```

### Context Management
```yaml
thresholds:
  warning: 70
  critical: 85

monitoring_points:
  - Before each operation
  - After large changes
  - Before state transitions
  - After file operations

required_actions:
  - Check context before operations
  - Monitor environment_details size
  - Break large tasks into chunks
  - Use incremental implementation
  - Force commits at warning threshold
  - Stop operations at critical threshold

prohibited_actions:
  - Large operations near warning threshold
  - Any operations at critical threshold
  - Ignoring context percentage
  - Multiple operations without commits
  - Large file reads without chunking
```

### Testing Framework
```yaml
test_validation:
  requirements:
    - TDD approach mandatory
    - Coverage thresholds met
    - Performance validated
    - Security verified
    - Integration tested
    - QA criteria met

  output_handling:
    mode: "silent"
    format: "compact"
    retention:
      keep_latest: true
      cleanup_old: true

  result_processing:
    rules:
      - Store only pass/fail status
      - Use percentage for coverage
      - Skip detailed test output
      - Summarize error messages
      - Batch similar failures
```

### Documentation Standards
```yaml
required_documents:
  implementation_specs:
    - Technical Context
    - Implementation Details
    - Code Structure
    - Error Handling
    - Performance Considerations
    - Security Measures
    - Test Coverage
    - Documentation Links
    - QA Requirements

  test_implementation:
    - Test Strategy
    - Test Cases
    - Coverage Reports
    - Performance Tests
    - Security Tests
    - Integration Tests
    - Documentation
    - Coverage Metrics
    - QA Criteria

  quality_validation:
    - Code Quality
    - Test Coverage
    - Performance Metrics
    - Security Validation
    - Documentation Status
    - Error Handling
    - Best Practices
    - Standards Compliance
    - QA Readiness
```

## Integration Points

### Workflow Sequence
```yaml
phases:
  implementation:
    source: "TASKMANAGER"
    actions:
      - check_context
      - implement
      - test
      - document
      - monitor_context
    next: "version_control"

  version_control:
    source: "implementation"
    actions:
      - store_source_state
      - commit
      - verify
      - await_return
      - process_return
    next: "qa_preparation"

  qa_preparation:
    source: "version_control"
    actions:
      - prepare
      - validate
      - send
```

### Mode Chain Integration
```yaml
hierarchical_workflow:
  position: "Implementation phase"
  receives_from: "TASKMANAGER"
  reports_to: ["GIT", "QA"]
  chain_role: "Implementation"
```

## Error Handling

### Error Management
```yaml
error_handling:
  format:
    template: "E:${type}|S:${severity}|A:${action}"
    rules:
      - Use abbreviated keys
      - Omit non-essential context
      - Use pipe delimiter
      - Skip stack traces
      - Limit error context

  required_actions:
    - Document errors (minimal format)
    - Update logs (token-efficient)
    - Create reports (summary only)
    - Link documentation (essential only)
    - Track resolution (compact format)
    - Preserve state (critical data)
    - Prepare recovery (focused plan)
```

## State Management

### State Tracking
```yaml
state_management:
  required_tracking:
    taskmanager:
      fields:
        - coverage_thresholds
        - tdd_requirements
        - tool_requirements
        - environment_specs
    implementation:
      fields:
        - status
        - coverage
        - validation
    testing:
      fields:
        - status
        - coverage
        - results
    git_interaction:
      fields:
        - source_state
        - commit_status
        - return_status
        - next_action
```

## Recommendations

1. Context Management
   - Add context recovery procedures
   - Enhance chunking strategies
   - Implement automatic cleanup
   - Add context metrics tracking

2. Testing Framework
   - Add test performance metrics
   - Enhance failure analysis
   - Implement test chunking
   - Add test state tracking

3. Documentation
   - Add version tracking
   - Implement size limits
   - Add change tracking
   - Enhance linking validation

4. Integration
   - Add workflow metrics
   - Enhance state transitions
   - Implement rollback procedures
   - Add validation checkpoints

5. Error Handling
   - Add error pattern analysis
   - Enhance recovery procedures
   - Implement error metrics
   - Add impact assessment