<template>
  <div class="toast-example">
    <h2>Toast Example</h2>
    
    <div class="example-section">
      <h3>Toast Types</h3>
      <div class="controls">
        <button @click="showInfoToast">Info Toast</button>
        <button @click="showSuccessToast">Success Toast</button>
        <button @click="showWarningToast">Warning Toast</button>
        <button @click="showErrorToast">Error Toast</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Auto-dismiss Options</h3>
      <div class="controls">
        <button @click="showPersistentToast">Persistent Toast</button>
        <button @click="showAutoDismissToast">Auto-dismiss Toast (3s)</button>
        <button @click="showProgressToast">Toast with Progress Bar</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Positions</h3>
      <div class="controls">
        <button @click="showToastPosition('top-right')">Top Right</button>
        <button @click="showToastPosition('top-left')">Top Left</button>
        <button @click="showToastPosition('bottom-right')">Bottom Right</button>
        <button @click="showToastPosition('bottom-left')">Bottom Left</button>
        <button @click="showToastPosition('top-center')">Top Center</button>
        <button @click="showToastPosition('bottom-center')">Bottom Center</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Custom Content</h3>
      <div class="controls">
        <button @click="showCustomToast">Custom Content</button>
        <button @click="showActionToast">Toast with Actions</button>
      </div>
    </div>
    
    <!-- Toast components for different positions/examples -->
    <Toast
      v-model="showToast"
      :message="toastMessage"
      :type="toastType"
      :autoDismiss="toastAutoDismiss"
      :duration="toastDuration"
      :showProgress="toastShowProgress"
      :position="toastPosition"
      :dismissible="toastDismissible"
    >
      <!-- Custom content slot (used conditionally) -->
      <template v-if="useCustomContent">
        <div class="custom-toast-content">
          <strong>Custom Toast Content</strong>
          <p>This is a custom content example.</p>
        </div>
      </template>
      
      <!-- Actions slot (used conditionally) -->
      <template v-if="useActions" #actions>
        <button class="toast-action-button" @click="handleToastAction">View Details</button>
      </template>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Toast from './Toast.vue';
import { ToastType, ToastPosition } from '@/types';

// Toast state
const showToast = ref(false);
const toastMessage = ref('This is a toast message');
const toastType = ref<ToastType>('info');
const toastAutoDismiss = ref(false);
const toastDuration = ref(5000);
const toastShowProgress = ref(false);
const toastPosition = ref<ToastPosition>('top-right');
const toastDismissible = ref(true);
const useCustomContent = ref(false);
const useActions = ref(false);

// Basic toast types
const showInfoToast = () => {
  toastType.value = 'info';
  toastMessage.value = 'This is an information toast';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

const showSuccessToast = () => {
  toastType.value = 'success';
  toastMessage.value = 'Operation completed successfully!';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

const showWarningToast = () => {
  toastType.value = 'warning';
  toastMessage.value = 'Warning: This action cannot be undone';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

const showErrorToast = () => {
  toastType.value = 'error';
  toastMessage.value = 'An error occurred. Please try again.';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

// Auto-dismiss options
const showPersistentToast = () => {
  toastType.value = 'info';
  toastMessage.value = 'This toast will stay until dismissed';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

const showAutoDismissToast = () => {
  toastType.value = 'info';
  toastMessage.value = 'This toast will auto-dismiss in 3 seconds';
  toastAutoDismiss.value = true;
  toastDuration.value = 3000;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

const showProgressToast = () => {
  toastType.value = 'info';
  toastMessage.value = 'This toast shows a progress bar';
  toastAutoDismiss.value = true;
  toastDuration.value = 5000;
  toastShowProgress.value = true;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

// Position examples
const showToastPosition = (position: ToastPosition) => {
  toastType.value = 'info';
  toastMessage.value = `This toast is positioned ${position}`;
  toastPosition.value = position;
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = false;
  showToast.value = true;
};

// Custom content examples
const showCustomToast = () => {
  toastType.value = 'info';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = true;
  useActions.value = false;
  showToast.value = true;
};

const showActionToast = () => {
  toastType.value = 'info';
  toastMessage.value = 'This toast has action buttons';
  toastAutoDismiss.value = false;
  toastShowProgress.value = false;
  useCustomContent.value = false;
  useActions.value = true;
  showToast.value = true;
};

// Action handler
const handleToastAction = () => {
  alert('Toast action clicked!');
  showToast.value = false;
};
</script>

<style scoped>
.toast-example {
  padding: 1rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.example-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.15s ease;
}

button:hover {
  background-color: #2563eb;
}

.custom-toast-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast-action-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.toast-action-button:hover {
  background-color: #e5e7eb;
}
</style>