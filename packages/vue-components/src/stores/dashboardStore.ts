/**
 * Dashboard Store
 * Manages dashboard UI state and dashboard data
 */

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// Define dashboard filter types
export interface DashboardFilter {
  field: string;
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
  value: any;
}

// Dashboard view types
export type DashboardViewMode = 'list' | 'grid' | 'table' | 'calendar' | 'kanban';
export type DashboardTimeRange = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom';
export type DashboardRefreshRate = 'manual' | '30s' | '1m' | '5m' | '15m' | '30m' | '1h';

// Dashboard widget configuration
export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'table' | 'list' | 'calendar' | 'custom';
  title: string;
  dataSource: string;
  size: 'small' | 'medium' | 'large' | 'fullWidth';
  position: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
  settings: Record<string, any>;
  filters?: DashboardFilter[];
}

/**
 * Dashboard Store
 * Manages the dashboard UI state including:
 * - Sidebar collapse state
 * - Active dashboard
 * - Widget configurations
 * - Filters and view modes
 * - Time ranges and refresh rates
 */
export const useDashboardStore = defineStore('dashboard', () => {
  // ====== STATE ======
  const sidebarCollapsed = ref(false);
  const activeEntityType = ref<string>('');
  const activeDashboardId = ref<string>('');
  const dashboards = ref<Record<string, { name: string; widgets: DashboardWidget[] }>>({});
  const viewMode = ref<DashboardViewMode>('table');
  const filters = ref<DashboardFilter[]>([]);
  const timeRange = ref<DashboardTimeRange>('thisMonth');
  const customDateRange = ref<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const refreshRate = ref<DashboardRefreshRate>('manual');
  const lastRefreshed = ref<Date>(new Date());
  const isLoading = ref<boolean>(false);
  const widgetLoadingStates = ref<Record<string, boolean>>({});

  // ====== GETTERS ======
  /**
   * Get the active dashboard configuration
   */
  const activeDashboard = computed(() => {
    return dashboards.value[activeDashboardId.value] || null;
  });

  /**
   * Get the widgets for the active dashboard
   */
  const activeWidgets = computed(() => {
    return activeDashboard.value?.widgets || [];
  });

  /**
   * Get the formatted time range for display
   */
  const formattedTimeRange = computed(() => {
    switch (timeRange.value) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'thisWeek':
        return 'This Week';
      case 'lastWeek':
        return 'Last Week';
      case 'thisMonth':
        return 'This Month';
      case 'lastMonth':
        return 'Last Month';
      case 'thisYear':
        return 'This Year';
      case 'custom':
        if (customDateRange.value.start && customDateRange.value.end) {
          return `${formatDate(customDateRange.value.start)} to ${formatDate(customDateRange.value.end)}`;
        }
        return 'Custom Range';
      default:
        return 'This Month';
    }
  });

  /**
   * Check if any widgets are currently loading
   */
  const isAnyWidgetLoading = computed(() => {
    return Object.values(widgetLoadingStates.value).some(state => state);
  });

  // ====== ACTIONS ======
  /**
   * Toggle the sidebar collapsed state
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  /**
   * Set the sidebar collapsed state
   */
  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed;
  }

  /**
   * Set the active entity type (customers, products, tickets, etc.)
   */
  function setActiveEntityType(entityType: string) {
    activeEntityType.value = entityType;
  }

  /**
   * Set the active dashboard ID
   */
  function setActiveDashboard(dashboardId: string) {
    activeDashboardId.value = dashboardId;
  }

  /**
   * Add a new dashboard
   */
  function addDashboard(id: string, name: string, widgets: DashboardWidget[] = []) {
    dashboards.value[id] = { name, widgets };
  }

  /**
   * Add a widget to the current dashboard
   */
  function addWidget(widget: DashboardWidget) {
    if (!activeDashboard.value) return;
    
    dashboards.value[activeDashboardId.value].widgets.push(widget);
  }

  /**
   * Update a widget in the current dashboard
   */
  function updateWidget(widgetId: string, updates: Partial<DashboardWidget>) {
    if (!activeDashboard.value) return;
    
    const widgetIndex = dashboards.value[activeDashboardId.value].widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex === -1) return;
    
    dashboards.value[activeDashboardId.value].widgets[widgetIndex] = {
      ...dashboards.value[activeDashboardId.value].widgets[widgetIndex],
      ...updates
    };
  }

  /**
   * Remove a widget from the current dashboard
   */
  function removeWidget(widgetId: string) {
    if (!activeDashboard.value) return;
    
    dashboards.value[activeDashboardId.value].widgets = 
      dashboards.value[activeDashboardId.value].widgets.filter(w => w.id !== widgetId);
  }

  /**
   * Set the view mode for the current dashboard
   */
  function setViewMode(mode: DashboardViewMode) {
    viewMode.value = mode;
  }

  /**
   * Set the time range for the current dashboard
   */
  function setTimeRange(range: DashboardTimeRange, start?: Date, end?: Date) {
    timeRange.value = range;
    
    if (range === 'custom' && start && end) {
      customDateRange.value = { start, end };
    }
  }

  /**
   * Set the refresh rate for the current dashboard
   */
  function setRefreshRate(rate: DashboardRefreshRate) {
    refreshRate.value = rate;
  }

  /**
   * Add a filter to the current dashboard
   */
  function addFilter(filter: DashboardFilter) {
    filters.value.push(filter);
  }

  /**
   * Update a filter in the current dashboard
   */
  function updateFilter(index: number, filter: DashboardFilter) {
    if (index >= 0 && index < filters.value.length) {
      filters.value[index] = filter;
    }
  }

  /**
   * Remove a filter from the current dashboard
   */
  function removeFilter(index: number) {
    if (index >= 0 && index < filters.value.length) {
      filters.value.splice(index, 1);
    }
  }

  /**
   * Clear all filters from the current dashboard
   */
  function clearFilters() {
    filters.value = [];
  }

  /**
   * Set the loading state for a specific widget
   */
  function setWidgetLoading(widgetId: string, loading: boolean) {
    widgetLoadingStates.value[widgetId] = loading;
  }

  /**
   * Refresh dashboard data
   */
  function refreshDashboard() {
    isLoading.value = true;
    
    // In a real implementation, this would fetch data for each widget
    // For now, we'll just simulate a refresh with a timeout
    setTimeout(() => {
      lastRefreshed.value = new Date();
      isLoading.value = false;
    }, 500);
  }

  /**
   * Reset the dashboard to its default state
   */
  function resetDashboard() {
    filters.value = [];
    timeRange.value = 'thisMonth';
    customDateRange.value = { start: null, end: null };
    refreshRate.value = 'manual';
    viewMode.value = 'table';
  }

  // Helper function to format dates
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return {
    // State
    sidebarCollapsed,
    activeEntityType,
    activeDashboardId,
    dashboards,
    viewMode,
    filters,
    timeRange,
    customDateRange,
    refreshRate,
    lastRefreshed,
    isLoading,
    widgetLoadingStates,
    
    // Getters
    activeDashboard,
    activeWidgets,
    formattedTimeRange,
    isAnyWidgetLoading,
    
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    setActiveEntityType,
    setActiveDashboard,
    addDashboard,
    addWidget,
    updateWidget,
    removeWidget,
    setViewMode,
    setTimeRange,
    setRefreshRate,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    setWidgetLoading,
    refreshDashboard,
    resetDashboard
  };
});