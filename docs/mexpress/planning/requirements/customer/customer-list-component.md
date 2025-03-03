# Customer List Component

## Overview

The Customer List component displays a paginated list of customers with sorting, filtering, and search capabilities. It supports selection for bulk actions, status display, and customizable actions per customer.

## Features

- Table-based layout with consistent styling
- Avatar component standardization
- Status badge implementation
- Device tag components
- Action button placement
- Responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Full test coverage

## Implementation

```typescript
interface CustomerListProps {
  customers: Customer[];
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: CustomerFilters) => void;
  onSearch?: (term: string) => void;
  onSelect?: (selectedIds: string[]) => void;
  onAction?: (action: string, customerId: string) => void;
  loading?: boolean;
  error?: Error;
}
```

## Usage

```tsx
import { CustomerList } from '@mexpress/ui-components';

function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const handleSort = (field, direction) => {
    // Implementation
  };
  
  const handleAction = (action, customerId) => {
    // Implementation
  };
  
  return (
    <CustomerList 
      customers={customers}
      onSort={handleSort}
      onAction={handleAction}
    />
  );
}
```

## Performance Considerations

- Virtualized scrolling for large lists
- Optimized rendering with memoization
- Lazy loading images
- Debounced search input

## Accessibility Features

- Proper ARIA attributes
- Keyboard navigation
- High contrast mode support
- Screen reader testing

## Location

`projects/montpc_crm/frontend/src/components/customers/CustomerList.tsx`