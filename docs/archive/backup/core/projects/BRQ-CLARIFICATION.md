# BRQ IDENTIFIER CLARIFICATION

## ISSUE IDENTIFIED: Duplicate/Overlapping BRQ Identifiers

During the Milestone Test Verification task, we identified significant inconsistencies in BRQ identifier usage across projects. This document clarifies these issues and recommends standardization.

## SPECIFIC ISSUES

### 1. Authentication Implementation Confusion

Multiple overlapping identifiers are being used for authentication capabilities:

**MEXP-2025-002-FE: Authentication System**
- Used in MontPC CRM with two components:
  * Authentication Service (backend)
  * Authentication Frontend (frontend components)

**MEXP-2025-018-FE: Frontend Authentication**
- Used in mExpress Frontend Project
- Appears to cover similar functionality to MEXP-2025-002-FE's frontend component
- Creates confusion in reference and testing

### 2. External Integrations Duplication

**MEXP-2025-006-API: External Integrations**
- Used in BOTH MontPC CRM and mExpress Core
- Covers different functionality in each project
- Creates significant ambiguity in requirements tracing
- mExpress implementation has been fixed and passes all tests
- MontPC implementation still shows test failures

**Remediation Applied:**
- MontPC CRM's MEXP-2025-006-API has been renamed to BRQ-2025-032 in documentation
- References to the former identifier maintained for historical traceability

## ARCHITECTURE-LEVEL ACTION REQUIRED

This situation highlights the need for a centralized BRQ management system across all projects:

1. **Cross-Project BRQ Registry**
   - Central allocation system for BRQ identifiers
   - Validation to prevent duplicates

2. **BRQ Naming Conventions**
   - Include project identifiers in BRQ naming
   - Example: M-MEXP-2025-006-API (MontPC), X-MEXP-2025-007-BE (mExpress)

3. **BRQ Mapping Document**
   - Create mapping for existing duplicate identifiers
   - Document relationships between related BRQs

4. **BRQ Hierarchy Structure**
   - Main BRQ for system capabilities
   - Sub-BRQs for project-specific implementations

## RECOMMENDED DISTINCTION

### Authentication Capabilities

**MEXP-2025-002-FE: Authentication System (MontPC CRM)**
- Authentication Service (backend)
  * Token management
  * User authentication/authorization
  * Session handling
- Authentication Frontend (frontend components)
  * Login/registration UI
  * Auth flow implementation
  * Form validation

**MEXP-2025-018-FE: Advanced Frontend Authentication (mExpress)**
- Extended frontend authentication capabilities
- Token persistence optimization
- Permission management UI
- Enhanced security features

### External Integrations

**MEXP-2025-006-API: External Integrations Framework (mExpress Core)**
- Base integration framework
- API connectivity
- Rate limiting
- Token management
- Response format handling

**BRQ-2025-032: External Service Integration (MontPC CRM)**
- Previously known as MEXP-2025-006-API
- Specific integrations with:
  * Hiboutik inventory system
  * Ringover communication platform
- UI implementation for these integrations

## IMPLEMENTATION STATUS

- ✅ MEXP-2025-006-API (mExpress): FIXED - All tests passing
- ✅ MEXP-2025-007-BE (mExpress): FIXED - All tests passing
- ⚠️ BRQ-2025-032 (MontPC): PARTIAL FIX - Some tests still failing

## RECOMMENDED PROCESS IMPROVEMENTS

1. **Centralized BRQ Registry**
   - Implement a system to track all BRQ identifiers
   - Prevent duplicate allocation
   - Enforce standard naming conventions

2. **BRQ Relationship Mapping**
   - Document dependencies between related BRQs
   - Track cross-project implementations

3. **Project-Specific Prefixes**
   - Add project identifiers to BRQ numbers
   - Create clear distinction between related implementations

4. **Documentation Updates**
   - Update all test documentation to reflect clarified BRQ identifiers
   - Maintain backward references for historical context

## NEXT STEPS

1. Review test implementations to ensure they reflect the proper BRQ identification
2. Update documentation across projects to use consistent BRQ identification
3. Create formal BRQ registry to prevent future duplication
4. Complete remaining test fixes for BRQ-2025-032 (formerly MEXP-2025-006-API) in MontPC CRM