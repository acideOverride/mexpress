<template>
  <div class="notification-example">
    <h2>Notification Example</h2>
    
    <div class="example-section">
      <h3>Notification Types</h3>
      <div class="controls">
        <button @click="addNotification('info')">Info Notification</button>
        <button @click="addNotification('success')">Success Notification</button>
        <button @click="addNotification('warning')">Warning Notification</button>
        <button @click="addNotification('error')">Error Notification</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Notification Options</h3>
      <div class="controls">
        <button @click="addNotificationWithTitle()">With Title</button>
        <button @click="addNotificationWithAction()">With Action</button>
        <button @click="addNotificationWithMultipleActions()">Multiple Actions</button>
        <button @click="addAutoDismissNotification()">Auto-dismiss (3s)</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Notification Positions</h3>
      <div class="controls">
        <button @click="changePosition('top-right')">Top Right</button>
        <button @click="changePosition('top-left')">Top Left</button>
        <button @click="changePosition('bottom-right')">Bottom Right</button>
        <button @click="changePosition('bottom-left')">Bottom Left</button>
        <button @click="changePosition('top-center')">Top Center</button>
        <button @click="changePosition('bottom-center')">Bottom Center</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Display Settings</h3>
      <div class="controls">
        <button @click="toggleStacked()">{{ stacked ? 'Disable' : 'Enable' }} Stacked Mode</button>
        <button @click="removeAllNotifications()">Clear All Notifications</button>
      </div>
    </div>
    
    <div class="example-section">
      <h3>Custom Content</h3>
      <div class="controls">
        <button @click="addCustomNotification()">Custom Notification</button>
      </div>
    </div>
    
    <!-- Notification component -->
    <Notification
      :notifications="notifications"
      :position="position"
      :stacked="stacked"
      :maxCount="maxCount"
      @remove="handleRemove"
      @action="handleAction"
    >
      <!-- Custom notification template -->
      <template #item="{ notification }">
        <div v-if="notification.custom" class="custom-notification">
          <div class="custom-notification-header">
            <div class="custom-notification-avatar">
              <img :src="notification.avatar" alt="User avatar" />
            </div>
            <div class="custom-notification-info">
              <div class="custom-notification-name">{{ notification.name }}</div>
              <div class="custom-notification-time">{{ notification.time }}</div>
            </div>
            <button class="notification-close" @click="handleRemove(notification.id)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
              </svg>
            </button>
          </div>
          <div class="custom-notification-content">
            {{ notification.message }}
          </div>
          <div class="custom-notification-actions">
            <button 
              v-for="action in notification.customActions" 
              :key="action.id" 
              class="custom-notification-action"
              @click="handleAction(notification.id, action.id)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </template>
    </Notification>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Notification from './Notification.vue';
import { NotificationItem, ToastType, ToastPosition } from '@/types';

// Notification state
const notifications = ref<NotificationItem[]>([]);
const position = ref<ToastPosition>('top-right');
const stacked = ref(false);
const maxCount = ref(5);

// Helper to generate unique IDs
const generateId = () => {
  return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// Basic notification types
const addNotification = (type: ToastType) => {
  notifications.value.push({
    id: generateId(),
    type,
    message: `This is a ${type} notification.`,
    timestamp: new Date(),
    dismissible: true
  });
};

// With title
const addNotificationWithTitle = () => {
  notifications.value.push({
    id: generateId(),
    type: 'info',
    title: 'Notification Title',
    message: 'This notification has a title.',
    timestamp: new Date(),
    dismissible: true
  });
};

// With action
const addNotificationWithAction = () => {
  notifications.value.push({
    id: generateId(),
    type: 'info',
    message: 'This notification has an action button.',
    timestamp: new Date(),
    dismissible: true,
    actions: [
      { id: 'view', label: 'View Details', variant: 'primary' }
    ]
  });
};

// With multiple actions
const addNotificationWithMultipleActions = () => {
  notifications.value.push({
    id: generateId(),
    type: 'warning',
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    timestamp: new Date(),
    dismissible: true,
    actions: [
      { id: 'cancel', label: 'Cancel' },
      { id: 'confirm', label: 'Confirm', variant: 'danger' }
    ]
  });
};

// Auto-dismiss
const addAutoDismissNotification = () => {
  notifications.value.push({
    id: generateId(),
    type: 'success',
    message: 'This notification will auto-dismiss in 3 seconds.',
    timestamp: new Date(),
    dismissible: true,
    autoDismiss: true,
    duration: 3000
  });
  
  // Auto-remove from our local state after duration
  const id = notifications.value[notifications.value.length - 1].id;
  setTimeout(() => {
    handleRemove(id);
  }, 3000);
};

// Custom notification
const addCustomNotification = () => {
  notifications.value.push({
    id: generateId(),
    type: 'info',
    message: 'Jane Doe sent you a message: "Hey, how are you doing?"',
    timestamp: new Date(),
    custom: true,
    name: 'Jane Doe',
    time: '2 minutes ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    customActions: [
      { id: 'ignore', label: 'Ignore' },
      { id: 'reply', label: 'Reply' }
    ]
  });
};

// Position change
const changePosition = (newPosition: ToastPosition) => {
  position.value = newPosition;
  
  // Add a notification to demonstrate the position
  notifications.value.push({
    id: generateId(),
    type: 'info',
    message: `Notifications now appear at the ${newPosition} position.`,
    timestamp: new Date(),
    dismissible: true
  });
};

// Toggle stacked mode
const toggleStacked = () => {
  stacked.value = !stacked.value;
  
  // Add a notification to demonstrate the change
  if (stacked.value) {
    notifications.value.push({
      id: generateId(),
      type: 'info',
      message: 'Stacked mode enabled. Notifications will stack on top of each other.',
      timestamp: new Date(),
      dismissible: true
    });
  } else {
    notifications.value.push({
      id: generateId(),
      type: 'info',
      message: 'Stacked mode disabled. Notifications will display normally.',
      timestamp: new Date(),
      dismissible: true
    });
  }
};

// Clear all notifications
const removeAllNotifications = () => {
  notifications.value = [];
};

// Handlers
const handleRemove = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};

const handleAction = (notificationId: string, actionId: string) => {
  alert(`Action "${actionId}" clicked on notification ${notificationId}`);
  
  // Remove the notification after action
  handleRemove(notificationId);
};
</script>

<style scoped>
.notification-example {
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

/* Custom notification styling */
.custom-notification {
  padding: 1rem;
}

.custom-notification-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.custom-notification-avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
  margin-right: 0.75rem;
}

.custom-notification-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-notification-info {
  flex: 1;
}

.custom-notification-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.custom-notification-time {
  color: #6b7280;
  font-size: 0.75rem;
}

.custom-notification-content {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.custom-notification-actions {
  display: flex;
  gap: 0.5rem;
}

.custom-notification-action {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.custom-notification-action:hover {
  background-color: #e5e7eb;
}

.notification-close {
  flex-shrink: 0;
  margin-left: 0.5rem;
  background: transparent;
  border: none;
  padding: 0;
  color: #9ca3af;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.notification-close:hover {
  opacity: 1;
}
</style>