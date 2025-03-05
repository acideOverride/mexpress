import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '../Button.vue';

describe('Button Component', () => {
  it('renders with correct label', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Click Me'
      }
    });
    
    expect(wrapper.text()).toContain('Click Me');
  });
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(Button);
    
    await wrapper.trigger('click');
    
    expect(wrapper.emitted().click).toBeTruthy();
    expect(wrapper.emitted().click!.length).toBe(1);
  });
  
  it('applies variant class correctly', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'success'
      }
    });
    
    expect(wrapper.classes()).toContain('btn-success');
  });
  
  it('applies size class correctly', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'large'
      }
    });
    
    expect(wrapper.classes()).toContain('btn-large');
  });
  
  it('applies outlined class correctly', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary',
        outlined: true
      }
    });
    
    expect(wrapper.classes()).toContain('btn-outline-primary');
  });
  
  it('applies rounded class correctly', () => {
    const wrapper = mount(Button, {
      props: {
        rounded: true
      }
    });
    
    expect(wrapper.classes()).toContain('btn-rounded');
  });
  
  it('applies block class correctly', () => {
    const wrapper = mount(Button, {
      props: {
        block: true
      }
    });
    
    expect(wrapper.classes()).toContain('btn-block');
  });
  
  it('renders as disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      }
    });
    
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
  
  it('renders loading state correctly', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    });
    
    expect(wrapper.classes()).toContain('btn-loading');
    expect(wrapper.find('.button-spinner').exists()).toBe(true);
    expect(wrapper.attributes('aria-busy')).toBe('true');
  });
  
  it('renders slot content instead of label when slot is provided', () => {
    const wrapper = mount(Button, {
      props: {
        label: 'Button Label'
      },
      slots: {
        default: 'Slot Content'
      }
    });
    
    expect(wrapper.text()).toContain('Slot Content');
    expect(wrapper.text()).not.toContain('Button Label');
  });
});