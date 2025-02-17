# ASK Agent Updates

## Responsibilities List Update
```yaml
responsibilities:
  - Business requirements analysis
  - Value proposition assessment
  - Stakeholder communication
  - Market research integration
  - User needs assessment
  - Feature prioritization
  - ROI analysis
  - Risk assessment
  - Innovation strategy
  - Compliance verification
  - Documentation standards
  - Quality context initiation
  - Business process modeling
  - Success metrics definition
  - Change impact analysis
  - Requirements validation
  - Stakeholder management
  - Business value tracking
```

## Monitoring Points
```yaml
context_monitoring:
  thresholds:
    warning: 70
    critical: 85
  
  monitoring_points:
    business_analysis:
      - Before loading business requirements
      - During stakeholder analysis
      - While processing market data
      - After impact assessment
      - Before quality handoff
    
    data_handling:
      - Load requirements incrementally
      - Process stakeholder data in chunks
      - Stream market analysis data
      - Paginate large requirement sets
      - Batch process impact analyses
    
    quality_tracking:
      - Before chain initialization
      - During context building
      - While validating requirements
      - After evidence collection
      - Before handoff preparation
    
    state_preservation:
      - Save analysis state regularly
      - Checkpoint stakeholder data
      - Preserve validation history
      - Maintain quality context
      - Archive completed analyses

  validation:
    required: true
    blocking: true
```

## Required Actions
```yaml
required_actions:
  business_analysis:
    - Validate business requirements
    - Assess stakeholder needs
    - Analyze market conditions
    - Evaluate competition
    - Define success metrics
    validation:
      required: true
      evidence: required
  
  quality_preparation:
    - Initialize quality chain
    - Build quality context
    - Collect validation evidence
    - Prepare handoff package
    - Document quality status
    validation:
      required: true
      blocking: true
  
  stakeholder_management:
    - Track stakeholder input
    - Document decisions
    - Maintain communication log
    - Update requirement status
    - Monitor satisfaction levels
    validation:
      required: true
      tracking: required
  
  documentation:
    - Maintain requirement docs
    - Update process models
    - Track changes
    - Version control docs
    - Archive completed work
    validation:
      required: true
      versioning: required
```

## Implementation Steps

1. Update .clinerules-ask:
   - Add comprehensive responsibilities list
   - Add monitoring points configuration
   - Include required actions

2. Update ask_role.md:
   - Add detailed role responsibilities
   - Include monitoring procedures
   - Update required actions

3. Update ask_template_v3.md:
   - Add monitoring sections
   - Include action tracking
   - Update validation points

4. Validation:
   - Verify all updates against standards
   - Test monitoring points
   - Validate required actions
   - Check responsibility coverage

## Success Criteria
- [x] Comprehensive responsibilities list provided
- [x] Specific monitoring points defined
- [x] Required actions listed
- [x] Implementation steps documented
- [x] Validation approach specified

## Monitoring Implementation Guide

1. Context Thresholds:
   - Warning (70%): Begin incremental processing
   - Critical (85%): Force state preservation

2. Monitoring Strategy:
   - Regular checkpoints
   - Incremental processing
   - State preservation
   - Quality tracking
   - Performance monitoring

3. Action Tracking:
   - Log all required actions
   - Track completion status
   - Maintain evidence
   - Verify outcomes
   - Document results

4. Validation Process:
   - Check against standards
   - Verify completeness
   - Test functionality
   - Document results
   - Update status