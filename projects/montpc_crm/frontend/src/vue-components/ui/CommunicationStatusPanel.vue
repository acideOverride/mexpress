<template>
  <div class="comm-status-panel">
    <!-- Panel Header -->
    <div class="status-header">
      <h2 class="status-title">{{ title }}</h2>
      <span v-if="subtitle" class="status-subtitle">{{ subtitle }}</span>
      <slot name="header-actions"></slot>
    </div>
    
    <!-- Status Grid -->
    <div class="status-grid" :class="`cols-${columns}`">
      <slot>
        <!-- Default no data state if no children provided -->
        <div v-if="isEmpty" class="status-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ emptyText }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
const props = withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  columns?: 1 | 2 | 3 | 4;
  isEmpty?: boolean;
  emptyText?: string;
}>(), {
  columns: 4,
  subtitle: '',
  isEmpty: false,
  emptyText: 'No status data available'
});
</script>

<style scoped>
.comm-status-panel {
  background-color: var(--card-bg, var(--bg-primary, #ffffff));
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color-light, #f3f4f6);
}

/* Create a subtle gradient background */
.comm-status-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(16, 185, 129, 0.05) 50%, 
    rgba(139, 92, 246, 0.05) 100%);
  opacity: 0.7;
  z-index: 0;
}

.status-header {
  position: relative;
  z-index: 1;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
}

.status-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin-bottom: 0.25rem;
  margin-top: 0;
}

.status-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary, #4b5563);
}

.status-grid {
  display: grid;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.status-grid.cols-1 {
  grid-template-columns: 1fr;
}

.status-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.status-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.status-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.status-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-tertiary, #9ca3af);
  background-color: var(--bg-tertiary, #f3f4f6);
  border-radius: var(--radius-md, 8px);
  border: 1px dashed var(--border-color, #e5e7eb);
}

.status-empty svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.status-empty p {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Night Shift Mode Enhancements */
:root[data-theme="night-shift"] .comm-status-panel::before {
  background: linear-gradient(120deg, 
    rgba(59, 130, 246, 0.07) 0%, 
    rgba(16, 185, 129, 0.07) 50%, 
    rgba(139, 92, 246, 0.07) 100%);
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive Styles */
@media (max-width: 1280px) {
  .status-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .status-grid.cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .comm-status-panel {
    padding: 1.25rem;
  }
  
  .status-title {
    font-size: 1.125rem;
  }
  
  .status-grid.cols-2,
  .status-grid.cols-3,
  .status-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>