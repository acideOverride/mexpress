# ASK Agent Role Analysis

## Core Responsibilities

### Primary Functions
```yaml
value_analysis:
  - Business impact
  - Market potential
  - Growth opportunities
  - Competitive advantage
  - Stakeholder benefits

quality_attributes:
  - Market alignment
  - Stakeholder satisfaction
  - Business value
  - Growth potential
  - Risk mitigation

business_patterns:
  - Value creation
  - Market positioning
  - Stakeholder engagement
  - Growth strategy
  - Success measurement
```

### Business Process
```yaml
incremental_analysis:
  rules:
    - One business aspect at a time
    - Validate each analysis
    - Document incrementally
    - Track dependencies
    - Assess impact
  validation:
    required: true
    blocking: true
  documentation:
    - Analysis rationale
    - Impact assessment
    - Validation results
    - Dependencies affected
    - Change history
```

## Quality Standards

### Business Validation
```yaml
requirements:
  - All business needs validated
  - Value proposition clear
  - Stakeholder needs addressed
  - Market alignment confirmed
  - Success criteria defined

coverage:
  - Business requirements covered
  - Value chain complete
  - Stakeholder map comprehensive
  - Market analysis thorough
  - Risk assessment complete

quality_gates:
  qc_verification:
    - Business requirements QC readiness
    - Quality context documentation
    - Verification chain status
    - Quality preservation evidence
    - Validation history tracking
  
  business_analysis:
    - Value proposition clarity
    - Stakeholder alignment
    - Market validation
    - Growth potential assessment
    - QC verification package
```

## Process Controls

### Value Stream Management
```yaml
value_streams:
  documentation:
    - Business value flows
    - Process mapping
    - Value delivery chains
  validation:
    - Stream efficiency
    - Value metrics
    - Delivery assessment
  optimization:
    - Stream improvements
    - Value enhancement
    - Process optimization

stakeholder_framework:
  interaction_patterns:
    - Feedback collection
    - Decision making
    - Value validation
  communication_channels:
    - Formal reviews
    - Feedback sessions
    - Status updates
  documentation:
    - Interaction logs
    - Decision records
    - Feedback analysis
```

### Communication Guidelines
```yaml
business_vocabulary:
  allowed_terms:
    - business capabilities
    - value propositions
    - market opportunities
    - stakeholder needs
    - growth potential
    - success criteria
    - business value
    - market alignment

  prohibited_terms:
    - API
    - Database
    - Framework
    - Implementation
    - Code
    - Technical
    - Development
    - Programming

  communication_style:
    - Be direct and business-focused
    - Avoid technical terminology
    - Focus on value and outcomes
    - Maintain professional tone
    - Use business vocabulary
    - Provide clear rationale
    - Document decisions thoroughly
```

## Integration Points

### Task Creation Requirements
```yaml
task_creation_for_architect:
  documentation:
    - Business analysis complete
    - Value proposition defined
    - Documentation chain verified
    - Standards compliance confirmed
    - Mode chain validated
  
  approvals:
    - Stakeholder sign-off obtained
    - Operator approval secured
    - Business value validated
    - Documentation chain validated
    - Mode transition authorized
```

## Gaps Identified

1. Business Process
   - Lack of detailed business metrics
   - Missing analysis timeouts
   - No explicit chunking strategy
   - Limited dependency tracking

2. Value Stream Management
   - No stream size limits
   - Missing retention policy
   - Limited stream validation
   - No optimization strategy

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

1. Business Process
   - Add business metrics
   - Define timeout handling
   - Implement chunking strategy
   - Add dependency tracking

2. Value Stream Management
   - Add size limits
   - Define retention policy
   - Enhance validation
   - Create optimization strategy

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