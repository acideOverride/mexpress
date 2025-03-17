import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import RepairTimelineItem from '../../../../frontend/src/vue-components/ui/RepairTimelineItem.vue';

describe('RepairTimelineItem', () => {
  it('mounts properly', () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        customerName: 'John Doe',
        deviceName: 'MacBook Pro'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with correct props', () => {
    const props = {
      status: 'in-progress',
      statusText: 'In Progress',
      statusDescription: 'On track',
      customerName: 'John Doe',
      customerPhone: '123-456-7890',
      deviceName: 'MacBook Pro',
      deviceType: 'mac',
      deviceIssue: 'Won\'t boot',
      etaDate: '2025-03-25',
      promiseText: 'End of day',
      overdue: false,
      urgent: false
    };

    const wrapper = mount(RepairTimelineItem, { props });
    
    // Check status
    expect(wrapper.find('.status-badge').text()).toBe('In Progress');
    expect(wrapper.find('.status-text').text()).toBe('On track');
    
    // Check customer info
    expect(wrapper.find('.customer-name').text()).toBe('John Doe');
    expect(wrapper.find('.customer-contact').text()).toContain('123-456-7890');
    
    // Check device info
    expect(wrapper.find('.device-name').text()).toBe('MacBook Pro');
    expect(wrapper.find('.device-issue').text()).toBe('Won\'t boot');
    
    // Check ETA
    expect(wrapper.find('.eta-date').text()).toContain('2025-03-25');
    expect(wrapper.find('.eta-time').text()).toBe('End of day');
  });

  it('computes customer initials correctly', () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        customerName: 'John Doe',
        deviceName: 'MacBook Pro'
      }
    });
    
    expect(wrapper.find('.customer-avatar').text()).toBe('JD');
    
    // Test with single name
    wrapper.setProps({ customerName: 'John' });
    expect(wrapper.find('.customer-avatar').text()).toBe('J');
    
    // Test with more than two names
    wrapper.setProps({ customerName: 'John Middle Doe' });
    expect(wrapper.find('.customer-avatar').text()).toBe('JM');
  });

  it('applies proper status classes', async () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        status: 'in-progress',
        statusText: 'In Progress',
        customerName: 'John Doe',
        deviceName: 'MacBook Pro'
      }
    });
    
    expect(wrapper.find('.status-badge').classes()).toContain('in-progress');
    
    await wrapper.setProps({ status: 'delayed' });
    expect(wrapper.find('.status-badge').classes()).toContain('delayed');
    
    await wrapper.setProps({ status: 'completed' });
    expect(wrapper.find('.status-badge').classes()).toContain('completed');
  });

  it('applies overdue and urgent classes', async () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        status: 'in-progress',
        customerName: 'John Doe',
        deviceName: 'MacBook Pro',
        overdue: true,
        urgent: true
      }
    });
    
    expect(wrapper.classes()).toContain('urgent');
    expect(wrapper.classes()).toContain('overdue');
    
    expect(wrapper.find('.eta-date').classes()).toContain('overdue');
  });

  it('emits click events correctly', async () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        customerName: 'John Doe',
        deviceName: 'MacBook Pro'
      }
    });
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('emits action events correctly', async () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        customerName: 'John Doe',
        deviceName: 'MacBook Pro',
        showNotifyAction: true,
        showDetailsAction: true
      }
    });
    
    // Notify button
    const notifyButton = wrapper.findAll('.timeline-action-btn')[0];
    await notifyButton.trigger('click');
    expect(wrapper.emitted('notify')).toBeTruthy();
    expect(wrapper.emitted('notify')).toHaveLength(1);
    
    // Details button
    const detailsButton = wrapper.findAll('.timeline-action-btn')[1];
    await detailsButton.trigger('click');
    expect(wrapper.emitted('details')).toBeTruthy();
    expect(wrapper.emitted('details')).toHaveLength(1);
  });

  it('renders device icon based on device type', async () => {
    const wrapper = mount(RepairTimelineItem, {
      props: {
        customerName: 'John Doe',
        deviceName: 'MacBook Pro',
        deviceType: 'mac'
      }
    });
    
    expect(wrapper.find('.device-icon').classes()).toContain('mac');
    
    await wrapper.setProps({ deviceType: 'pc' });
    expect(wrapper.find('.device-icon').classes()).toContain('pc');
    
    await wrapper.setProps({ deviceType: 'phone' });
    expect(wrapper.find('.device-icon').classes()).toContain('phone');
  });

  it('formats dates correctly', () => {
    // Test with string date
    const wrapper = mount(RepairTimelineItem, {
      props: {
        customerName: 'John Doe',
        deviceName: 'MacBook Pro',
        etaDate: '2025-03-25'
      }
    });
    
    expect(wrapper.find('.eta-date').text()).toBe('2025-03-25');
    
    // Test with Date object
    const dateObj = new Date('2025-03-25');
    wrapper.setProps({ etaDate: dateObj });
    
    // This depends on locale, but should contain the correct month and day
    expect(wrapper.vm.formattedEta).toContain('Mar');
    expect(wrapper.vm.formattedEta).toContain('25');
  });
});