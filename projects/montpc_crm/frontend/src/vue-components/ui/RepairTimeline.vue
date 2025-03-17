<template>
  <div class="dashboard-panel repair-timeline">
    <!-- Timeline Header -->
    <div class="timeline-header">
      <div class="timeline-status">{{ statusHeader }}</div>
      <div class="timeline-customer">{{ customerHeader }}</div>
      <div class="timeline-device">{{ deviceHeader }}</div>
      <div class="timeline-eta">{{ etaHeader }}</div>
      <div class="timeline-actions">{{ actionsHeader }}</div>
    </div>
    
    <!-- Timeline Items -->
    <div class="timeline-items">
      <slot>
        <!-- Empty state if no items provided -->
        <div v-if="isEmpty" class="timeline-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ emptyText }}</p>
        </div>
      </slot>
    </div>
    
    <!-- Optional footer for pagination or load more -->
    <div v-if="$slots.footer" class="timeline-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = withDefaults(defineProps<{
  statusHeader?: string;
  customerHeader?: string;
  deviceHeader?: string;
  etaHeader?: string;
  actionsHeader?: string;
  isEmpty?: boolean;
  emptyText?: string;
}>(), {
  statusHeader: 'Status',
  customerHeader: 'Customer',
  deviceHeader: 'Device',
  etaHeader: 'ETA',
  actionsHeader: 'Actions',
  isEmpty: false,
  emptyText: 'No repair items found'
});
</script>

<style scoped>
.repair-timeline {
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg, var(--bg-primary, #ffffff));
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  overflow: hidden;
  border: 1px solid var(--border-color-light, #f3f4f6);
  flex: 1;
}

.timeline-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1fr 1fr;
  padding: 0.75rem 1.25rem;
  background-color: var(--bg-tertiary, #f3f4f6);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary, #4b5563);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.timeline-items {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.timeline-items::-webkit-scrollbar {
  width: 4px;
}

.timeline-items::-webkit-scrollbar-track {
  background: transparent;
}

.timeline-items::-webkit-scrollbar-thumb {
  background: var(--text-tertiary, #9ca3af);
  border-radius: 4px;
}

/* Empty state */
.timeline-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-tertiary, #9ca3af);
  height: 100%;
  min-height: 200px;
}

.timeline-empty svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.timeline-empty p {
  font-size: 0.875rem;
  font-weight: 500;
}

.timeline-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
  display: flex;
  justify-content: center;
}

/* Timeline Item Styles - For Reference */
:deep(.timeline-item) {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1fr 1fr;
  padding: 1rem 1.25rem;
  align-items: center;
  border-bottom: 1px solid var(--border-color-light, #f3f4f6);
  transition: background-color 0.2s ease;
}

:deep(.timeline-item:hover) {
  background-color: var(--bg-tertiary, #f3f4f6);
}

:deep(.timeline-item.urgent) {
  background-color: rgba(239, 68, 68, 0.05);
}

/* Responsive styles */
@media (max-width: 1280px) {
  .timeline-header,
  :deep(.timeline-item) {
    grid-template-columns: 1fr 1.5fr 1.5fr 1fr auto;
  }
}

@media (max-width: 992px) {
  .timeline-header,
  :deep(.timeline-item) {
    grid-template-columns: 1fr 1.5fr 1.5fr auto;
  }
  
  .timeline-eta {
    display: none;
  }
  
  :deep(.timeline-eta) {
    display: none;
  }
}

@media (max-width: 768px) {
  .timeline-header,
  :deep(.timeline-item) {
    grid-template-columns: 1fr 1.5fr auto;
  }
  
  .timeline-device,
  :deep(.timeline-device) {
    display: none;
  }
}

@media (max-width: 640px) {
  .timeline-header,
  :deep(.timeline-item) {
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
  }
  
  .timeline-customer,
  :deep(.timeline-customer) {
    display: none;
  }
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .timeline-item.urgent {
  box-shadow: inset 0 0 15px rgba(239, 68, 68, 0.1);
}
</style>