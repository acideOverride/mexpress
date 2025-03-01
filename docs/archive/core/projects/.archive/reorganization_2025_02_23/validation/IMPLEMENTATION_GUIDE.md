# Documentation Reorganization Implementation Guide

Roo: ARCHITECT
PROJECT: Documentation Restructure
COMPONENT: Implementation Guide - BRQ-2025-REORG-IMPL
DATE: 2025-02-22
STATUS: READY_FOR_IMPLEMENTATION

## Project Structure Template

Each project must follow this structure:
```
project_name/
├── README.md
├── architecture/
│   ├── decisions/
│   ├── gpm-handoff/
│   └── qc-integration/
├── components/
├── design/
├── implementation/
├── overview/
├── project/
├── qa/
│   ├── code-reports/
│   └── gpm-reports/
├── specifications/
│   ├── api/
│   ├── design/
│   └── requirements/
└── tasks/
```

## Implementation Steps

### 1. mexpress Project Reorganization

#### Current State Analysis
- Basic documentation present
- Some directories missing
- Structure needs standardization

#### Required Actions
1. Create missing directories:
   ```
   mkdir -p mexpress/{components,design,implementation,overview,project,qa/{code-reports,gpm-reports},specifications/{api,design,requirements},tasks}
   ```

2. Move existing files:
   - brq-gap-analysis.md → mexpress/architecture/decisions/
   - minimal-deployment.md → mexpress/implementation/
   - project-summary.md → mexpress/overview/
   - purpose-analysis.md → mexpress/overview/

### 2. montpc_crm Project Reorganization

#### Current State Analysis
- Most directories present
- Some structural inconsistencies
- Additional directories to clean up

#### Required Actions
1. Standardize directory structure:
   ```
   mkdir -p montpc_crm/{components,design,implementation,overview,project,qa/{code-reports,gpm-reports},specifications/{api,design,requirements},tasks}
   ```

2. Move and consolidate files:
   - README.md stays at root
   - TechnicalBusinessOverview.md → overview/
   - TechnicalBusinessRequirements.md → specifications/requirements/

3. Clean up duplicate directories:
   - Merge any unique content from projects_backup/montpc_crm
   - Remove redundant backup directories

### 3. Migration Files Consolidation

#### Current State Analysis
- Migration files scattered at root level
- Need central location for migration documentation

#### Required Actions
1. Create migration documentation structure:
   ```
   mkdir -p docs/core/projects/migration_docs
   ```

2. Move migration files:
   - MIGRATION_GUIDE.md → migration_docs/
   - MIGRATION_MAPPING.md → migration_docs/
   - TEST_MIGRATION_GUIDE.md → migration_docs/
   - TEST_MIGRATION_MAPPING.md → migration_docs/
   - TEST_MIGRATION_SUMMARY.md → migration_docs/

## Implementation Sequence

### Phase 1: Directory Structure
1. Create standard directories for each project
2. Verify directory structure compliance
3. Document directory creation results

### Phase 2: Content Migration
1. Move files to appropriate locations
2. Update any internal references
3. Verify file movements
4. Document content migration

### Phase 3: Cleanup
1. Remove redundant directories
2. Clean up backup content
3. Verify no content loss
4. Document cleanup results

## Validation Requirements

### Structure Validation
- All required directories present
- Proper hierarchy maintained
- No orphaned directories
- Clean organization

### Content Validation
- All files properly placed
- No duplicate content
- References updated
- Documentation complete

### Migration Validation
- All migration files consolidated
- No scattered documentation
- Clear migration history
- Proper organization

## Mode Handoff Instructions

### To Code Mode
1. Execute directory creation commands
2. Perform file movements
3. Run cleanup operations
4. Document all actions

### Back to Architect
1. Review implementation results
2. Verify structure compliance
3. Update documentation
4. Plan next phase

## References
- Reorganization Plan: /opt/mExpress/docs/core/projects/REORGANIZATION_PLAN.md
- Backup Verification: /opt/mExpress/docs/core/projects/validation/BACKUP_VERIFICATION.md
- Validation Checklist: /opt/mExpress/docs/core/projects/validation/VALIDATION_CHECKLIST.md