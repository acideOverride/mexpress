import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Checkbox from '../Checkbox.vue';

describe('Checkbox Component', () => {
  it('renders with correct label', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'Accept terms',
        modelValue: false
      }
    });
    
    expect(wrapper.text()).toContain('Accept terms');
  });
  
  it('emits update:modelValue event when changed', async () => {
    const wrapper = mount(Checkbox, {
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
    const wrapper = mount(Checkbox, {
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
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        disabled: true
      }
    });
    
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.element.disabled).toBe(true);
    expect(wrapper.classes()).toContain('is-disabled');
  });
  
  it('applies required attribute when required prop is true', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        required: true
      }
    });
    
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.element.required).toBe(true);
  });
  
  it('renders slot content instead of label when slot is provided', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'Checkbox Label',
        modelValue: false
      },
      slots: {
        default: 'Custom Slot Content'
      }
    });
    
    expect(wrapper.text()).toContain('Custom Slot Content');
    expect(wrapper.text()).not.toContain('Checkbox Label');
  });
  
  it('applies correct classes when checked', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    });
    
    expect(wrapper.classes()).not.toContain('is-checked');
    
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.classes()).toContain('is-checked');
  });
});