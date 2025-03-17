<template>
  <div 
    class="status-card" 
    :class="[
      variant && `variant-${variant}`,
      hoverable && 'hoverable'
    ]"
  >
    <div class="status-icon" :class="variant">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <component :is="iconComponent" />
      </svg>
    </div>
    <div class="status-info">
      <h3 class="status-value">{{ value }}</h3>
      <p class="status-label">{{ label }}</p>
    </div>
    <div v-if="$slots.actions || actionText" class="status-actions">
      <slot name="actions">
        <button v-if="actionText" class="status-action-btn" @click="handleAction">
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Types
type StatusCardVariant = 'urgent' | 'pending' | 'completed' | 'delayed' | 'info';
type StatusCardIcon = 
  | 'alert-circle'  // urgent
  | 'check-circle'  // pending
  | 'check'         // completed
  | 'clock'         // delayed
  | 'info'          // info
  | 'alert-triangle'
  | 'bell'
  | 'file'
  | 'message-circle'
  | 'phone'
  | 'calendar';

// Props
const props = withDefaults(defineProps<{
  value: string | number;
  label: string;
  variant?: StatusCardVariant;
  icon?: StatusCardIcon;
  actionText?: string;
  hoverable?: boolean;
}>(), {
  variant: 'info',
  icon: undefined,
  actionText: '',
  hoverable: true
});

// Emits
const emit = defineEmits<{
  (e: 'action'): void;
}>();

// Computed
const iconComponent = computed(() => {
  // Default icon based on variant if not specified
  const iconType = props.icon || getDefaultIcon();
  
  switch (iconType) {
    case 'alert-circle':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
          )
        }
      };
    case 'check-circle':
      return {
        render() {
          return (
            <>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </>
          )
        }
      };
    case 'check':
      return {
        render() {
          return (
            <polyline points="20 6 9 17 4 12" />
          )
        }
      };
    case 'clock':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </>
          )
        }
      };
    case 'info':
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </>
          )
        }
      };
    case 'alert-triangle':
      return {
        render() {
          return (
            <>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </>
          )
        }
      };
    case 'bell':
      return {
        render() {
          return (
            <>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </>
          )
        }
      };
    case 'file':
      return {
        render() {
          return (
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </>
          )
        }
      };
    case 'message-circle':
      return {
        render() {
          return (
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          )
        }
      };
    case 'phone':
      return {
        render() {
          return (
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          )
        }
      };
    case 'calendar':
      return {
        render() {
          return (
            <>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </>
          )
        }
      };
    default:
      // Default to info icon
      return {
        render() {
          return (
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </>
          )
        }
      };
  }
});

// Helper function to get default icon based on variant
function getDefaultIcon(): StatusCardIcon {
  switch (props.variant) {
    case 'urgent': return 'alert-circle';
    case 'pending': return 'check-circle';
    case 'completed': return 'check';
    case 'delayed': return 'clock';
    case 'info': return 'info';
    default: return 'info';
  }
}

// Action handler
function handleAction() {
  emit('action');
}
</script>

<style scoped>
.status-card {
  background-color: var(--bg-primary, #ffffff);
  border-radius: var(--radius-md, 8px);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
  border: 1px solid var(--border-color-light, #f3f4f6);
  transition: all 0.3s ease;
}

.status-card.hoverable:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
}

.status-icon.urgent {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger, #ef4444);
}

.status-icon.pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning, #f59e0b);
}

.status-icon.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

.status-icon.delayed {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--info, #0ea5e9);
}

.status-info {
  flex: 1;
}

.status-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #111827);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.status-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #4b5563);
  font-weight: 500;
}

.status-actions {
  margin-left: auto;
}

.status-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  border: none;
  border-radius: var(--radius-md, 8px);
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-action-btn:hover {
  background-color: var(--primary, #3b82f6);
  color: white;
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .status-card {
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%);
}

:root[data-theme="night-shift"] .status-icon.urgent {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

:root[data-theme="night-shift"] .status-icon.pending {
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

:root[data-theme="night-shift"] .status-icon.completed {
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

:root[data-theme="night-shift"] .status-icon.delayed {
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.4);
}

/* Special animation for urgent status */
@keyframes pulseUrgent {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.variant-urgent .status-icon {
  animation: pulseUrgent 2s infinite;
}

/* Responsive styles */
@media (max-width: 640px) {
  .status-card {
    padding: 1rem;
  }
  
  .status-icon {
    width: 40px;
    height: 40px;
  }
  
  .status-value {
    font-size: 1.5rem;
  }
}
</style>