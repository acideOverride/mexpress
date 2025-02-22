# mExpress Documentation Structure

## Directory Organization

### /docs
Root documentation directory.

### /docs/core
Core documentation that applies across all projects:
- /standards - Development and architectural standards
- /workflow - Process and workflow documentation
- /agents - Agent-specific documentation
- /projects - Project-related core documentation
  * Core project files (brq-gap-analysis.md, project-summary.md, etc.)
  * Project-specific directories (montpc_crm/, etc.)

### /docs/docs_audits
Documentation audit trails and verification records:
- /standards - Standards audit records
- /workflow - Workflow audit records
- /agents - Agent audit records

## Documentation Standards

1. Core project documentation should be placed directly in `/docs/core/projects/`
2. Project-specific directories should be in `/docs/core/projects/${project_name}/`
3. Core standards and workflows belong in `/docs/core/`
4. Documentation should follow the established directory structure
5. File names should be lowercase with hyphens (kebab-case)
6. Each directory should contain relevant README.md

## Recent Changes

- 2025-02-22: Reorganized project documentation to correct location
  * Moved PROJECT_SUMMARY.md → /core/projects/project-summary.md
  * Moved PURPOSE_ANALYSIS.md → /core/projects/purpose-analysis.md
  * Moved BRQ_GAP_ANALYSIS.md → /core/projects/brq-gap-analysis.md
  * Moved MINIMAL_DEPLOYMENT.md → /core/projects/minimal-deployment.md