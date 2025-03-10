<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button-spinner" aria-hidden="true"></span>
    <slot name="icon"></slot>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'text';
type SizeVariant = 'small' | 'medium' | 'large';

const props = withDefaults(defineProps<{
  label?: string;
  variant?: ColorVariant;
  size?: SizeVariant;
  disabled?: boolean;
  loading?: boolean;
  outlined?: boolean;
  rounded?: boolean;
  block?: boolean;
}>(), {
  label: '',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
  outlined: false,
  rounded: false,
  block: false,
});

defineEmits(['click']);

const buttonClasses = computed(() => {
  return {
    'btn': true,
    [`btn-${props.variant}`]: !props.outlined,
    [`btn-outline-${props.variant}`]: props.outlined,
    [`btn-${props.size}`]: true,
    'btn-rounded': props.rounded,
    'btn-block': props.block,
    'btn-loading': props.loading,
  };
});
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
  gap: 0.25rem;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:disabled,
.btn.disabled {
  opacity: 0.65;
  pointer-events: none;
}

/* Size variants */
.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.btn-medium {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
}

.btn-large {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}

/* Color variants */
.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  color: #fff;
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  color: #fff;
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-warning {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-warning:hover {
  color: #212529;
  background-color: #e0a800;
  border-color: #d39e00;
}

.btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
}

.btn-text {
  color: #007bff;
  background-color: transparent;
  border-color: transparent;
}

.btn-text:hover {
  color: #0056b3;
  text-decoration: underline;
  background-color: transparent;
  border-color: transparent;
}

/* Block variants */
.btn-block {
  display: block;
  width: 100%;
}

/* Loading state */
.btn-loading {
  position: relative;
  color: transparent !important;
}

.button-spinner {
  position: absolute;
  width: 1em;
  height: 1em;
  border: 0.15em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 0.75s linear infinite;
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>