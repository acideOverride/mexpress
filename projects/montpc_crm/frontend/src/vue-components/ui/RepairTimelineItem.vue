<template>
  <div 
    class="timeline-item" 
    :class="{ urgent, overdue }"
    @click="$emit('click')"
  >
    <!-- Status Column -->
    <div class="timeline-status">
      <slot name="status">
        <span 
          class="status-badge" 
          :class="statusClass"
        >{{ statusText }}</span>
        <span class="status-text">{{ statusDescription }}</span>
      </slot>
    </div>
    
    <!-- Customer Column -->
    <div class="timeline-customer">
      <slot name="customer">
        <div class="customer-avatar">{{ customerInitials }}</div>
        <div class="customer-info">
          <div class="customer-name">{{ customerName }}</div>
          <div class="customer-contact">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {{ customerPhone }}
          </div>
        </div>
      </slot>
    </div>
    
    <!-- Device Column -->
    <div class="timeline-device">
      <slot name="device">
        <div 
          class="device-icon" 
          :class="deviceType"
        >
          <DeviceIcon :type="deviceType" />
        </div>
        <div class="device-info">
          <div class="device-name">{{ deviceName }}</div>
          <div class="device-issue">{{ deviceIssue }}</div>
        </div>
      </slot>
    </div>
    
    <!-- ETA Column -->
    <div class="timeline-eta">
      <slot name="eta">
        <div 
          class="eta-date" 
          :class="{ overdue }"
        >{{ formattedEta }}</div>
        <div class="eta-time">{{ promiseText }}</div>
      </slot>
    </div>
    
    <!-- Actions Column -->
    <div class="timeline-actions">
      <slot name="actions">
        <button 
          v-if="showNotifyAction"
          class="timeline-action-btn primary" 
          @click.stop="$emit('notify')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>{{ notifyText }}</span>
        </button>
        <button 
          v-if="showDetailsAction"
          class="timeline-action-btn" 
          @click.stop="$emit('details')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>{{ detailsText }}</span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';

// Utility Device Icon Component
const DeviceIcon = defineComponent({
  props: {
    type: {
      type: String,
      default: 'generic'
    }
  },
  setup(props) {
    return () => {
      switch (props.type) {
        case 'mac':
          return h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
            h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
            h('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
          ]);
        case 'pc':
          return h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
            h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
            h('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
          ]);
        case 'printer':
          return h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('polyline', { points: '6 9 6 2 18 2 18 9' }),
            h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
            h('rect', { x: '6', y: '14', width: '12', height: '8' })
          ]);
        case 'phone':
          return h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('rect', { x: '5', y: '2', width: '14', height: '20', rx: '2', ry: '2' }),
            h('line', { x1: '12', y1: '18', x2: '12', y2: '18.01' })
          ]);
        case 'tablet':
          return h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2', ry: '2' }),
            h('line', { x1: '12', y1: '18', x2: '12', y2: '18.01' })
          ]);
        default:
          return h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }, [
            h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2', ry: '2' }),
            h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
            h('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
          ]);
      }
    };
  }
});

// Types
type RepairStatus = 'delayed' | 'in-progress' | 'waiting-parts' | 'received' | 'completed' | 'ready';
type DeviceType = 'mac' | 'pc' | 'printer' | 'phone' | 'tablet' | 'generic';

// Props
const props = withDefaults(defineProps<{
  status?: RepairStatus;
  statusText?: string;
  statusDescription?: string;
  customerName: string;
  customerPhone?: string;
  deviceName: string;
  deviceType?: DeviceType;
  deviceIssue?: string;
  etaDate?: Date | string;
  promiseText?: string;
  overdue?: boolean;
  urgent?: boolean;
  showNotifyAction?: boolean;
  showDetailsAction?: boolean;
  notifyText?: string;
  detailsText?: string;
}>(), {
  status: 'in-progress',
  statusText: 'In Progress',
  statusDescription: 'On track',
  customerPhone: '',
  deviceType: 'generic',
  deviceIssue: '',
  promiseText: '',
  overdue: false,
  urgent: false,
  showNotifyAction: true,
  showDetailsAction: true,
  notifyText: 'Notify',
  detailsText: 'Details'
});

