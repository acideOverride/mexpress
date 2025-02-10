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
