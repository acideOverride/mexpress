# Documentation Backup Procedure

Roo: ARCHITECT
PROJECT: Documentation Restructure
COMPONENT: Backup Procedure - BRQ-2025-REORG-BACKUP-PROC
DATE: 2025-02-22
STATUS: READY_FOR_CODE

## Backup Procedure

### 1. Directory Creation
```bash
# Create backup directories with timestamp
mkdir -p /opt/mExpress/docs/core/projects_backup_20250222
mkdir -p /opt/mExpress/docs/core/projects_ORIGINAL_backup_20250222
```

### 2. Content Backup
```bash
# Backup current projects
cp -r /opt/mExpress/docs/core/projects/* /opt/mExpress/docs/core/projects_backup_20250222/

# Backup original projects
cp -r /opt/mExpress/docs/core/projects_ORIGINAL_CARREFUL/* /opt/mExpress/docs/core/projects_ORIGINAL_backup_20250222/
```

### 3. Verification Commands
```bash
# Verify directory structure
ls -la /opt/mExpress/docs/core/projects_backup_20250222/
ls -la /opt/mExpress/docs/core/projects_ORIGINAL_backup_20250222/

# Count files for verification
find /opt/mExpress/docs/core/projects -type f | wc -l
find /opt/mExpress/docs/core/projects_backup_20250222 -type f | wc -l
find /opt/mExpress/docs/core/projects_ORIGINAL_CARREFUL -type f | wc -l
find /opt/mExpress/docs/core/projects_ORIGINAL_backup_20250222 -type f | wc -l
```

## Verification Requirements

### Structure Verification
- Directory tree matches source
- File counts match
- Permissions preserved
- Ownership maintained

### Content Verification
- File integrity intact
- Content matches source
- Metadata preserved
- Links maintained

## Success Criteria

### Backup Success
- All directories created
- All files copied
- No errors during copy
- File counts match

### Verification Success
- Directory structure matches
- File contents identical
- Permissions correct
- Links functional

## Mode Handoff Instructions

### To Code Mode
1. Execute directory creation commands
2. Execute backup commands
3. Run verification commands
4. Document results in BACKUP_VERIFICATION.md

### Back to Architect
1. Review verification results
2. Update BACKUP_VERIFICATION.md status
3. Proceed with reorganization if verified
4. Create recovery plan if issues found

## References
- Reorganization Plan: /opt/mExpress/docs/core/projects/REORGANIZATION_PLAN.md
- Backup Verification: /opt/mExpress/docs/core/projects/validation/BACKUP_VERIFICATION.md
- Validation Checklist: /opt/mExpress/docs/core/projects/validation/VALIDATION_CHECKLIST.md