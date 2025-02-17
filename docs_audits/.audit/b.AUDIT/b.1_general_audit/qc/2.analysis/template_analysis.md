# QC Agent Template Analysis

## Core Configuration Analysis

### Context Management
```yaml
thresholds:
  warning: 70
  critical: 85
monitoring_points:
  - Before verification start
  - After documentation reviews
  - Before ARCHITECT handoff
  - After finding documentation
  - During file operations
required_actions:
  - Check context percentage before verification
  - Monitor environment_details size
  - Break large verifications into phases
  - Use incremental documentation
  - Force commits at warning threshold
  - Stop operations at critical threshold
prohibited_actions:
  - Large operations near warning threshold
  - Any operations at critical threshold
  - Ignoring context percentage
  - Multiple verifications without commits
```

### Performance Requirements
```yaml
verification_process:
  - Incremental verification approach
  - Progressive documentation
  - Staged finding reviews
  - Modular verification units
resource_management:
  - Split large documents
  - Incremental updates
  - Progressive review
  - Staged findings
monitoring:
  - Context percentage tracking
  - Documentation size monitoring
  - Verification state tracking
  - Performance checkpoints
```

### Error Handling
```yaml
verification_errors:
  - Document error details
  - Track in verification report
  - Include in feedback
  - Require resolution
documentation_errors:
  - Track documentation issues
  - Require corrections
  - Verify updates
  - Document resolution
recovery_points:
  - Before major verifications
  - After finding documentation
  - During state transitions
  - Before documentation updates
```

### Documentation Standards
```yaml
required_documents:
  verification_report:
    - Architecture Overview
    - Design Pattern Analysis
    - Integration Validation
    - Scalability Assessment
    - Security Review
    - Documentation Quality
  quality_controls:
    - Control Points
    - Verification Process
    - Standards Compliance
    - Issue Tracking
  feedback_documentation:
    - Findings Summary
    - Detailed Analysis
    - Improvement Recommendations
linking_conventions:
  format: "[Document Name](../relative/path/to/doc.md)"
  section_format: "[Section Name](doc.md#section-name)"
```

## Integration Points

### Workflow Integration
```yaml
allowed_interactions:
  - ARCHITECT
prohibited_interactions:
  - CODE
  - TASKMANAGER
  - QA
  - GPM
sequence:
  - Receive from ARCHITECT
  - Perform verification
  - Document findings
  - Return to ARCHITECT
```

### State Management
```yaml
required_tracking:
  - Current verification state
  - Documentation status
  - Issue status
  - Feedback status
  - Handoff readiness
state_transitions:
  - Validate state changes
  - Track transition history
  - Document state updates
  - Verify completion
```

## Technical Strategy

### Tool Usage
```yaml
read_operations:
  purpose: Architecture and documentation review
  scope: QC verification documents
  validation: Required before verification
write_operations:
  purpose: Verification documentation
  scope: QC findings and feedback
  validation: Required after verification
search_operations:
  purpose: Pattern and standard validation
  scope: Architecture documentation
  validation: Required during verification
```

### Quality Gates
```yaml
verification_requirements:
  - Complete architecture review
  - Pattern validation complete
  - Standards compliance checked
  - Documentation verified
  - Issues documented
  - Feedback prepared
documentation:
  - All sections completed
  - Clear findings presented
  - Standards referenced
  - Issues tracked
  - Status documented
```

## Recommendations

1. Context Management
   - Implement strict context monitoring
   - Enforce chunking strategy
   - Add context cleanup protocols

2. Performance Optimization
   - Add performance metrics tracking
   - Implement verification checkpoints
   - Add progress tracking

3. Error Handling
   - Enhance error categorization
   - Add error pattern analysis
   - Implement automated recovery

4. Documentation
   - Add version tracking
   - Enhance linking validation
   - Implement documentation metrics

5. Integration
   - Add handoff validation
   - Enhance state tracking
   - Implement transition guards