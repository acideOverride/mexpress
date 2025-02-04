D. QUALITY AND SECURITY

# quality and security

XI. QUALITY GATES
[⬆ Back to Top](#table-of-contents)

# quality gates

A. Code Quality Gates

1.  Static Analysis Configuration:

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    complexity: ['error', { max: 10 }],
    'max-lines-per-function': ['error', { max: 50 }],
    'no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};

// prettier.config.js
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
};
```

2.  Test Coverage Configuration:

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    './src/core/**/*.ts': {
      statements: 90,
      branches: 90,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/test/**',
    '!src/types/**',
  ],
};
```

3.  Code Review Automation:

```javascript
// .github/workflows/code-review.yml
name: Code Review

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Check branch naming
        run: |
          if [[ ! $GITHUB_HEAD_REF =~ ^(feature|bugfix|hotfix)/ ]]; then
            exit 1
          fi

      - name: Check PR description
        uses: actions/github-script@v6
        with:
          script: |
            const { data } = await github.rest.pulls.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number
            });
            if (!data.body.includes('## Changes')) {
              core.setFailed('PR description must include Changes section');
            }
```

B. Performance Gates

1.  Frontend Performance Monitoring:

```typescript
// performanceMonitor.ts
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class PerformanceMonitor {
  private thresholds = {
    fcp: 2000, // 2 seconds
    lcp: 2500, // 2.5 seconds
    fid: 100, // 100ms
    cls: 0.1, // 0.1 score
    ttfb: 600, // 600ms
  };

  measurePerformance(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      fcp: this.getFCP(),
      lcp: this.getLCP(),
      fid: this.getFID(),
      cls: this.getCLS(),
      ttfb: this.getTTFB(),
    };

    this.reportMetrics(metrics);
    return metrics;
  }

  private reportMetrics(metrics: PerformanceMetrics): void {
    Object.entries(metrics).forEach(([metric, value]) => {
      if (value > this.thresholds[metric]) {
        console.warn(`Performance threshold exceeded for ${metric}: ${value}`);
        // Report to monitoring service
      }
    });
  }
}
```

2.  API Performance Monitoring:

```typescript
// apiPerformanceMiddleware.ts
interface APIMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
}

const apiPerformanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const responseTime = seconds * 1000 + nanoseconds / 1000000;

    const metrics: APIMetrics = {
      endpoint: req.path,
      method: req.method,
      responseTime,
      statusCode: res.statusCode,
      timestamp: new Date(),
    };

    if (responseTime > 300) {
      // 300ms threshold
      logger.warn('API response time threshold exceeded', metrics);
    }

    metricsService.record(metrics);
  });

  next();
};
```

C. Bundle Analysis

1.  Bundle Size Monitoring:

```javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      defaultSizes: 'gzip',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json',
    }),
  ],
  performance: {
    maxEntrypointSize: 244 * 1024, // 244kb
    maxAssetSize: 244 * 1024,
    hints: 'error',
  },
};
```

2.  Bundle Size CI Check:

```javascript
// scripts/check-bundle-size.js
const fs = require('fs');
const bytes = require('bytes');

const LIMITS = {
  main: bytes('200kb'),
  vendor: bytes('244kb'),
};

const stats = JSON.parse(fs.readFileSync('./dist/bundle-stats.json', 'utf8'));

const failures = stats.assets
  .filter(asset => {
    const limit = LIMITS[asset.name.split('.')[0]];
    return limit && asset.size > limit;
  })
  .map(asset => ({
    name: asset.name,
    size: bytes(asset.size),
    limit: bytes(LIMITS[asset.name.split('.')[0]]),
  }));

if (failures.length > 0) {
  console.error('Bundle size limits exceeded:', failures);
  process.exit(1);
}
```

D. Memory Usage Monitoring

1.  Backend Memory Monitoring:

```typescript
// memoryMonitor.ts
interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

class MemoryMonitor {
  private readonly MEMORY_THRESHOLD = 512 * 1024 * 1024; // 512MB

  monitorMemoryUsage(interval: number = 60000): void {
    setInterval(() => {
      const metrics = this.getMemoryMetrics();
      this.checkThresholds(metrics);
      this.logMetrics(metrics);
    }, interval);
  }

  private getMemoryMetrics(): MemoryMetrics {
    const { heapUsed, heapTotal, external, rss } = process.memoryUsage();

    return { heapUsed, heapTotal, external, rss };
  }

  private checkThresholds(metrics: MemoryMetrics): void {
    if (metrics.heapUsed > this.MEMORY_THRESHOLD) {
      logger.warn('Memory usage exceeded threshold', {
        used: metrics.heapUsed,
        threshold: this.MEMORY_THRESHOLD,
      });

      // Optional: Trigger cleanup or alert
      this.handleHighMemoryUsage();
    }
  }

  private handleHighMemoryUsage(): void {
    // Implement cleanup strategies
    global.gc?.(); // If running with --expose-gc
    // Alert operations team
  }
}
```

