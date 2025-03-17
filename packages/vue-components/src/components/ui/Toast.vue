<template>
  <Transition
    :name="'toast-' + (position ? position.split('-')[0] : 'right')"
    appear
  >
    <div 
      v-if="modelValue"
      class="toast-container"
      :class="[
        `toast-${type}`,
        position ? `toast-${position}` : null
      ]"
      role="alert"
      aria-live="polite"
    >
      <div class="toast-content">
        <div v-if="type" :class="`toast-icon toast-icon-${type}`">
          <!-- Success Icon -->
          <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="toast-svg">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
          </svg>
          
          <!-- Error Icon -->
          <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="toast-svg">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
          </svg>
          
          <!-- Warning Icon -->
          <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="toast-svg">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
          </svg>
          
          <!-- Info Icon -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="toast-svg">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
          </svg>
        </div>
        
        <div class="toast-body">
          <div v-if="message" class="toast-message">{{ message }}</div>
          <slot></slot>
          <div v-if="$slots.actions" class="toast-actions">
            <slot name="actions"></slot>
          </div>
        </div>
        
        <button 
          v-if="dismissible" 
          class="toast-dismiss"
          @click="dismiss"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="toast-svg">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
          </svg>
        </button>
      </div>
      
      <div v-if="showProgress && autoDismiss" class="toast-progress">
        <div 
          class="toast-progress-bar"
          :style="{ animationDuration: `${duration}ms` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ToastProps, ToastType, ToastPosition } from '@/types';

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  autoDismiss: false,
  duration: 5000,
  dismissible: true,
  showProgress: false,
  position: 'top-right',
});

const emit = defineEmits(['update:modelValue', 'show', 'hide']);

const dismissTimer = ref<number | null>(null);

// Methods
const dismiss = () => {
  clearDismissTimer();
  emit('update:modelValue', false);
  emit('hide');
};

const startDismissTimer = () => {
  if (props.autoDismiss && props.duration > 0) {
    dismissTimer.value = window.setTimeout(() => {
      emit('update:modelValue', false);
      emit('hide');
    }, props.duration);
  }
};

const clearDismissTimer = () => {
  if (dismissTimer.value !== null) {
    clearTimeout(dismissTimer.value);
    dismissTimer.value = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  if (props.modelValue) {
    emit('show');
    startDismissTimer();
  }
});

onBeforeUnmount(() => {
  clearDismissTimer();
});

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    emit('show');
    startDismissTimer();
  } else {
    clearDismissTimer();
    emit('hide');
  }
});
</script>

<style scoped>
.toast-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  margin-bottom: 0.75rem;
  overflow: hidden;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: 0.95;
  transition: all 0.3s ease;
}

.toast-container:hover {
  opacity: 1;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.toast-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
}

.toast-body {
  flex: 1;
  margin: 0 0.5rem;
}

.toast-message {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #1f2937;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.toast-dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  margin-left: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.toast-dismiss:hover {
  opacity: 1;
}

.toast-actions {
  display: flex;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.toast-progress {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.toast-progress-bar {
  height: 100%;
  width: 100%;
  background-color: currentColor;
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-progress {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

/* Toast types */
.toast-success {
  border-left: 4px solid #10b981;
  color: #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
  color: #ef4444;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
  color: #f59e0b;
}

.toast-info {
  border-left: 4px solid #3b82f6;
  color: #3b82f6;
}

/* Toast positions */
.toast-top-right {
  position: fixed;
  top: 1rem;
  right: 1rem;
}

.toast-top-left {
  position: fixed;
  top: 1rem;
  left: 1rem;
}

.toast-bottom-right {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}

.toast-bottom-left {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
}

.toast-top-center {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.toast-bottom-center {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

/* Transition animations */
.toast-right-enter-active,
.toast-right-leave-active,
.toast-left-enter-active,
.toast-left-leave-active,
.toast-top-enter-active,
.toast-top-leave-active,
.toast-bottom-enter-active,
.toast-bottom-leave-active {
  transition: all 0.3s ease;
}

.toast-right-enter-from,
.toast-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-left-enter-from,
.toast-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.toast-top-enter-from,
.toast-top-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-bottom-enter-from,
.toast-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .toast-container {
    background-color: #1f2937;
  }
  
  .toast-message {
    color: #f3f4f6;
  }
  
  .toast-dismiss {
    color: #d1d5db;
  }
}
</style>