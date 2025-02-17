# F. PROJECT DOCUMENTATION STANDARDS

## Table of Contents
1. [Project Documentation Structure](#1-project-documentation-structure)
2. [Documentation Types and Responsibilities](#2-documentation-types-and-responsibilities)
3. [Documentation Workflow](#3-documentation-workflow)
4. [Integration with Agent Workflow](#4-integration-with-agent-workflow)
5. [Templates](#5-templates)

## 1. Project Documentation Structure

### 1.1 Base Structure
```
/docs/projects/{project_name}/
├── overview/                  # Project Overview
│   ├── introduction.md       # Project introduction and goals
│   ├── architecture.md       # High-level architecture
│   └── roadmap.md           # Project roadmap and milestones
│
├── specifications/           # Project Specifications
│   ├── requirements/        # Business and technical requirements
│   ├── design/             # System design documents
│   └── api/                # API specifications
│
├── components/              # Component Documentation
│   ├── {component_name}/   # One directory per component
│   │   ├── overview.md     # Component overview
│   │   ├── design.md       # Component design
│   │   └── integration.md  # Integration points
│   └── README.md           # Component catalog
│
├── implementation/          # Implementation Details
│   ├── setup.md            # Setup instructions
│   ├── deployment.md       # Deployment procedures
│   └── maintenance.md      # Maintenance guides
│
├── decisions/              # Decision Records
│   ├── TEMPLATE.md         # Decision record template
│   └── {date}-{title}.md   # Individual decision records
│
└── progress/               # Project Progress
    ├── milestones/        # Milestone tracking
    ├── releases/          # Release notes
    └── status/            # Status reports
```

### 1.2 File Naming Conventions
- Use lowercase with hyphens for filenames
- Include status in filename: `{topic}-{status}.md`
- Date format in filenames: YYYYMMDD
- Version in filename when applicable: `{topic}-v{version}.md`

### 1.3 Required Documentation
1. Project Overview Documents:
   - introduction.md
   - architecture.md
   - roadmap.md

2. Specification Documents:
   - business-requirements.md
   - technical-requirements.md
   - api-specifications.md

3. Progress Documents:
   - current-status.md
   - release-notes.md
   - milestone-tracking.md

## 2. Documentation Types and Responsibilities

### 2.1 Project-Level Documentation
Owner: GPM
- Project overview and goals
- Project roadmap
- Status reports
- Release notes
- Milestone tracking

### 2.2 Technical Documentation
Owner: ARCHITECT
- System design documents
- Technical specifications
- Architecture decisions
- Integration guides
- API documentation

### 2.3 Component Documentation
Owner: Component Owner
- Component design
- Integration points
- Dependencies
- Usage guidelines
- Performance considerations

### 2.4 Implementation Documentation
Owner: CODE
- Setup guides
- Deployment procedures
- Maintenance instructions
- Troubleshooting guides
- Performance optimizations

## 3. Documentation Workflow

### 3.1 Document Creation Process
1. Initialize using template
2. Draft content following standards
3. Include required metadata
4. Add cross-references
5. Submit for review

### 3.2 Review Process
1. Technical review (ARCHITECT)
   - Technical accuracy
   - Design alignment
   - Integration completeness

2. Quality review (QC)
   - Documentation standards
   - Completeness
   - Clarity
   - Cross-references

3. Final approval (GPM)
   - Business alignment
   - Completeness
   - Strategic fit

### 3.3 Update Procedures
1. Regular Review Schedule
   - Monthly for project docs
   - Quarterly for technical docs
   - On-release for implementation docs

2. Version Control
   - Use semantic versioning
   - Maintain changelog
   - Archive old versions

3. Change Process
   - Document change request
   - Impact assessment
   - Review and approval
   - Implementation
   - Validation

## 4. Integration with Agent Workflow

### 4.1 Documentation Handoffs
1. Project → Agent Flow
   - Project docs provide context
   - Link to relevant agent docs
   - Maintain traceability

2. Agent → Project Flow
   - Agent docs reference project docs
   - Update project status
   - Maintain consistency

### 4.2 Cross-referencing Rules
1. Use relative links
2. Include section anchors
3. Maintain bidirectional links
4. Version reference if needed

### 4.3 Quality Gates
1. Documentation Completeness
   - All required sections present
   - Metadata complete
   - Cross-references valid

2. Technical Accuracy
   - Content verified
   - Examples tested
   - Diagrams current

3. Integration Validation
   - Links functional
   - References accurate
   - Dependencies documented

## 5. Templates

### 5.1 Project Overview Template
```markdown
# Project: {name}

## Metadata
- Version: x.y.z
- Last Updated: YYYY-MM-DD
- Status: [Draft|Review|Approved]
- Owner: [Team/Role]

## Overview
[Project description and goals]

## Scope
- Included features
- Excluded features
- Dependencies

## Timeline
- Start Date: YYYY-MM-DD
- Key Milestones
- Target Completion: YYYY-MM-DD

## References
- Related documents
- External resources
- Agent documentation
```

### 5.2 Component Documentation Template
```markdown
# Component: {name}

## Metadata
- Version: x.y.z
- Last Updated: YYYY-MM-DD
- Status: [Draft|Review|Approved]
- Owner: [Team/Role]

## Overview
- Purpose
- Key features
- Dependencies

## Technical Details
- Architecture
- Design decisions
- Integration points

## Implementation
- Setup instructions
- Usage guidelines
- Examples

## References
- Related components
- External documentation
- Agent documentation
```

### 5.3 Decision Record Template
```markdown
# Decision Record: {title}

## Metadata
- Date: YYYY-MM-DD
- Status: [Proposed|Accepted|Deprecated|Superseded]
- Deciders: [Names/Roles]

## Context
[Decision context and background]

## Decision
[The decision made]

## Consequences
[Impact and implications]

## Related
- Components affected
- Documentation updates needed
- Agent documentation links
```

### 5.4 Status Report Template
```markdown
# Status Report: {date}

## Metadata
- Period: YYYY-MM-DD to YYYY-MM-DD
- Status: [On Track|At Risk|Blocked]
- Report Owner: [Name/Role]

## Progress Summary
- Key achievements
- Current activities
- Upcoming work

## Metrics
- Completion percentage
- Quality metrics
- Performance indicators

## Issues and Risks
- Current issues
- Potential risks
- Mitigation plans

## References
- Related documents
- Agent documentation
- External resources
```

## 6. Implementation Guidelines

### 6.1 Getting Started
1. Create project structure using provided templates
2. Initialize required documentation
3. Set up review process
4. Establish update schedule

### 6.2 Maintenance
1. Regular reviews
2. Version updates
3. Archive management
4. Link validation

### 6.3 Quality Assurance
1. Documentation audits
2. Completeness checks
3. Accuracy verification
4. Integration validation

This standard ensures:
1. Clear separation of project and agent documentation
2. Consistent structure across projects
3. Clear ownership and responsibilities
4. Quality maintenance
5. Proper integration with agent workflows