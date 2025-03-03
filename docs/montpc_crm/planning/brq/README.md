# MontPC CRM BRQ Documentation

This directory contains documentation for Business Requirements (BRQs) for the MontPC CRM project.

## BRQ Documents

### Full-Stack Components

#### MONT-2025-001-FULL (Customer Service Implementation)
- [MONT-2025-001-FULL-customer-service-implementation.md](./MONT-2025-001-FULL-customer-service-implementation.md) - Customer service implementation specifications

#### MONT-2025-002-FULL (Authentication Service & Frontend)
- [MONT-2025-002-FULL-auth-service-design.md](./MONT-2025-002-FULL-auth-service-design.md) - Authentication service design
- [MONT-2025-002-FULL-auth-service-implementation.md](./MONT-2025-002-FULL-auth-service-implementation.md) - Authentication service implementation
- [MONT-2025-002-FULL-auth-frontend-implementation.md](./MONT-2025-002-FULL-auth-frontend-implementation.md) - Authentication frontend implementation

#### MONT-2025-007-FULL (Emergency Recovery)
- [MONT-2025-007-FULL-emergency-recovery-plan.md](./MONT-2025-007-FULL-emergency-recovery-plan.md) - Emergency recovery plan
- [MONT-2025-007-FULL-recovery-tracking.md](./MONT-2025-007-FULL-recovery-tracking.md) - Recovery tracking process
- [MONT-2025-007-FULL-customer-component-recovery.md](./MONT-2025-007-FULL-customer-component-recovery.md) - Customer component recovery procedures

### API Components

#### MONT-2025-032-API (External Integrations)
- [MONT-2025-032-API-external-integrations.md](./MONT-2025-032-API-external-integrations.md) - Hiboutik and Ringover integration

## BRQ Naming Convention

All BRQ files follow the naming convention:
`[PROJ]-[YEAR]-[NUM]-[COMPONENT]-description.md`

- PROJ: 4-letter project code (MONT)
- YEAR: 4-digit year (2025)
- NUM: 3-digit sequential number (001, 002, etc.)
- COMPONENT: Scope indicator (FE, BE, API, INFRA, FULL, DOC)
- description: Brief description of the document contents

## BRQ Cross-References

The following BRQs have been renamed according to the new convention:
- M-MEXP-2025-001-API → MONT-2025-001-FULL (Customer Service Implementation)
- M-MEXP-2025-002-FE → MONT-2025-002-FULL (Authentication Service & Frontend)
- M-MEXP-2025-007-BE → MONT-2025-007-FULL (Emergency Recovery)
- BRQ-2025-006/032, BRQ-2025-032 → MONT-2025-032-API (External Integrations)