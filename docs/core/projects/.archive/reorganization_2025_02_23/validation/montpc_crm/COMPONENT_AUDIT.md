# montpc_crm Component Audit

Roo: CODE
PROJECT: Documentation Restructure
COMPONENT: Component Audit
DATE: 2025-02-23
STATUS: IN_PROGRESS

## Current Structure Analysis

### Component Organization
```
components/
├── admin-dashboard/
│   ├── design.md
│   └── overview.md
├── customer-portal/
│   ├── design.md
│   └── overview.md
└── integration/
    ├── design.md
    └── overview.md
```

### Related Design Files
```
design/
├── auth-components-spec.md
├── auth-service-code-handoff.md
├── auth-service-design.md
├── BRQ-2025-006-ui-design.md
├── test-migration-design-handoff.md
└── test-organization-design-system.md
```

## Component Relationships

### Admin Dashboard Component
- Primary Design: components/admin-dashboard/design.md
- Related Files:
  * design/auth-components-spec.md
  * design/BRQ-2025-006-ui-design.md
- Implementation: architecture/implementation/auth-frontend-implementation.md
- Testing: architecture/testing/T-006-04-dashboard-testing.md

### Customer Portal Component
- Primary Design: components/customer-portal/design.md
- Related Files:
  * design/auth-service-design.md
  * design/auth-service-code-handoff.md
- Implementation: architecture/implementation/auth-service.md
- Testing: architecture/testing/T-006-05-customer-testing.md

### Integration Component
- Primary Design: components/integration/design.md
- Related Files:
  * architecture/external-integrations.md
- Implementation: architecture/implementation/customer-service.md
- Testing: architecture/testing/T-006-06-integration-testing.md

## Design File Analysis

### Authentication Related
1. auth-components-spec.md
   - Relates to: admin-dashboard
   - Type: Component Specification
   - Status: Active

2. auth-service-design.md
   - Relates to: customer-portal
   - Type: Service Design
   - Status: Active

3. auth-service-code-handoff.md
   - Relates to: customer-portal
   - Type: Implementation Guide
   - Status: Active

### UI Related
1. BRQ-2025-006-ui-design.md
   - Relates to: admin-dashboard
   - Type: UI Design
   - Status: Active

### Test Related
1. test-migration-design-handoff.md
   - Type: Migration Guide
   - Status: Support

2. test-organization-design-system.md
   - Type: System Design
   - Status: Support

## Recommended Changes

### 1. Component Documentation Structure
```
components/
├── admin-dashboard/
│   ├── design/
│   │   ├── component-spec.md (from auth-components-spec.md)
│   │   └── ui-design.md (from BRQ-2025-006-ui-design.md)
│   ├── implementation/
│   │   └── frontend-implementation.md
│   └── overview.md
├── customer-portal/
│   ├── design/
│   │   ├── service-design.md (from auth-service-design.md)
│   │   └── code-handoff.md (from auth-service-code-handoff.md)
│   ├── implementation/
│   │   └── service-implementation.md
│   └── overview.md
└── integration/
    ├── design/
    │   └── integration-spec.md
    ├── implementation/
    │   └── service-implementation.md
    └── overview.md
```

### 2. Design File Organization
- Move component-specific design files to respective component directories
- Keep system-wide design files in design/ directory
- Update all references to reflect new locations

### 3. Implementation Integration
- Link component documentation with implementation files
- Update cross-references
- Maintain clear dependency chains

## Implementation Steps

### Phase 1: Create New Structure
- [ ] Create design/ subdirectories in each component
- [ ] Create implementation/ subdirectories in each component
- [ ] Verify directory structure

### Phase 2: Move Design Files
- [ ] Move auth-components-spec.md to admin-dashboard/design/
- [ ] Move BRQ-2025-006-ui-design.md to admin-dashboard/design/
- [ ] Move auth-service-design.md to customer-portal/design/
- [ ] Move auth-service-code-handoff.md to customer-portal/design/
- [ ] Update references

### Phase 3: Link Implementations
- [ ] Create implementation links
- [ ] Update cross-references
- [ ] Verify relationships
- [ ] Test documentation links

## Success Criteria
1. Clear component organization
2. Proper design file placement
3. Maintained relationships
4. Updated references
5. Complete documentation

## References
- Content Audit: /opt/mExpress/docs/core/projects/validation/montpc_crm/CONTENT_AUDIT.md
- QC Audit: /opt/mExpress/docs/core/projects/validation/montpc_crm/QC_AUDIT.md
- Reorganization Progress: /opt/mExpress/docs/core/projects/validation/montpc_crm/REORGANIZATION_PROGRESS.md