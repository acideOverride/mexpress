# Project Documentation Migration Guide

## Overview
This guide outlines the process for migrating existing documentation to the new project documentation structure defined in F_project_documentation.md.

## Migration Steps

### 1. Documentation Inventory
1. Review existing documentation in:
   - /docs_backup/project_docs_backup/
   - /docs_backup/150225/
   - /docs_backup/docs_migration/
   - /docs_tech/

2. Categorize documents:
   ```
   A. Framework Documentation (mExpress)
      - Core functionality
      - Service mesh
      - Message queue
      - Integration specifications

   B. Client Documentation (MontPC)
      - CRM functionality
      - Client customizations
      - Integration requirements
   ```

### 2. Content Migration

#### For mExpress:
1. Project Overview (/docs/projects/mexpress/overview/)
   - Move architecture documentation
   - Update roadmap information
   - Create introduction from existing docs

2. Specifications (/docs/projects/mexpress/specifications/)
   - Migrate technical specifications
   - Update API documentation
   - Consolidate design documents

3. Components (/docs/projects/mexpress/components/)
   - Create component structure
   - Move component-specific documentation
   - Update integration points

#### For MontPC:
1. Project Overview (/docs/projects/montpc_crm/overview/)
   - Create client-specific introduction
   - Document system architecture
   - Define implementation roadmap

2. Specifications (/docs/projects/montpc_crm/specifications/)
   - Move client requirements
   - Document customizations
   - Define integration specs

3. Components (/docs/projects/montpc_crm/components/)
   - Document CRM components
   - Define integration points
   - Specify customizations

### 3. Documentation Updates

1. Update Cross-References:
   - Check all document links
   - Update file paths
   - Verify integration points

2. Add Required Metadata:
   ```markdown
   # Document Title

   ## Metadata
   - Version: x.y.z
   - Last Updated: YYYY-MM-DD
   - Status: [DRAFT|REVIEW|APPROVED]
   - Author: [Role/Team]
   - Reviewers: [Roles/Teams]
   ```

3. Verify Documentation Standards:
   - Follow markdown formatting
   - Include required sections
   - Add proper cross-references
   - Update version history

### 4. Quality Verification

1. Document Completeness:
   - All required sections present
   - Metadata complete
   - Cross-references valid
   - Version history updated

2. Technical Accuracy:
   - Content verified
   - Examples tested
   - Configurations validated
   - Integration points confirmed

3. Documentation Quality:
   - Clear and concise
   - Properly formatted
   - Consistent style
   - No broken links

### 5. Agent Integration

1. Update Agent Documentation:
   - Link to project documentation
   - Update workflow references
   - Verify handoff procedures
   - Maintain quality chain

2. Quality Gates:
   - Documentation completeness
   - Technical accuracy
   - Cross-reference validity
   - Agent workflow integration

### 6. Migration Checklist

```markdown
# Pre-Migration
- [ ] Inventory complete
- [ ] Documents categorized
- [ ] Migration plan reviewed
- [ ] Backup created

# Content Migration
- [ ] Project overview migrated
- [ ] Specifications updated
- [ ] Components documented
- [ ] Implementation details moved
- [ ] Decision records created
- [ ] Progress tracking established

# Quality Verification
- [ ] Documentation standards met
- [ ] Cross-references updated
- [ ] Technical content verified
- [ ] Agent integration confirmed

# Post-Migration
- [ ] All documents reviewed
- [ ] Quality gates passed
- [ ] Agent workflows updated
- [ ] Old documentation archived
```

## Timeline and Priorities

1. High Priority:
   - Core framework documentation
   - Critical specifications
   - Active component docs

2. Medium Priority:
   - Implementation details
   - Decision records
   - Progress tracking

3. Low Priority:
   - Historical records
   - Archived documents
   - Deprecated content

## Support and Resources

1. Reference Documentation:
   - F_project_documentation.md
   - A_foundation.md
   - E_agent_standards.md

2. Tools and Templates:
   - Document templates
   - Migration scripts
   - Validation tools

3. Contact Points:
   - Documentation team
   - Technical leads
   - Quality assurance

## Post-Migration Tasks

1. Documentation Cleanup:
   - Archive old documents
   - Remove duplicates
   - Update indexes

2. Process Updates:
   - Update documentation workflows
   - Train team on new structure
   - Establish review process

3. Monitoring:
   - Track documentation usage
   - Gather feedback
   - Plan improvements