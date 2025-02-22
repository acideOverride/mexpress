# Agent Audit Prompt Template

## Purpose
This prompt template guides the systematic audit of each agent to ensure alignment with standards and proper integration into the agent team workflow.

## Agent Information
```
Agent Name: [NAME]
Primary Role: [ROLE]
Core Files Location: /opt/mExpress/docs_tech/docs_migration/c.IMPLEMENTATION/agents/[agent]/
```

## Audit Sequence

### 1. Core File Verification
Review each required file:

```
.clinerules-[agent]:
- Is mode correctly defined?
- Are responsibilities comprehensive?
- Is docs_path correct?
- Are tool groups appropriate?
- Is vocabulary control present?

[agent]_role.md:
- Is purpose clearly stated?
- Are responsibilities complete?
- Is workflow position accurate?
- Are capabilities well-defined?
- Are procedures standardized?

[agent]_template_v3.md:
- Is configuration complete?
- Are sections standardized?
- Are templates comprehensive?
- Are formats consistent?
```

### 2. Workflow Integration
Verify chain position:

```
Receives From: [List expected input agents]
Reports To: [List expected output agents]
Validates With: [List validation partners]
Chain Role: [Specific role in workflow]
Focus Areas: [Primary responsibilities]
```

### 3. Communication Standards
Check message formats:

```
Input Format:
[Expected format for receiving tasks/information]

Output Format:
[Expected format for sending tasks/information]

Error Format:
[Expected format for error reporting]

Status Format:
[Expected format for status updates]
```

### 4. Quality Framework
Verify quality integration:

```
Quality Gates:
- Entry criteria
- Process validation
- Exit criteria

Evidence Collection:
- Required evidence
- Collection points
- Storage format

Validation Chain:
- Verification points
- Chain maintenance
- State preservation
```

### 5. State Management
Check state handling:

```
State Components:
- Task state
- Workflow state
- Quality state
- Context state

Preservation Rules:
- When to preserve
- What to preserve
- How to preserve

Recovery Procedures:
- Error scenarios
- Recovery steps
- State restoration
```

## Audit Questions

For each section, answer:

1. Standards Compliance:
   "Does the implementation match the standard specification?"
   - [ ] Fully compliant
   - [ ] Partially compliant
   - [ ] Non-compliant

2. Integration Effectiveness:
   "How well does it integrate with other agents?"
   - [ ] Seamless integration
   - [ ] Minor issues
   - [ ] Major issues

3. Documentation Quality:
   "Is the documentation clear and complete?"
   - [ ] Complete and clear
   - [ ] Needs minor updates
   - [ ] Needs major revision

4. Implementation Readiness:
   "Is it ready for implementation?"
   - [ ] Ready
   - [ ] Needs minor fixes
   - [ ] Needs major work

## Results Documentation

Document findings in this format:

```markdown
# [Agent Name] Audit Results

## Compliance Summary
- Standards: [Status]
- Integration: [Status]
- Documentation: [Status]
- Readiness: [Status]

## Identified Gaps
1. [Gap Description]
   - Impact: [High/Medium/Low]
   - Fix Required: [Description]
   - Dependencies: [List]

2. [Gap Description]
   - Impact: [High/Medium/Low]
   - Fix Required: [Description]
   - Dependencies: [List]

## Recommendations
1. [Recommendation]
   - Priority: [High/Medium/Low]
   - Effort: [Estimate]
   - Dependencies: [List]

2. [Recommendation]
   - Priority: [High/Medium/Low]
   - Effort: [Estimate]
   - Dependencies: [List]

## Implementation Path
1. [Step 1]
   - Tasks: [List]
   - Validation: [Criteria]

2. [Step 2]
   - Tasks: [List]
   - Validation: [Criteria]
```

## Success Criteria

An agent passes audit when:
1. All core files are compliant with standards
2. Workflow integration is properly defined
3. Communication formats are standardized
4. Quality framework is fully integrated
5. State management is comprehensive
6. Documentation is complete and clear
7. No blocking issues are identified
8. Implementation path is clear

## Next Steps

After audit completion:
1. Document all findings
2. Prioritize fixes
3. Create implementation plan
4. Set validation criteria
5. Define success metrics
6. Establish timeline
7. Identify dependencies
8. Plan verification steps