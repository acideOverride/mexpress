# mExpress Documentation Structure

## Directory Organization

### /docs
Root documentation directory.

### /docs/core
Core documentation that applies across all projects:
- /standards - Development and architectural standards
- /workflow - Process and workflow documentation
- /agents - Agent-specific documentation
- /projects - Project-specific core documentation
  * /${project_name} - Project documentation and artifacts
  * /mexpress - mExpress project documentation
  * /montpc_crm - MontPC CRM project documentation

### /docs/docs_audits
Documentation audit trails and verification records:
- /standards - Standards audit records
- /workflow - Workflow audit records
- /agents - Agent audit records

## Documentation Standards

1. Project documentation should be placed in `/docs/core/projects/${project_name}/`
2. Core standards and workflows belong in `/docs/core/`
3. Documentation should follow the established directory structure
4. File names should be lowercase with hyphens (kebab-case)
5. Each directory should contain relevant README.md

## Recent Changes

- 2025-02-22: Reorganized project documentation to correct location
  * Moved PROJECT_SUMMARY.md → /core/projects/mexpress/project-summary.md
  * Moved PURPOSE_ANALYSIS.md → /core/projects/mexpress/purpose-analysis.md
  * Moved BRQ_GAP_ANALYSIS.md → /core/projects/mexpress/brq-gap-analysis.md
  * Moved MINIMAL_DEPLOYMENT.md → /core/projects/mexpress/minimal-deployment.md