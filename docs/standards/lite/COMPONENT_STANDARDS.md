# Component Standards (Lite Version)

This document outlines the essential standards for component development across mExpress projects, focusing on Vue.js with some guidance for React components when needed.

## Component Organization

### File Structure

```
ComponentName.vue          # Main component file
ComponentName.test.ts      # Test file (in appropriate test directory)
ComponentName.types.ts     # Type definitions (optional, for complex components)
ComponentName.scss         # Styles (if not using scoped styles in the component)
```

### Component Naming

- **Vue Components**: Use PascalCase for component names and filenames
  - ✅ `UserAvatar.vue`, `StatusCard.vue`, `DataTable.vue`
  - ❌ `user-avatar.vue`, `statusCard.vue`, `data_table.vue`

- **Component Directories**: Use kebab-case for directories
  - ✅ `user-management/`, `data-visualization/`
  - ❌ `UserManagement/`, `dataVisualization/`

## Vue Component Structure

### Standard Component Layout

```vue
<script lang="ts">
// 1. Imports
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { PropType } from 'vue';
import { StatusType } from '@/types';

// 2. Component definition
export default defineComponent({
  name: 'ComponentName',
  
  // 3. Props with validation and types
  props: {
    status: {
      type: String as PropType<StatusType>,
      required: true,
      validator: (value: string) => ['active', 'pending', 'completed'].includes(value)
    },
    label: {
      type: String,
      default: ''
    }
  },
  
  // 4. Emits with validation
  emits: {
    'status-change': (newStatus: StatusType) => typeof newStatus === 'string'
  },
  
  // 5. Component logic
  setup(props, { emit }) {
    // State
    const count = ref(0);
    
    // Computed properties
    const formattedLabel = computed(() => `Status: ${props.label}`);
    
    // Methods
    const incrementCount = () => {
      count.value++;
    };
    
    const handleStatusChange = (newStatus: StatusType) => {
      emit('status-change', newStatus);
    };
    
    // Lifecycle hooks
    onMounted(() => {
      console.log('Component mounted');
    });
    
    // Expose to template
    return {
      count,
      formattedLabel,
      incrementCount,
      handleStatusChange
    };
  }
});
</script>

<template>
  <div class="component-name">
    <h2>{{ formattedLabel }}</h2>
    <div class="status" :class="status">
      {{ status }}
    </div>
    <div class="counter">
      <span>{{ count }}</span>
      <button @click="incrementCount">Increment</button>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped lang="scss">
.component-name {
  padding: 16px;
  border-radius: 4px;
  
  .status {
    padding: 4px 8px;
    border-radius: 4px;
    
    &.active {
      background-color: var(--color-success);
    }
    
    &.pending {
      background-color: var(--color-warning);
    }
    
    &.completed {
      background-color: var(--color-info);
    }
  }
}
</style>
```

## Component Composition API

- Always use the Composition API with `<script lang="ts">` and `defineComponent`
- Use `ref` for primitive values and `reactive` for objects
- Prefer `computed` properties over methods for derived values
- Use TypeScript for props definitions with `PropType`
- Always define emitted events with `emits` option

## Props and Events

### Props Guidelines

- Always define types for props using TypeScript
- Provide default values when appropriate
- Use validators for enum-like values
- Document props with JSDoc comments for better IDE support
- Use `required: true` for mandatory props

```typescript
props: {
  /**
   * The type of status to display
   * @values 'active', 'pending', 'completed'
   */
  status: {
    type: String as PropType<StatusType>,
    required: true,
    validator: (value: string) => ['active', 'pending', 'completed'].includes(value)
  }
}
```

### Events Guidelines

- Use kebab-case for event names
- Document events with JSDoc comments
- Define event payload types
- Validate emitted values when possible

```typescript
/**
 * Emitted when the status changes
 * @param {StatusType} newStatus - The new status value
 */
emits: {
  'status-change': (newStatus: StatusType) => typeof newStatus === 'string'
}
```

## Styling

- Use scoped styles with SCSS: `<style scoped lang="scss">`
- Use CSS variables for theming
- Follow BEM naming convention for classes
- Ensure responsive design with media queries
- Avoid inline styles

```scss
<style scoped lang="scss">
.card {
  &__header {
    font-size: var(--font-size-large);
  }
  
  &__content {
    padding: var(--spacing-medium);
  }
  
  &--highlighted {
    border: 1px solid var(--color-primary);
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-small);
  }
}
</style>
```

## Component Testing

- Test components in isolation
- Create tests for each prop and event
- Test different component states
- Include accessibility testing when relevant
- Document component usage in tests

```typescript
import { mount } from '@vue/test-utils';
import ComponentName from '@/components/ComponentName.vue';

describe('ComponentName.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(ComponentName, {
      props: {
        status: 'active'
      }
    });
    
    expect(wrapper.find('.status').text()).toBe('active');
    expect(wrapper.find('.status').classes()).toContain('active');
  });
  
  it('emits status-change event when status changes', async () => {
    const wrapper = mount(ComponentName, {
      props: {
        status: 'active'
      }
    });
    
    await wrapper.find('.status').trigger('click');
    
    expect(wrapper.emitted('status-change')).toBeTruthy();
    expect(wrapper.emitted('status-change')[0]).toEqual(['pending']);
  });
});
```

## Component Documentation

- Include a brief description at the top of each component file
- Document props, events, and slots
- Provide usage examples
- Document any dependencies or requirements

```typescript
/**
 * StatusCard - A reusable card that displays a status with colored indicators
 * 
 * @component
 * 
 * @example
 * <StatusCard 
 *   status="active" 
 *   label="User Account"
 *   @status-change="handleStatusChange" 
 * />
 */
```

## Performance Considerations

- Use computed properties for derived data
- Implement `v-once` for static content
- Use `v-memo` to prevent unnecessary re-renders
- Keep component responsibilities focused
- Use `shallowRef` for large objects that don't need reactivity

## Accessibility

- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Support screen readers with appropriate text
- Test with accessibility tools

## Common Patterns

### Loading States

```vue
<template>
  <div class="component">
    <div v-if="loading" class="component__loading">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="component__error">
      {{ error }}
    </div>
    <div v-else class="component__content">
      <!-- Actual content -->
    </div>
  </div>
</template>
```

### Empty States

```vue
<template>
  <div class="data-list">
    <div v-if="items.length === 0" class="data-list__empty">
      <EmptyState
        icon="list"
        title="No items found"
        description="Try changing your search criteria"
      />
    </div>
    <div v-else class="data-list__items">
      <!-- List items -->
    </div>
  </div>
</template>
```

### Slots Usage

```vue
<template>
  <div class="card">
    <div class="card__header">
      <slot name="header">
        <h2>{{ title }}</h2>
      </slot>
    </div>
    <div class="card__content">
      <slot></slot>
    </div>
    <div class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```