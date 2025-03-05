import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Toggle from '../Toggle.vue';

describe('Toggle Component', () => {
  it('renders with correct label', () => {
    const wrapper = mount(Toggle, {
      props: {
        label: 'Dark Mode',
        modelValue: false
      }
    });
    
    expect(wrapper.text()).toContain('Dark Mode');
  });
  
  it('emits update:modelValue event when toggled', async () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false
      }
    });
    
    const input = wrapper.find('input[type="checkbox"]');
    await input.setValue(true);
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
  });
  
  it('reflects the modelValue prop in the checked state', async () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: true
      }
    });
    
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.element.checked).toBe(true);
    
    await wrapper.setProps({ modelValue: false });
    expect(input.element.checked).toBe(false);
  });
  
  it('applies disabled state correctly', () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false,
        disabled: true
      }
    });
    
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.element.disabled).toBe(true);
    expect(wrapper.classes()).toContain('is-disabled');
  });
  
  it('applies size classes correctly', () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false,
        size: 'small'
      }
    });
    
    expect(wrapper.classes()).toContain('toggle-size-small');
    
    // Test different sizes
    return wrapper.setProps({ size: 'large' }).then(() => {
      expect(wrapper.classes()).toContain('toggle-size-large');
      expect(wrapper.classes()).not.toContain('toggle-size-small');
    });
  });
  
  it('applies required attribute when required prop is true', () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false,
        required: true
      }
    });
    
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.element.required).toBe(true);
  });
  
  it('shows required indicator when required prop is true', () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false,
        label: 'Toggle option',
        required: true
      }
    });
    
    const requiredIndicator = wrapper.find('.toggle-required');
    expect(requiredIndicator.exists()).toBe(true);
  });
  
  it('applies correct classes when checked', async () => {
    const wrapper = mount(Toggle, {
      props: {
        modelValue: false
      }
    });
    
    expect(wrapper.classes()).not.toContain('is-checked');
    
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.classes()).toContain('is-checked');
  });
});