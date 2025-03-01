# Documentation Reorganization Implementation Plan

## New Directory Structure

```
/opt/mExpress/docs/
├── archive/                 # Legacy documentation backup
│   ├── core/                # Previous core directory
│   └── docs_audits/         # Audit documentation
│
├── common/                  # Cross-project standards and references
│   ├── standards/           # Development standards
│   ├── reference/           # Reference information (BRQ mapping, etc.)
│   └── architecture/        # Common architectural patterns
│
├── mexpress/                # Foundation layer docs
│   ├── architecture/        # Core architecture decisions
│   ├── features/            # Feature specifications
│   └── api/                 # API documentation
│
├── montpc_crm/              # MontPC CRM project docs
│   ├── architecture/        # Project-specific architecture
│   ├── features/            # Project features
│   └── integrations/        # External integrations
│
└── resources/               # Supporting resources
    └── agents/              # Agent role definitions
```

## Implementation Strategy

1. First create the new directory structure
2. Copy key standards documents to common/standards
3. Copy BRQ mapping and other reference materials to common/reference
4. Selectively copy architecture documents to respective project directories
5. Selectively copy feature documentation to respective project directories
6. Archive all other documentation to maintain history

## Files to Migrate (First Pass - Most Critical)

### Common Standards
- [x] /opt/mExpress/docs/core/standards/*.md -> /opt/mExpress/docs/common/standards/

### Common Reference
- [x] /opt/mExpress/docs/core/standards/brq-mapping.md -> /opt/mExpress/docs/common/reference/
- [x] Project status dashboard -> /opt/mExpress/docs/common/reference/

### Foundation Architecture (mExpress)
- [ ] Key architectural decision documents -> /opt/mExpress/docs/mexpress/architecture/
  - Key documents to include:
    - Message queue architecture
    - Core API architecture
    - System overview

### Project Architecture (MontPC CRM)
- [ ] Key architectural decision documents -> /opt/mExpress/docs/montpc_crm/architecture/
  - Key documents to include:
    - External integration architecture
    - Customer management architecture

### Agent Resources
- [ ] Lite agent role definitions -> /opt/mExpress/docs/resources/agents/

## Additional Implementation Notes

- Remove duplicate versions of documents
- Eliminate process documentation that doesn't provide technical value
- Maintain clean cross-references between documents
- Update README files in each directory to explain purpose

## Repository Update

After documentation is reorganized, commit the changes with a message describing the reorganization.
