<template>
  <span 
    class="status-badge" 
    :class="[
      `variant-${variant}`,
      size && `size-${size}`,
      rounded && 'rounded',
      outline && 'outline',
      icon && 'with-icon'
    ]"
  >
    <svg 
      v-if="icon" 
      class="badge-icon" 
      xmlns="http://www.w3.org/2000/svg" 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <component :is="iconComponent" />
    </svg>
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Types
type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeIcon = 
  | 'check'
  | 'x'
  | 'alert-circle'
  | 'alert-triangle'
  | 'info'
  | 'clock'
  | 'pause'
  | 'play';

// Props
const props = withDefaults(defineProps<{
  variant?: BadgeVariant;
  size?: BadgeSize;
  text?: string;
  rounded?: boolean;
  outline?: boolean;
  icon?: BadgeIcon;
}>(), {
  variant: 'primary',
  size: 'md',
  text: '',
  rounded: false,
  outline: false
});

// Computed
const iconComponent = computed(() => {
  switch (props.icon) {
    case 'check':
      return {
        render() {
          return (
            <path d="M20 6L9 17l-5-5" />
          )
        }
      };
    case 'x':
      return {
        render() {
          return (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          )
        }
      };
    case 'alert-circle':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
          )
        }
      };
    case 'alert-triangle':
      return {
        render() {
          return (
            <>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </>
          )
        }
      };
    case 'info':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </>
          )
        }
      };
    case 'clock':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </>
          )
        }
      };
    case 'pause':
      return {
        render() {
          return (
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          )
        }
      };
    case 'play':
      return {
        render() {
          return (
            <polygon points="5 3 19 12 5 21 5 3" />
          )
        }
      };
    default:
      return null;
  }
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
}

/* Size variants */
.size-sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.size-md {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.size-lg {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
}

/* Rounded variant */
.rounded {
  border-radius: 9999px !important;
}

/* Icon styling */
.badge-icon {
  margin-right: 0.25rem;
}

.with-icon {
  padding-left: 0.375rem;
}

.size-sm.with-icon .badge-icon {
  width: 10px;
  height: 10px;
  margin-right: 0.125rem;
}

.size-lg.with-icon .badge-icon {
  width: 14px;
  height: 14px;
  margin-right: 0.375rem;
}

/* Color Variants - Solid */
.variant-primary {
  background-color: var(--accent-color, #2563eb);
  color: white;
}

.variant-success {
  background-color: var(--success-color, #10b981);
  color: white;
}

.variant-warning {
  background-color: var(--warning-color, #f59e0b);
  color: white;
}

.variant-error {
  background-color: var(--error-color, #ef4444);
  color: white;
}

.variant-info {
  background-color: var(--info-color, #0ea5e9);
  color: white;
}

.variant-neutral {
  background-color: var(--neutral-color, #6b7280);
  color: white;
}

/* Color Variants - Outline */
.variant-primary.outline {
  background-color: transparent;
  color: var(--accent-color, #2563eb);
  border: 1px solid var(--accent-color, #2563eb);
}

.variant-success.outline {
  background-color: transparent;
  color: var(--success-color, #10b981);
  border: 1px solid var(--success-color, #10b981);
}

.variant-warning.outline {
  background-color: transparent;
  color: var(--warning-color, #f59e0b);
  border: 1px solid var(--warning-color, #f59e0b);
}

.variant-error.outline {
  background-color: transparent;
  color: var(--error-color, #ef4444);
  border: 1px solid var(--error-color, #ef4444);
}

.variant-info.outline {
  background-color: transparent;
  color: var(--info-color, #0ea5e9);
  border: 1px solid var(--info-color, #0ea5e9);
}

.variant-neutral.outline {
  background-color: transparent;
  color: var(--neutral-color, #6b7280);
  border: 1px solid var(--neutral-color, #6b7280);
}
</style>