import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Toast from '@/components/ui/Toast.vue';

describe('Toast Component', () => {
  // Basic rendering
  it('renders correctly with default props', () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: true,
        message: 'Test toast message'
      }
    });
    
    expect(wrapper.find('.toast-container').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test toast message');
    expect(wrapper.classes()).toContain('toast-info'); // default type
  });

  // Different types test
  it('renders with different types', async () => {
    const types = ['success', 'error', 'warning', 'info'];
    
    for(const type of types) {
      const wrapper = mount(Toast, {
        props: {
          modelValue: true,
          message: `${type} message`,
          type
        }
      });
      
      expect(wrapper.classes()).toContain(`toast-${type}`);
      expect(wrapper.find(`.toast-icon-${type}`).exists()).toBe(true);
    }
  });

  // Show/hide functionality
  it('shows and hides based on modelValue', async () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: false,
        message: 'Hidden toast'
      }
    });
    
    expect(wrapper.isVisible()).toBe(false);
    
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.isVisible()).toBe(true);
    
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.isVisible()).toBe(false);
  });

  // Auto-dismiss functionality
  it('auto-dismisses after specified duration', async () => {
    vi.useFakeTimers();
    
    const wrapper = mount(Toast, {
      props: {
        modelValue: true,
        message: 'Auto-dismiss toast',
        autoDismiss: true,
        duration: 2000
      }
    });
    
    const emitSpy = vi.spyOn(wrapper.vm, '$emit');
    
    vi.advanceTimersByTime(1000);
    expect(emitSpy).not.toHaveBeenCalledWith('update:modelValue', false);
    
    vi.advanceTimersByTime(1000);
    expect(emitSpy).toHaveBeenCalledWith('update:modelValue', false);
    
    vi.useRealTimers();
  });

  // Progress bar test
  it('shows progress bar when enabled', () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: true,
        message: 'Toast with progress',
        showProgress: true,
        duration: 3000
      }
    });
    
    expect(wrapper.find('.toast-progress').exists()).toBe(true);
  });

  // Dismissible test
  it('emits close event when dismiss button is clicked', async () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: true,
        message: 'Dismissible toast',
        dismissible: true
      }
    });
    
    expect(wrapper.find('.toast-dismiss').exists()).toBe(true);
    
    await wrapper.find('.toast-dismiss').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  // Position test
  it('applies correct position class', () => {
    const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'];
    
    for(const position of positions) {
      const wrapper = mount(Toast, {
        props: {
          modelValue: true,
          message: 'Positioned toast',
          position
        }
      });
      
      expect(wrapper.classes()).toContain(`toast-${position}`);
    }
  });

  // Custom content with slots
  it('renders custom content using slot', () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<div class="custom-content">Custom toast content</div>'
      }
    });
    
    expect(wrapper.find('.custom-content').exists()).toBe(true);
    expect(wrapper.text()).toContain('Custom toast content');
  });

  // Actions slot
  it('renders actions using slot', () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: true,
        message: 'Toast with actions'
      },
      slots: {
        actions: '<button class="action-button">Action</button>'
      }
    });
    
    expect(wrapper.find('.action-button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Action');
  });

  // Events
  it('emits events on show and hide', async () => {
    const wrapper = mount(Toast, {
      props: {
        modelValue: false,
        message: 'Event toast'
      }
    });
    
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.emitted('show')).toBeTruthy();
    
    await wrapper.setProps({ modelValue: false });
    expect(wrapper.emitted('hide')).toBeTruthy();
  });
});