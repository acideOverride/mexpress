# Test Standards for Monorepo

## Table of Contents
1. [Test Organization](#1-test-organization)
   - [Directory Structure](#11-directory-structure)
   - [Test Types](#12-test-types)
   - [Shared Utilities](#13-shared-utilities)
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

## 1. Test Organization

### 1.1 Directory Structure
```text
/opt/mexpress/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   └── tests/
│   │       ├── unit/        # Unit tests
│   │       ├── integration/ # Integration tests
│   │       └── __mocks__/   # Shared mocks
│   ├── ui-components/
│   │   ├── src/
│   │   └── tests/
│   │       ├── unit/        # Component tests
│   │       ├── e2e/         # Browser tests
│   │       └── __fixtures__/# Test fixtures
│   └── utils/
│       ├── src/
│       └── tests/
│           ├── unit/        # Utility tests
│           └── __helpers__/ # Test helpers
└── projects/
    └── mexpress/
        ├── frontend/
        │   ├── src/
        │   └── tests/
        │       ├── unit/    # Project unit tests
        │       ├── e2e/     # Project E2E tests
        │       └── __mocks__/
        └── backend/
            ├── src/
            └── tests/
                ├── unit/    # Project unit tests
                ├── api/     # API tests
                └── __mocks__/
```

### 1.2 Test Types
```typescript
// packages/core/tests/unit/auth/auth.service.test.ts
describe('Core - AuthService', () => {
  it('should validate credentials', async () => {
    const authService = new AuthService(mockUserRepo, mockConfig);
    const result = await authService.validateCredentials('test@example.com', 'password');
    expect(result).toBe(true);
  });
});

// packages/ui-components/tests/unit/Button/Button.test.tsx
describe('UI Components - Button', () => {
  it('should render with default props', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button')).toHaveTextContent('Click me');
  });
});

// projects/mexpress/frontend/tests/unit/features/CustomerForm.test.tsx
describe('mExpress - CustomerForm', () => {
  it('should handle submit', async () => {
    const onSubmit = jest.fn();
    const { getByRole } = render(<CustomerForm onSubmit={onSubmit} />);
    await userEvent.click(getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### 1.3 Shared Utilities
```typescript
// packages/utils/tests/__helpers__/test-utils.ts
export const createTestUser = (overrides = {}) => ({
  id: 'test-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  ...overrides
});

export const mockRepository = <T>() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

// packages/ui-components/tests/__helpers__/render-utils.tsx
export const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      {ui}
    </ThemeProvider>
  );
};
```

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

// packages/ui-components/jest.config.js
module.exports = {
  displayName: 'ui-components',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect'
  ],
  moduleNameMapper: {
    '^@mexpress/ui-components/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
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
// packages/core/tests/unit/services/user.service.test.ts
import { UserService } from '@mexpress/core/services/user.service';
import { createTestUser, mockRepository } from '@mexpress/utils/test-helpers';

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

    it('should throw if email exists', async () => {
      const userData = createTestUser();
      userRepository.findOne.mockResolvedValue(userData);

      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Email already exists');
    });
  });
});
```

### 3.2 Integration Tests
```typescript
// packages/core/tests/integration/auth/auth.test.ts
import { createTestingModule } from '@nestjs/testing';
import { AuthModule } from '@mexpress/core/auth/auth.module';
import { createTestUser } from '@mexpress/utils/test-helpers';

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
// projects/mexpress/frontend/tests/e2e/customer-management.test.ts
import { test, expect } from '@playwright/test';

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
    "test:core": "jest --config packages/core/jest.config.js",
    "test:ui": "jest --config packages/ui-components/jest.config.js",
    "test:utils": "jest --config packages/utils/jest.config.js",
    "test:packages": "jest --config jest.packages.config.js"
  }
}
```

### 4.2 Project Tests
```json
{
  "scripts": {
    "test:frontend": "jest --config projects/mexpress/frontend/jest.config.js",
    "test:backend": "jest --config projects/mexpress/backend/jest.config.js",
    "test:e2e": "playwright test",
    "test:projects": "jest --config jest.projects.config.js"
  }
}
```

### 4.3 Full Suite
```json
{
  "scripts": {
    "test": "jest --config jest.config.js",
    "test:ci": "jest --config jest.config.js --ci --coverage",
    "test:watch": "jest --config jest.config.js --watch",
    "test:all": "npm run test:packages && npm run test:projects && npm run test:e2e"
  }
}
```

Remember to:
- Keep tests organized by package/project
- Share test utilities and helpers
- Maintain consistent naming conventions
- Use appropriate test types for each layer
- Configure proper test environments
- Set up CI/CD test pipelines