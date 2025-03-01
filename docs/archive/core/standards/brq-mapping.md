# BRQ Identifier Mapping Document

## Purpose

This document serves as the central registry and mapping for all Business Requirement Query (BRQ) identifiers across projects. It addresses the critical issue of inconsistent BRQ numbering identified during the Milestone Test Verification task.

## Project Code Definitions

| Code | Project | Description |
|------|---------|-------------|
| MEXP | mExpress Core | Core platform services and framework |
| MONT | MontPC CRM | Customer Relationship Management system for MontPC |
| GIAN | Giandra Photos | Photo management application |
| JERO | Jerome Bikes | Bicycle inventory and sales system |

## BRQ Naming Convention

Format: `[PROJ]-[YEAR]-[NUM]-[COMPONENT]`

Where:
- **PROJ**: 4-letter project code (MEXP, MONT, GIAN, etc.)
- **YEAR**: 4-digit year (2025)
- **NUM**: 3-digit sequential number (001, 002, etc.)
- **COMPONENT**: Required suffix indicating scope
  - **FE**: Frontend only
  - **BE**: Backend only
  - **FULL**: Both frontend and backend
  - **API**: API integration
  - **INFRA**: Infrastructure
  - **DOC**: Documentation only

## BRQ Mapping Table

### MontPC CRM Project BRQs

| Legacy ID | New ID | Name | Description | Status |
|-----------|--------|------|-------------|--------|
| BRQ-2025-001, M-BRQ-2025-001 | MONT-2025-001-FULL | Customer Service Implementation | Core customer data management | COMPLETED |
| BRQ-2025-002, M-BRQ-2025-002 | MONT-2025-002-FULL | Authentication Service & Frontend | User authentication system | COMPLETED |
| BRQ-2025-006/032, BRQ-2025-032 | MONT-2025-032-API | External Integrations | Hiboutik and Ringover Integration | IN PROGRESS |
| BRQ-2025-007, M-BRQ-2025-007 | MONT-2025-007-FULL | Emergency Recovery | Critical system recovery | IN PROGRESS |

### mExpress Core Project BRQs

| Legacy ID | New ID | Name | Description | Status |
|-----------|--------|------|-------------|--------|
| BRQ-2025-001 | MEXP-2025-001-API | API Integration Phase | Core API framework | COMPLETED |
| BRQ-2025-002 | MEXP-2025-002-FE | Frontend Component Research | UI component system | COMPLETED |
| BRQ-2025-003 | MEXP-2025-003-BE | Message Queue System | Async message processing | COMPLETED |
| BRQ-2025-004 | MEXP-2025-004-BE | Core CRUD Functionality | Data management operations | COMPLETED |
| BRQ-2025-005 | MEXP-2025-005-FE | UI Architecture | UI framework design | COMPLETED |
| BRQ-2025-006 | MEXP-2025-006-API | External Integrations | 3rd party system integration | COMPLETED |
| BRQ-2025-007 | MEXP-2025-007-BE | Integration Architecture | Service integration framework | COMPLETED |
| BRQ-2025-018 | MEXP-2025-018-FE | Frontend Authentication | Auth UI components | IN PROGRESS |
| BRQ-2025-024 | MEXP-2025-024-INFRA | Infrastructure Setup | DevOps infrastructure | IN PROGRESS |
| BRQ-2025-025 | MEXP-2025-025-INFRA | Local Development Setup | Dev environment tools | COMPLETED |
| BRQ-2025-027 | MEXP-2025-027-BE | Product Model Implementation | Product data management | READY |
| BRQ-2025-030 | MEXP-2025-030-API | External Integrations | Additional 3rd party integrations | READY |
| BRQ-2025-031 | MEXP-2025-031-API | Ringover Customer Management | Ringover specific integration | READY |
| BRQ-2025-037 | MEXP-2025-037-FULL | MVP Implementation | Minimum viable product | IN PROGRESS |
| BRQ-2025-040 | MEXP-2025-040-FE | Dashboard Implementation | Analytics dashboard | READY |

## Functionality Mapping

This section maps similar functionality across projects to ensure consistent tracking.

### Authentication Functionality

| Project | Legacy BRQ | New BRQ | Components |
|---------|------------|---------|------------|
| MontPC CRM | BRQ-2025-002, M-BRQ-2025-002 | MONT-2025-002-FULL | Authentication Service, Authentication Frontend |
| mExpress Core | BRQ-2025-018 | MEXP-2025-018-FE | Frontend Authentication |

### External Integrations Functionality

| Project | Legacy BRQ | New BRQ | Integration Targets |
|---------|------------|---------|---------------------|
| MontPC CRM | BRQ-2025-006/032, BRQ-2025-032 | MONT-2025-032-API | Hiboutik, Ringover |
| mExpress Core | BRQ-2025-006 | MEXP-2025-006-API | Generic integration framework |
| mExpress Core | BRQ-2025-030 | MEXP-2025-030-API | Additional 3rd party systems |
| mExpress Core | BRQ-2025-031 | MEXP-2025-031-API | Ringover specific integration |

## Implementation Rules

1. All BRQs must follow the standardized format: `[PROJ]-[YEAR]-[NUM]-[COMPONENT]`
2. BRQs for similar functionality across projects should use consistent base numbers
3. All test directories should be updated to use the new BRQ identifiers
4. Legacy identifiers should be maintained in documentation for historical reference
5. This document must be updated when new BRQs are created

## Migration Plan

1. Update documentation to use new BRQ identifiers ✓
2. Rename all file references containing BRQ identifiers ✓
3. Rename actual files and directories containing BRQ in their names ✓
4. Update test scripts to use the new naming convention
5. Ensure all documentation cross-references are updated

This document serves as the authoritative source for BRQ mapping across all projects and should be referenced when creating, modifying, or discussing BRQs.