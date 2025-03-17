<template>
  <button 
    class="action-button" 
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      iconOnly && 'icon-only',
      disabled && 'disabled',
      loading && 'loading'
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- Leading Icon -->
    <span v-if="icon && !iconOnly && !loading" class="icon icon-leading">
      <slot name="icon">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          :width="iconSize" 
          :height="iconSize" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <component :is="iconComponent" />
        </svg>
      </slot>
    </span>
    
    <!-- Icon Only -->
    <span v-if="iconOnly && !loading" class="icon">
      <slot name="icon">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          :width="iconSize" 
          :height="iconSize" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <component :is="iconComponent" />
        </svg>
      </slot>
    </span>
    
    <!-- Loading Spinner -->
    <span v-if="loading" class="spinner"></span>
    
    <!-- Button Text (not shown for icon-only) -->
    <span v-if="!iconOnly" class="label">
      <slot>{{ label }}</slot>
    </span>
    
    <!-- Trailing Icon -->
    <span v-if="trailingIcon && !iconOnly && !loading" class="icon icon-trailing">
      <slot name="trailing-icon">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          :width="iconSize" 
          :height="iconSize" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <component :is="trailingIconComponent" />
        </svg>
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Types
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonIcon = 
  | 'plus'
  | 'edit'
  | 'trash'
  | 'check'
  | 'x'
  | 'arrow-right'
  | 'arrow-left'
  | 'settings'
  | 'user'
  | 'search'
  | 'bell'
  | 'menu'
  | 'refresh'
  | 'more'
  | 'filter'
  | 'grid'
  | 'list'
  | 'folder'
  | 'download'
  | 'upload'
  | 'calendar'
  | 'mail'
  | 'phone'
  | 'star';

// Props
const props = withDefaults(defineProps<{
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  icon?: ButtonIcon;
  trailingIcon?: ButtonIcon;
  iconOnly?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>(), {
  label: '',
  variant: 'primary',
  size: 'md',
  type: 'button',
  iconOnly: false,
  disabled: false,
  loading: false
});

// Emits
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

// Computed
const iconSize = computed(() => {
  switch (props.size) {
    case 'xs': return 14;
    case 'sm': return 16;
    case 'lg': return 20;
    case 'xl': return 22;
    default: return 18; // medium
  }
});

const iconComponent = computed(() => {
  if (!props.icon) return null;
  
  switch (props.icon) {
    case 'plus':
      return {
        render() {
          return (
            <>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </>
          )
        }
      };
    case 'edit':
      return {
        render() {
          return (
            <>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </>
          )
        }
      };
    case 'trash':
      return {
        render() {
          return (
            <>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </>
          )
        }
      };
    case 'check':
      return {
        render() {
          return <polyline points="20 6 9 17 4 12" />
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
    case 'arrow-right':
      return {
        render() {
          return (
            <>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </>
          )
        }
      };
    case 'arrow-left':
      return {
        render() {
          return (
            <>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </>
          )
        }
      };
    case 'settings':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </>
          )
        }
      };
    case 'user':
      return {
        render() {
          return (
            <>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </>
          )
        }
      };
    case 'search':
      return {
        render() {
          return (
            <>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </>
          )
        }
      };
    case 'bell':
      return {
        render() {
          return (
            <>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </>
          )
        }
      };
    case 'menu':
      return {
        render() {
          return (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )
        }
      };
    case 'refresh':
      return {
        render() {
          return (
            <>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </>
          )
        }
      };
    case 'more':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </>
          )
        }
      };
    case 'filter':
      return {
        render() {
          return <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        }
      };
    case 'grid':
      return {
        render() {
          return (
            <>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </>
          )
        }
      };
    case 'list':
      return {
        render() {
          return (
            <>
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </>
          )
        }
      };
    case 'folder':
      return {
        render() {
          return <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        }
      };
    case 'download':
      return {
        render() {
          return (
            <>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </>
          )
        }
      };
    case 'upload':
      return {
        render() {
          return (
            <>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </>
          )
        }
      };
    case 'calendar':
      return {
        render() {
          return (
            <>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </>
          )
        }
      };
    case 'mail':
      return {
        render() {
          return (
            <>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </>
          )
        }
      };
    case 'phone':
      return {
        render() {
          return <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        }
      };
    case 'star':
      return {
        render() {
          return <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        }
      };
    default:
      return null;
  }
});

