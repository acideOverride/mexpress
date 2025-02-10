# Quality Implementation Guide for Roo Code

## Overview
This guide explains how to implement the dual-stream quality system (QC and QA) in Roo Code's workflow.

## Quality Streams

### 1. Downstream Quality Control (QC)
- **Purpose**: Prevent issues before implementation
- **Coverage**: ASK → UXUI → ARCHITECT → GPM → TASKMANAGER → CODE
- **Focus**: Requirements, Design, Architecture

### 2. Upstream Quality Assurance (QA)
- **Purpose**: Validate implementation and provide feedback
- **Coverage**: CODE → TASKMANAGER → GPM and CODE → DEBUG → GIT
- **Focus**: Implementation, Testing, Integration

## Implementation in Roo Code

### 1. Agent Instructions

Each agent needs to be configured to:

```markdown
ASK Agent:
- Create initial documentation in /docs/qc/requirements/
- Wait for QC validation before proceeding
- Route to UXUI or ARCHITECT based on QC feedback

UXUI Agent:
- Read QC validation from /docs/qc/requirements/
- Create design documentation in /docs/qc/design/
- Wait for QC validation before handoff to ARCHITECT

ARCHITECT Agent:
- Read QC validation from /docs/qc/design/
- Create architecture documentation
- Proceed to GPM after QC approval

CODE Agent:
- Submit implementation for QA review
- Address QA feedback before proceeding
- Route debug issues through DEBUG agent

DEBUG Agent:
- Process issues from QA feedback
- Submit fixes for QA validation
- Route approved fixes to GIT
```

### 2. Quality Gates

```markdown
QC Gates:
1. Requirements Gate (ASK → UXUI/ARCHITECT)
   - Business requirements validation
   - Technical feasibility check
   - Resource assessment

2. Design Gate (UXUI → ARCHITECT)
   - Design compliance check
   - Integration feasibility
   - Technical alignment

QA Gates:
1. Implementation Gate (CODE → TASKMANAGER)
   - Code quality check
   - Test coverage validation
   - Performance assessment

2. Debug Gate (DEBUG → GIT)
   - Fix validation
   - Regression testing
   - Integration verification
```

### 3. Documentation Flow

```markdown
1. QC Documentation:
   - Created in /docs/qc/{phase}/
   - Must be approved before handoff
   - Linked in agent handoff documents

2. QA Documentation:
   - Created in /docs/qa/{phase}/
   - Includes feedback loops
   - Links to implementation artifacts
```

## Integration with Existing Workflow

1. Add to Agent Role Definitions:
```markdown
- Read access to quality documentation
- Quality check requirements
- Validation responsibilities
- Handoff protocols
```

2. Update Custom Instructions:
```markdown
- Quality gate checkpoints
- Documentation requirements
- Validation procedures
- Feedback handling
```

3. Modify Cline Rules:
```markdown
- Quality documentation paths
- Validation requirements
- Handoff protocols
- Feedback mechanisms
```

## Benefits

1. Early Issue Detection:
- Problems caught before implementation
- Reduced rework
- Better resource utilization

2. Clear Quality Standards:
- Consistent validation
- Traceable decisions
- Measurable improvements

3. Effective Communication:
- Structured feedback
- Clear handoff points
- Documented decisions

## Implementation Steps

1. Create Directory Structure:
```bash
mkdir -p /opt/mExpress/docs/{qc,qa}/{requirements,design,implementation}/
```

2. Initialize Templates:
```bash
cp templates/* /opt/mExpress/docs/qc/templates/
cp templates/* /opt/mExpress/docs/qa/templates/
```

3. Update Agent Configurations:
- Add quality paths to role definitions
- Include validation requirements
- Update handoff protocols

4. Test Workflow:
- Start with small project
- Monitor quality gates
- Collect feedback
- Adjust as needed

## Success Metrics

1. Quality Metrics:
- Reduced defect rate
- Improved test coverage
- Faster issue resolution

2. Process Metrics:
- Reduced rework
- Faster handoffs
- Better documentation

3. Project Metrics:
- Improved delivery time
- Reduced resource waste
- Better project outcomes