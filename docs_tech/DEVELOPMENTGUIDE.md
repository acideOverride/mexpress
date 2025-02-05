# mExpress Development Guide

# mExpress Project Documentation Structure

[A. PROJECT FOUNDATION](#foundation)

[I. FILESYSTEM STRUCTURE](#filesystem-structure)
[II. PROJECT OVERVIEW AND SETUP](#project-overview)
[III. ENVIRONMENTS](#environments)

[B. ARCHITECTURE](#architecture)

[IV. BACKEND STRUCTURE](#backend)
[V. FRONTEND STRUCTURE](#frontend)
[VI. DATABASE AND MODEL STANDARDS](#database-and-model-standards)

[C. DEVELOPMENT STANDARDS](#development-standards)

[VII. DEVELOPMENT PRINCIPLES](#development-principles)
[VIII. BACKEND DEVELOPMENT STANDARDS](#backend-development-standards)
[IX. FRONTEND DEVELOPMENT STANDARDS](#frontend-development-standards)
[X. API STANDARDS AND DOCUMENTATION](#api-standards-and-documentation)

[D. QUALITY AND SECURITY](#quality-and-security)

[XI. QUALITY GATES](#quality-gates)
[XII. TESTING STRATEGY](#testing-strategy)
[XIII. SECURITY IMPLEMENTATION STANDARDS](#security-implementation-standards)
[XIV. ERROR HANDLING](#error-handling)
[XV. PERFORMANCE STANDARDS](#performance)

[E. PROCESS AND WORKFLOW](#process-and-workflow)

[XVI. VERSION CONTROL GUIDELINES](#version-control-guidelines)
[XVII. CONTINUOUS INTEGRATION](#continuous-integration)
[XVIII. DOCUMENTATION STANDARDS](#documentation)
[XIX. INTERACTION PROTOCOLS](#interaction-protocols)

## Table of Contents

[A. PROJECT FOUNDATION](#foundation)

- [I. Filesystem Structure](#filesystem-structure)
  - [Application Layout](#application-layout)
  - [Access Control](#access-control)
  - [System Links](#system-links)
  - [Backup Structure](#backup-structure)
  - [Setup Commands](#setup-commands)
- [II. Project Overview and Setup](#project-overview)
- [III. Environments](#environments)
  - [Development Environment](#development-environment)
  - [Staging Environment](#staging-environment)
  - [Production Environment](#production-environment)

[B. ARCHITECTURE](#architecture)

- [IV. Backend Structure](#backend)
  - [Application Root](#application-root)
  - [File Naming Conventions](#file-naming-conventions)
  - [Code Organization Standards](#code-organization-standards)
  - [Environment Configuration](#environment-configuration)
- [V. Frontend Structure](#frontend)
  - [Project Organization](#project-organization)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
  - [Styling Standards](#styling-standards)
- [VI. Database and Model Standards](#database-and-model-standards)
  - [Schema Design Principles](#schema-design-principles)
  - [Model Organization](#model-organization)
  - [Indexing Strategy](#indexing-strategy)
  - [Query Optimization](#query-optimization)

[C. DEVELOPMENT STANDARDS](#development-standards)

- [VII. Development Principles](#development-principles)
  - [DRY Principles](#dry-dont-repeat-yourself)
  - [SOLID Principles](#solid-principles)
  - [Clean Code Practices](#clean-code-practices)
  - [State Management](#state-management)
- [VIII. Backend Development Standards](#backend-development-standards)
  - [Controller Architecture](#controller-architecture)
  - [Service Layer Patterns](#service-layer-patterns)
  - [Repository Pattern](#repository-pattern)
  - [Middleware Standards](#middleware-standards)
- [IX. Frontend Development Standards](#frontend-development-standards)
  - [Component Architecture](#component-architecture)
  - [State Management](#state-management)
  - [Form Handling](#form-handling)
  - [API Integration](#api-integration)
- [X. API Standards and Documentation](#api-standards-and-documentation)
  - [API Structure](#api-structure)
  - [Request Standards](#request-standards)
  - [Response Standards](#response-standards)
  - [Validation Standards](#validation-standards)

[D. QUALITY AND SECURITY](#quality-and-security)

- [XI. Quality Gates](#quality-gates)
  - [Code Quality](#code-quality)
  - [Performance Gates](#performance-gates)
  - [Security Gates](#security-gates)
- [XII. Testing Strategy](#testing-strategy)
  - [Testing Framework](#testing-framework)
  - [Unit Testing](#unit-testing)
  - [Integration Testing](#integration-testing)
  - [E2E Testing](#e2e-testing)
- [XIII. Security Implementation Standards](#security-implementation-standards)
  - [Authentication System](#authentication-system)
  - [Authorization Framework](#authorization-framework)
  - [Data Protection](#data-protection)
  - [Security Headers](#security-headers)
- [XIV. Error Handling](#error-handling)
  - [Error Classification](#error-classification)
  - [Error Middleware](#error-middleware)
  - [Logging Strategy](#logging-strategy)
- [XV. Performance Standards](#performance)
  - [Frontend Performance](#frontend-performance)
  - [Backend Performance](#backend-performance)
  - [Database Performance](#database-performance)

[E. PROCESS AND WORKFLOW](#process-and-workflow)

- [XVI. Version Control Guidelines](#version-control-guidelines)
  - [Branch Strategy](#branch-strategy)
  - [Commit Standards](#commit-standards)
  - [Pull Request Process](#pull-request-process)
- [XVII. Continuous Integration](#continuous-integration)
  - [Pipeline Configuration](#pipeline-configuration)
  - [Quality Gates](#quality-gates)
  - [Deployment Process](#deployment-process)
- [XVIII. Documentation Standards](#documentation)
  - [Technical Documentation](#technical-documentation)
  - [API Documentation](#api-documentation)
  - [Code Documentation](#code-documentation)
- [XIX. Interaction Protocols](#interaction-protocols)
  - [Command Responses](#command-responses)
  - [Step-by-Step Execution](#step-by-step-execution)
  - [Error Resolution](#error-resolution)

---

A. PROJECT FOUNDATION

# foundation

I. FILESYSTEM STRUCTURE (Linux FHS standard)
[⬆ Back to Top](#table-of-contents)

# filesystem structure

1. Application Layout
   a. Root Directory (/opt/mexpress/)

   - backend/ # Backend application code
   - frontend/ # Frontend application code
   - scripts/ # Deployment and maintenance scripts

   b. Variable Data (/var/lib/mexpress/)

   - uploads/ # User uploaded files
   - temp/ # Temporary processing files
   - cache/ # Application cache

   c. Logs (/var/log/mexpress/)

   - access.log # HTTP access logs
   - error.log # Application error logs
   - audit.log # Security audit logs
   - debug.log # Debug information

   d. Configuration (/etc/mexpress/)

   - ssl/ # SSL certificates
   - nginx/ # Nginx configuration
   - env/ # Environment configurations

# project overview

2. Access Control
   a. Directory Ownership

   - /opt/mexpress: $USER:$USER
   - /var/lib/mexpress: www-data:www-data
   - /var/log/mexpress: www-data:www-data

   b. Permission Sets

   - Application directories: 755
   - Log directories: 744
   - Upload directories: 755
   - Config files: 644

3. System Links
   a. Symbolic Links

   - logs -> /var/log/mexpress
   - uploads -> /var/lib/mexpress/uploads

4. Backup Structure
   a. Backup Directory (/var/backups/mexpress/)

   - daily/ # Daily backups
   - weekly/ # Weekly backups
   - monthly/ # Monthly backups

5. Setup Commands

   # Create directory structure

   sudo mkdir -p /opt/mexpress/{backend,frontend,scripts}
   sudo mkdir -p /var/lib/mexpress/{uploads,temp,cache}
   sudo mkdir -p /var/log/mexpress
   sudo mkdir -p /etc/mexpress/{ssl,nginx,env}
   sudo mkdir -p /var/backups/mexpress/{daily,weekly,monthly}

   # Set permissions

   sudo chown -R $USER:$USER /opt/mexpress
   sudo chown -R www-data:www-data /var/lib/mexpress
   sudo chown -R www-data:www-data /var/log/mexpress

   # Create symbolic links

   ln -s /var/log/mexpress /opt/mexpress/logs
   ln -s /var/lib/mexpress/uploads /opt/mexpress/uploads

III. ENVIRONMENTS
[⬆ Back to Top](#table-of-contents)

# environments

A. Environment Configuration

1.  Base Configuration:

```typescript
// config/environment.ts
interface EnvironmentConfig {
  app: {
    name: string;
    version: string;
    port: number;
    apiUrl: string;
    corsOrigins: string[];
  };
  database: {
    uri: string;
    poolSize: number;
    retryWrites: boolean;
  };
  cache: {
    host: string;
    port: number;
    ttl: number;
  };
  security: {
    jwtSecret: string;
    jwtExpiry: string;
    bcryptRounds: number;
  };
}

// Base configuration implementation
const getEnvironmentConfig = (env: string): EnvironmentConfig => {
  const baseConfig: EnvironmentConfig = {
    app: {
      name: 'mExpress',
      version: process.env.npm_package_version || '1.0.0',
      port: parseInt(process.env.PORT || '3000', 10),
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    },
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mexpress',
      poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
      retryWrites: true,
    },
    cache: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
    },
    security: {
      jwtSecret: process.env.JWT_SECRET || 'development-secret',
      jwtExpiry: process.env.JWT_EXPIRY || '1h',
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    },
  };

  return baseConfig;
};
```

B. Development Environment

1.  Development Configuration:

```typescript
// config/environments/development.ts
const developmentConfig: Partial<EnvironmentConfig> = {
  app: {
    corsOrigins: ['*'],
  },
  database: {
    uri: 'mongodb://localhost:27017/mexpress_dev',
  },
  cache: {
    ttl: 60, // Short cache for development
  },
  security: {
    jwtExpiry: '24h', // Longer token life for development
  },
};

// Development specific features
const developmentFeatures = {
  enableDebugLogs: true,
  enableSwagger: true,
  mockThirdPartyServices: true,
  disableRateLimiting: true,
  hotReload: true,
};
```

2.  Development Tools:

```typescript
// utils/development.ts
class DevelopmentTools {
  // API request logger
  static requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  };

  // Error stack trace enhancement
  static enhanceError = (err: Error) => {
    Error.stackTraceLimit = Infinity;
    return err;
  };

  // Development-only routes
  static registerDevRoutes = (app: Express) => {
    if (process.env.NODE_ENV === 'development') {
      app.get('/dev/routes', (req, res) => {
        const routes = app._router.stack
          .filter(r => r.route)
          .map(r => ({
            path: r.route.path,
            methods: Object.keys(r.route.methods),
          }));
        res.json(routes);
      });
    }
  };
}
```

C. Staging Environment

1.  Staging Configuration:

```typescript
// config/environments/staging.ts
const stagingConfig: Partial<EnvironmentConfig> = {
  app: {
    corsOrigins: ['https://staging.mexpress.com'],
  },
  database: {
    uri: process.env.STAGING_DB_URI,
    poolSize: 20,
  },
  cache: {
    ttl: 300, // 5 minutes cache
  },
  security: {
    jwtExpiry: '2h',
  },
};

// Staging monitoring setup
const stagingMonitoring = {
  metrics: {
    enabled: true,
    interval: 60000, // 1 minute
    retention: '7d',
  },
  logging: {
    level: 'debug',
    format: 'json',
    filename: '/var/log/mexpress/staging.log',
  },
  alerts: {
    enabled: true,
    endpoints: [
      'https://alerts.mexpress.com/staging',
      'mailto:devs@mexpress.com',
    ],
  },
};
```

2.  Staging Validation:

```typescript
// utils/staging-validator.ts
class StagingValidator {
  static async validateEnvironment(): Promise<boolean> {
    const checks = [
      this.checkDatabaseConnection(),
      this.checkRedisConnection(),
      this.checkExternalServices(),
      this.checkFilePermissions(),
      this.checkCertificates(),
    ];

    try {
      const results = await Promise.all(checks);
      return results.every(result => result === true);
    } catch (error) {
      logger.error('Staging validation failed:', error);
      return false;
    }
  }

  static async checkExternalServices(): Promise<boolean> {
    const services = [
      'https://api.hiboutik.com/health',
      'https://api.brevo.com/health',
      'https://api.qonto.com/health',
    ];

    const results = await Promise.all(
      services.map(service =>
        axios
          .get(service)
          .then(() => true)
          .catch(() => false)
      )
    );

    return results.every(result => result === true);
  }
}
```

D. Production Environment

1.  Production Configuration:

```typescript
// config/environments/production.ts
const productionConfig: Partial<EnvironmentConfig> = {
  app: {
    corsOrigins: ['https://mexpress.com'],
  },
  database: {
    uri: process.env.PROD_DB_URI,
    poolSize: 50,
    retryWrites: true,
  },
  cache: {
    ttl: 3600, // 1 hour cache
    host: process.env.PROD_REDIS_HOST,
    port: parseInt(process.env.PROD_REDIS_PORT || '6379', 10),
  },
  security: {
    jwtExpiry: '1h',
    bcryptRounds: 12,
  },
};

// Production security enhancements
const productionSecurity = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};
```

2.  Production Monitoring:

```typescript
// monitoring/production.ts
class ProductionMonitoring {
  private metrics: MetricsService;
  private alerts: AlertService;

  constructor() {
    this.metrics = new MetricsService({
      interval: 30000, // 30 seconds
      retention: '30d',
      alertThresholds: {
        cpu: 80, // 80% CPU usage
        memory: 85, // 85% memory usage
        disk: 90, // 90% disk usage
        errors: 50, // 50 errors per minute
      },
    });

    this.alerts = new AlertService({
      channels: ['slack', 'email', 'pager'],
      escalationPolicy: {
        level1: 'devops-team',
        level2: 'engineering-lead',
        level3: 'cto',
      },
    });
  }

  async monitorHealthMetrics(): Promise<void> {
    const metrics = await this.collectMetrics();
    await this.evaluateMetrics(metrics);
    await this.storeMetrics(metrics);
  }

  private async evaluateMetrics(metrics: SystemMetrics): Promise<void> {
    if (metrics.errorRate > 50 || metrics.responseTime > 500) {
      await this.alerts.trigger('HIGH_ERROR_RATE', metrics);
    }
  }
}
```

E. Environment Switch Utility

```typescript
// utils/environment-switcher.ts
class EnvironmentSwitcher {
  static async switchTo(
    env: 'development' | 'staging' | 'production'
  ): Promise<void> {
    // 1. Load environment-specific configuration
    const config = await this.loadConfig(env);

    // 2. Configure services
    await this.configureServices(config);

    // 3. Run environment-specific validations
    await this.validateEnvironment(env);

    // 4. Update monitoring
    await this.updateMonitoring(env);

    logger.info(`Successfully switched to ${env} environment`);
  }

  private static async validateEnvironment(env: string): Promise<void> {
    const validator =
      env === 'staging' ? new StagingValidator() : new ProductionValidator();

    const isValid = await validator.validateEnvironment();
    if (!isValid) {
      throw new Error(`Environment validation failed for ${env}`);
    }
  }
}
```

These environment configurations provide:

- Clear separation between environments
- Environment-specific security measures
- Appropriate monitoring and logging
- Validation and health checks
- Production-ready configurations
- Development tools and conveniences
- Staging environment for testing

B. ARCHITECTURE

# architecture

IV. BACKEND STRUCTURE
[⬆ Back to Top](#table-of-contents)

# backend

1. Application Root (/opt/mexpress/backend/)
   A. Source Code Directory (src/)

   1. API Layer (api/)
      a. Controllers (controllers/)

      - Base controller class
      - Feature-specific controllers
      - Error handling methods
        Structure:

      ```typescript
      export class BaseController {
        protected sendResponse(res, data, status = 200) {...}
        protected handleError(error, req, res, next) {...}
      }
      ```

      b. Middlewares (middlewares/)

      - Authentication
      - Validation
      - Error handling
      - Logging
      - Rate limiting
        Structure:

      ```typescript
      export const authMiddleware = async (req, res, next) => {...}
      ```

      c. Routes (routes/)

      - Route definitions
      - Endpoint grouping
      - Version management
        Structure:

      ```typescript
      const router = express.Router();
      router.use('/v1', v1Routes);
      ```

      d. Validators (validators/)

      - Input validation schemas
      - Custom validators
      - Validation middleware
        Structure:

      ```typescript
      export const validateCustomer = {
        body: Joi.object({...})
      };
      ```

   2. Core Components
      a. Models (models/)

      - Database schemas
      - Type definitions
      - Model methods
        Structure:

      ```typescript
      const schema = new Schema({
        field: { type: Type, required: true },
      });
      ```

      b. Services (services/)

      - Business logic
      - External integrations
      - Data processing
        Structure:

      ```typescript
      export class UserService {
        async createUser(data) {...}
      }
      ```

      c. Utils (utils/)

      - Helper functions
      - Common utilities
      - Shared constants
        Structure:

      ```typescript
      export const formatDate = (date) => {...}
      ```

      d. Workflows (workflows/)

      - Process definitions
      - State machines
      - Business rules
        Structure:

      ```typescript
      export class OrderWorkflow {
        async process(order) {...}
      }
      ```

   B. Configuration Management

   1. Environment Files (config/)
      a. Base Configuration (default.json)

      ```json
      {
        "app": {
          "name": "mExpress",
          "version": "1.0.0"
        }
      }
      ```

      b. Environment-Specific (\*.json)

      - development.json
      - production.json
      - test.json

      c. Dynamic Config (config.ts)

      ```typescript
      export const config = {
        ...defaultConfig,
        ...envConfig,
      };
      ```

   C. Testing Infrastructure (tests/)

   1. Unit Tests

      - **tests**/unit/
      - Jest configuration
      - Mock data

   2. Integration Tests

      - **tests**/integration/
      - API tests
      - Database tests

   3. Test Utilities
      - **tests**/utils/
      - Test helpers
      - Fixtures

   D. Build and Deployment

   1. Scripts (scripts/)

      - build.sh
      - deploy.sh
      - backup.sh
      - migrate.sh

   2. Configuration Files
      - tsconfig.json
      - jest.config.js
      - .eslintrc
      - .prettierrc

2. File Naming Conventions
   A. Source Files

   - PascalCase for classes: UserController.ts
   - camelCase for utilities: dateFormatter.ts
   - kebab-case for configs: api-config.ts

   B. Test Files

   - Same name as source: UserController.test.ts
   - Descriptive prefixes: integration.UserController.test.ts

3. Code Organization Standards
   A. File Structure

   ```typescript
   // Imports
   import { ... } from '...';

   // Types/Interfaces
   interface Config {...}

   // Constants
   const DEFAULT_TIMEOUT = 5000;

   // Class/Function Definitions
   export class Service {...}

   // Exports
   export default Service;
   ```

   B. Directory Organization

   ```bash
   # Create standard directory structure
   mkdir -p src/{api/{controllers,middlewares,routes,validators},models,services,utils,workflows}
   mkdir -p tests/{unit,integration,utils}
   mkdir -p scripts
   mkdir -p config
   ```

4. Environment Configuration
   A. Environment Variables (.env)

   # Create environment files

   cat << EOF > .env.example
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mexpress
   EOF

   ````

   B. Git Configuration
   ```bash
   # Configure git ignore
   echo "node_modules/" >> .gitignore
   echo ".env" >> .gitignore
   echo "dist/" >> .gitignore
   ````

5. Initialization Commands

   ```bash
   # Initialize project
   npm init -y

   # Install core dependencies
   npm install express mongoose winston typescript

   # Install dev dependencies
   npm install -D @types/node @types/express jest ts-jest

   # Initialize TypeScript
   npx tsc --init

   # Create initial directory structure
   ./scripts/init-project.sh
   ```

V. FRONTEND STRUCTURE (/opt/mexpress/frontend/):
[⬆ Back to Top](#table-of-contents)

# frontend

A. Project Organization

```plaintext
/opt/mexpress/frontend/
├── src/
│   ├── components/              # React components
│   │   ├── common/             # Shared components
│   │   │   ├── Button/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── Button.module.css
│   │   │   ├── Input/
│   │   │   └── Modal/
│   │   ├── forms/              # Form components
│   │   │   ├── LoginForm/
│   │   │   └── RegisterForm/
│   │   ├── layouts/            # Layout components
│   │   │   ├── MainLayout/
│   │   │   └── DashboardLayout/
│   │   └── features/           # Feature-specific components
│   │       ├── UserManagement/
│   │       └── WorkflowBuilder/
│   │
│   ├── context/               # React context providers
│   │   ├── AuthContext/
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   └── useAuth.ts
│   │   └── ThemeContext/
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useForm.ts
│   │   ├── useApi.ts
│   │   └── useDebounce.ts
│   │
│   ├── services/            # API service integrations
│   │   ├── api.ts          # API client setup
│   │   ├── auth.service.ts
│   │   └── users.service.ts
│   │
│   ├── styles/             # CSS and style files
│   │   ├── global.css      # Global styles
│   │   ├── variables.css   # CSS variables
│   │   └── themes/         # Theme configurations
│   │
│   └── utils/             # Utility functions
│       ├── validation.ts
│       ├── formatting.ts
│       └── testing.ts
│
├── public/               # Static files
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── tests/               # Test files
│   ├── setup.ts        # Test setup
│   ├── mocks/          # Test mocks
│   └── utils/          # Test utilities
│
└── config/             # Configuration files
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── jest.config.js
    └── tsconfig.json
```

B. Component Structure

1.  Common Components

```typescript
// src/components/common/Button/index.tsx
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

2.  Feature Components

```typescript
// src/components/features/UserManagement/UserList/index.tsx
export interface UserListProps {
  users: User[];
  onUserSelect: (userId: string) => void;
  sortOrder: 'asc' | 'desc';
  filterBy?: UserFilter;
}
```

C. Configuration Files

1.  Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
```

2.  Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... other shades
        },
      },
      spacing: {
        navbar: '64px',
        sidebar: '240px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
```

D. Environment Configuration

```plaintext
# .env.example
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
VITE_APP_NAME=mExpress
VITE_ENV=development
VITE_ANALYTICS_ID=
```

E. Type Definitions

```typescript
// src/types/global.d.ts
declare global {
  interface Window {
    config: {
      apiUrl: string;
      environment: string;
    };
  }
}

// src/types/api.ts
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

F. Test Configuration

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
```

This expanded structure:

- Provides clear organization patterns
- Shows detailed component structure
- Includes configuration examples
- Defines type organization
- Specifies test setup
- Maintains scalability

VI. DATABASE AND MODEL STANDARDS
[⬆ Back to Top](#table-of-contents)

# database and model standards

A. Schema Design Principles

1.  Base Schema Structure:

```javascript
// Base schema for all models
const baseSchema = new Schema(
  {
    // Common fields for all documents
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    // Schema options
    timestamps: true,
    strict: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
```

2.  Field Naming Conventions:

```javascript
const fieldConventions = {
  // Use camelCase for field names
  goodExample: {
    firstName: String,
    emailAddress: String,
    phoneNumber: String,
  },

  // Avoid unclear abbreviations
  badExample: {
    fname: String, // Avoid
    em: String, // Avoid
    ph: String, // Avoid
  },
};
```

3.  Type Definitions:

```javascript
// Common type definitions
const commonTypes = {
  // Use MongoDB ObjectId for references
  referenceId: {
    type: Schema.Types.ObjectId,
    ref: 'ModelName',
    required: true,
    index: true,
  },

  // Use String for URLs with validation
  url: {
    type: String,
    validate: {
      validator: v => /^https?:\/\//.test(v),
      message: 'Invalid URL format',
    },
  },

  // Use String for emails with validation
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => /\S+@\S+\.\S+/.test(v),
      message: 'Invalid email format',
    },
  },
};
```

B. Model Organization

1.  Model Structure:

```javascript
// Customer.js
const customerSchema = new Schema({
  // Basic Information
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: commonTypes.email,
    phone: {
      type: String,
      validate: {
        validator: v => /^\+?[\d\s-]{10,}$/.test(v),
        message: 'Invalid phone number format',
      },
    },
  },

  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },

  // Status and Metadata
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true,
  },
});
```

2.  Model Methods:

```javascript
// Instance methods
customerSchema.methods = {
  // Transform customer data for API response
  toAPI() {
    const { personalInfo, status } = this;
    return {
      id: this._id,
      name: `${personalInfo.firstName} ${personalInfo.lastName}`,
      email: personalInfo.email,
      status,
    };
  },

  // Check if customer is active
  isActive() {
    return this.status === 'active';
  },
};

// Static methods
customerSchema.statics = {
  // Find active customers
  findActive() {
    return this.find({ status: 'active', isDeleted: false });
  },

  // Find by email with case-insensitive search
  findByEmail(email) {
    return this.findOne({
      'personalInfo.email': new RegExp(`^${email}$`, 'i'),
    });
  },
};
```

C. Indexing Strategy

1.  Index Configuration:

```javascript
// Index definitions
customerSchema.index(
  { 'personalInfo.email': 1 },
  {
    unique: true,
    sparse: true,
    background: true,
  }
);

customerSchema.index(
  { 'personalInfo.phone': 1 },
  {
    sparse: true,
    background: true,
  }
);

customerSchema.index(
  {
    'personalInfo.firstName': 'text',
    'personalInfo.lastName': 'text',
  },
  {
    weights: {
      'personalInfo.firstName': 2,
      'personalInfo.lastName': 1,
    },
    name: 'CustomerTextIndex',
  }
);
```

2.  Compound Indexes:

```javascript
// Compound index for common queries
customerSchema.index(
  {
    status: 1,
    createdAt: -1,
    isDeleted: 1,
  },
  {
    name: 'CustomerStatusIndex',
  }
);
```

D. Query Optimization

1.  Query Best Practices:

```javascript
// Query helper methods
customerSchema.query = {
  // Add status filter
  byStatus(status) {
    return this.where({ status });
  },

  // Add date range filter
  byDateRange(startDate, endDate) {
    return this.where({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  },

  // Add pagination
  paginate(page = 1, limit = 10) {
    return this.skip((page - 1) * limit).limit(limit);
  },
};
```

2.  Lean Queries:

```javascript
// Use lean for read-only operations
const getCustomerList = async filters => {
  return Customer.find(filters)
    .select('personalInfo.firstName personalInfo.lastName status')
    .lean()
    .exec();
};
```

E. Data Validation

1.  Custom Validators:

```javascript
// Validation helpers
const validators = {
  // Phone number validator
  phone: {
    validator: v => /^\+?[\d\s-]{10,}$/.test(v),
    message: 'Invalid phone number format',
  },

  // Email validator
  email: {
    validator: v => /\S+@\S+\.\S+/.test(v),
    message: 'Invalid email format',
  },

  // Password strength validator
  password: {
    validator: v => {
      const requirements = [
        /[A-Z]/, // uppercase
        /[a-z]/, // lowercase
        /[0-9]/, // numbers
        /[!@#$%^&*]/, // special chars
      ];
      return requirements.every(pattern => pattern.test(v));
    },
    message: 'Password does not meet requirements',
  },
};
```

2.  Pre-save Middleware:

```javascript
// Pre-save hooks
customerSchema.pre('save', async function (next) {
  // Update timestamps
  this.updatedAt = new Date();

  // Format fields
  if (this.personalInfo.email) {
    this.personalInfo.email = this.personalInfo.email.toLowerCase();
  }

  next();
});
```

F. Relationships and Population

1.  Reference Configuration:

```javascript
// Define relationships
const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: Number,
      price: Number,
    },
  ],
});
```

2.  Population Strategies:

```javascript
// Population helper methods
orderSchema.statics.findWithDetails = function (criteria) {
  return this.find(criteria)
    .populate('customer', 'personalInfo.firstName personalInfo.lastName')
    .populate('items.product', 'name price');
};
```

G. Error Handling

1.  Database Error Handling:

```javascript
// Error handler middleware
const handleDBError = error => {
  if (error.name === 'ValidationError') {
    return new ValidationError(
      Object.values(error.errors)
        .map(err => err.message)
        .join(', ')
    );
  }

  if (error.code === 11000) {
    return new DuplicateError('Record already exists');
  }

  return new DatabaseError('Database operation failed');
};
```

H. Performance Monitoring

1.  Query Monitoring:

```javascript
// Query performance monitoring
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });
}
```

2.  Index Usage Analysis:

```javascript
// Index usage stats
const analyzeIndexes = async model => {
  const stats = await model.collection
    .aggregate([{ $indexStats: {} }])
    .toArray();

  console.log('Index Usage Stats:', stats);
};
```

I. Backup and Maintenance

1.  Backup Strategy:

```javascript
// Backup configuration
const backupConfig = {
  frequency: '0 0 * * *', // Daily at midnight
  retention: 30, // Keep 30 days of backups
  path: '/var/backups/mongodb',
};
```

J. Testing Requirements

1.  Model Testing:

```javascript
describe('Customer Model', () => {
  test('should validate email format', async () => {
    const customer = new Customer({
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      },
    });

    await expect(customer.validate()).rejects.toThrow();
  });
});
```

C. DEVELOPMENT STANDARDS

# development standards

VII. DEVELOPMENT PRINCIPLES:
[⬆ Back to Top](#table-of-contents)

# development principles

A. DRY (Don't Repeat Yourself)

1.  Shared Components

```typescript
// Bad Example
const Page1 = () => (
  <div>
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      Click Me
    </button>
  </div>
);

const Page2 = () => (
  <div>
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      Submit
    </button>
  </div>
);

// Good Example
const Button = ({ children, ...props }) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    {...props}
  >
    {children}
  </button>
);

const Page1 = () => <Button>Click Me</Button>;
const Page2 = () => <Button>Submit</Button>;
```

2.  Utility Functions

```typescript
// utils/formatting.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

3.  Custom Hooks

```typescript
// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

B. SOLID Principles

1.  Single Responsibility

```typescript
// Bad Example
class UserManager {
  async createUser(userData: UserData) {
    /* ... */
  }
  async validateUser(userData: UserData) {
    /* ... */
  }
  async sendWelcomeEmail(email: string) {
    /* ... */
  }
}

// Good Example
class UserService {
  async createUser(userData: UserData) {
    /* ... */
  }
}

class UserValidator {
  async validate(userData: UserData) {
    /* ... */
  }
}

class EmailService {
  async sendWelcomeEmail(email: string) {
    /* ... */
  }
}
```

2.  Open/Closed

```typescript
// Bad Example
class PaymentProcessor {
  processPayment(type: string, amount: number) {
    if (type === 'credit') {
      // Process credit payment
    } else if (type === 'debit') {
      // Process debit payment
    }
  }
}

// Good Example
interface PaymentStrategy {
  process(amount: number): Promise<void>;
}

class CreditPayment implements PaymentStrategy {
  async process(amount: number) {
    /* ... */
  }
}

class DebitPayment implements PaymentStrategy {
  async process(amount: number) {
    /* ... */
  }
}
```

C. Clean Code Practices

1.  Naming Conventions

```typescript
// Bad Examples
const d = new Date();
const u = getUser();
const fn = (x: number) => x * 2;

// Good Examples
const currentDate = new Date();
const currentUser = getUser();
const doubleNumber = (value: number) => value * 2;
```

2.  Function Structure

```typescript
// Bad Example
function processUserData(data: any) {
  // 100+ lines of mixed responsibilities
}

// Good Example
async function processUserData(userData: UserData): Promise<User> {
  const validatedData = await validateUserData(userData);
  const sanitizedData = sanitizeUserInput(validatedData);
  return createUser(sanitizedData);
}
```

D. State Management

1.  Global State

```typescript
// context/AuthContext.tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Context logic

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};
```

2.  Component State

```typescript
// Bad Example
const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Multiple separate states

  // Good Example
  interface UserData {
    name: string;
    email: string;
    phone: string;
  }

  const UserProfile = () => {
    const [userData, setUserData] = useState<UserData>({
      name: '',
      email: '',
      phone: ''
    });
};
```

E. Error Handling

1.  Error Boundaries

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

2.  API Error Handling

```typescript
const apiCall = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new ApiError(response.statusText);
    }

    return await response.json();
  } catch (error) {
    handleError(error);
    throw error;
  }
};
```

F. Performance Principles

1.  Memoization

```typescript
const MemoizedComponent = React.memo(({ data }) => (
  <div>{/* Expensive render */}</div>
));

const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
```

2.  Code Splitting

```typescript
const LazyComponent = React.lazy(() =>
  import('./HeavyComponent')
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

This expanded section:

- Provides practical examples
- Shows good vs bad practices
- Covers key principles in depth
- Includes performance considerations
- Demonstrates error handling
- Shows state management patterns

VIII. BACKEND DEVELOPMENT STANDARDS
[⬆ Back to Top](#table-of-contents)

# backend development standards

A. Controller Architecture

1.  Base Controller Pattern:

```typescript
// controllers/base.controller.ts
abstract class BaseController {
  protected async execute(
    req: Request,
    res: Response,
    action: () => Promise<any>
  ): Promise<void> {
    try {
      const result = await action();
      this.sendResponse(res, result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  protected sendResponse(res: Response, data: any, status = 200): void {
    res.status(status).json({
      status: 'success',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  protected handleError(error: Error, res: Response): void {
    if (error instanceof ValidationError) {
      res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details,
      });
      return;
    }

    // Handle other error types...
  }
}

// Implementation example
class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  public getUser = async (req: Request, res: Response): Promise<void> => {
    await this.execute(req, res, async () => {
      const userId = req.params.id;
      return this.userService.getUserById(userId);
    });
  };
}
```

B. Service Layer Patterns

1.  Service Structure:

```typescript
// services/base.service.ts
abstract class BaseService {
  protected abstract repository: Repository<any>;

  protected async transaction<T>(
    operation: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

// Implementation
class UserService extends BaseService {
  constructor(
    protected repository: UserRepository,
    private readonly emailService: EmailService
  ) {
    super();
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    return this.transaction(async session => {
      const user = await this.repository.create(userData, { session });
      await this.emailService.sendWelcomeEmail(user.email);
      return user;
    });
  }
}
```

C. Repository Pattern

1.  Base Repository:

```typescript
// repositories/base.repository.ts
abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(conditions: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(conditions).exec();
  }

  async create(data: Partial<T>, options?: SaveOptions): Promise<T> {
    const entity = new this.model(data);
    return entity.save(options);
  }

  async update(
    id: string,
    data: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, ...options })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}

// Implementation
class UserRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}
```

D. Middleware Standards

1.  Middleware Pattern:

```typescript
// middleware/validation.middleware.ts
const createValidationMiddleware = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = validated;
      next();
    } catch (error) {
      next(new ValidationError(error.details));
    }
  };
};

// middleware/auth.middleware.ts
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req);
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid token'));
  }
};
```

E. Database Interaction

1.  Query Building:

```typescript
// utils/query-builder.ts
class QueryBuilder<T> {
  private query: FilterQuery<T> = {};
  private options: QueryOptions = {};

  where(conditions: FilterQuery<T>): this {
    this.query = { ...this.query, ...conditions };
    return this;
  }

  select(fields: string[]): this {
    this.options.select = fields.join(' ');
    return this;
  }

  populate(path: string, select?: string[]): this {
    this.options.populate = {
      path,
      select: select?.join(' '),
    };
    return this;
  }

  paginate(page: number, limit: number): this {
    this.options.skip = (page - 1) * limit;
    this.options.limit = limit;
    return this;
  }

  sort(field: string, order: 'asc' | 'desc' = 'asc'): this {
    this.options.sort = { [field]: order === 'asc' ? 1 : -1 };
    return this;
  }

  build(): { query: FilterQuery<T>; options: QueryOptions } {
    return { query: this.query, options: this.options };
  }
}
```

F. Event Handling

1.  Event System:

```typescript
// events/event-emitter.ts
type EventHandler = (...args: any[]) => Promise<void> | void;

class EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  async emit(event: string, ...args: any[]): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    await Promise.all(handlers.map(handler => handler(...args)));
  }
}

// Implementation
const eventEmitter = new EventEmitter();

eventEmitter.on('user.created', async (user: User) => {
  await emailService.sendWelcomeEmail(user.email);
});

eventEmitter.on('user.created', async (user: User) => {
  await analyticsService.trackUserCreation(user);
});
```

G. Caching Strategy

1.  Cache Service:

```typescript
// services/cache.service.ts
class CacheService {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}

// Cache decorator
function Cached(ttl: number = 3600) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      const cached = await cacheService.get(cacheKey);

      if (cached) return cached;

      const result = await originalMethod.apply(this, args);
      await cacheService.set(cacheKey, result, ttl);
      return result;
    };
  };
}
```

H. Request Validation

1.  Validation Schemas:

```typescript
// validation/schemas/user.schema.ts
const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must include upper, lower case and numbers',
    }),
});

// Usage with middleware
router.post('/users', validateRequest(userSchema), userController.createUser);
```

These backend standards provide:

- Consistent controller architecture
- Service layer patterns
- Repository abstractions
- Middleware patterns
- Database interaction standards
- Event handling
- Caching strategies
- Request validation

IX. FRONTEND DEVELOPMENT STANDARDS
[⬆ Back to Top](#table-of-contents)

# frontend development standards

A. Component Architecture

1.  Base Component Structure:

```typescript
// ComponentName.tsx
import React from 'react';
import type { ComponentProps } from './types';

const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  children
}) => {
  // State hooks
  const [state, setState] = useState(initialState);

  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handle event
  };

  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

2.  Component Organization:

```text
src/components/
├── common/              # Shared components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   └── Input/
├── features/           # Feature-specific components
│   ├── CustomerForm/
│   └── OrderList/
├── layouts/           # Layout components
└── pages/            # Page components
```

B. State Management

1.  Local State:

```typescript
// Using useState
const ComponentWithState: React.FC = () => {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
      {data && <DataDisplay data={data} />}
    </div>
  );
};
```

2.  Context Management:

```typescript
// Context definition
interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: Credentials) => {
    // Implementation
  };

  const logout = () => {
    // Implementation
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

C. Styling Standards

1.  Tailwind Configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#6366F1',
        },
      },
      spacing: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
```

2.  Component Styling:

```typescript
// Use Tailwind utility classes
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children
}) => {
  const baseClasses = 'rounded-md font-medium focus:outline-none';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
};
```

D. Form Handling

1.  Form Component Structure:

```typescript
interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await submitForm(formData);
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      {/* Other form fields */}
    </form>
  );
};
```

2.  Form Validation:

```typescript
const validateForm = (values: FormData) => {
  const errors: Partial<FormData> = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  return errors;
};
```

E. API Integration

1.  API Service Structure:

```typescript
// api/customers.ts
import { apiClient } from './client';
import type { Customer } from './types';

export const customerService = {
  async getCustomers(params?: QueryParams) {
    const response = await apiClient.get<Customer[]>('/customers', { params });
    return response.data;
  },

  async createCustomer(data: CustomerInput) {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  },
};
```

2.  API Hook Pattern:

```typescript
// hooks/useCustomers.ts
export const useCustomers = (params?: QueryParams) => {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const customers = await customerService.getCustomers(params);
        setData(customers);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [params]);

  return { data, loading, error };
};
```

F. Error Handling

1.  Error Boundary:

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

2.  Error Display Components:

```typescript
const ErrorMessage: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <XCircleIcon className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {error.message}
          </h3>
        </div>
      </div>
    </div>
  );
};
```

G. Performance Optimization

1.  Component Optimization:

```typescript
// Use memo for expensive renders
const ExpensiveComponent = React.memo(({ data }) => {
  return (
    // Component content
  );
});

// Use callback for stable functions
const handleClick = useCallback(() => {
  // Handler implementation
}, [dependencies]);

// Use memo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

2.  Code Splitting:

```typescript
// Route-based code splitting
const CustomerPage = lazy(() => import('./pages/CustomerPage'));

// Component usage
<Suspense fallback={<LoadingSpinner />}>
  <CustomerPage />
</Suspense>
```

H. Testing Standards

1.  Component Testing:

```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react';

describe('Button', () => {
  test('renders with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click me</Button>
    );

    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

2.  Hook Testing:

```typescript
// useCustomer.test.ts
import { renderHook, act } from '@testing-library/react-hooks';

describe('useCustomer', () => {
  test('fetches customer data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useCustomer('123'));

    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.data).toBeDefined();
  });
});
```

I. Documentation Requirements

1.  Component Documentation:

```typescript
/**
 * Button component that follows the design system
 *
 * @param {string} variant - The button style variant
 * @param {string} size - The button size
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */
```

2.  Story Documentation:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
```

J. Accessibility Standards

1.  Component Accessibility:

```typescript
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title" className="text-lg font-medium">
        {title}
      </h2>
      {children}
    </Dialog>
  );
};
```

2.  Focus Management:

```typescript
const FocusTrap: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Focus management implementation
  }, []);

  return <div ref={ref}>{children}</div>;
};
```

Remember to:

- Follow component structure consistently
- Use TypeScript for type safety
- Implement proper error handling
- Write comprehensive tests
- Maintain accessibility standards
- Document components and hooks
- Optimize for performance

X. API STANDARDS AND DOCUMENTATION
[⬆ Back to Top](#table-of-contents)

# api standards and documentation

A. API Structure and Naming

1.  URL Structure:

```text
/api/v1/[resource]/[identifier]/[sub-resource]

Examples:
GET    /api/v1/customers          # List customers
POST   /api/v1/customers          # Create customer
GET    /api/v1/customers/:id      # Get specific customer
PUT    /api/v1/customers/:id      # Update customer
DELETE /api/v1/customers/:id      # Delete customer
```

2.  Resource Naming:
    - Use plural nouns for resources: customers, orders
    - Use kebab-case for multi-word resources: order-items
    - Use descriptive verbs for actions: /customers/:id/activate

B. Request Standards

1.  HTTP Methods:

```javascript
GET:    // Retrieve resources
POST:   // Create new resources
PUT:    // Update entire resources
PATCH:  // Partial updates
DELETE: // Remove resources
```

2.  Request Headers:

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer [token]",
  "Accept": "application/json",
  "X-Request-ID": "unique-request-id"
}
```

3.  Query Parameters:

```javascript
// Pagination
?page=1&limit=10

// Filtering
?status=active&type=premium

// Sorting
?sort=createdAt:desc

// Field selection
?fields=id,name,email
```

C. Response Standards

1.  Success Response Format:

```javascript
{
  "status": "success",
  "data": {
    // Resource data
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

2.  Error Response Format:

```javascript
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human readable message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "requestId": "unique-request-id",
  "timestamp": "2025-01-12T12:00:00Z"
}
```

3.  HTTP Status Codes:

```javascript
200: OK              // Successful GET, PUT, PATCH
201: Created         // Successful POST
204: No Content      // Successful DELETE
400: Bad Request     // Validation errors
401: Unauthorized    // Authentication failed
403: Forbidden       // Authorization failed
404: Not Found       // Resource not found
409: Conflict        // Resource conflict
422: Unprocessable   // Business logic error
429: Too Many       // Rate limit exceeded
500: Server Error   // Internal error
```

D. Validation Standards

1.  Input Validation:

```javascript
const validateCustomer = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .description('Customer email address'),
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .description('Customer full name'),
    phone: Joi.string()
      .pattern(/^\+?[\d\s-]{10,}$/)
      .description('Customer phone number'),
  }),
};
```

2.  Common Validation Rules:

```javascript
const commonRules = {
  id: Joi.string().uuid(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[\d\s-]{10,}$/),
  password: Joi.string().min(8).max(100),
  date: Joi.date().iso(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
};
```

E. Versioning

1.  Version Control:

    - Use URL versioning: /api/v1/
    - Major version changes for breaking changes
    - Document deprecated endpoints
    - Provide migration guides

2.  Version Lifecycle:

```javascript
const versions = {
  current: 'v1',
  supported: ['v1'],
  deprecated: [],
  sunset: {
    v1: '2026-01-01',
  },
};
```

F. API Documentation

1.  OpenAPI/Swagger Specification:

```yaml
openapi: 3.0.0
info:
  title: mExpress API
  version: 1.0.0
paths:
  /customers:
    post:
      summary: Create new customer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Customer'
      responses:
        201:
          description: Customer created successfully
```

2.  Endpoint Documentation:

```javascript
/**
 * @api {post} /api/v1/customers Create Customer
 * @apiVersion 1.0.0
 * @apiName CreateCustomer
 * @apiGroup Customer
 *
 * @apiParam {String} email Customer email
 * @apiParam {String} name Customer full name
 * @apiParam {String} [phone] Customer phone number
 *
 * @apiSuccess {String} id Customer unique ID
 * @apiSuccess {String} email Customer email
 * @apiSuccess {String} name Customer name
 *
 * @apiError (400) {Object} ValidationError Invalid input data
 * @apiError (409) {Object} ConflictError Email already exists
 */
```

G. Security Standards

1.  Authentication:

    - Bearer token required
    - Token validation middleware
    - Token refresh mechanism

2.  Authorization:

    - Role-based access control
    - Resource ownership validation
    - Permission middleware

3.  Rate Limiting:

```javascript
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

H. Testing Requirements

1.  API Tests:

```javascript
describe('POST /api/v1/customers', () => {
  test('should create new customer', async () => {
    const response = await request(app)
      .post('/api/v1/customers')
      .send(validCustomerData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
```

2.  Coverage Requirements:
    - All endpoints tested
    - Success scenarios covered
    - Error scenarios covered
    - Edge cases tested

I. Monitoring and Logging

1.  Request Logging:

```javascript
{
  timestamp: '2025-01-12T12:00:00Z',
  requestId: 'unique-id',
  method: 'POST',
  path: '/api/v1/customers',
  status: 201,
  duration: 45, // ms
  userId: 'user-id'
}
```

2.  Performance Metrics:
    - Response times
    - Error rates
    - Request volume
    - Resource usage

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

E. PROCESS AND WORKFLOW

# process and workflow

XVI. VERSION CONTROL GUIDELINES
[⬆ Back to Top](#table-of-contents)

# version control guidelines

A. Git Flow Implementation

1.  Branch Structure:

```bash
# Branch naming and purpose
main           # Production-ready code
├── develop    # Development integration branch
├── release/*  # Release preparation (e.g., release/1.2.0)
├── feature/*  # New features (e.g., feature/MEX-123-user-auth)
├── bugfix/*   # Bug fixes (e.g., bugfix/MEX-456-login-error)
└── hotfix/*   # Production fixes (e.g., hotfix/MEX-789-critical-security)
```

2.  Branch Management Commands:

```bash
# Feature branch workflow
git checkout develop
git pull origin develop
git checkout -b feature/MEX-123-user-auth
git push -u origin feature/MEX-123-user-auth

# Release branch workflow
git checkout develop
git checkout -b release/1.2.0
git push -u origin release/1.2.0

# Hotfix workflow
git checkout main
git checkout -b hotfix/MEX-789-critical-security
git push -u origin hotfix/MEX-789-critical-security
```

B. Commit Standards

1.  Commit Message Format:

```bash
# Format:
<type>(<scope>): <subject>

[optional body]

[optional footer]

# Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation only
- style:    Code style/formatting
- refactor: Code refactoring
- test:     Adding/updating tests
- chore:    Maintenance tasks

# Examples:
feat(auth): implement JWT authentication (#123)
fix(api): handle undefined user object (#456)
docs(readme): update installation steps
style(lint): apply prettier formatting
refactor(users): simplify permission logic
test(auth): add unit tests for login
chore(deps): update dependencies
```

2.  Commit Hooks (Git Hooks):

```javascript
// .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1

// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'test',
      'chore'
    ]],
    'scope-case': [2, 'always', 'lowercase'],
    'subject-case': [2, 'always', 'lower'],
    'body-max-line-length': [2, 'always', 72],
  }
};
```

C. Pull Request Standards

1.  PR Template:

```markdown
# .github/pull_request_template.md

## Description

[Provide a brief description of the changes]

## Type of change

- [ ] Feature (non-breaking change)
- [ ] Bug fix (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

- Fixes #[issue number]

## Testing

- [ ] New tests added
- [ ] All tests passing
- [ ] Manual testing performed

## Checklist

- [ ] My code follows style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex logic
- [ ] I have updated documentation
- [ ] My changes generate no warnings
```

2.  PR Security Checklist:

```markdown
## Security Review Checklist

- [ ] Input validation implemented
- [ ] Authentication checks in place
- [ ] Authorization rules implemented
- [ ] Sensitive data protected
- [ ] SQL/NoSQL injection prevented
- [ ] XSS protection implemented
- [ ] CSRF protection in place
```

D. Branch Protection Rules

1.  GitHub Branch Protection:

```javascript
// Branch protection configuration (via GitHub API)
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "continuous-integration/jenkins/pr-merge",
      "security/snyk",
      "lint",
      "test"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {
      "users": ["tech-lead"],
      "teams": ["senior-devs"]
    },
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2
  },
  "restrictions": null
}
```

E. Code Review Guidelines

1.  Review Checklist:

```markdown
## Code Review Checklist

### Functionality

- [ ] Code works as described in requirements
- [ ] Edge cases handled
- [ ] Error cases handled appropriately

### Code Quality

- [ ] Follows project style guide
- [ ] No unnecessary complexity
- [ ] No duplicate code
- [ ] Proper naming conventions

### Testing

- [ ] Tests cover the changes
- [ ] Tests are meaningful
- [ ] All tests pass

### Security

- [ ] No security vulnerabilities
- [ ] Proper input validation
- [ ] Secure data handling

### Performance

- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] Proper use of caching
```

F. Version Control Scripts

1.  Git Workflow Automation:

```bash
#!/bin/bash
# scripts/create-feature.sh

# Validate ticket number
if [[ ! $1 =~ ^MEX-[0-9]+$ ]]; then
  echo "Invalid ticket number format. Use MEX-XXX"
  exit 1
fi

# Create feature branch
BRANCH="feature/$1-${2:-feature}"
git checkout develop
git pull origin develop
git checkout -b "$BRANCH"
git push -u origin "$BRANCH"

echo "Created and pushed branch: $BRANCH"
```

G. Release Management

1.  Version Bumping:

```javascript
// scripts/version-bump.js
const fs = require('fs');
const { execSync } = require('child_process');

function bumpVersion(type) {
  // Read current version
  const pkg = JSON.parse(fs.readFileSync('package.json'));
  const [major, minor, patch] = pkg.version.split('.');

  // Calculate new version
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${parseInt(major) + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${parseInt(minor) + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
      break;
  }

  // Update files
  pkg.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  // Create git tag
  execSync(`git tag -a v${newVersion} -m "Release ${newVersion}"`);
  execSync('git push origin --tags');
}
```

These version control implementations provide:

- Clear branch strategy
- Standardized commit messages
- PR templates and checklists
- Branch protection rules
- Code review guidelines
- Automated workflows
- Release management

XVII. CONTINUOUS INTEGRATION:
[⬆ Back to Top](#table-of-contents)

# continuous integration

A. Pipeline Configuration

1.  GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint check
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:ci

      - name: Build verification
        run: npm run build
```

2.  Environment Configuration

```yaml
# .github/workflows/environment.yml
env:
  NODE_ENV: test
  MONGODB_URI: mongodb://localhost:27017/test
  REDIS_URL: redis://localhost:6379
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

B. Quality Gates Implementation

1.  Test Coverage Configuration

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
};
```

2.  Linting Rules

```javascript
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    complexity: ['error', 10],
    'max-lines-per-function': ['error', 50],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },
};
```

C. Security Scanning

1.  Dependency Scanning

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    - name: Run Snyk
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

    - name: Run npm audit
      run: npm audit
```

2.  Code Scanning

```yaml
code-scanning:
  runs-on: ubuntu-latest
  steps:
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2

    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

D. Branch Protection Rules

1.  GitHub Repository Settings

```javascript
{
  "protection": {
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "quality",
        "security-scan",
        "code-scanning"
      ]
    },
    "required_pull_request_reviews": {
      "required_approving_review_count": 2,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    },
    "enforce_admins": true,
    "restrictions": null
  }
}
```

E. Artifact Management

1.  Build Artifacts

```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build
    path: dist/
    retention-days: 14
```

2.  Test Reports

```yaml
- name: Generate test report
  run: npm run test:report

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: |
      coverage/
      junit.xml
```

F. Monitoring and Alerts

1.  Workflow Notifications

```yaml
- name: Send notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

2.  Performance Monitoring

```javascript
const performanceCheck = {
  buildTime: 300, // seconds
  testTime: 180, // seconds
  deployTime: 240, // seconds
};
```

G. Deployment Integration

1.  Staging Deployment

```yaml
deploy-staging:
  needs: [quality, security-scan]
  if: github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to staging
      uses: some-deploy-action@v1
      with:
        environment: staging
```

2.  Production Deployment

```yaml
deploy-production:
  needs: [quality, security-scan]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to production
      uses: some-deploy-action@v1
      with:
        environment: production
```

H. Error Resolution Procedures

1.  Failure Analysis

```typescript
interface CIFailure {
  job: string;
  step: string;
  error: string;
  logs: string;
  artifacts: string[];
}

const analyzeFailure = (failure: CIFailure) => {
  // Analysis implementation
};
```

2.  Recovery Steps

```markdown
## CI Failure Recovery Checklist

1. Identify failing job and step
2. Download and analyze logs
3. Reproduce locally
4. Fix issue
5. Verify fix
6. Push update
7. Monitor new run
```

I. Reporting System

1.  Report Generation

```typescript
interface CIReport {
  buildNumber: string;
  status: 'success' | 'failure';
  duration: number;
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  tests: {
    total: number;
    passed: number;
    failed: number;
  };
  artifacts: string[];
}
```

2.  Report Storage

```yaml
- name: Store CI report
  uses: actions/upload-artifact@v3
  with:
    name: ci-report
    path: reports/
    retention-days: 30
```

CHECKPOINTS:

- SAFETY:

  - Verify no breaking changes
  - Check deployment impact
  - Validate dependencies
  - Review security scans

- INTEGRATION:

  - Confirm API compatibility
  - Check database migrations
  - Verify service integration
  - Test cross-component functionality

- ERRORS:

  - Monitor error rates
  - Check log patterns
  - Verify error handling
  - Test recovery procedures

- TESTS:
  - Run all test suites
  - Verify coverage thresholds
  - Check integration tests
  - Validate end-to-end scenarios

This expanded section provides:

- Detailed CI/CD pipeline configuration
- Comprehensive quality gates
- Security scanning implementation
- Clear error handling procedures
- Complete reporting system

XVIII. DOCUMENTATION:
[⬆ Back to Top](#table-of-contents)

# documentation

A. Technical Documentation

1.  API Documentation

    ```yaml
    # OpenAPI/Swagger Specification
    openapi: 3.0.0
    info:
      title: mExpress API
      version: 1.0.0
      description: Core API documentation for mExpress
    components:
      schemas:
        Error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
      securitySchemes:
        bearerAuth:
          type: http
          scheme: bearer
    ```

2.  Component Documentation

    ```typescript
    /**
     * @component Button
     * @description Core button component following design system
     *
     * @prop {string} variant - Visual style ('primary' | 'secondary' | 'ghost')
     * @prop {string} size - Button size ('sm' | 'md' | 'lg')
     * @prop {function} onClick - Click handler
     * @prop {boolean} disabled - Disabled state
     * @prop {ReactNode} children - Button content
     *
     * @example
     * <Button
     *   variant="primary"
     *   size="md"
     *   onClick={() => console.log('clicked')}
     * >
     *   Click Me
     * </Button>
     */
    ```

3.  Architecture Documentation
    - System diagrams (using PlantUML/Mermaid)
    - Data flow diagrams
    - Database schemas
    - Infrastructure diagrams

B. Code Documentation

1.  File Headers

    ```typescript
    /**
     * @fileoverview User authentication service implementation
     * @module services/auth
     * @author Development Team
     * @version 1.0.0
     * @license MIT
     */
    ```

2.  Function Documentation

    ```typescript
    /**
     * Authenticates user and generates access token
     *
     * @param {LoginCredentials} credentials - User login credentials
     * @returns {Promise<AuthResponse>} Authentication response with tokens
     * @throws {AuthenticationError} When credentials are invalid
     * @throws {ValidationError} When input validation fails
     *
     * @example
     * const response = await authenticate({
     *   email: 'user@example.com',
     *   password: 'password123'
     * });
     */
    ```

3.  Type Documentation
    ```typescript
    /**
     * User profile information
     * @typedef {Object} UserProfile
     * @property {string} id - Unique identifier
     * @property {string} email - User email address
     * @property {string} name - Full name
     * @property {UserRole} role - User role enum
     * @property {Date} createdAt - Account creation date
     */
    ```

C. Implementation Guides

1.  Setup Documentation

    ````markdown
    # Local Development Setup

    1. Prerequisites

       - Node.js 18.x
       - MongoDB 7.x
       - Redis 7.x

    2. Installation Steps

       ```bash
       # Clone repository
       git clone [repository-url]

       # Install dependencies
       npm install

       # Configure environment
       cp .env.example .env
       ```
    ````

    3. Configuration
       - Database setup
       - Environment variables
       - External services

    ```

    ```

2.  Deployment Documentation

    ```markdown
    # Deployment Guide

    1. Environment Preparation

       - Server requirements
       - Security configurations
       - SSL certificates

    2. Deployment Process

       - Build steps
       - Database migrations
       - Service configuration

    3. Verification Steps
       - Health checks
       - Smoke tests
       - Monitoring setup
    ```

D. User Documentation

1.  End-User Guides

    - Feature walkthroughs
    - Common use cases
    - FAQs
    - Troubleshooting guides

2.  Administrator Guides

    - System configuration
    - User management
    - Backup procedures
    - Security policies

3.  Integration Guides
    - API integration examples
    - Authentication flows
    - Webhook implementations
    - Error handling

E. Documentation Maintenance

1.  Version Control

    ```markdown
    # Version History

    ## [1.2.0] - 2025-01-15

    ### Added

    - New feature documentation
    - Additional code examples

    ### Changed

    - Updated deployment process
    - Improved troubleshooting guides

    ### Removed

    - Deprecated feature documentation
    ```

2.  Review Process

    - Technical accuracy review
    - Clarity and completeness check
    - Code example verification
    - Link validation

3.  Update Procedures
    - Regular review schedule
    - Change notification process
    - Archival procedures
    - Version tracking

F. Documentation Standards

1.  Writing Style

    - Clear and concise language
    - Consistent terminology
    - Active voice
    - Step-by-step instructions

2.  Formatting Guidelines

    - Markdown usage
    - Code block formatting
    - Image and diagram standards
    - Link conventions

3.  Content Organization
    - Logical structure
    - Progressive disclosure
    - Cross-referencing
    - Search optimization

This expanded documentation section provides:

- Comprehensive technical documentation standards
- Clear examples and templates
- Structured maintenance procedures
- Coverage of all documentation types
- Consistent formatting guidelines

XIX. INTERACTION PROTOCOLS
[⬆ Back to Top](#table-of-contents)

# interaction protocols

A. Command Responses

1.  File Operations:

    # Create directory & file

    mkdir -p /path/to/dir
    touch /path/to/file

2.  Content Creation:

    # New file content

    cat << 'EOF' > newfile.ts
    [content]
    EOF

3.  Content Updates:
    UPDATE REQUIRED IN: [file path]
    FIND: [exact existing code]
    REPLACE WITH: [new code]

B. Step-by-Step Execution

1.  Step Format:
    CURRENT STEP: [#] - [Brief description]
    LOCATION: [file/directory path]
    STATUS: Awaiting execution
    ACTION REQUIRED: [Specific commands to run]
    VERIFICATION: [How to verify success]
    NEXT STEP PREVIEW: [What comes next after success]

2.  Response Options:
    SUCCESS:

    - Step #: Completed
    - Output: [Any relevant output]
    - Ready for next step

    ISSUE:

    - Step #: Issue encountered
    - Error: [Error message]
    - Location: [Where error occurred]
    - Output: [Any relevant output]

    QUESTION:

    - Step #: Need clarification
    - Question: [Your question]
    - Context: [Related info]

C. Issue Resolution

1.  Error Format:
    ANALYZING ERROR:
    Error Type: [Classification]
    DIAGNOSIS NEEDED:

    1. [Specific check required]
    2. [Output needed]
       DO NOT PROCEED UNTIL REQUESTED INFO PROVIDED

2.  Fix Format:
    FIX FOR STEP #:
    1. Backup (if needed): [Backup commands]
    2. Correction: [Specific fix commands]
    3. Verification: [Verification commands]

D. Modification Requests

1.  Code Changes:
    LOCATION: [file path]
    CURRENT CODE: [Exact current code block]
    UPDATED CODE: [Exact new code block]
    VERIFICATION: [How to verify change]

2.  Configuration Updates:
    FILE: [config file path]
    ADD/UPDATE CONFIGURATION: [Exact lines to add/update]
    RESTART REQUIRED: Yes/No
    [Any restart commands if needed]

E. Progress Tracking

1.  Status Check:
    CURRENT PROGRESS:

    - Feature: [Feature name]
    - Current Step: [#] of [Total]
    - Last Completed: [Previous step]
    - Next Action: [What's needed]

2.  Completion Report:
    STEP COMPLETION:
    - Step #: [Number]
    - Status: Complete
    - Changes Made:
      - [File/change 1]
      - [File/change 2]
    - Tests Passed: Yes/No

F. Clarification Requests

1.  From Claude:
    CLARIFICATION NEEDED:

    - Regarding: [Topic/Step]
    - Specific Question: [Question]
    - Options Available:
      1. [Option 1]
      2. [Option 2]

2.  Your Response Format:
    CLARIFICATION PROVIDED:
    - Re: [Topic/Step]
    - Choice: [Your choice]
    - Additional Info: [Any extra details]

G. Error Prevention

1.  Backup Commands:

    # Before critical changes

    cp file.original file.backup

2.  Validation Steps:
    VALIDATE BEFORE PROCEEDING:
    1. [Check 1]
    2. [Check 2]
       Confirm checks passed before continuing

H. Rollback Procedures

1.  Rollback Format:
    ROLLBACK STEPS:
    1. [Revert command 1]
    2. [Revert command 2]
       VERIFICATION: [How to verify successful rollback]

INTERACTION GUIDELINES:

1. Always wait for confirmation before proceeding
2. Report any issues immediately
3. Provide exact error messages
4. Ask for clarification if needed
5. Confirm successful steps
6. Use copy-paste ready commands

[⬆ Back to Top](#table-of-contents)
