C. DEVELOPMENT STANDARDS

# development standards

VII. DEVELOPMENT PRINCIPLES:
[⬆ Back to Top](#table-of-contents)

# development principles

A. DRY (Don't Repeat Yourself)

1.  Shared Components in Monorepo

```typescript
// packages/ui-components/src/components/Button/index.tsx
export const Button = ({ children, ...props }) => (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    {...props}
  >
    {children}
  </button>
);

// projects/mexpress/frontend/src/pages/Page1.tsx
import { Button } from '@mexpress/ui-components';

const Page1 = () => <Button>Click Me</Button>;

// projects/mexpress/frontend/src/pages/Page2.tsx
import { Button } from '@mexpress/ui-components';

const Page2 = () => <Button>Submit</Button>;

// Bad Example - Duplicating shared components
// projects/mexpress/frontend/src/components/CustomButton.tsx
const CustomButton = ({ children, ...props }) => ( // Don't duplicate ui-components
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    {...props}
  >
    {children}
  </button>
);
```

2.  Shared Utilities in Monorepo

```typescript
// packages/utils/src/formatting/currency.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// packages/utils/src/validation/email.ts
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Using shared utilities in core package
// packages/core/src/services/payment.ts
import { formatCurrency } from '@mexpress/utils/formatting';

export class PaymentService {
  async processPayment(amount: number) {
    const formattedAmount = formatCurrency(amount);
    // Process payment...
  }
}

// Using shared utilities in project
// projects/mexpress/frontend/src/components/PaymentForm.tsx
import { validateEmail } from '@mexpress/utils/validation';
import { formatCurrency } from '@mexpress/utils/formatting';

export const PaymentForm = () => {
  const validateForm = (data: FormData) => {
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email');
    }
    // Validate other fields...
  };

  return (
    <div>
      <span>Amount: {formatCurrency(100)}</span>
      {/* Form fields */}
    </div>
  );
};
```

3.  Shared Hooks in Monorepo

```typescript
// packages/ui-components/src/hooks/useDebounce/index.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Using shared hooks in project components
// projects/mexpress/frontend/src/components/SearchBar.tsx
import { useDebounce } from '@mexpress/ui-components/hooks';

export const SearchBar = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // Use debounced value for API calls
    searchApi(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

// Bad Example - Duplicating shared hooks
// projects/mexpress/frontend/src/hooks/useCustomDebounce.ts
const useCustomDebounce = <T>(value: T, delay: number): T => { // Don't duplicate shared hooks
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
// Bad Example - Mixed responsibilities in core package
// packages/core/src/services/UserManager.ts
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

// Good Example - Separated responsibilities across packages
// packages/core/src/services/user/UserService.ts
class UserService {
  async createUser(userData: UserData) {
    /* ... */
  }
}

// packages/utils/src/validation/UserValidator.ts
class UserValidator {
  async validate(userData: UserData) {
    /* ... */
  }
}

// packages/core/src/services/email/EmailService.ts
class EmailService {
  async sendWelcomeEmail(email: string) {
    /* ... */
  }
}

// Using the services in project
// projects/mexpress/backend/src/controllers/UserController.ts
import { UserService } from '@mexpress/core/services/user';
import { UserValidator } from '@mexpress/utils/validation';
import { EmailService } from '@mexpress/core/services/email';

export class UserController {
  constructor(
    private userService: UserService,
    private validator: UserValidator,
    private emailService: EmailService
  ) {}

  async register(userData: UserData) {
    await this.validator.validate(userData);
    const user = await this.userService.createUser(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
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

G. Test Development Principles

1. Token-Efficient Testing
```typescript
// Good Example - Minimal Output
describe('UserService', () => {
  test('should validate credentials', async () => {
    const result = await service.validate(validInput);
    expect(result).toBe(true);
  });
});

// Bad Example - Verbose Output
describe('UserService', () => {
  test('should validate credentials', async () => {
    console.log('Testing validation...'); // Avoid console output
    const result = await service.validate(validInput);
    console.log('Result:', result); // Avoid logging results
    expect(result).toBe(true);
  });
});
```

2. Test Organization
```typescript
// Good Example - Focused Tests
describe('Authentication', () => {
  // Group related tests
  describe('login', () => {
    test('succeeds with valid credentials');
    test('fails with invalid password');
  });
});

// Bad Example - Mixed Concerns
describe('User Tests', () => {
  test('should do everything related to users'); // Too broad
});
```

3. Context Management
- Write focused, single-responsibility tests
- Avoid console.log statements
- Use minimal, focused assertions
- Break large test suites into smaller files

4. Token-Efficient Test Patterns
```typescript
// Good Example - Minimal Test Setup
describe('UserService', () => {
  // Shared minimal setup
  const testUser = { id: '1', name: 'test' }; // Only required fields

  test('creates user', async () => {
    const result = await service.create(testUser);
    expect(result.id).toBeDefined();
  });
});

// Bad Example - Verbose Test Setup
describe('UserService', () => {
  // Avoid large test data
  const testUser = {
    id: '1',
    name: 'test',
    profile: { /* large nested object */ },
    preferences: { /* more nested data */ }
  };

  beforeEach(() => {
    console.log('Setting up test...'); // Avoid logging
    // ... verbose setup
  });
});
```

5. Test Output Management
```typescript
// Good Example - Silent Tests
test('processes data', async () => {
  const result = await processor.run(data);
  expect(result.status).toBe('success');
});

// Bad Example - Noisy Tests
test('processes data', async () => {
  console.time('process'); // Avoid performance logging
  const result = await processor.run(data);
  console.timeEnd('process');
  console.log('Result:', result); // Avoid debug logging
  expect(result.status).toBe('success');
});
```

6. Test Data Management
```typescript
// Good Example - Minimal Test Data Factory
const createTestUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  // Only include required fields by default
  ...overrides
});

// Use in tests
test('updates user email', async () => {
  const user = createTestUser();
  const newEmail = 'new@example.com';
  const result = await updateEmail(user.id, newEmail);
  expect(result.email).toBe(newEmail);
});

// Bad Example - Excessive Test Data
const fullTestUser = {
  id: '1',
  email: 'test@example.com',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    address: {
      street: '123 Test St',
      city: 'Test City',
      // ... more unnecessary data
    }
  },
  preferences: {
    // ... more unnecessary data
  }
};
```
