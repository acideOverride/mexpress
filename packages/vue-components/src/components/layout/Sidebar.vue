<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <div class="sidebar-header">
      <div v-if="!collapsed" class="sidebar-logo-full">
        <slot name="logo">
          <div class="default-logo">mExpress</div>
        </slot>
      </div>
      <div v-else class="sidebar-logo-icon">
        <slot name="icon">
          <div class="default-icon">M</div>
        </slot>
      </div>
    </div>
    <div class="sidebar-content">
      <ul class="sidebar-nav">
        <template v-for="item in items" :key="item.id">
          <li class="sidebar-nav-item">
            <a 
              :href="item.route || '#'" 
              class="sidebar-link"
              :class="{ 'sidebar-link-active': isActiveRoute(item.route) }"
            >
              <span v-if="item.icon" class="sidebar-icon">
                {{ item.icon }}
              </span>
              <span v-if="!collapsed" class="sidebar-label">{{ item.label }}</span>
            </a>
            <ul v-if="!collapsed && item.children && item.children.length > 0" class="sidebar-submenu">
              <li v-for="child in item.children" :key="child.id" class="sidebar-submenu-item">
                <a 
                  :href="child.route || '#'" 
                  class="sidebar-sublink"
                  :class="{ 'sidebar-sublink-active': isActiveRoute(child.route) }"
                >
                  <span v-if="child.icon" class="sidebar-subicon">
                    {{ child.icon }}
                  </span>
                  <span class="sidebar-sublabel">{{ child.label }}</span>
                </a>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>
    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { SidebarProps, SidebarItem } from '@/types';

export default defineComponent({
  name: 'Sidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 280
    },
    collapsedWidth: {
      type: Number,
      default: 64
    },
    items: {
      type: Array as PropType<SidebarItem[]>,
      default: () => []
    }
  },
  setup(props) {
    // In a real app this would use a router like vue-router
    // For this simple component, we'll just check the current URL
    const isActiveRoute = (route?: string) => {
      if (!route) return false;
      
      // In browser environment, check against the current URL
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        return currentPath === route || currentPath.startsWith(`${route}/`);
      }
      
      return false;
    };
    
    return {
      isActiveRoute
    };
  }
});
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e293b;
  color: #e2e8f0;
  overflow-x: hidden;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #334155;
  flex-shrink: 0;
}

.default-logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

.default-icon {
  width: 32px;
  height: 32px;
  background-color: #3b82f6;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.25rem;
}

.sidebar-content {
  flex: 1 1 auto;
  overflow-y: auto;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav-item {
  margin-bottom: 0.25rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.sidebar-link:hover {
  background-color: #334155;
  color: #ffffff;
}

.sidebar-link-active {
  background-color: #334155;
  color: #ffffff;
  border-left: 3px solid #3b82f6;
}

.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
}

.sidebar-collapsed .sidebar-icon {
  margin-right: 0;
}

.sidebar-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-submenu {
  list-style: none;
  padding-left: 2.5rem;
  margin: 0.25rem 0 0.5rem 0;
}

.sidebar-sublink {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 0.875rem;
}

.sidebar-sublink:hover {
  background-color: #334155;
  color: #cbd5e1;
}

.sidebar-sublink-active {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.sidebar-subicon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #334155;
  flex-shrink: 0;
}

.sidebar-collapsed .sidebar-submenu,
.sidebar-collapsed .sidebar-footer :not(.sidebar-icon) {
  display: none;
}

.sidebar-collapsed .sidebar-header {
  justify-content: center;
  padding: 1rem;
}

.sidebar-collapsed .sidebar-link {
  justify-content: center;
  padding: 0.75rem;
}
</style>