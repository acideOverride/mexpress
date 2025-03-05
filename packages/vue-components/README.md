# mExpress Vue Component Library

This package contains the Vue.js component library for the mExpress platform. It provides a set of reusable UI components, layouts, visualization charts, and utilities for building consistent user interfaces across mExpress applications.

## Features

- **Type Safety**: Full TypeScript support with proper type definitions
- **Composables**: Reusable composition functions for common patterns
- **Responsive Design**: Mobile-first approach with responsive components
- **Accessibility**: ARIA-compliant components for better accessibility
- **Themeable**: Support for light/dark modes and customizable themes
- **Visualizations**: Integrated D3.js chart components for data visualization

## Installation

```bash
# Install the package
npm install @mexpress/vue-components

# Or with yarn
yarn add @mexpress/vue-components
```

## Usage

### Register All Components Globally

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import MExpressComponents from '@mexpress/vue-components'

const app = createApp(App)
app.use(MExpressComponents)
app.mount('#app')
```

### Import Individual Components

```vue
<template>
  <div>
    <m-button variant="primary" @click="handleClick">Click Me</m-button>
    <m-input v-model="inputValue" label="Name" />
    <m-card title="Card Title">
      Card content goes here
    </m-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input, Card } from '@mexpress/vue-components'

const inputValue = ref('')
const handleClick = () => {
  console.log('Button clicked')
}
</script>
```

### Using Composables

```vue
<template>
  <form @submit="handleSubmit">
    <m-input 
      v-model="form.values.name"
      :error="form.errors.name"
      label="Name" 
    />
    <m-button type="submit" :loading="form.isSubmitting">Submit</m-button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@mexpress/vue-components'

const form = useForm({
  initialValues: {
    name: '',
    email: ''
  },
  validate: (values) => {
    const errors: Record<string, string> = {}
    if (!values.name) {
      errors.name = 'Name is required'
    }
    return Object.keys(errors).length ? errors : null
  },
  onSubmit: async (values) => {
    // Submit form data
    await api.saveUser(values)
  }
})
</script>
```

## Available Components

### UI Components

- `Button`: Versatile button component with various styles and states
- `Input`: Text input field with validation support
- `Card`: Content container with header, body, and footer sections
- `Checkbox`: Boolean selection component
- `Select`: Dropdown selection component
- `Toggle`: Switch component for binary choices

### Layout Components

- `DashboardLayout`: Main application layout with sidebar and content areas
- `Sidebar`: Navigation sidebar with collapsible items

### Visualization Components

- `BaseChart`: Foundation chart component with responsive resizing
- `BarChart`: Bar chart with vertical/horizontal orientation and grouped/stacked options

## Composables

- `useForm`: Form state management with validation
- `useTheme`: Theme switching and management

## Visualization Utilities

- `ThemeProvider`: Chart theming with light/dark mode support
- `TooltipManager`: Interactive tooltips for chart elements
- `LegendBuilder`: Chart legends with customizable styling

## Documentation

For detailed documentation on each component, see the component descriptions in the code or the generated documentation site.

## Development

### Requirements

- Node.js 16+
- npm or yarn

### Commands

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## License

Private - ©2025 mExpress