E. Quality Gate Pipeline Integration

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Code Style
        run: |
          npm run lint
          npm run format:check

      - name: Tests & Coverage
        run: |
          npm run test:coverage
          npm run test:e2e

      - name: Bundle Analysis
        run: |
          npm run build
          node scripts/check-bundle-size.js

      - name: Security Scan
        run: |
          npm audit
          npm run security:scan

      - name: Performance Check
        run: |
          npm run lighthouse
          npm run analyze:runtime

    # Gate conditions
    if: ${{ success() }}
    # Only proceed if all quality gates pass
```

These quality gates provide:

- Specific, measurable criteria
- Automated enforcement
- Clear threshold definitions
- Integration with CI/CD
- Monitoring and alerting
- Performance tracking
- Bundle size control
- Memory usage monitoring

XII. TESTING STRATEGY
[⬆ Back to Top](#table-of-contents)

# testing strategy

A. Testing Framework Setup

1.  Jest Configuration:

```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/test/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
    './src/core/': {
      statements: 90,
      branches: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

2.  Test Setup:

```typescript
// test/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { redis } from '@/services/redis';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Setup MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  // Clear Redis cache
  await redis.flushall();
});

afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await redis.quit();
});
```

B. Backend Testing

1.  Unit Tests:

```typescript
// services/__tests__/auth.service.test.ts
describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    authService = new AuthService(mockUserRepository);
  });

  describe('validateCredentials', () => {
    it('should validate correct credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateCredentials(
        'test@example.com',
        'password123'
      );

      expect(result).toBe(true);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should reject invalid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.validateCredentials('test@example.com', 'wrong')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

2.  Integration Tests:

```typescript
// api/__tests__/auth.api.test.ts
describe('Auth API', () => {
  let app: Express;
  let token: string;

  beforeEach(async () => {
    app = await createTestApp();
    // Create test user and get token
    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = response.body.token;
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrong',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
```

3.  Database Tests:

```typescript
// models/__tests__/user.model.test.ts
describe('User Model', () => {
  describe('Validation', () => {
    it('should validate required fields', async () => {
      const userWithoutRequired = new User({});

      await expect(userWithoutRequired.validate()).rejects.toThrow(
        mongoose.Error.ValidationError
      );
    });

    it('should validate email format', async () => {
      const userWithInvalidEmail = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      });

      await expect(userWithInvalidEmail.validate()).rejects.toThrow(
        'Invalid email format'
      );
    });
  });

  describe('Indexes', () => {
    it('should enforce unique email', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      await expect(
        User.create({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password456',
        })
      ).rejects.toThrow('E11000 duplicate key error');
    });
  });
});
```

C. Frontend Testing

1.  Component Tests:

```typescript
// components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    render(<LoginForm onSubmit={mockLogin} />);
  });

  it('renders all form elements', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows validation errors', async () => {
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
```

2.  Hook Tests:

```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

D. Test Utilities

1.  Test Factory:

```typescript
// test/factories/user.factory.ts
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';
import { User } from '@/models/user.model';

export const userFactory = Factory.define<User>(() => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  roles: ['user'],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// Usage in tests
const user = userFactory.build();
const adminUser = userFactory.build({ roles: ['admin'] });
```

2.  Test Helpers:

```typescript
// test/helpers/api.helper.ts
export const createAuthenticatedRequest = async (app: Express, user?: User) => {
  const testUser = user || (await userFactory.create());
  const response = await request(app).post('/api/auth/login').send({
    email: testUser.email,
    password: 'password123',
  });

  return {
    token: response.body.token,
    user: testUser,
  };
};
```

E. Test Coverage Tools

1.  Coverage Configuration:

```javascript
// package.json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "coverageReporters": [
      "text",
      "lcov",
      "json-summary"
    ]
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --reporters='default' --reporters='jest-junit'"
  }
}
```

2.  Coverage Report Generation:

```yaml
# .github/workflows/coverage.yml
name: Test Coverage

on: [push, pull_request]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests with coverage
        run: npm run test:coverage
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

These testing implementations provide:

- Complete test setup and configuration
- Unit test examples
- Integration test patterns
- Component testing practices
- Hook testing strategies
- Test utilities and factories
- Coverage reporting and monitoring

XIII. SECURITY IMPLEMENTATION STANDARDS
[⬆ Back to Top](#table-of-contents)

# security implementation standards

A. Authentication System

1.  JWT Implementation:

```javascript
// Token Structure
const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      version: user.tokenVersion, // For forced logout
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
      algorithm: 'HS256',
      audience: 'mexpress-api',
      issuer: 'mexpress',
    }
  );
};

