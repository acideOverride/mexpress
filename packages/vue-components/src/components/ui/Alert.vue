<template>
  <Transition name="alert-fade">
    <div 
      v-if="isVisible"
      class="alert"
      :class="[
        `alert-${type}`,
        { 'alert-bordered': bordered },
        { 'alert-filled': filled },
        { 'alert-banner': banner }
      ]"
      role="alert"
    >
      <div class="alert-content">
        <div v-if="showIcon" class="alert-icon-wrapper">
          <slot name="icon">
            <!-- Success Icon -->
            <div v-if="type === 'success'" class="alert-icon alert-icon-success">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
              </svg>
            </div>
            
            <!-- Error Icon -->
            <div v-else-if="type === 'error'" class="alert-icon alert-icon-error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
              </svg>
            </div>
            
            <!-- Warning Icon -->
            <div v-else-if="type === 'warning'" class="alert-icon alert-icon-warning">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
              </svg>
            </div>
            
            <!-- Info Icon -->
            <div v-else class="alert-icon alert-icon-info">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
              </svg>
            </div>
          </slot>
        </div>
        
        <div class="alert-body">
          <div v-if="title" class="alert-title">{{ title }}</div>
          <div v-if="message" class="alert-message">{{ message }}</div>
          <slot></slot>
        </div>
        
        <div v-if="$slots.action" class="alert-action">
          <slot name="action"></slot>
        </div>
        
        <button 
          v-if="dismissible"
          class="alert-dismiss"
          @click="onDismiss"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AlertProps } from '@/types';

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  dismissible: false,
  showIcon: true,
  bordered: false,
  filled: false,
  banner: false
});

const emit = defineEmits(['dismiss']);

const isVisible = ref(true);

const onDismiss = () => {
  isVisible.value = false;
  emit('dismiss');
};
</script>

<style scoped>
.alert {
  position: relative;
  display: flex;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  background-color: rgba(var(--color-bg), 0.1);
  border: 1px solid rgba(var(--color-border), 0.2);
}

.alert-content {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.alert-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
}

.alert-body {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 1rem;
  line-height: 1.5;
}

.alert-message {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.alert-action {
  margin-left: 1rem;
  display: flex;
  align-items: center;
}

.alert-dismiss {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: inherit;
  margin-left: 0.75rem;
  padding: 0;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s ease;
}

.alert-dismiss:hover {
  opacity: 1;
}

/* Alert types */
.alert-success {
  --color-bg: 16, 185, 129;
  --color-border: 16, 185, 129;
  --color-text: 16, 185, 129;
  color: rgb(var(--color-text));
}

.alert-error {
  --color-bg: 239, 68, 68;
  --color-border: 239, 68, 68;
  --color-text: 239, 68, 68;
  color: rgb(var(--color-text));
}

.alert-warning {
  --color-bg: 245, 158, 11;
  --color-border: 245, 158, 11;
  --color-text: 245, 158, 11;
  color: rgb(var(--color-text));
}

.alert-info {
  --color-bg: 59, 130, 246;
  --color-border: 59, 130, 246;
  --color-text: 59, 130, 246;
  color: rgb(var(--color-text));
}

/* Alert styles */
.alert-bordered {
  background-color: transparent;
  border: 1px solid rgb(var(--color-border));
}

.alert-filled {
  background-color: rgb(var(--color-bg));
  border-color: rgb(var(--color-bg));
  color: white;
}

.alert-banner {
  border-radius: 0;
  width: 100%;
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
}

/* Transition */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .alert:not(.alert-filled) {
    background-color: rgba(var(--color-bg), 0.15);
  }
}
</style>