# MontPC CRM Vue Components

This directory contains the Vue.js implementation of the MontPC CRM frontend components. This is part of the ongoing migration from React to Vue.js.

## Structure

- `App.vue` - Root Vue component that manages the application layout
- `index.ts` - Entry point for the Vue app
- `router.ts` - Vue Router configuration
- `/auth` - Authentication-related components (Login, Register)
- `/common` - Shared utility components (LoadingSpinner, NotFound)
- `/dashboard` - Dashboard and metrics components
- `/layout` - Layout components (AppLayout)
- `/customers` - Customer management components (coming soon)
- `/tickets` - Ticket management components (coming soon)

## Running the Vue Frontend

You can run the Vue app in standalone mode:

```bash
npm run dev:vue
```

Or toggle between React and Vue implementations by visiting `/toggle.html` when running the standard dev server:

```bash
npm run dev
```

## Testing Vue Components

To run tests for Vue components:

```bash
npm run test:vue
```

For watch mode:

```bash
npm run test:vue:watch
```

## Migration Guidelines

When migrating a React component to Vue:

1. Create a corresponding `.vue` file in the appropriate subdirectory
2. Convert React patterns to Vue equivalents:
   - `useState()` → `ref()` / `reactive()`
   - `useEffect()` → `watch()` / `watchEffect()`
   - Props are almost identical, but use type-based prop validation
   - Use slots instead of `children`
   - Use `provide/inject` instead of Context API
   - Use `<style scoped>` for component-specific styles

3. Create a test file using the Vue test utils framework
4. Update component imports in the router configuration

## Integration with mExpress Vue Components

We're using the mExpress Vue component library for UI elements:

```typescript
// Import mExpress Vue components
import { Button, Card, Table } from '@mexpress/vue-components';
```

## Development Status

🚧 This Vue implementation is currently in progress. Currently completed:

- ✅ App structure and build setup
- ✅ Dashboard component
- ✅ Layout components
- ✅ Router configuration (basic)
- ✅ Framework toggle for parallel development

Next steps:

- Core components (customer views, ticket management)
- Form handling
- API integration
- Authentication flow