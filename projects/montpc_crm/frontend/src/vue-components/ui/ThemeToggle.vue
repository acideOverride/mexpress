<template>
  <button 
    class="theme-toggle" 
    :class="[
      `size-${size}`,
      variant && `variant-${variant}`,
      currentTheme
    ]"
    @click="cycleTheme"
    type="button"
    aria-label="Toggle theme"
  >
    <!-- Light theme icon -->
    <svg 
      v-if="currentTheme === 'light'" 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="icon icon-sun"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    
    <!-- Dark theme icon -->
    <svg 
      v-else-if="currentTheme === 'dark'" 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="icon icon-moon"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    
    <!-- Night-shift theme icon -->
    <svg 
      v-else
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      class="icon icon-eye"
    >
      <path d="M12 2 L12 6" />
      <path d="M12 18 L12 22" />
      <path d="M4.93 4.93 L7.76 7.76" />
      <path d="M16.24 16.24 L19.07 19.07" />
      <path d="M2 12 L6 12" />
      <path d="M18 12 L22 12" />
      <path d="M4.93 19.07 L7.76 16.24" />
      <path d="M16.24 7.76 L19.07 4.93" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '../composables/useTheme';

// Types
type ToggleSize = 'sm' | 'md' | 'lg';
type ToggleVariant = 'default' | 'minimal' | 'rounded' | 'pill';

// Props
const props = withDefaults(defineProps<{
  size?: ToggleSize;
  variant?: ToggleVariant;
}>(), {
  size: 'md',
  variant: 'default'
});

// Get theme context from parent
const { currentTheme, cycleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--text-muted);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

/* Size variants */
.size-sm {
  width: 2rem;
  height: 2rem;
}

.size-sm .icon {
  width: 14px;
  height: 14px;
}

.size-md {
  width: 2.5rem;
  height: 2.5rem;
}

.size-lg {
  width: 3rem;
  height: 3rem;
}

.size-lg .icon {
  width: 22px;
  height: 22px;
}

/* Variant styles */
.variant-default {
  border: 1px solid var(--border-color);
}

.variant-default:hover {
  background-color: var(--button-hover);
  color: var(--text-primary);
}

.variant-minimal {
  border: none;
}

.variant-minimal:hover {
  background-color: var(--button-hover);
  color: var(--text-primary);
}

.variant-rounded {
  border-radius: 9999px;
  border: 1px solid var(--border-color);
}

.variant-rounded:hover {
  background-color: var(--button-hover);
  color: var(--text-primary);
}

.variant-pill {
  border-radius: 9999px;
  background-color: var(--sidebar-hover);
  padding: 0 0.75rem;
}

.variant-pill:hover {
  background-color: var(--sidebar-active);
}

/* Theme-specific styles */
.light {
  color: var(--warning-color, #f59e0b);
}

.dark {
  color: var(--info-color, #0ea5e9);
}

.night-shift {
  color: var(--accent-color, #2563eb);
}

/* Icons animation */
.icon {
  transition: transform 0.3s ease;
}

.theme-toggle:hover .icon {
  transform: rotate(15deg);
}

.theme-toggle:active .icon {
  transform: scale(0.9);
}
</style>