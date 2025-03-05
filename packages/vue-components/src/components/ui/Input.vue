<template>
  <div class="input-wrapper" :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    <div class="input-container">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autofocus="autofocus"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
    </div>
    <div v-if="error" class="input-error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { InputProps, SizeVariant } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: 'Input',
  props: {
    modelValue: {
      type: [String, Number],
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
    type: {
      type: String,
      default: 'text'
    },
    size: {
      type: String as PropType<SizeVariant>,
      default: 'medium',
      validator: (value: string) => {
        return ['small', 'medium', 'large'].includes(value);
      }
    },
    disabled: {
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
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'update:modelValue': (value: string | number) => true,
    'blur': (event: FocusEvent) => true,
    'focus': (event: FocusEvent) => true
  },
  setup(props, { emit }) {
    const inputId = `input-${uuidv4()}`;
    
    const wrapperClasses = computed(() => {
      return {
        [`input-size-${props.size}`]: true,
        'has-error': !!props.error,
        'is-disabled': props.disabled
      }
    });
    
    const inputClasses = computed(() => {
      return {
        'input': true,
        [`input-${props.size}`]: true,
        'input-error': !!props.error,
        'input-disabled': props.disabled
      }
    });
    
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value);
    };
    
    return {
      inputId,
      wrapperClasses,
      inputClasses,
      handleInput
    };
  }
});
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.input-required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.input-container {
  position: relative;
}

.input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.input::placeholder {
  color: #6c757d;
  opacity: 1;
}

.input-disabled,
.input:disabled {
  background-color: #e9ecef;
  opacity: 1;
  cursor: not-allowed;
}

.input-error {
  color: #dc3545;
  font-size: 0.875em;
  margin-top: 0.5rem;
}

.has-error .input {
  border-color: #dc3545;
}

.has-error .input:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Size variants */
.input-size-small .input-label {
  font-size: 0.75rem;
}

.input-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.input-medium {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
}

.input-large {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
}

.input-size-large .input-label {
  font-size: 1rem;
}
</style>