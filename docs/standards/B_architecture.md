# ARCHITECTURE STANDARDS

## Table of Contents
1. [Overview](#overview)
2. [Backend Architecture](#backend-architecture)
   - [Conceptual Design](#backend-conceptual-design)
   - [Implementation Standards](#backend-implementation-standards)
   - [Quality Control](#backend-quality-control)
3. [Frontend Architecture](#frontend-architecture)
   - [Conceptual Design](#frontend-conceptual-design)
   - [Implementation Standards](#frontend-implementation-standards)
   - [Quality Control](#frontend-quality-control)
4. [Database Architecture](#database-architecture)
   - [Conceptual Design](#database-conceptual-design)
   - [Implementation Standards](#database-implementation-standards)
   - [Quality Control](#database-quality-control)
5. [Quality Assurance Framework](#quality-assurance-framework)
   - [Documentation Standards](#documentation-standards)
   - [Testing Requirements](#testing-requirements)
   - [Validation Procedures](#validation-procedures)
   - [Quality Gates](#quality-gates)

## 1. Overview

### 1.1 Purpose
This document defines the architectural standards for the mExpress platform, covering backend, frontend, and database architectures.

### 1.2 Scope
- Backend service architecture
- Frontend application architecture
- Database and data model standards
- Quality assurance framework
- Integration standards
- Deployment standards

### 1.3 Architecture Principles
1. **Separation of Concerns**
   - Clear boundaries between layers
   - Modular component design
   - Single responsibility principle

2. **Scalability**
   - Horizontal scaling capability
   - Load balancing support
   - Caching strategies

3. **Maintainability**
   - Consistent coding standards
   - Comprehensive documentation
   - Automated testing

4. **Security**
   - Secure by design
   - Regular security audits
   - Compliance with standards

## 2. Backend Architecture

### 2.1 Conceptual Design

#### 2.1.1 Layer Organization
1. **API Layer**
   - Request/response handling
   - Input validation
   - Authentication and authorization
   - Rate limiting and security
   - API versioning

2. **Service Layer**
   - Business logic implementation
   - Data transformation
   - External service integration
   - Event handling
   - Caching strategy

3. **Data Access Layer**
   - Database operations
   - Data validation
   - Transaction management
   - Query optimization
   - Data integrity

#### 2.1.2 Component Interaction
1. **Communication Patterns**
   - REST API standards
   - Message queue integration
   - WebSocket protocols
   - Service-to-service communication
   - Event broadcasting

2. **Error Handling Strategy**
   - Error categorization
   - Error propagation rules
   - Logging requirements
   - Monitoring integration
   - Alert thresholds

### 2.2 Implementation Standards

#### 2.2.1 Directory Structure
```
/opt/mexpress/
├── packages/
│   ├── core/              # Core backend services
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── controllers/    # Request handlers
│   │   │   │   ├── middlewares/    # Request processing
│   │   │   │   ├── routes/         # Endpoint definitions
│   │   │   │   └── validators/     # Input validation
│   │   │   ├── services/           # Business logic
│   │   │   ├── models/             # Data models
│   │   │   ├── utils/              # Shared utilities
│   │   │   └── config/             # Configuration
│   │   └── tests/                  # Test suites
│   ├── ui-components/    # Shared UI components
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   ├── hooks/             # Custom hooks
│   │   │   ├── utils/             # Utilities
│   │   │   └── styles/            # Component styles
│   │   └── tests/                 # Component tests
│   └── utils/            # Shared utilities
│       ├── src/
│       │   ├── validation/        # Validation utilities
│       │   ├── formatting/        # Formatting utilities
│       │   └── testing/          # Test utilities
│       └── tests/                # Utility tests
├── projects/
│   └── mexpress/        # Main project
│       ├── frontend/    # Project-specific frontend
│       └── backend/     # Project-specific backend
└── docs/
    ├── core/           # Core documentation
    └── projects/       # Project documentation
```

#### 2.2.2 API Layer Implementation
1. **Controllers**

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
   # Initialize monorepo
   npm init -y
   
   # Initialize packages
   cd packages/core && npm init -y
   cd ../ui-components && npm init -y
   cd ../utils && npm init -y
   
   # Initialize project
   cd ../../projects/mexpress/frontend && npm init -y
   cd ../backend && npm init -y
   
   # Install core package dependencies
   cd ../../../packages/core
   npm install express mongoose winston typescript
   npm install -D @types/node @types/express jest ts-jest
   
   # Install UI components package dependencies
   cd ../ui-components
   npm install react @types/react styled-components
   npm install -D jest @testing-library/react @testing-library/jest-dom
   
   # Install utils package dependencies
   cd ../utils
   npm install typescript
   npm install -D jest ts-jest @types/jest
   
   # Initialize TypeScript for all packages
   for dir in core ui-components utils; do
       cd ../packages/$dir
       npx tsc --init
   done
   
   # Initialize TypeScript for project
   cd ../../projects/mexpress/frontend
   npx tsc --init
   cd ../backend
   npx tsc --init
   
   # Create monorepo directory structure
   ./scripts/init-monorepo.sh
   ```

### 2.3 Quality Assurance Integration

#### 2.3.1 Deployment Validation
1. **Pre-deployment Validation**
```typescript
interface PreDeploymentCheck {
    systemResources: {
        cpu: number;      // CPU usage threshold (%)
        memory: number;   // Memory usage threshold (%)
        disk: number;     // Disk space threshold (%)
    };
    services: string[];   // Required services
    ports: number[];     // Required ports
    configs: string[];   // Required config files
}

class DeploymentValidator {
    static async validatePreDeployment(): Promise<ValidationResult> {
        // 1. System Resource Check
        const resourceCheck = await this.checkSystemResources({
            cpu: 80,    // Max 80% CPU usage
            memory: 85, // Max 85% memory usage
            disk: 90    // Min 10% free disk space
        });

        // 2. Service Health Check
        const serviceCheck = await this.checkRequiredServices([
            'nginx',
            'mongodb',
            'redis'
        ]);

        // 3. Configuration Check
        const configCheck = await this.validateConfigurations();

        // 4. Database Migration Check
        const migrationCheck = await this.validatePendingMigrations();

        return {
            valid: resourceCheck && serviceCheck && configCheck && migrationCheck,
            checks: {
                resources: resourceCheck,
                services: serviceCheck,
                configs: configCheck,
                migrations: migrationCheck
            }
        };
    }
}
```

2. **Deployment Process Validation**
```typescript
interface DeploymentStep {
    name: string;
    action: () => Promise<boolean>;
    rollback: () => Promise<void>;
    validation: () => Promise<boolean>;
}

class DeploymentProcess {
    private steps: DeploymentStep[] = [
        {
            name: 'Stop Application',
            action: async () => {
                await systemctl.stop('mexpress');
                return true;
            },
            validation: async () => {
                return !(await systemctl.isActive('mexpress'));
            },
            rollback: async () => {
                await systemctl.start('mexpress');
            }
        },
        {
            name: 'Database Backup',
            action: async () => {
                return await this.createDatabaseBackup();
            },
            validation: async () => {
                return await this.validateBackup();
            },
            rollback: async () => {
                await this.cleanupBackup();
            }
        }
    ];

    async execute(): Promise<boolean> {
        for (const step of this.steps) {
            const success = await this.executeStep(step);
            if (!success) {
                await this.rollback();
                return false;
            }
        }
        return true;
    }
}
```

#### 2.3.2 QA Integration Points
1. **Testing Requirements**
   - Unit test coverage > 85%
   - Integration test coverage > 80%
   - End-to-end test coverage > 75%
   - Performance test thresholds defined
   - Security scan requirements
   - Accessibility compliance tests

2. **Quality Gates**
```typescript
interface QualityGate {
    name: string;
    checks: Array<() => Promise<boolean>>;
    blocking: boolean;
}

const qualityGates: QualityGate[] = [
    {
        name: 'Code Quality',
        checks: [
            () => validateCodeCoverage(),
            () => validateCodeStyle(),
            () => validateDuplication()
        ],
        blocking: true
    },
    {
        name: 'Security',
        checks: [
            () => validateSecurityScan(),
            () => validateDependencies(),
            () => validateSecrets()
        ],
        blocking: true
    },
    {
        name: 'Performance',
        checks: [
            () => validateLoadTest(),
            () => validateResponseTimes(),
            () => validateResourceUsage()
        ],
        blocking: false
    }
];
```

3. **Continuous Integration**
```yaml
# CI Pipeline Integration
stages:
  - validate
  - test
  - security
  - performance
  - deploy

validate:
  script:
    - npm run lint
    - npm run type-check
    - npm run validate-deps

test:
  script:
    - npm run test:coverage
    - npm run test:integration
  coverage: '/Coverage: \d+.\d+%/'

security:
  script:
    - npm run security:scan
    - npm run security:audit
    - npm run security:secrets

performance:
  script:
    - npm run perf:load
    - npm run perf:stress
    - npm run perf:endurance

deploy:
  script:
    - npm run deploy:validate
    - npm run deploy:execute
    - npm run deploy:verify
```

## 2. Frontend Structure
[⬆ Back to Top](#table-of-contents)

### 2.1 Overview

A. Monorepo Organization

```plaintext
/opt/mexpress/
├── packages/
│   └── ui-components/          # Shared UI components
│       ├── src/
│       │   ├── components/     # Base components
│       │   │   ├── Button/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── Button.test.tsx
│       │   │   │   ├── Button.types.ts
│       │   │   │   └── Button.module.css
│       │   │   ├── Input/
│       │   │   └── Modal/
│       │   ├── hooks/         # Shared hooks
│       │   │   ├── useForm.ts
│       │   │   └── useApi.ts
│       │   └── styles/       # Component styles
│       │       ├── variables.css
│       │       └── themes/
│       └── tests/           # Component tests
└── projects/
    └── mexpress/
        └── frontend/        # Project-specific frontend
            ├── src/
            │   ├── components/    # Project components
            │   │   ├── forms/     # Form components
            │   │   │   ├── LoginForm/
            │   │   │   └── RegisterForm/
            │   │   ├── layouts/   # Layout components
            │   │   │   ├── MainLayout/
            │   │   │   └── DashboardLayout/
            │   │   └── features/  # Feature components
            │   │       ├── UserManagement/
            │   │       └── WorkflowBuilder/
            │   ├── context/      # Context providers
            │   │   ├── AuthContext/
            │   │   └── ThemeContext/
            │   ├── services/     # API services
            │   │   ├── api.ts
            │   │   └── auth.service.ts
            │   └── utils/        # Project utilities
            │       ├── validation.ts
            │       └── formatting.ts
            ├── public/          # Static files
            │   ├── images/
            │   └── fonts/
            ├── tests/          # Project tests
            │   ├── setup.ts
            │   └── mocks/
            └── config/         # Project config
                ├── vite.config.ts
                ├── tailwind.config.js
                └── jest.config.js
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

### 2.3 Quality Assurance Standards
#### 2.3.1 Accessibility Requirements
   - WCAG 2.1 AA compliance validation
   - Screen reader compatibility testing
   - Keyboard navigation testing
   - Color contrast verification

2. Performance Standards
   - First contentful paint < 1.5s
   - Time to interactive < 3.0s
   - Bundle size optimization
   - Memory usage monitoring

3. Testing Requirements
   - Component unit test coverage > 90%
   - Integration test coverage > 80%
   - Visual regression testing
   - Cross-browser compatibility

4. Documentation Requirements
   - Component API documentation
   - Style guide compliance
   - Usage examples
   - Accessibility guidelines

## 3. Database and Model Standards
[⬆ Back to Top](#table-of-contents)

### 3.1 Overview

A. Monorepo Model Organization
```plaintext
/opt/mexpress/
├── packages/
│   └── core/
│       └── src/
│           └── models/          # Core models
│               ├── base/        # Base model definitions
│               │   ├── Entity.ts
│               │   └── Audit.ts
│               ├── auth/        # Authentication models
│               │   ├── User.ts
│               │   └── Role.ts
│               └── common/      # Shared models
│                   ├── Address.ts
│                   └── Contact.ts
└── projects/
    └── mexpress/
        └── backend/
            └── src/
                └── models/      # Project-specific models
                    ├── business/
                    │   ├── Customer.ts
                    │   └── Order.ts
                    └── workflow/
                        ├── Task.ts
                        └── Process.ts
```

B. Schema Design Principles

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

### 3.3 Quality Assurance Standards
#### 3.3.1 Data Migration Standards
- Version control for migrations
- Rollback procedures
- Data integrity validation
- Performance impact assessment

#### 3.3.2 Quality Gates
- Schema validation checks
- Index optimization verification
- Query performance benchmarks
- Data consistency validation

#### 3.3.3 Monitoring Requirements
- Query performance thresholds
- Index usage metrics
- Resource utilization limits
- Error rate monitoring
