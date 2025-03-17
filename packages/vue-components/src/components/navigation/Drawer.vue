<template>
  <div>
    <div 
      v-if="modelValue" 
      class="drawer-backdrop" 
      @click="backdropClick"
      aria-hidden="true"
    ></div>
    <div 
      class="drawer" 
      :class="[
        `drawer--${position}`, 
        { 'drawer--open': modelValue }
      ]"
      role="dialog"
      aria-modal="true"
      :aria-hidden="!modelValue"
      tabindex="-1"
      ref="drawerRef"
    >
      <div class="drawer__content">
        <div v-if="showHeader" class="drawer__header">
          <slot name="header">
            <div class="drawer__title">{{ title }}</div>
            <button 
              v-if="showClose" 
              class="drawer__close" 
              @click="close"
              aria-label="Close drawer"
            >
              &times;
            </button>
          </slot>
        </div>
        <div class="drawer__body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="drawer__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { DrawerProps } from '@/types';

export default defineComponent({
  name: 'Drawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right', 'top', 'bottom'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'open', 'close'],
  setup(props, { emit }) {
    const drawerRef = ref<HTMLElement | null>(null);
    const originalBodyOverflow = ref('');

    // Manage scroll locking
    watch(() => props.modelValue, (value) => {
      if (props.lockScroll) {
        if (value) {
          originalBodyOverflow.value = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = originalBodyOverflow.value;
        }
      }

      if (value) {
        emit('open');
        nextTick(() => {
          // Focus management
          if (drawerRef.value) {
            drawerRef.value.focus();
          }
        });
      } else {
        emit('close');
      }
    });

    // Handle closing the drawer
    const close = () => {
      emit('update:modelValue', false);
    };

    const backdropClick = () => {
      if (props.closeOnBackdrop) {
        close();
      }
    };

    // Handle keyboard navigation (ESC to close)
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.modelValue) {
        close();
      }
    };

    // Set up event listeners
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });

    // Clean up event listeners
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleKeydown);
      
      // Ensure body overflow is restored
      if (props.lockScroll && props.modelValue) {
        document.body.style.overflow = originalBodyOverflow.value;
      }
    });

    return {
      drawerRef,
      close,
      backdropClick
    };
  }
});
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: rgba(0, 0, 0, 0.5);
}

.drawer {
  position: fixed;
  z-index: 1050;
  overflow: hidden;
  background-color: var(--drawer-bg, #fff);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.drawer--left {
  top: 0;
  left: 0;
  width: var(--drawer-width, 300px);
  height: 100%;
  transform: translateX(-100%);
}

.drawer--right {
  top: 0;
  right: 0;
  width: var(--drawer-width, 300px);
  height: 100%;
  transform: translateX(100%);
}

.drawer--top {
  top: 0;
  left: 0;
  width: 100%;
  height: var(--drawer-height, 300px);
  transform: translateY(-100%);
}

.drawer--bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: var(--drawer-height, 300px);
  transform: translateY(100%);
}

.drawer--open {
  transform: translate(0, 0);
}

.drawer__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--drawer-border-color, rgba(0, 0, 0, 0.1));
}

.drawer__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.drawer__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: var(--drawer-close-color, #333);
  font-size: 1.5rem;
  font-weight: 700;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.drawer__close:hover {
  background-color: var(--drawer-close-hover-bg, rgba(0, 0, 0, 0.1));
}

.drawer__body {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

.drawer__footer {
  padding: 1rem;
  border-top: 1px solid var(--drawer-border-color, rgba(0, 0, 0, 0.1));
}

@media (max-width: 576px) {
  .drawer--left,
  .drawer--right {
    width: var(--drawer-mobile-width, 80%);
  }
  
  .drawer--top,
  .drawer--bottom {
    height: var(--drawer-mobile-height, 60%);
  }
}
</style>