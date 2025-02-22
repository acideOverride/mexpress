# mExpress Documentation Structure

## Directory Organization

### /docs
Root documentation directory. Should not contain project-specific documentation directly.

### /docs/core
Core documentation that applies across all projects:
- /standards - Development and architectural standards
- /workflow - Process and workflow documentation
- /agents - Agent-specific documentation
- /projects - Project-related core documentation

### /docs/projects/${project_name}
Project-specific documentation:
- /architecture - Architectural decisions and designs
- /design - Design documents and specifications
- /implementation - Implementation details and guides
- /project - Project management documents
- /qa - Quality assurance documentation

### /docs/docs_audits
Documentation audit trails and verification records.

## Documentation Standards

1. Project-specific documentation should always be placed in `/docs/projects/${project_name}/`
2. Core standards and workflows belong in `/docs/core/`
3. Documentation should follow the established directory structure
4. File names should be lowercase with hyphens (kebab-case)
5. Each directory should contain relevant README.md

## Recent Changes

- 2025-02-22: Reorganized project documentation from root docs to project-specific locations
  * Moved PROJECT_SUMMARY.md → /projects/mexpress/project/project-summary.md
  * Moved PURPOSE_ANALYSIS.md → /projects/mexpress/project/purpose-analysis.md
  * Moved BRQ_GAP_ANALYSIS.md → /projects/mexpress/project/brq-gap-analysis.md
  * Moved MINIMAL_DEPLOYMENT.md → /projects/mexpress/project/minimal-deployment.md