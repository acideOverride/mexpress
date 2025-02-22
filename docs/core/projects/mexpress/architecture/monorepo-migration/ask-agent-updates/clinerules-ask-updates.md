# ASK Agent .clinerules-ask Updates for Monorepo

## Primary Responsibilities Updates
```
# Primary Responsibilities
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
- Package-level business analysis
- Cross-package impact assessment
- Monorepo business strategy
- Portfolio-level analysis
```

## Documentation Location Updates
```
# Documentation Location
Primary:
- /opt/mExpress/docs/projects/${project_name}/business/

Package Documentation:
- /opt/mExpress/packages/core/docs/business/
- /opt/mExpress/packages/ui-components/docs/business/
- /opt/mExpress/packages/utils/docs/business/

Project Documentation:
- /opt/mExpress/projects/${project_name}/docs/business/
```

## Required Documents Updates
```
1. package-business-requirements.md
   - Package Business Context
   - Package Value Proposition
   - Package Stakeholder Analysis
   - Package Market Positioning
   - Package Success Criteria
   - Package Growth Strategy
   - Package Risk Assessment
   - Package Dependencies
   - Cross-Package Impact

2. monorepo-business-analysis.md
   - System Overview
   - Shared Business Capabilities
   - Cross-Package Synergies
   - Resource Optimization
   - Portfolio Strategy
   - Integration Opportunities
   - System-wide Risks
   - Growth Strategy

3. stakeholder-analysis.md
   - Package Stakeholders
   - System Stakeholders
   - Cross-Package Dependencies
   - Value Expectations
   - Success Metrics
   - Communication Strategy
   - Engagement Plan
   - Decision Authority

4. market-analysis.md
   - Package Market Analysis
   - System Market Position
   - Portfolio Opportunities
   - Market Trends
   - Target Segments
   - Value Differentiation
   - Market Risks
   - Entry Strategy

5. value-proposition.md
   - Package Value Statement
   - System Value Statement
   - Business Benefits
   - Market Advantages
   - Customer Impact
   - Growth Potential
   - Success Indicators
   - ROI Analysis
```

## Project Structure Analysis Updates
```
project_structure_analysis:
  required_actions:
    # Package-Level Analysis
    - Map package business domains
    - Identify package value streams
    - Document package relationships
    - Track package processes
    - Analyze package value chains
    
    # Cross-Package Analysis
    - Map shared capabilities
    - Document business synergies
    - Identify integration points
    - Track shared resources
    - Analyze cross-package impact
    
    # System-Level Analysis
    - Map monorepo business domains
    - Document system relationships
    - Identify integration points
    - Track dependencies
    - Analyze impact paths
    
    # Quality Requirements
    - Verify QC requirements
    - Document user touchpoints
    - Validate package boundaries
    - Check dependency health
    
  validation:
    required: true
    timing: before_analysis
    package_validation:
      required: true
      checks:
        - Package boundary integrity
        - API compatibility
        - Version alignment
        - Dependency health
    
  documentation:
    # Package Documentation
    - Package business maps
    - Package API specifications
    - Package dependency graphs
    - Package version matrix
    
    # Cross-Package Documentation
    - Cross-package relationship map
    - Shared capability specifications
    - Integration contract documents
    - Dependency resolution guides
    
    # System Documentation
    - Business architecture map
    - Component diagram
    - Integration matrix
    - Dependency graph
    - Impact analysis
```

## Business Focus Updates
```
1. Package Business Analysis
   - Package business impact
   - Package market potential
   - Package growth opportunities
   - Package competitive advantage
   - Package stakeholder benefits

2. System Business Analysis
   - System-wide impact
   - Portfolio potential
   - Cross-package opportunities
   - System advantages
   - Shared stakeholder benefits

3. Quality Attributes
   - Package alignment
   - System consistency
   - Business value
   - Growth potential
   - Risk mitigation

4. Business Patterns
   - Package patterns
   - System patterns
   - Integration patterns
   - Growth patterns
   - Success measurement
```

## Version Control Integration
```
version_control:
  package_tracking:
    - Package version strategy
    - Package dependencies
    - Breaking changes
    - Migration planning
    - Documentation versioning
  
  monorepo_tracking:
    - System version strategy
    - Cross-package dependencies
    - System-wide changes
    - Portfolio evolution
    - Documentation alignment
```

## Quality Gates Updates
```
quality_gates:
  package_gates:
    - Package requirements complete
    - Package value clear
    - Package stakeholders mapped
    - Package market validated
    - Package documentation ready

  system_gates:
    - System requirements complete
    - Portfolio value clear
    - System stakeholders mapped
    - Market strategy validated
    - System documentation ready

  integration_gates:
    - Cross-package alignment
    - Resource optimization
    - Integration readiness
    - Documentation completeness
    - Chain preservation
```

## State Management Updates
```
state_management:
  package_state:
    required_actions:
      - Track package business state
      - Monitor package changes
      - Validate package updates
      - Document package history
      - Maintain package context
    state_tracking:
      business:
        fields: ["phase", "status", "components", "validation"]
        validation: "required"
      components:
        fields: ["versions", "dependencies", "usage", "status"]
        validation: "required"
      integration:
        fields: ["compatibility", "cross_package", "theme"]
        validation: "required"

  monorepo_state:
    required_actions:
      - Track system business state
      - Monitor cross-package changes
      - Validate system updates
      - Document system history
      - Maintain global context
    state_tracking:
      system:
        fields: ["structure", "organization", "integration"]
        validation: "required"
      shared:
        fields: ["capabilities", "patterns", "resources"]
        validation: "required"
      cross_package:
        fields: ["dependencies", "usage", "compatibility"]
        validation: "required"