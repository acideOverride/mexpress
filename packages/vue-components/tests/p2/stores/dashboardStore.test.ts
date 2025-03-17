/**
 * DashboardStore Unit Tests
 * 
 * Tests the dashboard state management functionality including:
 * - Dashboard widget management
 * - Filters and view modes
 * - Time ranges and refresh rates
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDashboardStore, DashboardWidget } from '../../../src/stores/dashboardStore';

describe('Dashboard Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active
    setActivePinia(createPinia());
    
    // Clear mock calls
    vi.clearAllMocks();
    
    // Reset Date.now() mocking
    vi.useRealTimers();
  });

  // Basic initialization tests
  it('initializes with default dashboard settings', () => {
    const dashboardStore = useDashboardStore();
    
    // Check default values
    expect(dashboardStore.sidebarCollapsed).toBe(false);
    expect(dashboardStore.activeEntityType).toBe('');
    expect(dashboardStore.activeDashboardId).toBe('');
    expect(dashboardStore.viewMode).toBe('table');
    expect(dashboardStore.filters).toEqual([]);
    expect(dashboardStore.timeRange).toBe('thisMonth');
    expect(dashboardStore.refreshRate).toBe('manual');
    expect(dashboardStore.isLoading).toBe(false);
  });

  // Sidebar tests
  it('handles sidebar state', () => {
    const dashboardStore = useDashboardStore();
    
    // Test sidebar toggle
    dashboardStore.toggleSidebar();
    expect(dashboardStore.sidebarCollapsed).toBe(true);
    
    dashboardStore.toggleSidebar();
    expect(dashboardStore.sidebarCollapsed).toBe(false);
    
    // Test direct setting
    dashboardStore.setSidebarCollapsed(true);
    expect(dashboardStore.sidebarCollapsed).toBe(true);
  });

  // Dashboard management tests
  it('manages dashboards and widgets', () => {
    const dashboardStore = useDashboardStore();
    
    // Add a dashboard
    dashboardStore.addDashboard('customer-dashboard', 'Customer Overview', []);
    expect(dashboardStore.dashboards).toHaveProperty('customer-dashboard');
    
    // Set active dashboard
    dashboardStore.setActiveDashboard('customer-dashboard');
    expect(dashboardStore.activeDashboardId).toBe('customer-dashboard');
    expect(dashboardStore.activeDashboard).toEqual({
      name: 'Customer Overview',
      widgets: []
    });
    
    // Add a widget
    const widget: DashboardWidget = {
      id: 'widget-1',
      type: 'stats',
      title: 'Customer Count',
      dataSource: 'customers/count',
      size: 'medium',
      position: { row: 0, col: 0, width: 1, height: 1 },
      settings: {}
    };
    
    dashboardStore.addWidget(widget);
    expect(dashboardStore.activeWidgets).toHaveLength(1);
    expect(dashboardStore.activeWidgets[0].id).toBe('widget-1');
    
    // Update a widget
    dashboardStore.updateWidget('widget-1', {
      title: 'Updated Title',
      size: 'large'
    });
    
    expect(dashboardStore.activeWidgets[0].title).toBe('Updated Title');
    expect(dashboardStore.activeWidgets[0].size).toBe('large');
    
    // Remove a widget
    dashboardStore.removeWidget('widget-1');
    expect(dashboardStore.activeWidgets).toHaveLength(0);
  });

  // View mode tests
  it('handles view mode changes', () => {
    const dashboardStore = useDashboardStore();
    
    // Change view mode
    dashboardStore.setViewMode('grid');
    expect(dashboardStore.viewMode).toBe('grid');
    
    dashboardStore.setViewMode('calendar');
    expect(dashboardStore.viewMode).toBe('calendar');
  });

  // Filter tests
  it('manages dashboard filters', () => {
    const dashboardStore = useDashboardStore();
    
    // Add filters
    dashboardStore.addFilter({
      field: 'status',
      operator: 'eq',
      value: 'active'
    });
    
    expect(dashboardStore.filters).toHaveLength(1);
    expect(dashboardStore.filters[0].field).toBe('status');
    
    // Add another filter
    dashboardStore.addFilter({
      field: 'createdAt',
      operator: 'gt',
      value: '2025-01-01'
    });
    
    expect(dashboardStore.filters).toHaveLength(2);
    
    // Update a filter
    dashboardStore.updateFilter(0, {
      field: 'status',
      operator: 'in',
      value: ['active', 'pending']
    });
    
    expect(dashboardStore.filters[0].operator).toBe('in');
    expect(dashboardStore.filters[0].value).toEqual(['active', 'pending']);
    
    // Remove a filter
    dashboardStore.removeFilter(1);
    expect(dashboardStore.filters).toHaveLength(1);
    
    // Clear all filters
    dashboardStore.clearFilters();
    expect(dashboardStore.filters).toHaveLength(0);
  });

  // Time range tests
  it('manages time ranges', () => {
    const dashboardStore = useDashboardStore();
    
    // Set predefined time range
    dashboardStore.setTimeRange('lastWeek');
    expect(dashboardStore.timeRange).toBe('lastWeek');
    expect(dashboardStore.formattedTimeRange).toBe('Last Week');
    
    // Set custom time range
    const start = new Date('2025-01-01');
    const end = new Date('2025-01-31');
    dashboardStore.setTimeRange('custom', start, end);
    
    expect(dashboardStore.timeRange).toBe('custom');
    expect(dashboardStore.customDateRange.start).toEqual(start);
    expect(dashboardStore.customDateRange.end).toEqual(end);
    
    // Format should include the date range
    expect(dashboardStore.formattedTimeRange).toContain('Jan 1, 2025');
    expect(dashboardStore.formattedTimeRange).toContain('Jan 31, 2025');
  });

  // Widget loading tests
  it('tracks widget loading states', () => {
    const dashboardStore = useDashboardStore();
    
    // Set loading state for widgets
    dashboardStore.setWidgetLoading('widget-1', true);
    dashboardStore.setWidgetLoading('widget-2', false);
    
    expect(dashboardStore.widgetLoadingStates).toEqual({
      'widget-1': true,
      'widget-2': false
    });
    
    // Any widget loading should be true
    expect(dashboardStore.isAnyWidgetLoading).toBe(true);
    
    // Set all to false
    dashboardStore.setWidgetLoading('widget-1', false);
    expect(dashboardStore.isAnyWidgetLoading).toBe(false);
  });

  // Refresh dashboard test
  it('refreshes dashboard data', async () => {
    const dashboardStore = useDashboardStore();
    
    // Mock timers
    vi.useFakeTimers();
    
    // Set last refreshed to a known time for easier testing
    const initialDate = new Date('2025-03-01T12:00:00Z');
    dashboardStore.lastRefreshed = initialDate;
    
    // Start refresh
    const refreshPromise = dashboardStore.refreshDashboard();
    
    // Should be in loading state
    expect(dashboardStore.isLoading).toBe(true);
    
    // Advance timers to complete the refresh
    vi.advanceTimersByTime(500);
    
    // Wait for the refresh to complete
    await Promise.resolve();
    
    // Should no longer be loading
    expect(dashboardStore.isLoading).toBe(false);
    
    // Last refreshed should be updated
    expect(dashboardStore.lastRefreshed).not.toEqual(initialDate);
  });

  // Reset dashboard test
  it('resets dashboard to defaults', () => {
    const dashboardStore = useDashboardStore();
    
    // Change various settings
    dashboardStore.setViewMode('grid');
    dashboardStore.setTimeRange('lastWeek');
    dashboardStore.setRefreshRate('30s');
    dashboardStore.addFilter({
      field: 'status',
      operator: 'eq',
      value: 'active'
    });
    
    // Reset everything
    dashboardStore.resetDashboard();
    
    // Check settings are back to defaults
    expect(dashboardStore.viewMode).toBe('table');
    expect(dashboardStore.timeRange).toBe('thisMonth');
    expect(dashboardStore.refreshRate).toBe('manual');
    expect(dashboardStore.filters).toEqual([]);
  });
});