const trailingIconComponent = computed(() => {
  if (!props.trailingIcon) return null;
  
  switch (props.trailingIcon) {
    // Reuse the same icon mapping as the main icon
    case 'plus':
    case 'edit':
    case 'trash':
    case 'check':
    case 'x':
    case 'arrow-right':
    case 'arrow-left':
    case 'settings':
    case 'user':
    case 'search':
    case 'bell':
    case 'menu':
    case 'refresh':
    case 'more':
    case 'filter':
    case 'grid':
    case 'list':
    case 'folder':
    case 'download':
    case 'upload':
    case 'calendar':
    case 'mail':
    case 'phone':
    case 'star':
      return iconComponent.value;
    default:
      return null;
  }
});

// Methods
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
/* Base Button Styles */
.action-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  cursor: pointer;
  gap: 0.5rem;
  white-space: nowrap;
  outline: none;
}

.action-button:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Button Sizes */
.size-xs {
  height: 1.75rem;
  padding: 0 0.625rem;
  font-size: 0.75rem;
  min-width: 1.75rem;
}

.size-sm {
  height: 2.25rem;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  min-width: 2.25rem;
}

.size-md {
  height: 2.5rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  min-width: 2.5rem;
}

.size-lg {
  height: 2.75rem;
  padding: 0 1.25rem;
  font-size: 0.9375rem;
  min-width: 2.75rem;
}

.size-xl {
  height: 3rem;
  padding: 0 1.5rem;
  font-size: 1rem;
  min-width: 3rem;
}

/* Icon Only Buttons */
.icon-only {
  padding: 0;
  justify-content: center;
  aspect-ratio: 1/1;
}

/* Button Variants */
.variant-primary {
  background-color: var(--accent-color);
  color: white;
}

.variant-primary:hover:not(:disabled):not(.loading) {
  background-color: var(--accent-color-light);
}

.variant-primary:active:not(:disabled):not(.loading) {
  background-color: var(--accent-color);
  transform: scale(0.98);
}

.variant-secondary {
  background-color: var(--sidebar-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.variant-secondary:hover:not(:disabled):not(.loading) {
  background-color: var(--sidebar-active);
}

.variant-secondary:active:not(:disabled):not(.loading) {
  background-color: var(--sidebar-hover);
  transform: scale(0.98);
}

.variant-success {
  background-color: var(--success-color);
  color: white;
}

.variant-success:hover:not(:disabled):not(.loading) {
  filter: brightness(1.1);
}

.variant-success:active:not(:disabled):not(.loading) {
  filter: brightness(1);
  transform: scale(0.98);
}

.variant-warning {
  background-color: var(--warning-color, #f59e0b);
  color: white;
}

.variant-warning:hover:not(:disabled):not(.loading) {
  filter: brightness(1.1);
}

.variant-warning:active:not(:disabled):not(.loading) {
  filter: brightness(1);
  transform: scale(0.98);
}

.variant-danger {
  background-color: var(--error-color, #ef4444);
  color: white;
}

.variant-danger:hover:not(:disabled):not(.loading) {
  filter: brightness(1.1);
}

.variant-danger:active:not(:disabled):not(.loading) {
  filter: brightness(1);
  transform: scale(0.98);
}

.variant-info {
  background-color: var(--info-color, #0ea5e9);
  color: white;
}

.variant-info:hover:not(:disabled):not(.loading) {
  filter: brightness(1.1);
}

.variant-info:active:not(:disabled):not(.loading) {
  filter: brightness(1);
  transform: scale(0.98);
}

.variant-ghost {
  background-color: transparent;
  color: var(--text-secondary);
}

.variant-ghost:hover:not(:disabled):not(.loading) {
  background-color: var(--sidebar-hover);
  color: var(--text-primary);
}

.variant-ghost:active:not(:disabled):not(.loading) {
  background-color: var(--sidebar-hover);
  transform: scale(0.98);
}

.variant-link {
  background-color: transparent;
  color: var(--accent-color);
  padding: 0;
  height: auto;
  min-width: auto;
  text-decoration: none;
}

.variant-link:hover:not(:disabled):not(.loading) {
  text-decoration: underline;
  color: var(--accent-color-light);
}

.variant-link:active:not(:disabled):not(.loading) {
  color: var(--accent-color);
  transform: translateY(1px);
}

/* Disabled State */
.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading State */
.loading {
  cursor: wait;
}

.loading .label {
  opacity: 0;
}

.spinner {
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Icon styles */
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-leading {
  margin-right: -0.125rem;
}

.icon-trailing {
  margin-left: -0.125rem;
}
</style>