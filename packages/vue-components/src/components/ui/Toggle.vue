<template>
  <div class="toggle-wrapper" :class="wrapperClasses">
    <label class="toggle-label">
      <span v-if="label" class="toggle-text">
        {{ label }}
        <span v-if="required" class="toggle-required">*</span>
      </span>
      <div class="toggle-container">
        <input
          type="checkbox"
          :checked="modelValue"
          :disabled="disabled"
          :required="required"
          class="toggle-input"
          @change="handleChange"
        />
        <span class="toggle-switch"></span>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ToggleProps, SizeVariant } from '@/types';

export default defineComponent({
  name: 'Toggle',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<SizeVariant>,
      default: 'medium',
      validator: (value: string) => {
        return ['small', 'medium', 'large'].includes(value);
      }
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: boolean) => true
  },
  setup(props, { emit }) {
    const wrapperClasses = computed(() => {
      return {
        [`toggle-size-${props.size}`]: true,
        'is-disabled': props.disabled,
        'is-checked': props.modelValue
      };
    });
    
    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.checked);
    };
    
    return {
      wrapperClasses,
      handleChange
    };
  }
});
</script>

<style scoped>
.toggle-wrapper {
  display: inline-flex;
  margin-bottom: 0.5rem;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.toggle-text {
  margin-right: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
}

.toggle-required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.toggle-container {
  position: relative;
  display: inline-block;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch {
  display: inline-block;
  width: 38px;
  height: 20px;
  background-color: #e2e8f0;
  border-radius: 34px;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-switch::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-input:checked + .toggle-switch {
  background-color: #007bff;
}

.toggle-input:checked + .toggle-switch::before {
  transform: translateX(18px);
}

.toggle-input:focus + .toggle-switch {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.is-disabled .toggle-label {
  cursor: not-allowed;
  opacity: 0.65;
}

.is-disabled .toggle-input:checked + .toggle-switch {
  background-color: rgba(0, 123, 255, 0.5);
}

.is-disabled .toggle-input + .toggle-switch {
  background-color: #e9ecef;
}

/* Size variants */
.toggle-size-small .toggle-text {
  font-size: 0.75rem;
}

.toggle-size-small .toggle-switch {
  width: 30px;
  height: 16px;
}

.toggle-size-small .toggle-switch::before {
  height: 12px;
  width: 12px;
}

.toggle-size-small .toggle-input:checked + .toggle-switch::before {
  transform: translateX(14px);
}

.toggle-size-medium .toggle-switch {
  width: 38px;
  height: 20px;
}

.toggle-size-medium .toggle-switch::before {
  height: 16px;
  width: 16px;
}

.toggle-size-large .toggle-text {
  font-size: 1rem;
}

.toggle-size-large .toggle-switch {
  width: 50px;
  height: 26px;
}

.toggle-size-large .toggle-switch::before {
  height: 22px;
  width: 22px;
}

.toggle-size-large .toggle-input:checked + .toggle-switch::before {
  transform: translateX(24px);
}
</style>