// Computed
const customerInitials = computed(() => {
  return props.customerName.split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

const formattedEta = computed(() => {
  if (!props.etaDate) return 'No ETA';
  
  if (typeof props.etaDate === 'string') {
    return props.etaDate;
  }
  
  return props.etaDate.toLocaleDateString(undefined, { 
    month: 'short',
    day: 'numeric',
    year: props.etaDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
});

const statusClass = computed(() => {
  return props.status;
});

// Emits
defineEmits<{
  (e: 'click'): void;
  (e: 'notify'): void;
  (e: 'details'): void;
}>();
</script>

<style scoped>
.timeline-item {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1fr 1fr;
  padding: 1rem 1.25rem;
  align-items: center;
  border-bottom: 1px solid var(--border-color-light, #f3f4f6);
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.timeline-item:hover {
  background-color: var(--bg-tertiary, #f3f4f6);
}

.timeline-item.urgent {
  background-color: rgba(239, 68, 68, 0.05);
}

/* Status Column */
.timeline-status {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm, 4px);
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
  width: fit-content;
}

.status-badge.delayed {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger, #ef4444);
}

.status-badge.in-progress {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

.status-badge.waiting-parts {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning, #f59e0b);
}

.status-badge.received {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--info, #0ea5e9);
}

.status-badge.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

.status-badge.ready {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--accent, #8b5cf6);
}

.status-text {
  font-size: 0.7rem;
  color: var(--text-tertiary, #9ca3af);
}

/* Customer Column */
.timeline-customer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  color: white;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary, #111827);
}

.customer-contact {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--text-tertiary, #9ca3af);
}

/* Device Column */
.timeline-device {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.device-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary, #f3f4f6);
  color: var(--text-secondary, #4b5563);
}

.device-icon.mac {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--secondary, #0ea5e9);
}

.device-icon.pc {
  background-color: rgba(139, 92, 246, 0.1);
  color: var(--accent, #8b5cf6);
}

.device-icon.printer {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning, #f59e0b);
}

.device-icon.phone {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success, #10b981);
}

.device-icon.tablet {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.device-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary, #111827);
}

.device-issue {
  font-size: 0.7rem;
  color: var(--text-tertiary, #9ca3af);
}

/* ETA Column */
.timeline-eta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.eta-date {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary, #111827);
}

.eta-date.overdue {
  color: var(--danger, #ef4444);
}

.eta-time {
  font-size: 0.7rem;
  color: var(--text-tertiary, #9ca3af);
}

/* Actions Column */
.timeline-actions {
  display: flex;
  gap: 0.5rem;
}

.timeline-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: var(--bg-tertiary, #f3f4f6);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary, #4b5563);
  cursor: pointer;
  transition: all 0.15s ease;
}

.timeline-action-btn:hover {
  background-color: var(--bg-primary, #ffffff);
  color: var(--text-primary, #111827);
}

.timeline-action-btn.primary {
  background-color: var(--primary, #3b82f6);
  border-color: var(--primary, #3b82f6);
  color: white;
}

.timeline-action-btn.primary:hover {
  background-color: var(--primary-dark, #2563eb);
  border-color: var(--primary-dark, #2563eb);
}

.timeline-action-btn svg {
  width: 12px;
  height: 12px;
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .timeline-action-btn.primary {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

:root[data-theme="night-shift"] .device-icon.mac {
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.2);
}

:root[data-theme="night-shift"] .device-icon.pc {
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.2);
}

:root[data-theme="night-shift"] .device-icon.printer {
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.2);
}

/* Responsive Styles */
@media (max-width: 1280px) {
  .timeline-item {
    grid-template-columns: 1fr 1.5fr 1.5fr 1fr auto;
  }
}

@media (max-width: 992px) {
  .timeline-item {
    grid-template-columns: 1fr 1.5fr 1.5fr auto;
  }
  
  .timeline-eta {
    display: none;
  }
}

@media (max-width: 768px) {
  .timeline-item {
    grid-template-columns: 1fr 1.5fr auto;
  }
  
  .timeline-device {
    display: none;
  }
  
  .timeline-action-btn span {
    display: none;
  }
  
  .timeline-action-btn {
    padding: 0.3rem;
  }
}

@media (max-width: 640px) {
  .timeline-item {
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
  }
  
  .timeline-customer {
    display: none;
  }
}
</style>