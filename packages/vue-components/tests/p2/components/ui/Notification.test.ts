import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Notification from '@/components/ui/Notification.vue';

describe('Notification Container Component', () => {
  // Basic rendering
  it('renders correctly with default props', () => {
    const wrapper = mount(Notification);
    
    expect(wrapper.find('.notification-container').exists()).toBe(true);
    expect(wrapper.find('.notification-list').exists()).toBe(true);
  });

  // Position test
  it('applies correct position class', () => {
    const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'];
    
    for(const position of positions) {
      const wrapper = mount(Notification, {
        props: {
          position
        }
      });
      
      expect(wrapper.classes()).toContain(`notification-${position}`);
    }
  });

  // Notification item rendering
  it('renders notification items', async () => {
    const notifications = [
      { id: '1', message: 'First notification', type: 'info' },
      { id: '2', message: 'Second notification', type: 'success' }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications
      }
    });
    
    expect(wrapper.findAll('.notification-item').length).toBe(2);
    expect(wrapper.text()).toContain('First notification');
    expect(wrapper.text()).toContain('Second notification');
  });

  // Test max count
  it('respects max notifications count', async () => {
    const notifications = [
      { id: '1', message: 'First notification', type: 'info' },
      { id: '2', message: 'Second notification', type: 'success' },
      { id: '3', message: 'Third notification', type: 'warning' },
      { id: '4', message: 'Fourth notification', type: 'error' },
      { id: '5', message: 'Fifth notification', type: 'info' }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications,
        maxCount: 3
      }
    });
    
    expect(wrapper.findAll('.notification-item').length).toBe(3);
    expect(wrapper.text()).toContain('Fifth notification'); // Newest should be visible
    expect(wrapper.text()).toContain('Fourth notification');
    expect(wrapper.text()).toContain('Third notification');
    expect(wrapper.text()).not.toContain('Second notification');
    expect(wrapper.text()).not.toContain('First notification');
  });

  // Test notification removal
  it('emits remove event when notification is closed', async () => {
    const notifications = [
      { id: '1', message: 'Notification to remove', type: 'info' }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications
      }
    });
    
    await wrapper.find('.notification-close').trigger('click');
    expect(wrapper.emitted('remove')?.[0]).toEqual(['1']);
  });

  // Test stacking animation
  it('adds stacking classes when enabled', async () => {
    const notifications = [
      { id: '1', message: 'First notification', type: 'info' },
      { id: '2', message: 'Second notification', type: 'success' }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications,
        stacked: true
      }
    });
    
    expect(wrapper.classes()).toContain('notification-stacked');
    expect(wrapper.findAll('.notification-item')[0].classes()).toContain('notification-item-stacked');
    expect(wrapper.findAll('.notification-item')[1].classes()).toContain('notification-item-stacked');
  });

  // Test animation
  it('applies enter/leave transitions', () => {
    const wrapper = mount(Notification, {
      props: {
        transition: 'custom-transition'
      }
    });
    
    expect(wrapper.find('.custom-transition-group').exists()).toBe(true);
  });

  // Test different notification types
  it('renders notifications with different types', async () => {
    const notifications = [
      { id: '1', message: 'Info notification', type: 'info' },
      { id: '2', message: 'Success notification', type: 'success' },
      { id: '3', message: 'Warning notification', type: 'warning' },
      { id: '4', message: 'Error notification', type: 'error' }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications
      }
    });
    
    const items = wrapper.findAll('.notification-item');
    expect(items[0].classes()).toContain('notification-info');
    expect(items[1].classes()).toContain('notification-success');
    expect(items[2].classes()).toContain('notification-warning');
    expect(items[3].classes()).toContain('notification-error');
  });

  // Test custom action handlers
  it('emits action event when notification action is clicked', async () => {
    const notifications = [
      { 
        id: '1', 
        message: 'Notification with action', 
        type: 'info',
        actions: [
          { id: 'action1', label: 'Click me' }
        ]
      }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications
      }
    });
    
    await wrapper.find('.notification-action').trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['1', 'action1']);
  });

  // Test custom content slot
  it('renders custom content for notifications', () => {
    const notifications = [
      { id: '1', type: 'info', custom: true }
    ];
    
    const wrapper = mount(Notification, {
      props: {
        notifications
      },
      slots: {
        item: `
          <template #item="{ notification }">
            <div class="custom-notification">
              Custom content for ID: {{ notification.id }}
            </div>
          </template>
        `
      }
    });
    
    expect(wrapper.find('.custom-notification').exists()).toBe(true);
    expect(wrapper.text()).toContain('Custom content for ID: 1');
  });
});