# CustomerList Component

A reusable table-based component for displaying customer information with avatars, status badges, device tags, and action buttons.

## Features

- Responsive table layout
- Avatar display with customer name and email
- Status badge (active/inactive)
- Device tags
- Action buttons
- Accessibility support
- BEM methodology CSS
- CSS Modules for style isolation

## Usage

```tsx
import CustomerList from './components/CustomerList';
import { Customer } from './components/CustomerList/types';

const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: '/avatars/john.jpg',
    status: 'active',
    devices: ['iPhone', 'MacBook'],
    email: 'john@example.com'
  }
];

const MyComponent = () => {
  const handleRowClick = (customerId: string) => {
    console.log(`Row clicked: ${customerId}`);
  };

  const handleAction = (customerId: string, action: string) => {
    console.log(`Action ${action} clicked for customer: ${customerId}`);
  };

  return (
    <CustomerList
      customers={customers}
      onRowClick={handleRowClick}
      onAction={handleAction}
    />
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| customers | Customer[] | Yes | Array of customer data to display |
| onRowClick | (customerId: string) => void | No | Callback when a row is clicked |
| onAction | (customerId: string, action: string) => void | No | Callback when an action button is clicked |
| className | string | No | Additional CSS class name |

## Customer Type

```typescript
interface Customer {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'inactive';
  devices: string[];
  email: string;
}
```

## Styling

The component uses CSS Modules with BEM methodology. The main classes are:

- `customer-list__container`: Main wrapper
- `customer-list__table`: Table element
- `customer-list__row`: Table row
- `customer-list__cell`: Table cell
- `customer-list__status-badge`: Status indicator
- `customer-list__device-tag`: Device label
- `customer-list__action-button`: Action buttons

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly structure
- High contrast status indicators
- Focus management for interactive elements

## Performance

- Optimized rendering with React.FC
- Efficient event handling
- Responsive image loading
- CSS-based animations
- Minimal DOM updates

## Test Coverage

The component includes comprehensive tests:

- Unit tests for all features
- Integration tests for user interactions
- Accessibility tests
- Responsive layout tests
- Edge cases (empty state, long content)

Current test coverage: 100%

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Dependencies

- React 17+
- TypeScript 4.5+
- @heroicons/react
- CSS Modules

## Contributing

1. Follow BEM methodology for CSS
2. Maintain test coverage
3. Update documentation
4. Follow accessibility guidelines
5. Consider mobile responsiveness

## License

MIT