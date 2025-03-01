# Intra-Agent Core Files Consistency Audit Template

## Purpose
This template defines the structure for auditing consistency across an agent's three core files:
- .clinerules-[agent]
- [agent]_role.md
- [agent]_template_v3.md

## Audit Focus Areas

### 1. Communication Headers & Payloads
Check consistency across files for:
- Header format definitions
- Required payload fields
- Validation requirements
- Error handling specifications
- State preservation rules

### 2. Handoff Protocols
Verify alignment in:
- Handoff sequence definitions
- Required documentation
- State management during handoffs
- Validation requirements
- Error recovery procedures

### 3. Mode Transitions
Compare specifications for:
- Transition triggers
- State preservation requirements
- Validation gates
- Recovery procedures
- Context management

### 4. Agent Relationships
Analyze consistency in:
- Defined relationships
- Interaction boundaries
- Communication protocols
- Chain position definitions
- Role separation rules

### 5. Validation Chains
Check alignment of:
- Validation requirements
- Quality gates
- Evidence collection
- Chain preservation rules
- Verification points

## Audit Process

### 1. Initial Analysis
- Extract relevant sections from each file
- Create comparison matrix
- Identify overlapping definitions
- Note unique specifications
- Flag potential conflicts

### 2. Consistency Verification
- Compare header formats
- Validate protocol definitions
- Check transition rules
- Verify relationship definitions
- Analyze validation requirements

### 3. Gap Analysis
- Identify missing specifications
- Note incomplete definitions
- Flag undefined behaviors
- List ambiguous rules
- Document unclear requirements

### 4. Conflict Resolution
- List conflicting definitions
- Propose standardization
- Suggest improvements
- Define clear rules
- Document rationale

## Output Format

### 1. Summary Section
```markdown
# [Agent Name] Core Files Consistency Audit
Date: [YYYY-MM-DD]

## Files Analyzed
1. .clinerules-[agent]
2. [agent]_role.md
3. [agent]_template_v3.md

## Key Findings
- Consistency strengths
- Major discrepancies
- Critical gaps
- Improvement needs
```

### 2. Detailed Analysis
```markdown
## Communication Patterns
[Matrix comparing communication definitions across files]

## Handoff Protocols
[Comparison of handoff specifications]

## Mode Transitions
[Analysis of transition rules alignment]

## Relationship Definitions
[Comparison of relationship specifications]

## Validation Requirements
[Analysis of validation chain consistency]
```

### 3. Action Items
```markdown
## Required Updates
1. [File name]: [Specific changes needed]
2. [File name]: [Specific changes needed]
3. [File name]: [Specific changes needed]

## Standardization Needs
- [Area requiring standardization]
- [Proposed standard]
- [Implementation approach]
```

### 4. Evidence Package
```markdown
## Supporting Evidence
- [Reference to specific sections]
- [Comparison matrices]
- [Analysis results]
```

## Implementation Notes

### 1. File Organization
- Create audit file in: docs/docs_audits/agents/[agent]/core_consistency_audit_[date].md
- Include all comparison matrices
- Attach evidence package
- Document decision rationale

### 2. Validation Steps
- Verify all specifications
- Check cross-references
- Validate rule consistency
- Confirm completeness
- Ensure clarity

### 3. Output Requirements
- Clear findings
- Actionable items
- Evidence-based
- Implementation ready
- Traceable decisions

## Next Steps
1. Run audit for each agent
2. Compile findings
3. Create standardization plan
4. Implement improvements
5. Verify changes