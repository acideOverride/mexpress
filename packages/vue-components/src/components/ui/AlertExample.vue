<template>
  <div class="alert-example">
    <h2>Alert Example</h2>
    
    <div class="example-section">
      <h3>Alert Types</h3>
      <div class="controls">
        <button @click="showAlertType('info')">Info Alert</button>
        <button @click="showAlertType('success')">Success Alert</button>
        <button @click="showAlertType('warning')">Warning Alert</button>
        <button @click="showAlertType('error')">Error Alert</button>
      </div>
      
      <Alert
        v-if="showTypeAlert"
        :type="alertType"
        :message="alertMessage"
        :title="alertTitle"
        :dismissible="true"
        @dismiss="showTypeAlert = false"
      />
    </div>
    
    <div class="example-section">
      <h3>Alert Styles</h3>
      <div class="controls">
        <button @click="showStyleAlert('default')">Default</button>
        <button @click="showStyleAlert('bordered')">Bordered</button>
        <button @click="showStyleAlert('filled')">Filled</button>
        <button @click="showStyleAlert('banner')">Banner</button>
      </div>
      
      <Alert
        v-if="showStyleExampleAlert"
        :type="alertType"
        :message="alertMessage"
        :title="alertTitle"
        :bordered="alertStyle === 'bordered'"
        :filled="alertStyle === 'filled'"
        :banner="alertStyle === 'banner'"
        :dismissible="true"
        @dismiss="showStyleExampleAlert = false"
      />
    </div>
    
    <div class="example-section">
      <h3>With/Without Icon</h3>
      <div class="controls">
        <button @click="showIconAlert(true)">With Icon</button>
        <button @click="showIconAlert(false)">Without Icon</button>
      </div>
      
      <Alert
        v-if="showIconExampleAlert"
        :type="alertType"
        :message="alertMessage"
        :title="alertTitle"
        :showIcon="alertShowIcon"
        :dismissible="true"
        @dismiss="showIconExampleAlert = false"
      />
    </div>
    
    <div class="example-section">
      <h3>Custom Content</h3>
      <div class="controls">
        <button @click="showCustomAlert()">Custom Content</button>
        <button @click="showCustomIconAlert()">Custom Icon</button>
        <button @click="showActionAlert()">With Action</button>
      </div>
      
      <Alert
        v-if="showCustomContentAlert"
        :type="alertType"
        :title="alertTitle"
        :dismissible="true"
        @dismiss="showCustomContentAlert = false"
      >
        <div class="custom-alert-content">
          <p>This alert contains <strong>custom content</strong> with formatting.</p>
          <div class="custom-alert-extra">
            Additional details can be included here.
          </div>
        </div>
      </Alert>
      
      <Alert
        v-if="showCustomIconExampleAlert"
        :type="alertType"
        :message="alertMessage"
        :title="alertTitle"
        :showIcon="true"
        :dismissible="true"
        @dismiss="showCustomIconExampleAlert = false"
      >
        <template #icon>
          <div class="custom-icon">🔔</div>
        </template>
      </Alert>
      
      <Alert
        v-if="showActionExampleAlert"
        :type="alertType"
        :message="alertMessage"
        :title="alertTitle"
        :dismissible="true"
        @dismiss="showActionExampleAlert = false"
      >
        <template #action>
          <button class="alert-action-button" @click="handleAlertAction">Learn More</button>
        </template>
      </Alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Alert from './Alert.vue';
import { ToastType } from '@/types';

// Alert state
const alertType = ref<ToastType>('info');
const alertMessage = ref('This is an alert message.');
const alertTitle = ref<string | undefined>(undefined);
const alertShowIcon = ref(true);
const alertStyle = ref<'default' | 'bordered' | 'filled' | 'banner'>('default');

// Visibility state
const showTypeAlert = ref(false);
const showStyleExampleAlert = ref(false);
const showIconExampleAlert = ref(false);
const showCustomContentAlert = ref(false);
const showCustomIconExampleAlert = ref(false);
const showActionExampleAlert = ref(false);

// Alert type example
const showAlertType = (type: ToastType) => {
  alertType.value = type;
  
  switch (type) {
    case 'info':
      alertTitle.value = 'Information';
      alertMessage.value = 'This is an informational alert.';
      break;
    case 'success':
      alertTitle.value = 'Success';
      alertMessage.value = 'Operation completed successfully!';
      break;
    case 'warning':
      alertTitle.value = 'Warning';
      alertMessage.value = 'Please be careful with this action.';
      break;
    case 'error':
      alertTitle.value = 'Error';
      alertMessage.value = 'An error occurred while processing your request.';
      break;
  }
  
  showTypeAlert.value = true;
};

// Alert style example
const showStyleAlert = (style: 'default' | 'bordered' | 'filled' | 'banner') => {
  alertType.value = 'info';
  alertStyle.value = style;
  alertTitle.value = style.charAt(0).toUpperCase() + style.slice(1) + ' Style';
  alertMessage.value = `This is an alert with the ${style} style.`;
  showStyleExampleAlert.value = true;
};

// Alert icon example
const showIconAlert = (showIcon: boolean) => {
  alertType.value = 'info';
  alertShowIcon.value = showIcon;
  alertTitle.value = showIcon ? 'With Icon' : 'Without Icon';
  alertMessage.value = showIcon 
    ? 'This alert is displayed with an icon.' 
    : 'This alert is displayed without an icon.';
  showIconExampleAlert.value = true;
};

// Custom content alert
const showCustomAlert = () => {
  alertType.value = 'info';
  alertTitle.value = 'Custom Content Alert';
  showCustomContentAlert.value = true;
};

// Custom icon alert
const showCustomIconAlert = () => {
  alertType.value = 'info';
  alertTitle.value = 'Custom Icon';
  alertMessage.value = 'This alert has a custom icon.';
  showCustomIconExampleAlert.value = true;
};

// Alert with action
const showActionAlert = () => {
  alertType.value = 'info';
  alertTitle.value = 'Alert with Action';
  alertMessage.value = 'This alert includes an action button.';
  showActionExampleAlert.value = true;
};

// Action handler
const handleAlertAction = () => {
  alert('Alert action clicked!');
  showActionExampleAlert.value = false;
};
</script>

<style scoped>
.alert-example {
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
  margin-bottom: 1rem;
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

.custom-alert-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-alert-extra {
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.custom-icon {
  font-size: 1.25rem;
}

.alert-action-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.alert-action-button:hover {
  background-color: #e5e7eb;
}
</style>