// Token Verification
const verifyToken = async token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Verify token version for forced logout
    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AuthError('Token invalidated');
    }

    return decoded;
  } catch (error) {
    throw new AuthError('Invalid token');
  }
};
```

2.  Refresh Token System:

```javascript
// Refresh Token Generation
const generateRefreshToken = user => {
  return jwt.sign(
    {
      id: user.id,
      version: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// Token Rotation
const rotateTokens = async refreshToken => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);

  // Increment token version for security
  user.tokenVersion += 1;
  await user.save();

  return {
    accessToken: generateToken(user),
    refreshToken: generateRefreshToken(user),
  };
};
```

3.  Password Handling:

```javascript
// Password Hashing
const hashPassword = async password => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Password Validation
const validatePassword = password => {
  const requirements = {
    minLength: 8,
    maxLength: 128,
    requiredPatterns: [
      /[A-Z]/, // uppercase
      /[a-z]/, // lowercase
      /[0-9]/, // numbers
      /[!@#$%^&*]/, // special chars
    ],
  };

  return requirements.requiredPatterns.every(pattern => pattern.test(password));
};
```

B. Authorization Framework

1.  Role-Based Access Control (RBAC):

```javascript
// Role Definitions
const roles = {
  ADMIN: {
    name: 'admin',
    permissions: ['*'],
  },
  MANAGER: {
    name: 'manager',
    permissions: [
      'create:customer',
      'read:customer',
      'update:customer',
      'read:reports',
    ],
  },
  USER: {
    name: 'user',
    permissions: ['read:customer', 'update:own-profile'],
  },
};

// Permission Middleware
const requirePermission = permission => {
  return async (req, res, next) => {
    const userRole = roles[req.user.role];

    if (!userRole) {
      throw new AuthError('Invalid role');
    }

    if (!hasPermission(userRole, permission)) {
      throw new AuthError('Insufficient permissions');
    }

    next();
  };
};
```

2.  Resource Authorization:

```javascript
// Resource Ownership
const verifyOwnership = resourceType => {
  return async (req, res, next) => {
    const resource = await getResource(resourceType, req.params.id);

    if (resource.userId !== req.user.id) {
      throw new AuthError('Not authorized');
    }

    next();
  };
};
```

C. Data Protection

1.  Encryption Services:

```javascript
// Field Encryption
const encryptionService = {
  algorithm: 'aes-256-gcm',

  encrypt: async text => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      iv: iv.toString('hex'),
      content: encrypted,
      tag: cipher.getAuthTag().toString('hex'),
    };
  },

  decrypt: async encrypted => {
    // Decryption implementation
  },
};
```

2.  Data Masking:

```javascript
const maskingRules = {
  email: email => {
    const [name, domain] = email.split('@');
    return `${name[0]}***@${domain}`;
  },
  phone: phone => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  },
  creditCard: card => {
    return `****-****-****-${card.slice(-4)}`;
  },
};
```

D. Security Headers

1.  Header Configuration:

```javascript
// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
  })
);
```

E. Request Validation

1.  Input Sanitization:

```javascript
const sanitizeInput = input => {
  return {
    // Remove dangerous HTML
    html: sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    }),

    // SQL injection prevention
    sql: mysql.escape(input),

    // NoSQL injection prevention
    mongoSafe: input.replace(/[\${}()]/g, ''),
  };
};
```

2.  Request Validation:

```javascript
const validateRequest = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    next();
  };
};
```

F. Rate Limiting and Brute Force Protection

1.  Rate Limiting:

```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  headers: true,
});
```

2.  Login Attempt Tracking:

```javascript
const loginAttemptTracker = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes

  async trackAttempt(userId) {
    const attempts = await LoginAttempt.create({
      userId,
      timestamp: new Date(),
    });

    const recentAttempts = await this.getRecentAttempts(userId);

    if (recentAttempts.length >= this.maxAttempts) {
      await User.updateOne({ _id: userId }, { status: 'locked' });

      throw new AuthError('Account locked');
    }
  },
};
```

G. Secure Session Management

1.  Session Configuration:

```javascript
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  resave: false,
  saveUninitialized: false,
};
```

H. Security Monitoring and Logging

1.  Security Event Logging:

```javascript
const securityLogger = {
  logSecurityEvent: async event => {
    await SecurityLog.create({
      type: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details,
      severity: event.severity,
      timestamp: new Date(),
    });

    if (event.severity === 'high') {
      await this.sendAlert(event);
    }
  },
};
```

I. Security Testing Requirements

1.  Security Test Cases:

```javascript
describe('Security Features', () => {
  test('should prevent XSS attacks', () => {
    // XSS prevention tests
  });

  test('should prevent SQL injection', () => {
    // SQL injection tests
  });

  test('should enforce password requirements', () => {
    // Password validation tests
  });
});
```

J. Incident Response Procedures

1.  Security Incident Handler:

```javascript
const handleSecurityIncident = async incident => {
  // Log incident
  await securityLogger.logSecurityEvent(incident);

  // Take immediate action
  switch (incident.type) {
    case 'brute_force':
      await lockAccount(incident.userId);
      break;
    case 'suspicious_activity':
      await forceLogout(incident.userId);
      break;
  }

  // Notify security team
  await notifySecurityTeam(incident);
};
```

Remember to:

- Keep security configurations in environment variables
- Regularly update dependencies
- Monitor security advisories
- Conduct regular security audits
- Maintain incident response plans

XIV. ERROR HANDLING
[⬆ Back to Top](#table-of-contents)

# error handling

A. Error Classification

1.  Base Error Types:

```typescript
// errors/base.error.ts
abstract class BaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends BaseError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.fields = fields;
  }
}

