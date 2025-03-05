# Rapid Sequential Audit Process

## Phase 1: Intra-Agent Core Files Consistency

### Step 1: Individual Agent Audits
For each agent, analyze core files consistency using template from rapid_audit_prompt_template.md:

1. Architect Agent
   - .clinerules-architect
   - architect_role.md
   - architect_template_v3.md
   Output: /docs/docs_audits/agents/architect/core_consistency_audit_[date].md

2. QC Agent
   - .clinerules-qc
   - qc_role.md
   - qc_template_v3.md
   Output: /docs/docs_audits/agents/qc/core_consistency_audit_[date].md

3. UXUI Agent
   - .clinerules-uxui
   - uxui_role.md
   - uxui_template_v3.md
   Output: /docs/docs_audits/agents/uxui/core_consistency_audit_[date].md

[Continue for all agents...]

### Step 2: Consolidation
Create summary of intra-agent findings:
Output: /docs/docs_audits/agents/core_consistency_summary_[date].md

### Step 3: Standardization
Identify patterns and create standardization rules:
Output: /docs/docs_audits/agents/core_standards_[date].md

## Phase 2: Inter-Agent Communication Analysis

### Step 1: Communication Mapping
Using results from Phase 1:
1. Map all communication patterns
2. Document relationships
3. Identify validation chains
Output: /docs/docs_audits/agents/communication_map_[date].md

### Step 2: Protocol Analysis
Analyze:
1. Headers and payloads
2. Handoff protocols
3. Mode transitions
4. Validation requirements
Output: /docs/docs_audits/agents/protocol_analysis_[date].md

### Step 3: Chain Validation
Document:
1. Validation chains
2. Quality gates
3. Evidence requirements
Output: /docs/docs_audits/agents/validation_chains_[date].md

## Phase 3: Final Integration

### Step 1: Comprehensive Analysis
Combine findings from Phases 1 & 2:
Output: /docs/docs_audits/agents/integrated_analysis_[date].md

### Step 2: Action Items
Create actionable improvements:
Output: /docs/docs_audits/agents/action_items_[date].md

### Step 3: Implementation Plan
Define implementation strategy:
Output: /docs/docs_audits/agents/implementation_plan_[date].md

## Execution Order

1. Start with Architect agent (central to most communications)
2. Follow with QC agent (key validation role)
3. Continue with UXUI agent (design system focus)
4. Progress through remaining agents based on dependencies

## Critical Checkpoints

After each agent audit:
1. Verify completeness
2. Document findings
3. Update standards
4. Track patterns
5. Note improvements

## Success Criteria

Phase 1:
- All agent core files audited
- Inconsistencies documented
- Standards proposed
- Patterns identified

Phase 2:
- All communications mapped
- Protocols documented
- Chains validated
- Gaps identified

Phase 3:
- Comprehensive analysis complete
- Action items defined
- Implementation plan ready
- Evidence collected

## Expected Outputs

1. Individual Agent Audits:
   - Core consistency analysis
   - Specific improvements
   - Standard adherence

2. Communication Analysis:
   - Interaction maps
   - Protocol documentation
   - Chain validation

3. Implementation Guide:
   - Action items
   - Standards
   - Timelines
   - Dependencies

## Next Steps

1. Begin with Architect agent audit
2. Document findings using template
3. Create standards based on patterns
4. Progress to next agent
5. Maintain audit log
6. Track improvements
7. Update documentation