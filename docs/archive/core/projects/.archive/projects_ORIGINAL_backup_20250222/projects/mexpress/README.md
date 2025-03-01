# mExpress Framework Documentation

## Overview
This directory contains the project-level documentation for the mExpress framework. For agent-specific documentation, refer to individual component directories.

## Directory Structure

```
/mexpress/
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

## Documentation Standards
- Follow standards defined in F_project_documentation.md
- Use markdown format for all documentation
- Include metadata in all documents
- Maintain cross-references between project and agent documentation

## Key Documents
1. Project Overview:
   - introduction.md: Project goals and vision
   - architecture.md: High-level system design
   - roadmap.md: Development roadmap

2. Specifications:
   - Technical requirements
   - API documentation
   - Design specifications

3. Progress Tracking:
   - Milestone status
   - Release notes
   - Current project status

## Integration with Agent Documentation
- Project docs provide high-level context
- Component docs link to relevant agent documentation
- Progress tracking aggregates agent-level progress
- Decision records impact agent workflows

## Documentation Workflow
1. Follow templates from F_project_documentation.md
2. Maintain document metadata
3. Update cross-references
4. Regular review and updates
5. Version control for all documents

## Quality Requirements
- Technical accuracy
- Completeness
- Up-to-date content
- Proper cross-referencing
- Regular reviews

For detailed documentation standards and requirements, refer to:
- /docs/standards/F_project_documentation.md
- /docs/standards/A_foundation.md