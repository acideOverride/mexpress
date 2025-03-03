# BRQ Documentation Organization

This document provides an overview of how BRQ (Business Requirements) documents are organized across mExpress projects.

## BRQ Naming Convention

Files follow a standardized naming format:
`[PROJ]-[YEAR]-[NUM]-[COMPONENT]-description.md`

- **PROJ**: 4-letter project code (MEXP, MONT, etc.)
- **YEAR**: 4-digit year (2025)
- **NUM**: 3-digit sequential number (001, 002, etc.)
- **COMPONENT**: Scope indicator
  - FE: Frontend only
  - BE: Backend only
  - FULL: Both frontend and backend
  - API: API integration
  - INFRA: Infrastructure
  - DOC: Documentation only
- **description**: Brief description of the document contents

## BRQ Directory Structure

Each project has its own flat BRQ directory:

```
/opt/mExpress/docs/
├── mexpress/
│   └── brq/                      # All mExpress BRQs in a single flat directory
│       ├── MEXP-2025-006-API-customer-crud.md
│       ├── MEXP-2025-007-BE-integration-design.md
│       ├── MEXP-2025-025-INFRA-simplification.md
│       └── ...
│
└── montpc_crm/
    └── brq/                      # All MontPC CRM BRQs in a single flat directory
        ├── MONT-2025-007-FULL-emergency-recovery-plan.md
        └── ...
```

## BRQ Cross-References

The following BRQs have been renamed according to the new convention:

| Old BRQ ID         | New BRQ ID          | Description                     |
|--------------------|---------------------|---------------------------------|
| M-MEXP-2025-007-BE | MONT-2025-007-FULL  | Emergency Recovery              |
| M-MEXP-2025-002-FE | MONT-2025-002-FULL  | Authentication Service & Frontend|
| M-MEXP-2025-001-API| MONT-2025-001-FULL  | Customer Service Implementation |

See the brq-mapping.md file in common/reference for a complete mapping of BRQ IDs.