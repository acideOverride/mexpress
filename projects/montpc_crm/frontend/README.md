# MontPC CRM Frontend

MontPC CRM is a customer relationship management system for a PC repair business. It provides customer management, repair ticket tracking, and reporting features.

## Tech Stack

- **Frontend**: React (migrating to Vue.js), TypeScript, Vite
- **Styling**: Tailwind CSS
- **Build Tools**: Vite, TypeScript
- **Testing**: Jest, Vitest, Vue Test Utils
- **State Management**: Pinia (Vue), Context API (React)

## Vue.js Migration Status

The MontPC CRM frontend is currently being migrated from React to Vue.js. This migration follows the phased approach outlined in the [Vue Migration Guide](/docs/mexpress/VUE_MIGRATION_GUIDE.md).

### Current Status

#### Completed Components
- Base Vue.js application setup with router
- AppLayout component with navigation
- Dashboard component
- Customer management components:
  - CustomerList
  - CustomerDetail
  - CustomerForm
- Ticket management components:
  - TicketList
  - TicketDetail
  - TicketForm

#### In Progress
- Authentication components
- Reporting components
- State management integration
- Test suite setup

### Component Structure

The Vue.js components are organized following the structure defined in the migration guide:

```
src/
├── vue-components/           # Vue.js components
│   ├── App.vue               # Root component
│   ├── auth/                 # Authentication components
│   ├── common/               # Shared utility components
│   ├── customers/            # Customer management components
│   ├── dashboard/            # Dashboard components
│   ├── layout/               # Layout components
│   ├── tickets/              # Ticket management components
│   ├── router.ts             # Vue Router configuration
│   └── index.ts              # Component exports
```

### Test Structure

Tests for Vue components follow the project's priority-based organization structure:

```
tests/
├── frontend/
│   ├── p0/                   # Critical path tests
│   ├── p1/                   # Important feature tests
│   └── p2/                   # Secondary feature tests
```

## Development

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Testing

#### Run All Tests

```bash
npm test
```

#### Run Vue Component Tests

```bash
cd /opt/mExpress
./scripts/test_scripts/run-vue-component-tests.sh --vitest
```

Or using Jest:

```bash
./scripts/test_scripts/run-vue-component-tests.sh --jest
```

## Next Steps in Migration

1. Complete test suite for all Vue components
2. Implement remaining components:
   - Product management views
   - Advanced reporting views
   - Settings and administration views
3. Add Pinia state management integration
4. Update dashboard components to use D3.js visualization
5. Complete end-to-end tests for critical workflows