class BusinessError extends BaseError {
  constructor(message: string, code = 'BUSINESS_RULE_VIOLATION') {
    super(message, code, 422);
  }
}

class SystemError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, 'SYSTEM_ERROR', 500, false);
    this.stack = originalError?.stack;
  }
}

class NetworkError extends BaseError {
  constructor(
    message: string,
    public service: string,
    public endpoint: string
  ) {
    super(message, 'NETWORK_ERROR', 503);
    this.service = service;
    this.endpoint = endpoint;
  }
}
```

B. Error Handling Middleware

1.  Global Error Handler:

```typescript
// middleware/error-handler.ts
const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details
  logger.error('Error occurred:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    requestId: req.id,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  });

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.isOperational ? error.message : 'Internal server error',
      ...(error instanceof ValidationError && { fields: error.fields }),
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
};
```

2.  Async Handler Wrapper:

```typescript
// middleware/async-handler.ts
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage example
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);
  })
);
```

C. Error Logging Service

1.  Logger Implementation:

```typescript
// services/logger.service.ts
interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

class LoggerService {
  private readonly levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  constructor(
    private readonly minLevel: keyof typeof this.levels = 'info',
    private readonly transports: LogTransport[] = []
  ) {}

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  private async log(
    level: keyof typeof this.levels,
    message: string,
    context?: Record<string, any>
  ) {
    if (this.levels[level] > this.levels[this.minLevel]) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };

    for (const transport of this.transports) {
      await transport.write(entry);
    }
  }
}
```

D. Error Recovery Strategies

1.  Retry Mechanism:

```typescript
// utils/retry.ts
interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff: 'fixed' | 'exponential';
  maxDelay?: number;
  shouldRetry?: (error: Error) => boolean;
}

