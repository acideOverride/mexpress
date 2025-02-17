# Component: Mega Search

## Overview

### Purpose
High-performance, real-time search interface providing immediate access to key system entities with sub-500ms response time.

### Use Cases
- Quick customer lookup
- Product search
- Repair request search
- Global system search

### Variations
- Collapsed (default)
- Expanded (with results)
- Loading state
- Error state

## Specifications

### Size Variations
```css
/* Search Input */
--search-height-default: 48px;
--search-width-collapsed: 320px;
--search-width-expanded: 640px;

/* Results Panel */
--results-max-height: 480px;
--results-width: var(--search-width-expanded);
```

### States
1. Collapsed (Default)
   - Single search input
   - Search icon
   - Placeholder text
   - Focus state

2. Expanded (Active)
   - Enlarged search area
   - Results categories
   - Quick actions visible
   - Keyboard navigation enabled

3. Loading
   - Subtle loading indicator
   - Progressive result loading
   - Maintain input interaction
   - Preview placeholders

4. Error
   - Error message display
   - Retry action
   - Fallback suggestions
   - Support contact

## Behavior

### Activation
```typescript
interface SearchActivation {
  triggerLength: 2; // characters
  debounceTime: 150; // milliseconds
  activationTime: '<100ms';
}
```

### Results Display
```typescript
interface SearchResults {
  displayTime: '<500ms';
  categories: [
    'Customers',
    'Products',
    'Repair Requests',
    'Other'
  ];
  maxResults: {
    perCategory: 5,
    total: 20
  };
}
```

### Quick Actions
```typescript
interface QuickActions {
  actions: [
    'Create Customer',
    'Create Product',
    'Create Repair Request'
  ];
  position: 'bottom';
  displayStyle: 'button';
}
```

## Accessibility

### Keyboard Navigation
- `/` shortcut to focus search
- Arrow keys for result navigation
- Enter to select
- Esc to close
- Tab for quick actions

### ARIA Attributes
```html
<div role="search">
  <input 
    aria-expanded="false"
    aria-controls="search-results"
    aria-activedescendant="selected-option"
  />
  <div 
    role="listbox"
    id="search-results"
    aria-label="Search Results"
  >
    <!-- Result categories -->
  </div>
</div>
```

### Screen Reader Support
- Result count announcements
- Category headers
- Selection updates
- Loading state notifications
- Error announcements

## Performance

### Optimization Strategies
1. Client-side
   - Result caching
   - Debounced input
   - Progressive loading
   - Virtual scrolling

2. Network
   - Request batching
   - Response compression
   - Partial results
   - Background prefetch

### Metrics
```typescript
interface PerformanceMetrics {
  inputLatency: '<50ms';
  searchActivation: '<100ms';
  firstResult: '<500ms';
  scrolling: '60fps';
}
```

## Implementation Guidelines

### Do's
- Implement keyboard navigation
- Show loading states
- Cache recent results
- Provide clear feedback
- Support offline fallback

### Don'ts
- Block user input
- Show empty categories
- Delay UI feedback
- Hide error states
- Interrupt typing

## Error Handling

### Error States
1. Network Error
   - Retry option
   - Offline search
   - Clear error message
   - Recovery action

2. No Results
   - Helpful message
   - Search suggestions
   - Alternative actions
   - Clear next steps

3. Rate Limiting
   - User feedback
   - Cooldown period
   - Alternative search
   - Help contact

## Usage Examples

### Basic Implementation
```typescript
<MegaSearch
  debounceTime={150}
  minChars={2}
  categories={['customers', 'products', 'repairs']}
  quickActions={['createCustomer', 'createProduct']}
  onSelect={(result) => handleSelection(result)}
/>
```

### With Custom Styling
```typescript
<MegaSearch
  className="custom-search"
  resultClassName="custom-results"
  theme={{
    background: 'var(--color-surface)',
    text: 'var(--color-text-primary)',
    accent: 'var(--color-primary-500)'
  }}
/>
```

## Dependencies
- Design Tokens
- Typography System
- Color System
- Icon System
- Animation System

## Version History

### v1.0.0 (2025-02-05)
- Initial implementation
- Core search functionality
- Category support
- Quick actions
- Keyboard navigation