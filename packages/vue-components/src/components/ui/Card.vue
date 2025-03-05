<template>
  <div class="card" :class="cardClasses">
    <div v-if="loading" class="card-loading-overlay">
      <div class="card-spinner"></div>
    </div>
    <div v-if="title || subtitle" class="card-header">
      <h3 v-if="title" class="card-title">{{ title }}</h3>
      <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { CardProps } from '@/types';

export default defineComponent({
  name: 'Card',
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: true
    },
    elevated: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const cardClasses = computed(() => {
      return {
        'card-bordered': props.bordered,
        'card-elevated': props.elevated,
        'card-loading': props.loading
      };
    });
    
    return {
      cardClasses
    };
  }
});
</script>

<style scoped>
.card {
  position: relative;
  background-color: #fff;
  border-radius: 0.375rem;
  overflow: hidden;
}

.card-bordered {
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-elevated {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  background-color: rgba(0, 0, 0, 0.03);
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #212529;
}

.card-subtitle {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.card-body {
  padding: 1.25rem;
}

.card-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  background-color: rgba(0, 0, 0, 0.03);
}

.card-loading {
  min-height: 100px;
}

.card-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
}

.card-spinner {
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid rgba(0, 123, 255, 0.25);
  border-right-color: #007bff;
  border-radius: 50%;
  animation: card-spin 1s linear infinite;
}

@keyframes card-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>