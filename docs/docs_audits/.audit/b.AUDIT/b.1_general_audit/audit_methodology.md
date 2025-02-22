# Agent Audit Methodology

## Overview
This document provides a step-by-step guide for auditing agent core files to ensure consistency across the system. Each agent has three core files that need to be analyzed and cross-validated:
1. template_v3.md - Base workflow template
2. role.md - Role definition and responsibilities
3. .clinerules - Configuration and rules

## Directory Structure
```
.audit/
├── a.PREPARATION/
│   └── 1.current_state/
│       ├── audit_checklist.md      # Master checklist
│       ├── [agent]/               # Current state files
│       │   ├── template_v3.md
│       │   ├── role.md
│       │   └── .clinerules
│       └── audit_methodology.md    # This file
└── b.AUDIT/
    └── [agent]/
        ├── 1.core_files/          # Original files
        ├── 2.analysis/            # Individual analysis
        │   ├── template_analysis.md
        │   └── role_analysis.md
        ├── 3.cross_validation/    # Cross-validation
        │   └── cross_validation.md
        └── 4.results/             # Final results
            └── recommendations.md
```

## Step-by-Step Process

### 1. Setup Phase
```bash
# Create audit directories
mkdir -p /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/[agent]/{1.core_files,2.analysis,3.cross_validation,4.results}

# Create README
cat > /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/[agent]/README.md << 'EOF'
# [Agent] Audit

## Directory Structure
[Directory structure as shown above]

## Audit Process
1. Copy core files to 1.core_files/
2. Analyze each file individually in 2.analysis/
3. Cross-validate in 3.cross_validation/
4. Document results in 4.results/

## Status
- [ ] Core files copied
- [ ] Individual analysis complete
- [ ] Cross-validation complete
- [ ] Results documented
- [ ] Recommendations made
- [ ] Version updates specified
EOF
```

### 2. Template Analysis
1. Read template_v3.md
2. Analyze for:
   - Core configuration
   - Workflow patterns
   - Integration points
   - State management
   - Tool usage
   - Documentation requirements
3. Document in template_analysis.md:
   - Base configuration
   - Workflow analysis
   - Integration points
   - Technical strategy
   - State management
   - Tool integration
   - Documentation requirements
   - Recommendations

### 3. Role Analysis
1. Read role.md
2. Analyze for:
   - Core responsibilities
   - Task handling
   - Integration protocols
   - Communication formats
   - Process controls
   - Mode management
3. Document in role_analysis.md:
   - Core responsibilities
   - Task handling
   - QC integration
   - Communication formats
   - Process controls
   - Integration points
   - Mode management
   - Gaps identified
   - Recommendations

### 4. Cross-Validation
1. Compare template_v3.md and role.md analyses
2. Document in cross_validation.md:
   - Core alignment check
   - Workflow comparison
   - Documentation requirements
   - Integration points
   - Identified gaps
   - Recommendations
   - Next steps

### 5. Final Recommendations
1. Create comprehensive recommendations in recommendations.md:
   - Summary of findings
   - Required updates
   - Implementation plan
   - Validation checklist
   - Next steps
   - Success criteria

## Analysis Focus Points

### 1. Context Management
Look for:
- Window management
- Thresholds (warning: 70%, critical: 85%)
- Monitoring points
- Required actions
- Prohibited actions
- State preservation

### 2. Performance Requirements
Look for:
- Response time criteria
- Resource utilization
- Scalability requirements
- Load testing
- Monitoring procedures

### 3. Error Handling
Look for:
- Recovery procedures
- Retry strategies
- Timeout handling
- State recovery
- Error monitoring

### 4. Documentation Standards
Look for:
- Format requirements
- Section organization
- Linking conventions
- Version control
- Change tracking

## Recommendations Format

### 1. YAML Updates
```yaml
# Context Management
context_management:
  thresholds:
    warning: 70
    critical: 85
  monitoring_points:
    - [List monitoring points]
  required_actions:
    - [List required actions]
  prohibited_actions:
    - [List prohibited actions]

# Performance Requirements
performance_requirements:
  criteria:
    response_time:
      [Define thresholds]
    resource_utilization:
      [Define limits]
    scalability:
      [Define requirements]

# Error Handling
error_handling:
  recovery_procedures:
    [Define procedures]
  monitoring:
    [Define monitoring]
```

### 2. Implementation Plan
Structure as:
1. Phase 1: Core Updates
2. Phase 2: Documentation
3. Phase 3: Integration

### 3. Validation Checklist
Include:
- Context management checks
- Performance requirement checks
- Error handling checks
- Integration checks

## Success Criteria

### 1. Technical Success
- Files properly formatted
- Context management working
- Performance requirements met
- Error handling effective

### 2. Process Success
- Clear documentation
- Consistent implementation
- Effective monitoring
- Proper validation

### 3. Integration Success
- QC workflow smooth
- Git integration working
- User consultation effective
- State management reliable

## Next Steps
After completing an agent audit:
1. Review findings
2. Implement recommendations
3. Validate changes
4. Move to next agent

## Command to Start New Agent Audit
```bash
# Replace [agent] with actual agent name (lowercase)
mkdir -p /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/[agent]/{1.core_files,2.analysis,3.cross_validation,4.results}
```

Then follow the step-by-step process above, ensuring consistent analysis and documentation across all agents.