class RetryService {
  async retry<T>(
    operation: () => Promise<T>,
    options: RetryOptions
  ): Promise<T> {
    let lastError: Error;
    let delay = options.delay;

    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (
          (options.shouldRetry && !options.shouldRetry(error)) ||
          attempt === options.maxAttempts
        ) {
          throw error;
        }

        await this.sleep(delay);

        if (options.backoff === 'exponential') {
          delay = Math.min(
            delay * 2,
            options.maxDelay || Number.POSITIVE_INFINITY
          );
        }
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

E. Circuit Breaker Pattern

```typescript
// utils/circuit-breaker.ts
interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  monitorInterval?: number;
}

class CircuitBreaker {
  private failures = 0;
  private lastFailure?: Date;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly options: CircuitBreakerOptions,
    private readonly monitor?: (state: string) => void
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.shouldReset()) {
      this.reset();
    }

    if (this.state === 'open') {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
    this.monitor?.(this.state);
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = new Date();

    if (this.failures >= this.options.failureThreshold) {
      this.state = 'open';
      this.monitor?.(this.state);
    }
  }

  private shouldReset(): boolean {
    if (this.state !== 'open') return false;
    if (!this.lastFailure) return false;

    const now = new Date().getTime();
    const failureTime = this.lastFailure.getTime();
    return now - failureTime >= this.options.resetTimeout;
  }

  private reset(): void {
    this.state = 'half-open';
    this.monitor?.(this.state);
  }
}
```

F. Monitoring and Alerting

```typescript
// monitoring/error-monitor.ts
interface ErrorMetrics {
  count: number;
  lastOccurrence: Date;
  errorTypes: Map<string, number>;
}

class ErrorMonitor {
  private metrics: Map<string, ErrorMetrics> = new Map();
  private readonly alertThresholds = {
    errorRate: 10, // errors per minute
    severity: {
      high: 1, // immediate alert
      medium: 5, // alert after 5 occurrences
      low: 20, // alert after 20 occurrences
    },
  };

  recordError(error: Error): void {
    const errorType = error.constructor.name;
    const current = this.metrics.get(errorType) || {
      count: 0,
      lastOccurrence: new Date(),
      errorTypes: new Map(),
    };

    current.count++;
    current.lastOccurrence = new Date();
    current.errorTypes.set(
      error.message,
      (current.errorTypes.get(error.message) || 0) + 1
    );

    this.metrics.set(errorType, current);
    this.checkThresholds(errorType, current);
  }

  private async checkThresholds(
    type: string,
    metrics: ErrorMetrics
  ): Promise<void> {
    const errorRate = this.calculateErrorRate(metrics);

    if (errorRate >= this.alertThresholds.errorRate) {
      await this.sendAlert({
        type: 'HIGH_ERROR_RATE',
        message: `Error rate threshold exceeded for ${type}`,
        metrics,
      });
    }
  }

  private calculateErrorRate(metrics: ErrorMetrics): number {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    return Array.from(metrics.errorTypes.values()).filter(
      timestamp => timestamp > oneMinuteAgo
    ).length;
  }

  private async sendAlert(alert: Alert): Promise<void> {
    // Send to monitoring service
    await monitoringService.sendAlert(alert);

    // Log alert
    logger.error('Error threshold exceeded', {
      alert,
      metrics: this.metrics.get(alert.type),
    });
  }
}
```

These error handling implementations provide:

- Structured error hierarchy
- Global error handling
- Async error catching
- Logging service
- Retry mechanisms
- Circuit breaker pattern
- Error monitoring and alerting
- Recovery strategies

XV. PERFORMANCE:
[⬆ Back to Top](#table-of-contents)

# performance

Let's expand the Performance section to be more comprehensive and include specific implementations:

XV. PERFORMANCE STANDARDS
[⬆ Back to Top](#table-of-contents)

# performance

A. Frontend Performance

1.  Load Time Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns'],
        },
      },
    },
    // Asset optimization
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
    minify: 'terser',
  },
});
```

2.  Image Optimization

```typescript
// components/Image.tsx
interface OptimizedImageProps {
  src: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width,
  height,
  loading = 'lazy'
}) => (
  <img
    src={src}
    width={width}
    height={height}
    loading={loading}
    decoding="async"
    srcSet={`
      ${src}?w=300 300w,
      ${src}?w=600 600w,
      ${src}?w=900 900w
    `}
    sizes="(max-width: 600px) 300px,
           (max-width: 900px) 600px,
           900px"
  />
);
```

3.  Performance Monitoring

```typescript
// utils/performance.ts
export const measurePerformance = () => {
  const metrics = {
    FCP: performance.getEntriesByName('first-contentful-paint')[0],
    LCP: performance.getEntriesByName('largest-contentful-paint')[0],
    FID: performance.getEntriesByName('first-input-delay')[0],
    CLS: performance.getEntriesByName('cumulative-layout-shift')[0],
  };

  // Send metrics to monitoring service
  reportPerformanceMetrics(metrics);
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  firstLoad: 3000, // 3s
  subsequentLoad: 1000, // 1s
  apiResponse: 300, // 300ms
  ttfb: 100, // 100ms
  fcp: 1800, // 1.8s
  lcp: 2500, // 2.5s
};
```

B. Backend Performance

1.  Database Optimization

```typescript
// services/database.ts
class QueryOptimizer {
  private readonly indexedFields: string[] = ['email', 'userId', 'createdAt'];

