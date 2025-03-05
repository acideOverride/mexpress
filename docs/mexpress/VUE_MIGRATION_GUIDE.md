# Vue.js Migration Implementation Guide

This document provides guidelines and best practices for migrating from React to Vue.js across the mExpress platform and MontPC CRM project.

## Table of Contents
1. [Migration Approach](#migration-approach)
2. [Component Conversion Guidelines](#component-conversion-guidelines)
3. [Testing Strategy](#testing-strategy)
4. [Vue Project Structure](#vue-project-structure)
5. [Shared Component Library](#shared-component-library)
6. [State Management](#state-management)

## Migration Approach

### Phased Migration Strategy
1. **Component Library First**
   - Start with creating core UI components (Button, Input, Card, etc.)
   - Establish design system patterns
   - Create full test coverage for each component

2. **Layout & Navigation Second**
   - Build dashboard layouts and navigation structure
   - Implement responsive design patterns
   - Create router configuration

3. **Feature Components Third**
   - Migrate domain-specific components by feature area
   - Start with most frequently used components
   - Implement based on priority (customer views → repair views → product views)

4. **Non-Blocking Implementation**
   - Run React and Vue implementations in parallel during transition
   - Use feature flags to control which implementation is active
   - Test both implementations simultaneously

## Component Conversion Guidelines

### React to Vue Conversion Patterns

| React Pattern | Vue Equivalent | Notes |
|---------------|----------------|-------|
| `useState()` | `ref()` / `reactive()` | Use `ref()` for primitives, `reactive()` for objects |
| `useEffect()` | `watch()` / `watchEffect()` | Use `watch()` for specific dependencies, `watchEffect()` for automatic tracking |
| Props | Props | Almost identical, but Vue uses type-based prop validation |
| Children | Slots | Use named slots for multiple insertion points |
| `React.memo()` | `defineComponent()` | Vue components are optimized by default |
| Context API | Provide/Inject | Similar pattern but with improved type safety |
| CSS-in-JS | Scoped CSS | Use `<style scoped>` or CSS modules |

### TypeScript Integration
- Use Vue's `defineComponent()` to ensure proper type inference
- Create explicit prop type interfaces for all components
- Use `PropType<T>` for complex prop types
- Define explicit emits with proper typing

```typescript
// Example component with TypeScript
import { defineComponent, PropType } from 'vue'

interface User {
  id: number
  name: string
}

export default defineComponent({
  name: 'UserCard',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update': (user: User) => true
  },
  setup(props, { emit }) {
    // Component logic...
    
    return {
      // Template bindings...
    }
  }
})
```

## Testing Strategy

### Test First Approach
1. **Tests before implementation**
   - Create test file with expected behavior
   - Run test to verify it fails appropriately
   - Implement component to make test pass
   - Run test again to verify passing

2. **Test Documentation**
   - Before implementing a test, add it to the TESTS.md file
   - Include test metadata (priority, BRQ mapping, location, status)
   - After test passes, update TESTS.md with passing status

3. **Test Organization**
   - Keep tests in the canonical location from the start
   - Maintain priority-based organization (P0-P3)
   - Ensure clear BRQ mapping for all tests

### Vue Component Testing

```typescript
// Example Vue component test
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from './Button.vue'

describe('Button Component', () => {
  it('renders with correct text', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Click Me'
      }
    })
    
    expect(wrapper.text()).toContain('Click Me')
  })
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(Button)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
```

## Vue Project Structure

### Directory Structure
```
src/
├── assets/                # Static assets
├── components/            # Shared components
│   ├── ui/                # Generic UI components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── composables/           # Reusable Vue composition functions
├── router/                # Vue Router configuration
├── stores/                # Pinia stores
├── views/                 # Page components
├── services/              # API and external services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── App.vue                # Root component
```

### Naming Conventions
- **Components**: PascalCase for component names and files (Button.vue)
- **Composables**: camelCase prefixed with 'use' (useSearch.ts)
- **Stores**: camelCase (customerStore.ts)
- **Types**: PascalCase (CustomerData.ts)
- **Services**: camelCase (apiService.ts)

## Shared Component Library

### Core UI Components
1. **Foundation**
   - Colors, typography, spacing
   - Accessibility utilities
   - Responsive mixins

2. **Atoms**
   - Button
   - Input
   - Checkbox
   - Radio
   - Select
   - Toggle

3. **Molecules**
   - Form fields with labels
   - Search input
   - Pagination
   - Tabs
   - Modal
   - Dropdown

4. **Organisms**
   - Form groups
   - Data tables
   - Navigation bars
   - Cards
   - Drawers
   - Notifications

### Component Documentation
- Document each component with:
  - Usage examples
  - Prop definitions
  - Emitted events
  - Slots
  - Edge cases

## State Management

### Pinia Store Structure
- Organize stores by domain (customer, repair, product)
- Use composition API for defining stores
- Implement strong typing for state and actions
- Separate API calls into service layer

```typescript
// Example Pinia store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer } from '@/types/Customer'
import { customerService } from '@/services/customerService'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const customerCount = computed(() => customers.value.length)
  
  // Actions
  async function fetchCustomers() {
    isLoading.value = true
    error.value = null
    
    try {
      customers.value = await customerService.getCustomers()
    } catch (err) {
      error.value = 'Failed to fetch customers'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  async function getCustomerById(id: number) {
    isLoading.value = true
    error.value = null
    
    try {
      currentCustomer.value = await customerService.getCustomerById(id)
    } catch (err) {
      error.value = 'Failed to fetch customer'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    // State
    customers,
    currentCustomer,
    isLoading,
    error,
    
    // Getters
    customerCount,
    
    // Actions
    fetchCustomers,
    getCustomerById
  }
})
```

## Migration Checklist

### Setup Phase
- [ ] Initialize Vue 3 project with TypeScript
- [ ] Configure Vue Test Utils and testing framework
- [ ] Set up component library structure
- [ ] Configure build and bundling process
- [ ] Establish CI/CD pipeline for Vue components

### Component Library Phase
- [ ] Create design system tokens (colors, spacing, typography)
- [ ] Implement core UI components (at least 8-10 base components)
- [ ] Write tests for all components
- [ ] Document components with usage examples
- [ ] Create storybook or similar component showcase

### Layout and Navigation Phase
- [ ] Implement responsive grid system
- [ ] Create main dashboard layout
- [ ] Build navigation components (sidebar, top nav)
- [ ] Implement routing with Vue Router
- [ ] Create layout utility components

### Feature Implementation Phase
- [ ] Migrate customer management components
- [ ] Migrate repair management components
- [ ] Migrate product catalog components
- [ ] Implement MegaSearch components
- [ ] Create dashboard visualization components