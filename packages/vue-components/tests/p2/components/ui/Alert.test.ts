import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Alert from '@/components/ui/Alert.vue';

describe('Alert Component', () => {
  // Basic rendering
  it('renders correctly with default props', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Test alert message'
      }
    });
    
    expect(wrapper.find('.alert').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test alert message');
    expect(wrapper.classes()).toContain('alert-info'); // default type
  });

  // Different types test
  it('renders with different types', async () => {
    const types = ['success', 'error', 'warning', 'info'];
    
    for(const type of types) {
      const wrapper = mount(Alert, {
        props: {
          message: `${type} message`,
          type
        }
      });
      
      expect(wrapper.classes()).toContain(`alert-${type}`);
      expect(wrapper.find(`.alert-icon-${type}`).exists()).toBe(true);
    }
  });

  // Title test
  it('renders with title when provided', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Alert Title',
        message: 'Alert message'
      }
    });
    
    expect(wrapper.find('.alert-title').exists()).toBe(true);
    expect(wrapper.text()).toContain('Alert Title');
  });

  // Dismissible test
  it('renders dismiss button when dismissible', async () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Dismissible alert',
        dismissible: true
      }
    });
    
    expect(wrapper.find('.alert-dismiss').exists()).toBe(true);
    
    await wrapper.find('.alert-dismiss').trigger('click');
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });

  // Icon test
  it('displays icon when showIcon is true', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Alert with icon',
        showIcon: true,
        type: 'success'
      }
    });
    
    expect(wrapper.find('.alert-icon').exists()).toBe(true);
    expect(wrapper.find('.alert-icon-success').exists()).toBe(true);
  });

  // Hide icon test
  it('hides icon when showIcon is false', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Alert without icon',
        showIcon: false
      }
    });
    
    expect(wrapper.find('.alert-icon').exists()).toBe(false);
  });

  // With bordered style
  it('applies bordered style when specified', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Bordered alert',
        bordered: true
      }
    });
    
    expect(wrapper.classes()).toContain('alert-bordered');
  });

  // With filled style
  it('applies filled style when specified', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Filled alert',
        filled: true
      }
    });
    
    expect(wrapper.classes()).toContain('alert-filled');
  });

  // Custom content with slots
  it('renders custom content using default slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        default: '<div class="custom-content">Custom alert content</div>'
      }
    });
    
    expect(wrapper.find('.custom-content').exists()).toBe(true);
    expect(wrapper.text()).toContain('Custom alert content');
  });

  // Action slot
  it('renders action using action slot', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Alert with action'
      },
      slots: {
        action: '<button class="action-button">Action</button>'
      }
    });
    
    expect(wrapper.find('.action-button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Action');
  });

  // Custom icon slot
  it('renders custom icon using icon slot', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Alert with custom icon',
        showIcon: true
      },
      slots: {
        icon: '<div class="custom-icon">🔔</div>'
      }
    });
    
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.text()).toContain('🔔');
  });

  // Banner style
  it('renders as banner when specified', () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Banner alert',
        banner: true
      }
    });
    
    expect(wrapper.classes()).toContain('alert-banner');
  });

  // Close event test
  it('emits dismiss event when close is clicked', async () => {
    const wrapper = mount(Alert, {
      props: {
        message: 'Dismissible alert',
        dismissible: true
      }
    });
    
    await wrapper.find('.alert-dismiss').trigger('click');
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });
});