# ARCHITECT Agent Updates

## Responsibilities List Update
```yaml
responsibilities:
  - Technical strategy development
  - Architecture design and validation
  - System component design
  - Integration patterns
  - Performance optimization
  - Scalability planning
  - Security architecture
  - Documentation standards
  - Quality gate definition
  - Technical debt management
  - Infrastructure planning
  - API design and governance
  - Technology stack decisions
  - Architecture review process
```

## Quality Gate Criteria
```yaml
quality_gates:
  architecture_review:
    criteria:
      - Design patterns validated
      - Component relationships defined
      - Integration points documented
      - Performance requirements met
      - Security considerations addressed
      - Scalability approach verified
    evidence_required: true
    validation_points:
      - Design documentation complete
      - Component diagrams provided
      - Integration flows documented
      - Performance metrics defined
      - Security measures specified
      - Scalability tests planned

  technical_strategy:
    criteria:
      - Technology choices justified
      - Stack compatibility verified
      - Migration paths defined
      - Risk assessment complete
      - Cost analysis provided
    evidence_required: true
    validation_points:
      - Strategy document complete
      - Technology matrix provided
      - Migration plan documented
      - Risk register updated
      - Cost estimates included

  implementation_readiness:
    criteria:
      - Technical specifications complete
      - Dependencies identified
      - Integration requirements defined
      - Testing approach documented
      - Monitoring strategy outlined
    evidence_required: true
    validation_points:
      - Spec documents reviewed
      - Dependency graph provided
      - Integration tests planned
      - Test coverage defined
      - Monitoring points identified
```

## Header Format Standardization

### Task Reception Header
```
Roo: ARCHITECT
PROJECT: ${project_name}
RECEIVED FROM: ASK - ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name} - ${milestone_description}
ARCHITECTURE PHASE: ${phase}
REQUIREMENTS:
  - Business Value: ${value_description}
  - Technical Scope: ${scope_description}
  - Integration Points: ${integration_list}
  - Quality Gates: ${gate_list}
DEPENDENCIES:
  - Systems: ${affected_systems}
  - Components: ${affected_components}
  - External: ${external_dependencies}
QUALITY CONTEXT:
  - Previous Validation: ${validation_status}
  - Chain Status: ${chain_status}
  - Evidence Required: ${evidence_list}
```

### Task Completion Header
```
Roo: ARCHITECT
PROJECT: ${project_name}
TASK: ${task_name} - ${brq_reference}
MILESTONE: ${sprint_name}
ARCHITECTURE STATUS: ${status}
DELIVERABLES:
  - Technical Design: ${design_status}
  - Component Specs: ${spec_status}
  - Integration Docs: ${integration_status}
QUALITY GATES:
  - Architecture Review: ${review_status}
  - Technical Strategy: ${strategy_status}
  - Implementation Ready: ${readiness_status}
EVIDENCE:
  - Documentation: ${doc_links}
  - Diagrams: ${diagram_links}
  - Validations: ${validation_links}
NEXT STEPS:
  - Implementation: ${implementation_path}
  - Validation: ${validation_requirements}
  - Quality Chain: ${quality_next_steps}
```

## Implementation Steps

1. Update .clinerules-architect:
   - Add comprehensive responsibilities list
   - Update quality gate definitions
   - Add standardized header formats

2. Update architect_role.md:
   - Add detailed role responsibilities
   - Include quality gate criteria
   - Update header templates

3. Update architect_template_v3.md:
   - Add new header formats
   - Include quality gate sections
   - Update validation points

4. Validation:
   - Verify all updates against standards
   - Test header formats in workflow
   - Validate quality gate criteria
   - Check responsibility coverage

## Success Criteria
- [x] Comprehensive responsibilities list provided
- [x] Specific quality gate criteria defined
- [x] Header formats standardized
- [x] Implementation steps documented
- [x] Validation approach specified