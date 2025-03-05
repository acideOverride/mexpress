<template>
  <div class="dashboard-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <div 
      class="dashboard-sidebar" 
      :style="{ 
        width: sidebarCollapsed ? `${sidebarCollapsedWidth}px` : `${sidebarWidth}px` 
      }"
    >
      <slot name="sidebar">
        <Sidebar 
          :collapsed="sidebarCollapsed" 
          :width="sidebarWidth" 
          :collapsed-width="sidebarCollapsedWidth"
          :items="sidebarItems"
        />
      </slot>
      <div class="sidebar-toggle" @click="toggleSidebar">
        <div class="toggle-icon"></div>
      </div>
    </div>
    <div class="dashboard-main">
      <header class="dashboard-header">
        <slot name="header"></slot>
      </header>
      <main class="dashboard-content">
        <slot></slot>
      </main>
      <footer class="dashboard-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue';
import { DashboardLayoutProps, SidebarItem } from '@/types';
import Sidebar from './Sidebar.vue';

export default defineComponent({
  name: 'DashboardLayout',
  components: {
    Sidebar
  },
  props: {
    sidebarCollapsed: {
      type: Boolean,
      default: false
    },
    sidebarWidth: {
      type: Number,
      default: 280
    },
    sidebarCollapsedWidth: {
      type: Number,
      default: 64
    },
    sidebarItems: {
      type: Array as PropType<SidebarItem[]>,
      default: () => []
    }
  },
  emits: ['update:sidebarCollapsed'],
  setup(props, { emit }) {
    const collapsed = ref(props.sidebarCollapsed);
    
    onMounted(() => {
      // On mobile, default to collapsed
      if (window.innerWidth < 768 && !props.sidebarCollapsed) {
        toggleSidebar();
      }
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
    
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed.value) {
        toggleSidebar();
      }
    };
    
    const toggleSidebar = () => {
      collapsed.value = !collapsed.value;
      emit('update:sidebarCollapsed', collapsed.value);
    };
    
    return {
      toggleSidebar
    };
  }
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.dashboard-sidebar {
  position: relative;
  height: 100%;
  background-color: #1e293b;
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.sidebar-toggle {
  position: absolute;
  bottom: 20px;
  right: -12px;
  width: 24px;
  height: 24px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.toggle-icon {
  width: 10px;
  height: 10px;
  border-top: 2px solid #334155;
  border-right: 2px solid #334155;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
  position: relative;
  left: -2px;
}

.sidebar-collapsed .toggle-icon {
  transform: rotate(225deg);
  left: 2px;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f8fafc;
}

.dashboard-header {
  height: 64px;
  padding: 0 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.dashboard-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.dashboard-footer {
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-sidebar {
    position: absolute;
    z-index: 1000;
    height: 100%;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
}
</style>