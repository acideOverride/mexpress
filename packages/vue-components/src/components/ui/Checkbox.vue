<template>
  <div class="checkbox-wrapper" :class="wrapperClasses">
    <label class="checkbox-label">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :indeterminate="indeterminate"
        class="checkbox-input"
        @change="handleChange"
      />
      <span class="checkbox-custom"></span>
      <span v-if="label" class="checkbox-text">
        {{ label }}
        <span v-if="required" class="checkbox-required">*</span>
      </span>
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { CheckboxProps } from '@/types';

export default defineComponent({
  name: 'Checkbox',
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
    required: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: boolean) => true
  },
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);
    
    onMounted(() => {
      if (inputRef.value && props.indeterminate) {
        inputRef.value.indeterminate = props.indeterminate;
      }
    });
    
    const wrapperClasses = computed(() => {
      return {
        'is-disabled': props.disabled,
        'is-checked': props.modelValue,
        'is-indeterminate': props.indeterminate
      };
    });
    
    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.checked);
    };
    
    return {
      inputRef,
      wrapperClasses,
      handleChange
    };
  }
});
</script>

<style scoped>
.checkbox-wrapper {
  display: inline-flex;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 3px;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.checkbox-input:checked ~ .checkbox-custom {
  background-color: #007bff;
  border-color: #007bff;
}

.checkbox-input:checked ~ .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.is-indeterminate .checkbox-custom {
  background-color: #007bff;
  border-color: #007bff;
}

.is-indeterminate .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 8px;
  width: 10px;
  height: 2px;
  background-color: white;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #495057;
}

.checkbox-required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.is-disabled {
  opacity: 0.65;
}

.is-disabled .checkbox-label {
  cursor: not-allowed;
}

.checkbox-input:focus ~ .checkbox-custom {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.checkbox-input:disabled ~ .checkbox-custom {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.checkbox-input:checked:disabled ~ .checkbox-custom {
  background-color: rgba(0, 123, 255, 0.5);
}
</style>