<template>
  <Teleport to="body">
    <Transition :name="transition">
      <div v-if="modelValue" class="modal-overlay" @click="handleBackdropClick" @keydown.esc="handleEscapeKey">
        <div
          ref="modalContainer"
          class="modal-container"
          :class="[
            `modal-${size}`,
            { 'modal-centered': centered },
            { 'modal-scrollable': scrollable }
          ]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="hideHeader ? undefined : 'modal-title'"
          @click.stop
        >
          <div v-if="!hideHeader" class="modal-header">
            <h3 id="modal-title" class="modal-title">{{ title }}</h3>
            <button v-if="!hideClose" class="modal-close" @click="close" aria-label="Close modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { ModalProps } from '@/types';

const props = withDefaults(defineProps<ModalProps>(), {
  title: 'Modal',
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
  scrollable: false,
  centered: false,
  persistent: false,
  transition: 'modal-fade',
  hideClose: false,
  hideHeader: false
});

const emit = defineEmits(['update:modelValue', 'close', 'open']);

// Refs
const modalContainer = ref<HTMLElement | null>(null);
const originalBodyStyles = ref({
  overflow: '',
  paddingRight: ''
});
const focusableElements = ref<HTMLElement[]>([]);
const previousActiveElement = ref<HTMLElement | null>(null);

// Methods
const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent) {
    close();
  }
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (props.closeOnEsc && !props.persistent && event.key === 'Escape') {
    close();
  }
};

// Focus management
const getFocusableElements = () => {
  if (!modalContainer.value) return [];
  
  return Array.from(
    modalContainer.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];
};

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return;
  
  const elements = focusableElements.value;
  if (elements.length === 0) return;
  
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
};

// Body scroll management
const lockBodyScroll = () => {
  originalBodyStyles.value = {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight
  };
  
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollBarWidth}px`;
};

const unlockBodyScroll = () => {
  document.body.style.overflow = originalBodyStyles.value.overflow;
  document.body.style.paddingRight = originalBodyStyles.value.paddingRight;
};

// Event listeners
const addEventListeners = () => {
  document.addEventListener('keydown', trapFocus);
};

const removeEventListeners = () => {
  document.removeEventListener('keydown', trapFocus);
};

// Lifecycle hooks
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    emit('open');
    lockBodyScroll();
    
    // Save current active element to restore focus later
    previousActiveElement.value = document.activeElement as HTMLElement;
    
    await nextTick();
    
    // Set up focus trap
    focusableElements.value = getFocusableElements();
    addEventListeners();
    
    // Focus first focusable element
    if (focusableElements.value.length > 0) {
      focusableElements.value[0].focus();
    } else if (modalContainer.value) {
      modalContainer.value.focus();
    }
  } else {
    unlockBodyScroll();
    removeEventListeners();
    
    // Restore focus to previous element
    if (previousActiveElement.value) {
      previousActiveElement.value.focus();
    }
  }
});

onMounted(() => {
  if (props.modelValue) {
    lockBodyScroll();
    nextTick(() => {
      focusableElements.value = getFocusableElements();
      addEventListeners();
      
      if (focusableElements.value.length > 0) {
        focusableElements.value[0].focus();
      } else if (modalContainer.value) {
        modalContainer.value.focus();
      }
    });
  }
});

onBeforeUnmount(() => {
  if (props.modelValue) {
    unlockBodyScroll();
    removeEventListeners();
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  width: 95%;
  max-width: 500px;
  margin: 1.75rem auto;
  display: flex;
  flex-direction: column;
  outline: 0;
  max-height: calc(100vh - 3.5rem);
}

.modal-centered {
  align-self: center;
}

.modal-scrollable .modal-body {
  overflow-y: auto;
  max-height: calc(100vh - 11rem);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
  color: #212529;
}

.modal-close {
  padding: 0;
  background-color: transparent;
  border: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
}

.modal-close:hover {
  color: #212529;
  text-decoration: none;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  gap: 0.5rem;
}

/* Size Variations */
.modal-sm {
  max-width: 300px;
}

.modal-md {
  max-width: 500px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1140px;
}

.modal-full {
  max-width: calc(100% - 2rem);
  margin: 1rem;
}

/* Default Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Additional Animation: Slide */
.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Additional Animation: Scale */
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 576px) {
  .modal-container {
    max-width: 95%;
    margin: 1rem auto;
  }
  
  .modal-overlay {
    padding: 0.5rem;
  }
}
</style>