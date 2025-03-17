<template>
  <Modal
    v-model="isOpen"
    :title="title"
    :size="size"
    :close-on-backdrop="closeOnBackdrop && !persistent"
    :close-on-esc="closeOnEsc && !persistent"
    :scrollable="scrollable"
    :centered="centered"
    :persistent="persistent"
    :transition="transition"
    :hide-close="hideClose || type !== 'custom'"
    @close="onClose"
    @open="onOpen"
  >
    <div class="dialog-content">
      <p v-if="message" class="dialog-message">{{ message }}</p>
      
      <div v-if="type === 'prompt'" class="dialog-input-container">
        <input
          ref="promptInput"
          v-model="inputValue"
          :type="inputType"
          class="dialog-input"
          :placeholder="inputPlaceholder"
          @keydown.enter="onConfirm"
        >
        <div v-if="validationError" class="dialog-validation-error">
          {{ validationError }}
        </div>
      </div>
      
      <slot></slot>
    </div>
    
    <template #footer>
      <slot name="footer">
        <div class="dialog-buttons">
          <!-- Alert dialog: only OK button -->
          <button 
            v-if="type === 'alert'" 
            class="dialog-button dialog-button-primary"
            @click="onConfirm"
            ref="okButton"
          >
            {{ confirmText }}
          </button>
          
          <!-- Confirm dialog: Cancel and Confirm buttons -->
          <template v-else-if="type === 'confirm'">
            <button 
              class="dialog-button dialog-button-secondary"
              @click="onCancel"
            >
              {{ cancelText }}
            </button>
            <button 
              class="dialog-button dialog-button-primary"
              @click="onConfirm"
              ref="confirmButton"
            >
              {{ confirmText }}
            </button>
          </template>
          
          <!-- Prompt dialog: Cancel and OK buttons -->
          <template v-else-if="type === 'prompt'">
            <button 
              class="dialog-button dialog-button-secondary"
              @click="onCancel"
            >
              {{ cancelText }}
            </button>
            <button 
              class="dialog-button dialog-button-primary"
              @click="onConfirm"
              ref="okButton"
            >
              {{ confirmText }}
            </button>
          </template>
        </div>
      </slot>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import Modal from './Modal.vue';
import { DialogProps, DialogType } from '@/types';

const props = withDefaults(defineProps<DialogProps>(), {
  title: 'Dialog',
  size: 'sm',
  type: 'custom',
  message: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  defaultValue: '',
  inputType: 'text',
  inputPlaceholder: '',
  closeOnBackdrop: true,
  closeOnEsc: true,
  scrollable: false,
  centered: true,
  persistent: false,
  transition: 'modal-scale',
  hideClose: false,
  hideHeader: false
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'open', 'close']);

// Reactive state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const inputValue = ref(props.defaultValue);
const validationError = ref('');
const promptInput = ref<HTMLInputElement | null>(null);
const okButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);

// Methods
const onConfirm = () => {
  // For prompt dialogs, validate input if a validator is provided
  if (props.type === 'prompt' && props.inputValidator) {
    const validationResult = props.inputValidator(inputValue.value);
    
    if (validationResult !== true && validationResult !== '') {
      validationError.value = typeof validationResult === 'string' 
        ? validationResult 
        : 'Invalid input';
      return;
    }
  }
  
  // Emit different values based on dialog type
  let result: boolean | string | null = true;
  
  if (props.type === 'prompt') {
    result = inputValue.value;
  }
  
  isOpen.value = false;
  emit('confirm', result);
};

const onCancel = () => {
  isOpen.value = false;
  
  // Emit null for prompt dialogs, false for others
  const result = props.type === 'prompt' ? null : false;
  emit('confirm', result);
  emit('cancel');
};

const onOpen = () => {
  // Reset the dialog state
  if (props.type === 'prompt') {
    inputValue.value = props.defaultValue;
    validationError.value = '';
  }
  
  emit('open');
  
  // Focus appropriate element on next tick
  nextTick(() => {
    if (props.type === 'prompt' && promptInput.value) {
      promptInput.value.focus();
      promptInput.value.select();
    } else if ((props.type === 'alert' || props.type === 'prompt') && okButton.value) {
      okButton.value.focus();
    } else if (props.type === 'confirm' && confirmButton.value) {
      confirmButton.value.focus();
    }
  });
};

const onClose = () => {
  emit('close');
};

// Reset prompt value when defaultValue changes
watch(() => props.defaultValue, (newValue) => {
  if (props.type === 'prompt') {
    inputValue.value = newValue;
  }
});

// Add correct ARIA role based on dialog type
const dialogRole = computed(() => {
  if (props.type === 'alert') {
    return 'alertdialog';
  }
  return 'dialog';
});
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-message {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #212529;
}

.dialog-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dialog-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.dialog-input:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.dialog-validation-error {
  font-size: 0.875rem;
  color: #dc3545;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-button {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, 
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.dialog-button-primary {
  color: #fff;
  background-color: #0d6efd;
  border: 1px solid #0d6efd;
}

.dialog-button-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.dialog-button-primary:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.5);
}

.dialog-button-secondary {
  color: #212529;
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
}

.dialog-button-secondary:hover {
  background-color: #e9ecef;
  border-color: #dde0e3;
}

.dialog-button-secondary:focus {
  box-shadow: 0 0 0 0.25rem rgba(248, 249, 250, 0.5);
}
</style>