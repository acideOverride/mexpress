# Agent Audit Prompt Template

Please perform a comprehensive audit of the QC agent following the established methodology in audit_methodology.md. The goal is to ensure consistency across all agents while maintaining their specific roles and responsibilities.

## Files to Analyze
1. /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/template_v3.md
2. /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/role.md
3. /opt/mExpress/docs_tech/docs_migration/.audit/a.PREPARATION/1.current_state/[agent]/.clinerules-[agent]

## Required Steps

1. Create Audit Structure
```bash
mkdir -p /opt/mExpress/docs_tech/docs_migration/.audit/b.AUDIT/[agent]/{1.core_files,2.analysis,3.cross_validation,4.results}
```

2. Analyze Files
- Start with template_v3.md as the base
- Cross-reference with role.md
- Verify .clinerules implementation

3. Document Analysis
- Create template_analysis.md
- Create role_analysis.md
- Create cross_validation.md
- Create recommendations.md

4. Focus Areas
- Context management
- Performance requirements
- Error handling
- Documentation standards
- Integration points
- State management

## Required Outputs

1. Analysis Documents
- Detailed analysis of each file
- Cross-validation findings
- Clear recommendations
- Implementation plan

2. Format Requirements
- Use established YAML structure
- Follow documentation standards
- Maintain consistent terminology
- Include all required sections

3. Success Criteria
- Technical completeness
- Process clarity
- Integration effectiveness

## Special Instructions

1. Context Management
- Verify thresholds (warning: 70%, critical: 85%)
- Check monitoring points
- Validate required actions
- Confirm prohibited actions

2. Performance Requirements
- Check response time criteria
- Verify resource utilization
- Validate scalability requirements
- Confirm monitoring procedures

3. Error Handling
- Verify recovery procedures
- Check retry strategies
- Validate timeout handling
- Confirm monitoring setup

## Expected Deliverables

1. Analysis Files
```
b.AUDIT/[agent]/
├── 2.analysis/
│   ├── template_analysis.md
│   └── role_analysis.md
├── 3.cross_validation/
│   └── cross_validation.md
└── 4.results/
    └── recommendations.md
```

2. Each File Should Include
- Clear findings
- Specific recommendations
- Implementation steps
- Validation criteria

## Reference Documents
- audit_methodology.md for detailed process
- audit_checklist.md for verification points
- Previous agent audits for consistency

Please proceed with the audit following this template and the detailed methodology to ensure consistent analysis across all agents.