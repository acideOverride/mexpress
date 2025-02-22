# Test Migration Plan v1.0

## 1. Test Classification

### 1.1 P0 (Critical) Tests
```
# Backend
- Authentication (/services/__tests__/hiboutik.auth.test.ts)
- Core Services (/src/__tests__/p0/core/*.test.ts)
- Data Integrity (/services/validation/__tests__/*.test.ts)
- Critical APIs (/services/__tests__/sync.*.test.ts)

# Frontend
- Auth Services (/frontend/src/api/services/__tests__/auth.service.test.ts)
- Auth Interceptors (/frontend/src/api/interceptors/__tests__/auth.interceptor.test.ts)
```

### 1.2 P1 (High Priority) Tests
```
# Backend
- Business Logic (/services/__tests__/*.service.test.ts)
- Integration Tests (/tests/integration/__tests__/*.test.ts)
- Customer Management (/src/tests/customer/__tests__/*.test.ts)
- Error Handling (/lib/resilience/__tests__/*.test.ts)

# Frontend
- Customer Services (/frontend/src/api/services/__tests__/customers.service.test.ts)
- Product Services (/frontend/src/api/services/__tests__/products.service.test.ts)
- Dashboard Components (/frontend/src/components/dashboard/__tests__/*.test.ts)
```

### 1.3 P2 (Standard) Tests
```
# Backend
- Utility Functions (/src/utils/__tests__/*.test.ts)
- Monitoring (/lib/monitoring/__tests__/*.test.ts)
- Models (/src/models/__tests__/*.test.ts)

# Frontend
- UI Components (/frontend/src/components/*/__tests__/*.test.tsx)
- Hooks (/frontend/src/hooks/__tests__/*.test.ts)
- Error Interceptors (/frontend/src/api/interceptors/__tests__/error.interceptor.test.ts)
```

## 2. Migration Steps

### 2.1 Backend Migration
1. Create new directory structure:
```
src/__tests__/
├── p0/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── p1/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── p2/
    ├── unit/
    ├── integration/
    └── e2e/
```

2. Move files (preserve git history):
```bash
# Example for P0
git mv src/services/__tests__/hiboutik.auth.test.ts src/__tests__/p0/unit/auth.hiboutik.test.ts
```

3. Update imports and paths

4. Update test configurations

### 2.2 Frontend Migration
1. Create new directory structure:
```
frontend/src/__tests__/
├── p0/
│   ├── unit/
│   └── integration/
├── p1/
│   ├── unit/
│   └── integration/
└── p2/
    ├── unit/
    └── integration/
```

2. Move files (preserve git history)
3. Update imports and paths
4. Update test configurations

## 3. Refactoring Plan

### 3.1 Helper Implementation
1. Create helper structure:
```
src/__tests__/helpers/
├── mocks/
│   ├── database.ts
│   ├── api.ts
│   └── auth.ts
├── fixtures/
│   ├── users.ts
│   ├── orders.ts
│   └── config.ts
└── utils/
    ├── setup.ts
    ├── cleanup.ts
    └── assertions.ts
```

2. Extract common patterns:
- Database connections
- API mocks
- Authentication
- Test data

3. Update tests to use helpers

### 3.2 Environment Setup
1. Create environment structure
2. Configure per priority
3. Update test runners

### 3.3 Result Aggregation
1. Implement reporting structure
2. Update CI/CD integration
3. Configure dashboards

## 4. Migration Schedule

### 4.1 Phase 1: Critical (P0)
- Duration: 1 week
- Focus: Auth, Core, Data Integrity
- Risk: High (needs careful testing)

### 4.2 Phase 2: High Priority (P1)
- Duration: 2 weeks
- Focus: Business Logic, Integration
- Risk: Medium

### 4.3 Phase 3: Standard (P2)
- Duration: 2 weeks
- Focus: Utils, UI, Monitoring
- Risk: Low

## 5. Rollback Plan

### 5.1 Git Branches
- main (current)
- feature/test-migration
- feature/test-helpers
- feature/test-environment

### 5.2 Checkpoints
- After each priority migration
- After helper implementation
- After environment setup

### 5.3 Validation
- All tests must pass
- Coverage must be maintained
- Performance must be equal/better