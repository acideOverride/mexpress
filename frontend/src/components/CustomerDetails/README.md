# CustomerDetails Component

A comprehensive customer details view component that displays customer information, status, devices, and activity timeline.

## Features

- Customer header with status indicator
- Contact information display
- Device list with status indicators
- Activity timeline
- Edit and delete actions
- Responsive design
- Accessibility compliant
- BEM methodology CSS

## Usage

```tsx
import CustomerDetails from './components/CustomerDetails';

// Example usage
const customer = {
  id: '123',
  name: 'John Doe',
  status: 'Active',
  email: 'john@example.com',
  phone: '+1234567890',
  devices: [
    { id: 'd1', name: 'iPhone 12', status: 'Connected' },
    { id: 'd2', name: 'MacBook Pro', status: 'Offline' }
  ],
  activities: [
    { 
      id: 'a1', 
      type: 'Call', 
      date: '2025-02-19T14:30:00', 
      description: 'Support call' 
    }
  ]
};

function App() {
  const handleEdit = (id: string) => {
    // Handle edit action
  };

  const handleDelete = (id: string) => {
    // Handle delete action
  };

  return (
    <CustomerDetails
      customer={customer}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| customer | Customer | Yes | Customer data object |
| onEdit | (id: string) => void | No | Callback for edit action |
| onDelete | (id: string) => void | No | Callback for delete action |

### Customer Object Structure

```typescript
interface Customer {
  id: string;
  name: string;
  status: string;
  email: string;
  phone: string;
  devices: Device[];
  activities: Activity[];
}

interface Device {
  id: string;
  name: string;
  status: string;
}

interface Activity {
  id: string;
  type: string;
  date: string;
  description: string;
}
```

## Styling

The component uses CSS Modules with BEM methodology. Key style features:

- Responsive design
- Status indicators with semantic colors
- Consistent spacing using design system tokens
- Accessible color contrast
- Mobile-first approach

## Accessibility

The component is fully accessible with:

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly content
- Focus management

## Test Coverage

Component has 100% test coverage including:

- Unit tests for all features
- Integration tests for user interactions
- Accessibility tests using jest-axe
- Visual regression tests
- Empty state handling tests

## Performance

The component is optimized for performance:

- Efficient re-renders
- Memoized callbacks
- Optimized status calculations
- Minimal DOM updates
- Responsive image handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Dependencies

- React 18+
- TypeScript 4.5+
- date-fns (for date formatting)
- CSS Modules
- Tailwind CSS

## Contributing

1. Follow BEM naming convention for CSS
2. Maintain test coverage
3. Ensure accessibility compliance
4. Update documentation
5. Follow TypeScript strict mode

## License

MIT