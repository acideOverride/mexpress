<template>
  <Teleport to="body">
    <div 
      class="notification-container"
      :class="[
        `notification-${position}`,
        { 'notification-stacked': stacked }
      ]"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup
        :name="transition"
        tag="div"
        class="notification-list"
      >
        <div
          v-for="notification in displayedNotifications"
          :key="notification.id"
          class="notification-item"
          :class="[
            `notification-${notification.type || 'info'}`,
            { 'notification-item-stacked': stacked }
          ]"
          role="alert"
        >
          <!-- Custom slot for entire notification item -->
          <slot 
            v-if="notification.custom" 
            name="item" 
            :notification="notification"
          />
          
          <!-- Default notification layout -->
          <template v-else>
            <div class="notification-content">
              <div class="notification-icon" :class="`notification-icon-${notification.type || 'info'}`">
                <!-- Success Icon -->
                <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
                </svg>
                
                <!-- Error Icon -->
                <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
                </svg>
                
                <!-- Warning Icon -->
                <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
                </svg>
                
                <!-- Info Icon -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/>
                </svg>
              </div>
              
              <div class="notification-body">
                <div v-if="notification.title" class="notification-title">{{ notification.title }}</div>
                <div class="notification-message">{{ notification.message }}</div>
                
                <div v-if="notification.actions && notification.actions.length" class="notification-actions">
                  <button
                    v-for="action in notification.actions"
                    :key="action.id"
                    class="notification-action"
                    :class="action.variant ? `notification-action-${action.variant}` : ''"
                    @click="handleAction(notification.id, action.id)"
                  >
                    <span v-if="action.icon" class="notification-action-icon">{{ action.icon }}</span>
                    {{ action.label }}
                  </button>
                </div>
              </div>
              
              <button 
                v-if="notification.dismissible !== false"
                class="notification-close"
                @click="handleRemove(notification.id)"
                aria-label="Close notification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
                </svg>
              </button>
            </div>
          </template>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NotificationProps, NotificationItem, ToastPosition } from '@/types';

const props = withDefaults(defineProps<NotificationProps>(), {
  notifications: () => [],
  position: 'top-right',
  maxCount: 5,
  stacked: false,
  transition: 'notification-fade'
});

const emit = defineEmits(['remove', 'action']);

// Compute displayed notifications respecting max count
const displayedNotifications = computed(() => {
  if (props.notifications.length <= props.maxCount) {
    return props.notifications;
  }
  
  // Take only the most recent N notifications
  return props.notifications.slice(-props.maxCount);
});

// Handle notification removal
const handleRemove = (id: string) => {
  emit('remove', id);
};

// Handle notification action
const handleAction = (notificationId: string, actionId: string) => {
  emit('action', notificationId, actionId);
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
  width: 100%;
  max-width: 360px;
  pointer-events: none;
  padding: 1rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.notification-item {
  position: relative;
  margin-bottom: 0.75rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  pointer-events: auto;
  width: 100%;
  transform-origin: center top;
}

.notification-content {
  display: flex;
  padding: 1rem;
  align-items: flex-start;
}

.notification-icon {
  flex-shrink: 0;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.notification-message {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #4b5563;
  word-wrap: break-word;
  overflow-wrap: break-word;
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

.notification-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.notification-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  color: #1f2937;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.notification-action:hover {
  background-color: #e5e7eb;
}

.notification-action-icon {
  margin-right: 0.25rem;
}

/* Notification types */
.notification-success {
  border-left: 4px solid #10b981;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error {
  border-left: 4px solid #ef4444;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning {
  border-left: 4px solid #f59e0b;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info {
  border-left: 4px solid #3b82f6;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

/* Action variants */
.notification-action-primary {
  background-color: #3b82f6;
  color: white;
}

.notification-action-primary:hover {
  background-color: #2563eb;
}

.notification-action-success {
  background-color: #10b981;
  color: white;
}

.notification-action-success:hover {
  background-color: #059669;
}

.notification-action-danger {
  background-color: #ef4444;
  color: white;
}

.notification-action-danger:hover {
  background-color: #dc2626;
}

/* Positions */
.notification-top-right {
  top: 0;
  right: 0;
  align-items: flex-end;
}

.notification-top-left {
  top: 0;
  left: 0;
  align-items: flex-start;
}

.notification-bottom-right {
  bottom: 0;
  right: 0;
  align-items: flex-end;
}

.notification-bottom-left {
  bottom: 0;
  left: 0;
  align-items: flex-start;
}

.notification-top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.notification-bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

/* Stacked notifications */
.notification-stacked .notification-item {
  margin-bottom: 0.5rem;
}

.notification-item-stacked {
  margin-bottom: 0.25rem !important;
  transform: scale(1);
  transition: transform 0.2s ease, margin-bottom 0.2s ease;
}

.notification-item-stacked:not(:first-child) {
  transform: scale(0.95);
  margin-bottom: 0 !important;
}

.notification-item-stacked:not(:first-child):not(:nth-child(2)) {
  transform: scale(0.9);
}

.notification-item-stacked:not(:first-child):not(:nth-child(2)):not(:nth-child(3)) {
  transform: scale(0.85);
}

/* Transitions */
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.notification-fade-move {
  transition: transform 0.3s ease;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .notification-item {
    background-color: #1f2937;
  }
  
  .notification-message {
    color: #e5e7eb;
  }
  
  .notification-action {
    background-color: #374151;
    color: #f3f4f6;
  }
  
  .notification-action:hover {
    background-color: #4b5563;
  }
  
  .notification-close {
    color: #d1d5db;
  }
}
</style>