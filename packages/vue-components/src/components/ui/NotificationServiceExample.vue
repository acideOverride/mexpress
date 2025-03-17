<template>
  <div class="notification-service-example">
    <h2>Notification Service Example</h2>
    
    <div class="example-section">
      <h3>Basic Notifications</h3>
      <div class="controls">
        <button @click="showInfoNotification">Info Notification</button>
        <button @click="showSuccessNotification">Success Notification</button>
        <button @click="showWarningNotification">Warning Notification</button>
        <button @click="showErrorNotification">Error Notification</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Advanced Options</h3>
      <div class="controls">
        <button @click="showNotificationWithTitle">With Title</button>
        <button @click="showNotificationWithAction">With Action</button>
        <button @click="showCustomNotification">Custom Notification</button>
        <button @click="showPersistentNotification">Persistent</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Service Configuration</h3>
      <div class="controls">
        <button @click="changeMaxCount">Set Max Count: {{ maxCount }}</button>
        <button @click="toggleAutoDismiss">{{ defaultAutoDismiss ? 'Disable' : 'Enable' }} Auto-dismiss</button>
        <button @click="changePosition">Change Position</button>
        <button @click="clearAllNotifications">Clear All Notifications</button>
      </div>
    </div>
    
    <!-- Notification container using the service -->
    <Notification
      :notifications="notifications"
      :position="position"
      :stacked="stacked"
      :maxCount="maxCount"
      @remove="handleRemove"
      @action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Notification from './Notification.vue';
import { notificationService } from '@/services/NotificationService';
import { NotificationItem, ToastPosition } from '@/types';

// Local state
const maxCount = ref(5);
const position = ref<ToastPosition>('top-right');
const stacked = ref(false);
const defaultAutoDismiss = ref(true);
const defaultDuration = ref(5000);

// Computed property to get notifications from the service
const notifications = computed(() => {
  return notificationService.getNotifications();
});

// Initialize service with default options
onMounted(() => {
  notificationService.setOptions({
    maxCount: maxCount.value,
    defaultPosition: position.value,
    defaultAutoDismiss: defaultAutoDismiss.value,
    defaultDuration: defaultDuration.value
  });
});

// Basic notification examples
const showInfoNotification = () => {
  notificationService.info('This is an information notification.');
};

const showSuccessNotification = () => {
  notificationService.success('Operation completed successfully!');
};

const showWarningNotification = () => {
  notificationService.warning('Please be careful with this action.');
};

const showErrorNotification = () => {
  notificationService.error('An error occurred. Please try again.');
};

// Advanced notification options
const showNotificationWithTitle = () => {
  notificationService.info('This notification includes a title.', {
    title: 'Notification Title'
  });
};

const showNotificationWithAction = () => {
  notificationService.info('This notification includes action buttons.', {
    title: 'With Actions',
    actions: [
      { id: 'dismiss', label: 'Dismiss' },
      { id: 'view', label: 'View Details', variant: 'primary' }
    ]
  });
};

const showCustomNotification = () => {
  notificationService.custom('Jane Doe sent you a message: "Hey, can we talk?"', {
    title: 'New Message',
    type: 'info',
    custom: true,
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    name: 'Jane Doe',
    time: 'Just now',
    customActions: [
      { id: 'ignore', label: 'Ignore' },
      { id: 'reply', label: 'Reply' }
    ]
  });
};

const showPersistentNotification = () => {
  notificationService.info('This notification will stay until dismissed.', {
    title: 'Persistent Notification',
    autoDismiss: false
  });
};

// Service configuration
const changeMaxCount = () => {
  // Cycle through different max counts
  maxCount.value = maxCount.value === 5 ? 3 : maxCount.value === 3 ? 10 : 5;
  
  notificationService.setOptions({ maxCount: maxCount.value });
  
  notificationService.info(`Maximum notification count set to ${maxCount.value}.`);
};

const toggleAutoDismiss = () => {
  defaultAutoDismiss.value = !defaultAutoDismiss.value;
  
  notificationService.setOptions({ 
    defaultAutoDismiss: defaultAutoDismiss.value 
  });
  
  notificationService.info(
    defaultAutoDismiss.value 
      ? 'Notifications will now auto-dismiss by default.' 
      : 'Notifications will now stay until dismissed.',
    {
      autoDismiss: defaultAutoDismiss.value
    }
  );
};

const changePosition = () => {
  // Cycle through different positions
  const positions: ToastPosition[] = [
    'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
  ];
  
  const currentIndex = positions.indexOf(position.value);
  const nextIndex = (currentIndex + 1) % positions.length;
  position.value = positions[nextIndex];
  
  notificationService.info(`Notifications now appear at the ${position.value} position.`);
};

const clearAllNotifications = () => {
  notificationService.clearAll();
};

// Event handlers
const handleRemove = (id: string) => {
  notificationService.remove(id);
};

const handleAction = (notificationId: string, actionId: string) => {
  alert(`Action "${actionId}" clicked on notification ${notificationId}`);
  notificationService.remove(notificationId);
};
</script>

<style scoped>
.notification-service-example {
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
</style>