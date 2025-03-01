# Documentation Reorganization Review

## New Structure Created

A simplified documentation structure has been created at `/opt/mExpress/docs/` with the following organization:

```
/docs/
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

## What Has Been Migrated So Far

1. ✅ All standards have been copied to `/docs/common/standards/`
2. ✅ Key reference documents (BRQ mapping, project status) have been copied to `/docs/common/reference/`
3. ✅ Important architecture documents have been selectively copied to their respective projects
4. ✅ Simplified agent role definitions have been copied to `/docs/resources/agents/`

## Next Steps Before Full Migration

1. **Review the new structure** to ensure it meets project needs
2. **Decide which additional documents to move** from the old structure
3. **Identify and resolve any cross-references** between documents

## Final Migration Steps (After Review)

1. Move the original docs to the archive directory:
   ```bash
   # After review is complete
   mkdir -p /opt/mExpress/docs/archive/core
   mkdir -p /opt/mExpress/docs/archive/docs_audits
   mv /opt/mExpress/docs/core/* /opt/mExpress/docs/archive/core/
   mv /opt/mExpress/docs/docs_audits/* /opt/mExpress/docs/archive/docs_audits/
   ```

2. Remove the original directories:
   ```bash
   # After confirming everything is correctly archived
   rmdir /opt/mExpress/docs/core
   rmdir /opt/mExpress/docs/docs_audits
   ```

3. Commit the changes to git:
   ```bash
   git add /opt/mExpress/docs
   git commit -m "docs: reorganize documentation structure for simplicity and maintainability"
   ```

## Benefits of the New Structure

1. **Reduced nesting** - Clearer path to documentation
2. **Project-focused** - Organized by project rather than by process
3. **Simplified navigation** - Easier to find relevant documentation
4. **Reduced redundancy** - Eliminated duplicate documentation
5. **Maintainable** - Easier to keep updated

## Considerations

The migration has been designed with careful attention to preserve important documentation while eliminating excessive process documentation. The approach prioritizes:

1. **Technical content** over process documentation
2. **Current specifications** over historical records
3. **Usability** over completeness
