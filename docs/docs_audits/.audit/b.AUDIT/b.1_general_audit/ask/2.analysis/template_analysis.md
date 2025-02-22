# ASK Agent Template Analysis

## Core Configuration Analysis

### Primary Responsibilities
```yaml
core_focus:
  - Business requirements analysis for QC verification
  - Value proposition definition
  - Stakeholder needs assessment
  - Market alignment validation
  - Success criteria definition
  - Business value assessment
  - Growth potential analysis
  - Competitive advantage evaluation
  - Quality context documentation
  - Verification chain initialization
  - Quality status tracking
  - QC package preparation
```

### Documentation Structure
```yaml
required_documents:
  business_requirements:
    - Business Context
    - Value Proposition
    - Stakeholder Analysis
    - Market Positioning
    - Success Criteria
    - Growth Strategy
    - Risk Assessment
    - Competitive Analysis

  stakeholder_analysis:
    - Stakeholder Map
    - Needs Assessment
    - Value Expectations
    - Success Metrics
    - Communication Strategy
    - Engagement Plan
    - Feedback Channels
    - Decision Authority

  market_analysis:
    - Market Overview
    - Competitive Landscape
    - Growth Opportunities
    - Market Trends
    - Target Segments
    - Value Differentiation
    - Market Risks
    - Entry Strategy

  value_proposition:
    - Core Value Statement
    - Business Benefits
    - Market Advantages
    - Customer Impact
    - Growth Potential
    - Success Indicators
    - Value Metrics
    - ROI Analysis
```

### Quality Framework
```yaml
quality_gates:
  qc_verification_chain:
    - Business requirements QC-ready
    - Quality context documented
    - Verification chain initialized
    - Quality status tracked
    - Validation history maintained

  documentation_chain:
    - Business requirements complete
    - Value proposition documented
    - Success criteria defined
    - Market analysis completed
    - Documentation chain continued
    - QC verification package prepared

  approval_chain:
    - Stakeholder approval obtained
    - Business value validated
    - Market alignment confirmed
    - Task creation validated
    - Chain integrity verified
    - QC verification readiness confirmed
    - Quality context validated

  quality_preservation:
    - Verification chain maintained
    - Quality context preserved
    - Validation history tracked
    - Quality metrics documented
    - Status updates recorded
```

## Integration Points

### Mode Chain Position
```yaml
hierarchical_workflow:
  position: "First in chain"
  next_mode: "ARCHITECT (for QC verification)"
  transition_type: "Task Creation with QC Package"
  chain_role: "Business Analysis and Quality Initiation"
  quality_framework:
    - Prepare business requirements for QC
    - Initialize verification chain
    - Document quality context
    - Track verification status

mode_transition_rules:
  prohibited:
    - Direct mode switching
    - Skipping modes
    - Bypassing QC verification
    - Incomplete documentation
    - Unauthorized transitions
    - Breaking verification chain
    - Direct UXUI interaction

  required:
    - Complete business analysis for QC
    - Prepare QC verification package
    - Create task for ARCHITECT
    - Track verification status
    - Document quality decisions
    - Maintain verification chain
    - Continue documentation chain
    - Document transition state
```

### Context Management
```yaml
context_management:
  thresholds:
    warning: 70
    critical: 85

  monitoring_points:
    - Before business analysis
    - After documentation updates
    - Before ARCHITECT handoff
    - After stakeholder interactions
    - During file operations

  required_actions:
    - Check context percentage before analysis
    - Monitor environment_details size
    - Break large requirements into modules
    - Use incremental documentation
    - Force commits at warning threshold
    - Stop operations at critical threshold
    - Preserve essential state only
    - Clear non-critical context

  chunking_strategy:
    documentation:
      - Split large documents
      - Incremental updates
      - Modular approach
    analysis:
      - Break into smaller units
      - Progressive refinement
      - Staged processing
```

## Recommendations

1. Business Analysis
   - Add analysis metrics tracking
   - Enhance stakeholder management
   - Implement analysis chunking
   - Add dependency tracking

2. Quality Framework
   - Add verification metrics
   - Enhance chain management
   - Implement validation checks
   - Add monitoring points

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