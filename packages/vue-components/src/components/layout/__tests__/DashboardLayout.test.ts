import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardLayout from '../DashboardLayout.vue';
import Sidebar from '../Sidebar.vue';

// Mock window.innerWidth for testing responsive behavior
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  });
};

describe('DashboardLayout Component', () => {
  beforeEach(() => {
    // Reset window.innerWidth to desktop size
    mockInnerWidth(1024);
    
    // Mock window addEventListener
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });
  
  it('renders correctly with default props', () => {
    const wrapper = mount(DashboardLayout);
    
    expect(wrapper.find('.dashboard-layout').exists()).toBe(true);
    expect(wrapper.find('.dashboard-sidebar').exists()).toBe(true);
    expect(wrapper.find('.dashboard-main').exists()).toBe(true);
    expect(wrapper.find('.dashboard-header').exists()).toBe(true);
    expect(wrapper.find('.dashboard-content').exists()).toBe(true);
    expect(wrapper.find('.dashboard-footer').exists()).toBe(true);
  });
  
  it('renders the Sidebar component', () => {
    const wrapper = mount(DashboardLayout);
    
    expect(wrapper.findComponent(Sidebar).exists()).toBe(true);
  });
  
  it('applies sidebar width based on props', () => {
    const wrapper = mount(DashboardLayout, {
      props: {
        sidebarWidth: 300
      }
    });
    
    const sidebar = wrapper.find('.dashboard-sidebar');
    expect(sidebar.attributes('style')).toContain('width: 300px');
  });
  
  it('applies collapsed sidebar width when collapsed', () => {
    const wrapper = mount(DashboardLayout, {
      props: {
        sidebarCollapsed: true,
        sidebarCollapsedWidth: 80
      }
    });
    
    const sidebar = wrapper.find('.dashboard-sidebar');
    expect(sidebar.attributes('style')).toContain('width: 80px');
  });
  
  it('toggles sidebar when toggle button is clicked', async () => {
    const wrapper = mount(DashboardLayout);
    
    const toggleButton = wrapper.find('.sidebar-toggle');
    await toggleButton.trigger('click');
    
    expect(wrapper.emitted('update:sidebarCollapsed')).toBeTruthy();
    expect(wrapper.emitted('update:sidebarCollapsed')![0]).toEqual([true]);
  });
  
  it('uses default sidebar items when not provided', () => {
    const wrapper = mount(DashboardLayout);
    const sidebar = wrapper.findComponent(Sidebar);
    
    // Default sidebar items should be an empty array
    expect(sidebar.props('items')).toEqual([]);
  });
  
  it('passes sidebar items to Sidebar component', () => {
    const sidebarItems = [
      { id: '1', label: 'Dashboard', icon: 'D', route: '/dashboard' },
      { id: '2', label: 'Settings', icon: 'S', route: '/settings' }
    ];
    
    const wrapper = mount(DashboardLayout, {
      props: {
        sidebarItems
      }
    });
    
    const sidebar = wrapper.findComponent(Sidebar);
    expect(sidebar.props('items')).toEqual(sidebarItems);
  });
  
  it('adds sidebar-collapsed class when sidebar is collapsed', async () => {
    const wrapper = mount(DashboardLayout, {
      props: {
        sidebarCollapsed: false
      }
    });
    
    expect(wrapper.classes()).not.toContain('sidebar-collapsed');
    
    await wrapper.setProps({ sidebarCollapsed: true });
    expect(wrapper.classes()).toContain('sidebar-collapsed');
  });
  
  it('renders slot content', () => {
    const wrapper = mount(DashboardLayout, {
      slots: {
        default: '<div class="test-content">Main Content</div>',
        header: '<div class="test-header">Header Content</div>',
        footer: '<div class="test-footer">Footer Content</div>'
      }
    });
    
    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-header').exists()).toBe(true);
    expect(wrapper.find('.test-footer').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('Main Content');
    expect(wrapper.find('.test-header').text()).toBe('Header Content');
    expect(wrapper.find('.test-footer').text()).toBe('Footer Content');
  });
  
  it('sets up resize listener on mount', () => {
    mount(DashboardLayout);
    
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
  
  it('should auto-collapse on mobile screen size', () => {
    // Set window width to mobile size
    mockInnerWidth(480);
    
    const wrapper = mount(DashboardLayout);
    
    // Should have called toggleSidebar since screen width is < 768px
    expect(wrapper.emitted('update:sidebarCollapsed')).toBeTruthy();
    expect(wrapper.emitted('update:sidebarCollapsed')![0]).toEqual([true]);
  });
});