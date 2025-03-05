<template>
  <div class="select-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="selectId" class="select-label">
      {{ label }}
      <span v-if="required" class="select-required">*</span>
    </label>
    <div class="select-container">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        :aria-describedby="error ? `${selectId}-error` : undefined"
        class="select-input"
        @change="handleChange"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="select-arrow"></div>
      <button 
        v-if="clearable && modelValue && !disabled" 
        type="button" 
        class="select-clear"
        @click="clearSelection"
        aria-label="Clear selection"
      >
        ✕
      </button>
    </div>
    <div v-if="error" :id="`${selectId}-error`" class="select-error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { SelectOption, SelectProps, SizeVariant } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: 'Select',
  props: {
    modelValue: {
      type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
      required: true
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<SizeVariant>,
      default: 'medium',
      validator: (value: string) => {
        return ['small', 'medium', 'large'].includes(value);
      }
    }
  },
  emits: {
    'update:modelValue': (value: string | number | (string | number)[]) => true,
    'blur': (event: FocusEvent) => true,
    'focus': (event: FocusEvent) => true
  },
  setup(props, { emit }) {
    const selectId = `select-${uuidv4()}`;
    
    const wrapperClasses = computed(() => {
      return {
        [`select-size-${props.size}`]: true,
        'has-error': !!props.error,
        'is-disabled': props.disabled,
        'is-multiple': props.multiple,
        'has-value': !!props.modelValue
      };
    });
    
    const handleChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      
      if (props.multiple) {
        // For multiple select, gather all selected options
        const values: (string | number)[] = [];
        Array.from(target.selectedOptions).forEach(option => {
          const value = option.value;
          values.push(isNaN(Number(value)) ? value : Number(value));
        });
        emit('update:modelValue', values);
      } else {
        // For single select
        const value = target.value;
        emit('update:modelValue', isNaN(Number(value)) ? value : Number(value));
      }
    };
    
    const clearSelection = () => {
      emit('update:modelValue', props.multiple ? [] : '');
    };
    
    return {
      selectId,
      wrapperClasses,
      handleChange,
      clearSelection
    };
  }
});
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.select-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.select-required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.select-container {
  position: relative;
}

.select-input {
  display: block;
  width: 100%;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  appearance: none;
}

.select-input:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.select-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #495057;
  pointer-events: none;
}

.select-clear {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 2;
}

.select-clear:hover {
  color: #495057;
  background-color: #f8f9fa;
}

.select-input:disabled {
  background-color: #e9ecef;
  opacity: 1;
  cursor: not-allowed;
}

.select-error {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.5rem;
}

.has-error .select-input {
  border-color: #dc3545;
}

.has-error .select-input:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Size variants */
.select-size-small .select-label {
  font-size: 0.75rem;
}

.select-size-small .select-input {
  padding: 0.25rem 2.25rem 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.select-size-medium .select-input {
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
}

.select-size-large .select-input {
  padding: 0.5rem 2.25rem 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 0.3rem;
}

.select-size-large .select-label {
  font-size: 1rem;
}

/* Multiple select */
.is-multiple .select-input {
  padding-right: 0.75rem;
  height: auto;
  min-height: 6rem;
}

.is-multiple .select-arrow {
  display: none;
}
</style>