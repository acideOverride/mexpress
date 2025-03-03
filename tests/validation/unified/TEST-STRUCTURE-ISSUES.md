# Test Structure Discrepancies and Enhancement Plan

**Last Updated**: March 4, 2025

## Overview

This document tracks identified discrepancies between the current test implementation and the test standards defined in `/docs/common/standards/C4_test_standards.md`. It serves as a reference for future refactoring efforts **after** achieving stability in the current test suite.

> ⚠️ **CRITICAL**: Do not move or refactor tests until all tests are passing in their current locations. Achieving test stability takes priority over structural improvements.

## Test Structure Discrepancies

### 1. Directory Structure Non-Compliance

```
╔════════════════════════════════════════════════════════════════════════════════╗
║ CURRENT STATE                          ║ DESIRED STATE (per C4_test_standards) ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ /packages/core/tests/                  ║ /tests/packages/core/                 ║
║ /packages/core/src/**/__tests__/       ║ /tests/packages/core/unit/           ║
║ /projects/*/frontend/tests/            ║ /tests/projects/*/frontend/          ║
║ /projects/*/frontend/src/**/__tests__/ ║ /tests/projects/*/frontend/unit/     ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

#### Specific Examples

1. **Package-Specific Test Locations (Currently Working)**:
   - ✅ `/opt/mExpress/packages/core/tests/p0/core/message-queue-v2.test.ts`
   - ✅ `/opt/mExpress/packages/core/tests/p0/core/message-state-manager.test.ts`
   - ✅ `/opt/mExpress/packages/core/tests/p0/services/customer.service.test.ts`
   
2. **Centralized Test Structure (Incomplete/Not Working)**:
   - ❌ `/opt/mExpress/tests/packages/core/unit/core/message-queue/message-queue-v2.test.ts`

3. **Project Test Locations (Currently Working)**:
   - ✅ `/opt/mExpress/projects/montpc_crm/tests/frontend/p0/api/services/auth.service.test.ts`
   - ✅ `/opt/mExpress/projects/montpc_crm/tests/frontend/p0/components/auth/LoginForm.test.tsx`

### 2. Priority Organization

The current P0-P3 priority organization is implemented correctly in the package-specific test structure, but doesn't match the unit/integration/e2e organization in the centralized structure.

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ CURRENT PRIORITY STRUCTURE   ║ CENTRALIZED DIRECTORY STRUCTURE                ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ p0/ (Critical)               ║ unit/                                          ║
║ p1/ (High)                   ║ integration/                                   ║
║ p2/ (Medium)                 ║ e2e/                                           ║
║ p3/ (Low)                    ║                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### 3. In-Source Tests

Multiple tests are embedded within source code directories rather than in dedicated test directories:

- `/opt/mExpress/projects/montpc_crm/frontend/src/api/services/__tests__/auth.service.test.ts`
- `/opt/mExpress/projects/montpc_crm/frontend/src/components/customers/__tests__/CustomerList.test.tsx`
- `/opt/mExpress/packages/core/src/reconciliation-tools/__tests__/componentScanner.test.ts`

## Enhancement Plan

### Phase 1: Test Stabilization (Current Focus)

1. **Fix Failing Tests in Current Locations**
   - Continue addressing failing tests in their current locations
   - Update test status tracking in existing master files
   - Do not move or restructure tests during this phase

2. **Document All Discrepancies**
   - Maintain this document with all identified structural issues
   - Track working vs. non-working test locations
   - Identify patterns in test organization

### Phase 2: Refactoring Assessment (Future)

1. **Test Migration Strategy**
   - Develop scripts to properly migrate tests to the centralized structure
   - Create test infrastructure in centralized location matching current functionality
   - Establish verification process to ensure tests pass in new location

2. **Configuration Consistency**
   - Align Jest configurations between current and target structures
   - Update import paths and dependencies
   - Ensure consistent mocking and test utilities

### Phase 3: Incremental Migration (Future)

1. **Prioritized Migration Order**
   - Begin with stable units (message queue, auth services)
   - Migrate one component at a time with verification
   - Use feature toggles to support both structures during transition

2. **Documentation Updates**
   - Update CLAUDE.md with clear guidance during transition
   - Maintain location mappings for tests during transition
   - Update BRQ references and tracking documents

## Currently Identified Priority Issues

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║ 🔴 HIGHEST PRIORITY TEST ISSUES                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║ 1. MontPC Auth Service (MONT-2025-002-FULL)                                  ║
║    • auth.service.test.ts - Located in multiple locations with incompatible   ║
║      configurations                                                           ║
║    • login.test.tsx - Configuration dependencies not aligned                  ║
║                                                                               ║
║ 2. Frontend Component Tests (MEXP-2025-002-FE)                               ║
║    • component-tests.test.ts - Located in package-specific location only      ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## Configuration Discrepancies

1. **Jest Configuration Variations**
   - Package-specific Jest configurations use different presets and module mappers
   - Test setup files vary between locations (setupFilesAfterEnv)
   - Resource monitoring and performance tracking inconsistent

2. **Dependency Management**
   - Different mock implementations between test locations
   - Inconsistent import strategies (path aliases vs. relative imports)
   - Environment variable differences

## Recommended Immediate Actions

1. **Create Combined Test Command**
   - Run tests in both structures during transition
   - Flag and report discrepancies between outputs

2. **Establish "Source of Truth" by Component**
   - Document which test location is definitive for each component
   - Redirect engineers to correct location based on component

3. **Do Not Create New Tests in Both Locations**
   - Follow current working patterns for now
   - Document location decisions in this file

---

> This document represents the current state of test structure discrepancies and is the reference for future refactoring efforts. All changes to test organization should be guided by this document and the standards in /opt/mExpress/docs/common/standards/C4_test_standards.md.

> **Update Process**: When making changes related to test structure, update this document along with test status tracking.