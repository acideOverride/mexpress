<template>
  <div 
    class="notification-item" 
    :class="[
      priority && `priority-${priority}`,
      isRead && 'is-read'
    ]"
  >
    <!-- Priority Indicator -->
    <div class="notification-priority">
      <span class="priority-indicator"></span>
      <span class="priority-label">{{ priorityLabel }}</span>
    </div>
    
    <!-- Notification Content -->
    <div class="notification-content">
      <!-- Header -->
      <div class="notification-header">
        <h3 class="notification-title">
          <slot name="title">{{ title }}</slot>
        </h3>
        <span class="notification-time">{{ formattedTime }}</span>
      </div>
      
      <!-- Body -->
      <div class="notification-body">
        <p><slot>{{ body }}</slot></p>
      </div>
      
      <!-- Meta -->
      <div class="notification-meta">
        <!-- Tags -->
        <div v-if="tags && tags.length > 0" class="notification-tags">
          <span v-for="(tag, index) in tags" :key="index" class="tag">{{ tag }}</span>
        </div>
        
        <!-- Actions -->
        <div class="notification-actions">
          <slot name="actions">
            <button 
              v-if="showCallAction" 
              class="action-btn" 
              @click="$emit('call')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Call</span>
            </button>
            <button 
              v-if="showEmailAction" 
              class="action-btn" 
              @click="$emit('email')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Email</span>
            </button>
            <button 
              v-if="showSmsAction" 
              class="action-btn" 
              @click="$emit('sms')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span>SMS</span>
            </button>
            <button 
              v-if="showDoneAction" 
              class="action-btn" 
              @click="$emit('done')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Done</span>
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Types
type NotificationPriority = 'urgent' | 'high' | 'medium' | 'low';
type TimeDisplay = string | number | Date;

// Props
const props = withDefaults(defineProps<{
  title: string;
  body?: string;
  time: TimeDisplay;
  priority?: NotificationPriority;
  tags?: string[];
  isRead?: boolean;
  showCallAction?: boolean;
  showEmailAction?: boolean;
  showSmsAction?: boolean;
  showDoneAction?: boolean;
}>(), {
  body: '',
  priority: 'medium',
  tags: () => [],
  isRead: false,
  showCallAction: true,
  showEmailAction: true,
  showSmsAction: true,
  showDoneAction: true
});

// Emits
defineEmits<{
  (e: 'call'): void;
  (e: 'email'): void;
  (e: 'sms'): void;
  (e: 'done'): void;
  (e: 'click'): void;
}>();

// Computed
const priorityLabel = computed(() => {
  switch (props.priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return 'Medium';
  }
});

const formattedTime = computed(() => {
  const timeValue = props.time;
  
  if (typeof timeValue === 'string') {
    return timeValue; // Use as-is if already formatted
  }
  
  let date: Date;
  
  if (typeof timeValue === 'number') {
    date = new Date(timeValue);
  } else {
    date = timeValue;
  }
  
  // Get time elapsed
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    // Format as date
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
});
</script>

<style scoped>
.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md, 8px);
  margin-bottom: 0.75rem;
  position: relative;
  background-color: var(--bg-tertiary, #f3f4f6);
  border-left: 3px solid var(--text-tertiary, #9ca3af);
  transition: all 0.2s ease;
}

.notification-item:hover {
  background-color: var(--bg-primary, #ffffff);
}

.notification-item.is-read {
  opacity: 0.75;
}

/* Priority variants */
.notification-item.priority-urgent {
  border-left: 3px solid var(--danger, #ef4444);
}

.notification-item.priority-high {
  border-left: 3px solid var(--warning, #f59e0b);
}

.notification-item.priority-medium {
  border-left: 3px solid var(--info, #0ea5e9);
}

.notification-item.priority-low {
  border-left: 3px solid var(--text-tertiary, #9ca3af);
}

/* Priority indicator */
.notification-priority {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.25rem;
}

.priority-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  background-color: var(--text-tertiary, #9ca3af);
}

.priority-urgent .priority-indicator {
  background-color: var(--danger, #ef4444);
  animation: urgentPulse 2s infinite;
}

@keyframes urgentPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.priority-high .priority-indicator {
  background-color: var(--warning, #f59e0b);
}

.priority-medium .priority-indicator {
  background-color: var(--info, #0ea5e9);
}

.priority-low .priority-indicator {
  background-color: var(--text-tertiary, #9ca3af);
}

.priority-label {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-tertiary, #9ca3af);
}

.priority-urgent .priority-label {
  color: var(--danger, #ef4444);
}

.priority-high .priority-label {
  color: var(--warning, #f59e0b);
}

.priority-medium .priority-label {
  color: var(--info, #0ea5e9);
}

/* Content structure */
.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin: 0;
}

.notification-time {
  font-size: 0.7rem;
  color: var(--text-tertiary, #9ca3af);
}

.notification-body {
  margin-bottom: 0.75rem;
}

.notification-body p {
  font-size: 0.85rem;
  color: var(--text-secondary, #4b5563);
  line-height: 1.5;
  margin: 0;
}

.notification-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Tags */
.notification-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  background-color: var(--bg-primary, #ffffff);
  color: var(--text-secondary, #4b5563);
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm, 4px);
  font-weight: 500;
}

/* Action buttons */
.notification-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-primary, #111827);
}

.action-btn svg {
  width: 12px;
  height: 12px;
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .notification-item.priority-urgent {
  box-shadow: -3px 0 10px -3px rgba(239, 68, 68, 0.5);
}

:root[data-theme="night-shift"] .notification-item.priority-high {
  box-shadow: -3px 0 10px -3px rgba(245, 158, 11, 0.5);
}

:root[data-theme="night-shift"] .notification-item.priority-medium {
  box-shadow: -3px 0 10px -3px rgba(14, 165, 233, 0.5);
}

/* Responsive styles */
@media (max-width: 640px) {
  .notification-tags {
    display: none;
  }
  
  .notification-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .notification-actions {
    flex-wrap: nowrap;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .notification-actions::-webkit-scrollbar {
    display: none;
  }
}
</style>