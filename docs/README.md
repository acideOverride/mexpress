# mExpress Documentation Structure

## Directory Organization

### /docs
Root documentation directory.

### /docs/core
Core documentation that applies across all projects:
- /standards - Development and architectural standards
- /workflow - Process and workflow documentation
- /agents - Agent-specific documentation
- /projects - Project-specific documentation
  * /mexpress - mExpress project documentation
  * /montpc_crm - MontPC CRM project documentation
  * /giandra_photos - Giandra Photos project documentation

### /docs/docs_audits
Documentation audit trails and verification records:
- /standards - Standards audit records
- /workflow - Workflow audit records
- /agents - Agent audit records

## Documentation Standards

1. Project documentation should be organized in `/docs/core/projects/${project_name}/`
2. Each project directory should contain:
   - Project-specific documentation
   - Architecture decisions
   - Implementation details
   - Project management documents
   - QA documentation
3. Core standards and workflows belong in `/docs/core/`
4. Documentation should follow the established directory structure
5. File names should be lowercase with hyphens (kebab-case)
6. Each directory should contain relevant README.md

## Recent Changes

- 2025-02-22: Reorganized project documentation structure
  * Created proper project directories in /docs/core/projects/
  * Moved all project documentation to respective directories
  * Merged documentation from /docs/projects into /docs/core/projects
  * Created consistent project directory structure