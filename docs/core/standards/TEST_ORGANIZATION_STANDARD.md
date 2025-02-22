# Test Organization Standard v1.0

## Directory Structure

### 1. Package Tests (packages/*)
```
packages/[package_name]/
├── src/                 # Source code only, no tests
└── tests/              # All tests for the package
    ├── unit/           # Unit tests
    │   ├── models/     # Tests matching src/models structure
    │   ├── services/   # Tests matching src/services structure
    │   └── utils/      # Tests matching src/utils structure
    ├── integration/    # Integration tests
    ├── __mocks__/      # Mock files
    └── results/        # Test output
        ├── unit/       # Unit test results
        ├── integration/# Integration test results
        └── summary/    # Coverage reports
```

### 2. Project Backend Tests (projects/*/tests)
```
projects/[project_name]/
├── backend/           # Backend source code
└── tests/            # All backend tests
    ├── unit/         # Unit tests
    │   ├── models/   # Tests matching backend/models structure
    │   ├── services/ # Tests matching backend/services structure
    │   └── utils/    # Tests matching backend/utils structure
    ├── integration/  # Integration tests
    ├── __mocks__/    # Mock files
    └── results/      # Test output
        ├── unit/     # Unit test results
        ├── integration/# Integration test results
        └── summary/  # Coverage reports
```

### 3. Project Frontend Tests (projects/*/tests/frontend)
```
projects/[project_name]/
├── frontend/         # Frontend source code
└── tests/
    └── frontend/    # All frontend tests
        ├── unit/
        │   ├── components/  # Component tests
        │   │   ├── auth/    # Auth component tests
        │   │   └── dashboard/ # Dashboard component tests
        │   ├── hooks/     # Hook tests
        │   └── api/       # API tests
        │       ├── services/
        │       └── interceptors/
        ├── integration/  # Integration tests
        ├── __mocks__/   # Mock files
        └── results/     # Test output
            ├── unit/    # Unit test results
            ├── integration/# Integration test results
            └── summary/ # Coverage reports
```

## Migration Steps

1. Remove co-located tests:
   - Move all tests from src/__tests__ to tests/unit/
   - Move all tests from src/*/__tests__ to tests/unit/*/
   - Maintain same directory structure as source

2. Standardize test locations:
   - No tests in src/ directory
   - All tests go in dedicated tests/ directory
   - Maintain parallel structure to source code

3. Test File Naming:
   - Unit tests: [name].test.ts
   - Integration tests: [name].integration.test.ts
   - Mock files: [name].mock.ts

4. Test Output:
   - All test output goes to results/ directory
   - Organized by test type (unit, integration)
   - Summary reports in results/summary/

## Implementation

1. Create standard directory structure
2. Move tests to new locations
3. Update import paths
4. Update test configurations
5. Remove old test locations

## Benefits

1. Consistent organization across projects
2. Clear separation of concerns
3. Easy to find tests
4. Standardized output locations
5. Better maintainability