# Test Standards and Organization v2.0

## Table of Contents
1. [Test Organization](#1-test-organization)
   - [Directory Structure](#11-directory-structure)
   - [Priority Levels](#12-priority-levels)
   - [Resource Management](#13-resource-management)
2. [Test Configuration](#2-test-configuration)
   - [Package Configs](#21-package-configs)
   - [Project Configs](#22-project-configs)
   - [Shared Config](#23-shared-config)
3. [Test Implementation](#3-test-implementation)
   - [Unit Tests](#31-unit-tests)
   - [Integration Tests](#32-integration-tests)
   - [E2E Tests](#33-e2e-tests)
4. [Test Execution](#4-test-execution)
   - [Package Tests](#41-package-tests)
   - [Project Tests](#42-project-tests)
   - [Full Suite](#43-full-suite)
   - [Output Management](#44-output-management)

## 1. Test Organization

### 1.1 Directory Structure

#### Package-Level Organization
```
packages/[package]/
├── tests/
│   ├── p0/                    # Critical path tests
│   │   ├── core/             # Core functionality
│   │   ├── api/              # Critical API tests
│   │   └── data/             # Data integrity tests
│   │
│   ├── p1/                    # High priority tests
│   │   ├── business/         # Business logic
│   │   └── integration/      # Key integration tests
│   │
│   ├── p2/                    # Medium priority tests
│   │   ├── features/         # Feature tests
│   │   └── components/       # Component tests
│   │
│   ├── p3/                    # Low priority tests
│   │   ├── edge/             # Edge cases
│   │   └── performance/      # Performance tests
│   │
│   ├── __helpers__/          # Test helpers and utilities
│   │
│   └── results/              # Test execution results
│       ├── p0/
│       │   ├── test.log
│       │   ├── coverage.log
│       │   └── metrics.log
│       ├── p1/
│       ├── p2/
│       ├── p3/
│       └── summary/          # Aggregated results
```

#### Project-Level Organization
```
projects/[project]/
├── frontend/
│   └── tests/
│       ├── p0/
│       │   ├── core/         # Core UI tests
│       │   ├── routing/      # Critical routing tests
│       │   └── auth/         # Authentication tests
│       │
│       ├── p1/
│       │   ├── features/     # Key feature tests
│       │   └── integration/  # UI integration tests
│       │
│       ├── p2/
│       │   ├── components/   # Component tests
│       │   └── hooks/        # Custom hook tests
│       │
│       ├── p3/
│       │   ├── edge/         # Edge cases
│       │   └── performance/  # Performance tests
│       │
│       └── results/          # Test execution results
           ├── p0/
           ├── p1/
           ├── p2/
           ├── p3/
           └── summary/
```

### 1.2 Priority Levels

#### P0 (Critical) Tests
- Core functionality
- Authentication
- Data integrity
- Critical APIs
- Response time: 100ms
- Max Duration: 5 seconds
- Max Memory: 512MB
- Execution: Sequential

#### P1 (High Priority) Tests
- Business logic
- Key integrations
- Response time: 200ms
- Max Duration: 10 seconds
- Max Memory: 1GB
- Max Concurrent: 2

#### P2 (Medium Priority) Tests
- Features
- Components
- Response time: 300ms
- Max Duration: 20 seconds
- Max Memory: 1.5GB
- Max Concurrent: 3

#### P3 (Low Priority) Tests
- Edge cases
- Performance tests
- Response time: 500ms
- Max Duration: 30 seconds
- Max Memory: 2GB
- Max Concurrent: 4

### 1.3 Resource Management

Process Limits:
- CPU Usage: 70%
- Memory Usage: 80%
- File Descriptors: 1000
- Log Size: 5MB
- Error Log: 1MB

## 2. Test Configuration

### 2.1 Package Configs
```javascript
// packages/core/jest.config.js
module.exports = {
  displayName: 'core',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.ts'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/src/$1'
  }
};
```

### 2.2 Project Configs
```javascript
// projects/mexpress/frontend/jest.config.js
module.exports = {
  displayName: 'mexpress-frontend',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../../packages/core/src/$1',
    '^@mexpress/ui-components/(.*)$': '<rootDir>/../../../packages/ui-components/src/$1'
  }
};
```

### 2.3 Shared Config
```javascript
// jest.preset.js
module.exports = {
  testMatch: ['**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ]
};
```

## 3. Test Implementation

### 3.1 Unit Tests
```typescript
// Example unit test structure
describe('UserService', () => {
  let userService: UserService;
  let userRepository: any;

  beforeEach(() => {
    userRepository = mockRepository();
    userService = new UserService(userRepository);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = createTestUser();
      userRepository.create.mockReturnValue(userData);
      userRepository.save.mockResolvedValue(userData);

      const result = await userService.createUser(userData);
      expect(result).toEqual(userData);
    });
  });
});
```

### 3.2 Integration Tests
```typescript
// Example integration test structure
describe('Auth Integration', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [AuthModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should authenticate user', async () => {
    const user = createTestUser();
    const result = await authService.authenticate(user.email, 'password');
    expect(result).toBeDefined();
    expect(result.accessToken).toBeDefined();
  });
});
```

### 3.3 E2E Tests
```typescript
// Example E2E test structure
test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
  });

  test('should create new customer', async ({ page }) => {
    await page.click('button:text("Add Customer")');
    await page.fill('[name="name"]', 'Test Customer');
    await page.fill('[name="email"]', 'test@example.com');
    await page.click('button:text("Save")');

    await expect(page.locator('text=Customer created successfully')).toBeVisible();
    await expect(page.locator('text=Test Customer')).toBeVisible();
  });
});
```

## 4. Test Execution

### 4.1 Package Tests
```json
{
  "scripts": {
    "test:core": "jest --config packages/core/jest.config.js --silent > packages/core/tests/results/test.log 2>/dev/null",
    "test:ui": "jest --config packages/ui-components/jest.config.js --silent > packages/ui-components/tests/results/test.log 2>/dev/null",
    "test:utils": "jest --config packages/utils/jest.config.js --silent > packages/utils/tests/results/test.log 2>/dev/null",
    "test:packages": "jest --config jest.packages.config.js --silent > packages/core/tests/results/packages.log 2>/dev/null"
  }
}
```

### 4.2 Project Tests
```json
{
  "scripts": {
    "test:frontend": "jest --config projects/mexpress/frontend/jest.config.js --silent > projects/mexpress/frontend/tests/results/test.log 2>/dev/null",
    "test:backend": "jest --config projects/mexpress/backend/jest.config.js --silent > projects/mexpress/backend/tests/results/test.log 2>/dev/null",
    "test:e2e": "playwright test --reporter null > projects/mexpress/frontend/tests/results/e2e.log 2>/dev/null",
    "test:projects": "jest --config jest.projects.config.js --silent > projects/mexpress/frontend/tests/results/projects.log 2>/dev/null"
  }
}
```

### 4.3 Full Suite
```json
{
  "scripts": {
    "test": "jest --config jest.config.js --silent > packages/core/tests/results/test.log 2>/dev/null",
    "test:ci": "jest --config jest.config.js --ci --coverage --silent > packages/core/tests/results/ci.log 2>/dev/null",
    "test:watch": "jest --config jest.config.js --watch --silent > packages/core/tests/results/watch.log 2>/dev/null",
    "test:all": "npm run test:packages && npm run test:projects && npm run test:e2e > packages/core/tests/results/all.log 2>/dev/null"
  }
}
```

### 4.4 Output Management
!! CRITICAL: PREVENT VSCODE/EXTENSION HANGING !!

1. Output Requirements:
   - NEVER output to terminal/console
   - ALL output MUST be redirected to files
   - Use silent execution mode (--silent flag)
   - ALWAYS redirect stderr to /dev/null
   - Follow test directory structure
   - Maintain proper hierarchy

2. Output Directory Structure:
   ```
   tests/results/
   ├── p0/                 # Priority 0 test results
   │   ├── test.log       # Test execution output
   │   ├── coverage.log   # Coverage report
   │   └── metrics.log    # Performance metrics
   ├── p1/
   ├── p2/
   ├── p3/
   └── summary/           # Aggregated results
   ```

3. Output Format:
   - Use JSON for metrics
   - Keep logs minimal
   - Store summaries only
   - Clear after processing
   - Follow package/project structure
   - Maintain test category hierarchy

4. Result Handling:
   - Process test results from log files
   - Generate summaries in results/summary/
   - Use structured formats for reporting
   - Clean up temporary files after processing
   - Keep results aligned with test structure
   - Maintain package/project organization
   - Follow test category hierarchy

5. Performance Considerations:
   - Large terminal outputs WILL cause VSCode to hang
   - Direct console output WILL impact extension performance
   - Always use file output redirection
   - Process results in chunks if needed
   - Clean up logs regularly to manage disk space
   - Follow package/project structure for cleanup
   - Maintain disk space per package/project

6. Log Management:
   - Organize logs by test category
   - Follow package/project structure
   - Keep separate summary files
   - Clean up by test type
   - Maintain hierarchy:
     * Package level: tests/results/[test-type]/
     * Project level: tests/results/[test-type]/
     * Summary level: tests/results/summary/