  async optimizeQuery(query: any) {
    // Analyze query plan
    const queryPlan = await this.getQueryPlan(query);

    // Suggest indexes
    const suggestedIndexes = this.analyzePlan(queryPlan);

    // Log slow queries
    if (queryPlan.executionTime > 100) {
      this.logSlowQuery(query, queryPlan);
    }

    return suggestedIndexes;
  }

  private async getQueryPlan(query: any) {
    return await db.collection('users').explain('executionStats').find(query);
  }
}
```

2.  Caching Implementation

```typescript
// services/cache.ts
class CacheService {
  private redis: Redis;

  private readonly DEFAULT_TTL = 3600; // 1 hour

  private readonly CACHE_RULES = {
    user: { ttl: 3600 },
    product: { ttl: 1800 },
    category: { ttl: 7200 },
  };

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, expiry?: number): Promise<void> {
    const ttl = expiry || this.getCacheTTL(key);
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  private getCacheTTL(key: string): number {
    const [type] = key.split(':');
    return this.CACHE_RULES[type]?.ttl || this.DEFAULT_TTL;
  }
}
```

3.  Rate Limiting

```typescript
// middleware/rateLimiter.ts
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message: string; // Error message
}

const createRateLimiter = (config: RateLimitConfig) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get client IP
    const clientIp = req.ip;

    // Get requests in current window
    const clientRequests = (requests.get(clientIp) || []).filter(
      timestamp => timestamp > windowStart
    );

    if (clientRequests.length >= config.maxRequests) {
      return res.status(429).json({
        error: config.message,
        retryAfter: Math.ceil((windowStart + config.windowMs - now) / 1000),
      });
    }

    // Add current request
    clientRequests.push(now);
    requests.set(clientIp, clientRequests);

    next();
  };
};
```

C. Performance Testing

1.  Load Testing Setup

```typescript
// tests/performance/load.test.ts
import autocannon from 'autocannon';

interface LoadTestConfig {
  url: string;
  connections: number;
  pipelining: number;
  duration: number;
}

const runLoadTest = async (config: LoadTestConfig) => {
  const results = await autocannon({
    ...config,
    requests: [
      {
        method: 'GET',
        path: '/api/users',
      },
      {
        method: 'POST',
        path: '/api/users',
        body: JSON.stringify({
          /* test data */
        }),
      },
    ],
  });

  return {
    rps: results.requests.average,
    latency: results.latency.p99,
    errors: results.errors,
    timeouts: results.timeouts,
  };
};
```

2.  Performance Benchmarks

```typescript
// tests/performance/benchmarks.ts
const BENCHMARKS = {
  api: {
    p50: 100, // 50th percentile response time
    p95: 200, // 95th percentile response time
    p99: 300, // 99th percentile response time
  },
  database: {
    queryTime: 50, // Maximum query time in ms
    connectionPool: 20, // Optimal connection pool size
  },
  cache: {
    hitRate: 0.85, // Minimum cache hit rate
    latency: 5, // Maximum cache latency in ms
  },
};
```

D. Monitoring and Alerting

1.  Performance Metrics Collection

```typescript
// monitoring/metrics.ts
class PerformanceMonitor {
  private metrics: MetricsService;

  async collectMetrics() {
    return {
      system: await this.collectSystemMetrics(),
      application: await this.collectAppMetrics(),
      database: await this.collectDBMetrics(),
    };
  }

  private async collectSystemMetrics() {
    return {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };
  }

  async checkThresholds(metrics: Metrics) {
    const alerts = [];

    if (metrics.responseTime > PERFORMANCE_THRESHOLDS.apiResponse) {
      alerts.push({
        level: 'warning',
        message: 'API response time exceeded threshold',
      });
    }

    return alerts;
  }
}
```

This expanded section provides:

- Detailed implementation examples
- Specific performance metrics
- Optimization techniques
- Testing methodologies
- Monitoring solutions
- Clear thresholds and benchmarks
