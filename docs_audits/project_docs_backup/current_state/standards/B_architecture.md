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
