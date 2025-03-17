/**
 * Dialog Component Unit Tests
 * 
 * Tests for the Dialog component functionality
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Dialog from '@/components/ui/Dialog.vue';

describe('Dialog Component - Base Functionality', () => {
  it('renders when modelValue is true', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        title: 'Test Dialog',
        message: 'This is a test dialog message'
      }
    });
    
    expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    expect(wrapper.find('.modal-title').text()).toBe('Test Dialog');
    expect(wrapper.find('.dialog-message').text()).toBe('This is a test dialog message');
  });

  it('does not render when modelValue is false', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: false,
        title: 'Test Dialog',
        message: 'This is a test dialog message'
      }
    });
    
    expect(wrapper.find('.modal-overlay').exists()).toBe(false);
  });

  it('has the correct ARIA role for alert dialogs', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'alert',
        title: 'Alert Dialog'
      }
    });
    
    expect(wrapper.find('.modal-container').attributes('role')).toBe('alertdialog');
  });
});

describe('Dialog Component - Dialog Types', () => {
  it('renders an alert dialog with OK button', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'alert',
        title: 'Alert Dialog',
        message: 'This is an alert'
      }
    });
    
    const buttons = wrapper.findAll('.dialog-button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].text()).toBe('OK');
  });

  it('renders a confirm dialog with Cancel and Confirm buttons', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'confirm',
        title: 'Confirm Dialog',
        message: 'Are you sure?'
      }
    });
    
    const buttons = wrapper.findAll('.dialog-button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].text()).toBe('Cancel');
    expect(buttons[1].text()).toBe('Confirm');
  });

  it('renders a prompt dialog with input field', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        title: 'Prompt Dialog',
        message: 'Enter your name:'
      }
    });
    
    expect(wrapper.find('.dialog-input').exists()).toBe(true);
    const buttons = wrapper.findAll('.dialog-button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].text()).toBe('Cancel');
    expect(buttons[1].text()).toBe('OK');
  });

  it('allows custom button labels', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'confirm',
        title: 'Custom Buttons',
        message: 'Custom button test',
        confirmText: 'Yes, do it',
        cancelText: 'No, go back'
      }
    });
    
    const buttons = wrapper.findAll('.dialog-button');
    expect(buttons[0].text()).toBe('No, go back');
    expect(buttons[1].text()).toBe('Yes, do it');
  });
});

describe('Dialog Component - Button Interactions', () => {
  it('emits confirm event with true when OK button is clicked in alert dialog', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'alert',
        title: 'Alert Dialog'
      }
    });
    
    await wrapper.find('.dialog-button').trigger('click');
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual([true]);
  });

  it('emits confirm event with false when Cancel button is clicked in confirm dialog', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'confirm',
        title: 'Confirm Dialog'
      }
    });
    
    const buttons = wrapper.findAll('.dialog-button');
    await buttons[0].trigger('click'); // Cancel button
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual([false]);
  });

  it('emits confirm event with true when Confirm button is clicked in confirm dialog', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'confirm',
        title: 'Confirm Dialog'
      }
    });
    
    const buttons = wrapper.findAll('.dialog-button');
    await buttons[1].trigger('click'); // Confirm button
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual([true]);
  });

  it('emits confirm event with input value when OK button is clicked in prompt dialog', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        title: 'Prompt Dialog',
        defaultValue: 'Initial value'
      }
    });
    
    // Change input value
    const input = wrapper.find('.dialog-input');
    await input.setValue('Test input value');
    
    // Click OK button
    const buttons = wrapper.findAll('.dialog-button');
    await buttons[1].trigger('click');
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual(['Test input value']);
  });

  it('emits confirm event with null when Cancel button is clicked in prompt dialog', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        type: 'prompt',
        title: 'Prompt Dialog'
      }
    });
    
    // Click Cancel button
    const buttons = wrapper.findAll('.dialog-button');
    await buttons[0].trigger('click');
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('confirm')?.[0]).toEqual([null]);
  });
});

describe('Dialog Component - Custom Content', () => {
  it('renders custom content through default slot', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        title: 'Custom Dialog'
      },
      slots: {
        default: '<div class="custom-content">This is custom content</div>'
      }
    });
    
    expect(wrapper.find('.custom-content').exists()).toBe(true);
    expect(wrapper.find('.custom-content').text()).toBe('This is custom content');
  });

  it('renders custom buttons through footer slot', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        title: 'Custom Dialog'
      },
      slots: {
        footer: '<button class="custom-button">Custom Button</button>'
      }
    });
    
    expect(wrapper.find('.custom-button').exists()).toBe(true);
    expect(wrapper.find('.custom-button').text()).toBe('Custom Button');
  });
});
</string>
</invoke>