# Test Standards and Organization v3.0

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

#### Project-Specific Organization
Tests should be organized within project-specific test directories that follow a consistent priority-based structure:

```
/packages
  /core
    /tests
      /frontend
        /p0  # Critical path tests
          /components
          /services
        /p1  # Important features
        /p2  # Secondary features
        /p3  # Performance tests
      /backend
        /p0
          /services
          /models
        /p1
        /p2
        /p3
      /api
        /p0
        /p1
  /ui-components
    /tests
      /p0
        /components
      /p1
      /p2
/projects
  /montpc_crm
    /tests
      /frontend
        /p0
          /components
          /services
        /p1
        /p2
      /backend
        /p0
        /p1
        /p2
  /mexpress
    /tests
      /p0
      /p1
      /p2
```

This project-specific approach:
- Organizes tests alongside their respective projects
- Maintains consistent priority-based structure
- Prevents tests from being scattered across source files
- Provides clear organization within each project

#### Results Directory Structure
```
/tests
  /results
    /packages
      /core
        /frontend
          /p0
          /p1
          /p2
          /p3
        /backend
          /p0
          /p1
          /p2
        /api
          /p0
          /p1
      /ui-components
        /p0
        /p1
    /projects
      /montpc_crm
        /frontend
          /p0
          /p1
        /backend
          /p0
          /p1
      /mexpress
        /p0
        /p1
    /summary
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
// /packages/core/tests/jest.config.js
module.exports = {
  displayName: 'core',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/**/*.test.ts'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setup.ts'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../src/$1'
  }
};
```

### 2.2 Project Configs
```javascript
// /projects/montpc_crm/tests/frontend/jest.config.js
module.exports = {
  displayName: 'montpc-crm-frontend',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],
  moduleNameMapper: {
    '^@mexpress/core/(.*)$': '<rootDir>/../../../../packages/core/src/$1',
    '^@mexpress/ui-components/(.*)$': '<rootDir>/../../../../packages/ui-components/src/$1',
    '^@montpc_crm/(.*)$': '<rootDir>/../../src/$1'
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
    "test:core": "jest --config packages/core/tests/jest.config.js --silent > tests/results/packages/core/test.log 2>/dev/null",
    "test:ui": "jest --config packages/ui-components/tests/jest.config.js --silent > tests/results/packages/ui-components/test.log 2>/dev/null",
    "test:utils": "jest --config packages/utils/tests/jest.config.js --silent > tests/results/packages/utils/test.log 2>/dev/null",
    "test:packages": "npm run test:core && npm run test:ui && npm run test:utils > tests/results/packages/packages.log 2>/dev/null"
  }
}
```

### 4.2 Project Tests
```json
{
  "scripts": {
    "test:mexpress:frontend": "jest --config projects/mexpress/tests/frontend/jest.config.js --silent > tests/results/projects/mexpress/frontend/test.log 2>/dev/null",
    "test:montpc:frontend": "jest --config projects/montpc_crm/tests/frontend/jest.config.js --silent > tests/results/projects/montpc_crm/frontend/test.log 2>/dev/null",
    "test:montpc:backend": "jest --config projects/montpc_crm/tests/backend/jest.config.js --silent > tests/results/projects/montpc_crm/backend/test.log 2>/dev/null",
    "test:e2e": "playwright test --reporter null > tests/results/e2e.log 2>/dev/null",
    "test:projects": "npm run test:mexpress:frontend && npm run test:montpc:frontend && npm run test:montpc:backend > tests/results/projects/projects.log 2>/dev/null"
  }
}
```

### 4.3 Full Suite
```json
{
  "scripts": {
    "test": "jest --config tests/jest.config.js --silent > tests/results/test.log 2>/dev/null",
    "test:ci": "jest --config tests/jest.config.js --ci --coverage --silent > tests/results/ci.log 2>/dev/null",
    "test:watch": "jest --config tests/jest.config.js --watch --silent > tests/results/watch.log 2>/dev/null",
    "test:all": "npm run test:packages && npm run test:projects && npm run test:e2e > tests/results/all.log 2>/dev/null"
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
   ├── packages/                  # Package test results
   │   ├── core/                 # Core package results
   │   │   ├── unit/            # Unit test results
   │   │   │   ├── test.log     # Test execution output
   │   │   │   ├── coverage.log # Coverage report
   │   │   │   └── metrics.log  # Performance metrics
   │   │   └── integration/     # Integration test results
   │   ├── ui-components/
   │   └── utils/
   ├── projects/                  # Project test results
   │   ├── mexpress/
   │   │   ├── frontend/
   │   │   └── backend/
   │   └── montpc_crm/
   │       ├── frontend/
   │       └── backend/
   └── summary/                   # Aggregated results
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
   - Generate summaries in tests/results/summary/
   - Use structured formats for reporting
   - Clean up temporary files after processing
   - Keep results aligned with test structure
   - Maintain centralized results organization

5. Performance Considerations:
   - Large terminal outputs WILL cause VSCode to hang
   - Direct console output WILL impact extension performance
   - Always use file output redirection
   - Process results in chunks if needed
   - Clean up logs regularly to manage disk space
   - Follow centralized structure for cleanup

6. Log Management:
   - Follow project-specific but consistently organized test results
   - Keep separate summary files
   - Clean up by test type and priority level
   - Maintain hierarchy:
     * Package level: tests/results/packages/[package]/[frontend|backend]/[priority]/
     * Project level: tests/results/projects/[project]/[frontend|backend]/[priority]/
     * Summary level: tests/results/summary/