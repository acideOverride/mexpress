# MontPC CRM Documentation

## Overview
This directory contains the project-level documentation for the MontPC CRM system. For agent-specific documentation, refer to individual component directories.

## Directory Structure

```
/montpc_crm/
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
   - introduction.md: CRM system goals and scope
   - architecture.md: System architecture and integrations
   - roadmap.md: Implementation phases

2. Specifications:
   - Business requirements
   - Technical specifications
   - Integration requirements with:
     * mExpress framework
     * Third-party services
     * Client systems

3. Progress Tracking:
   - Implementation milestones
   - Release planning
   - Status reporting

## Integration Points
1. Framework Integration:
   - mExpress core services
   - Service mesh implementation
   - Message queue system

2. External Services:
   - Payment processing
   - Email services
   - Analytics integration

3. Client Systems:
   - Data migration
   - API integrations
   - Custom workflows

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

## Client-Specific Considerations
1. Customization Documentation:
   - Custom workflows
   - Specific integrations
   - Client requirements

2. Implementation Tracking:
   - Client feedback
   - Customization status
   - Integration progress

3. Deployment Planning:
   - Environment setup
   - Data migration
   - User training

For detailed documentation standards and requirements, refer to:
- /docs/standards/F_project_documentation.md
- /docs/standards/A_foundation.md