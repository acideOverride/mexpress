import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Select from '../Select.vue';

describe('Select Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
  
  it('renders with correct label', () => {
    const wrapper = mount(Select, {
      props: {
        label: 'Select an option',
        modelValue: '',
        options: defaultOptions
      }
    });
    
    expect(wrapper.text()).toContain('Select an option');
  });
  
  it('renders all options', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: defaultOptions
      }
    });
    
    const options = wrapper.findAll('option');
    expect(options.length).toBe(defaultOptions.length);
    expect(options[0].text()).toBe('Option 1');
    expect(options[1].text()).toBe('Option 2');
    expect(options[2].text()).toBe('Option 3');
  });
  
  it('emits update:modelValue event when option is selected', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: defaultOptions
      }
    });
    
    const select = wrapper.find('select');
    await select.setValue('option2');
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['option2']);
  });
  
  it('reflects the modelValue prop in the selected state', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'option2',
        options: defaultOptions
      }
    });
    
    const select = wrapper.find('select');
    expect(select.element.value).toBe('option2');
    
    await wrapper.setProps({ modelValue: 'option3' });
    expect(select.element.value).toBe('option3');
  });
  
  it('applies disabled state correctly', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: defaultOptions,
        disabled: true
      }
    });
    
    const select = wrapper.find('select');
    expect(select.element.disabled).toBe(true);
    expect(wrapper.classes()).toContain('is-disabled');
  });
  
  it('renders placeholder when provided', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: defaultOptions,
        placeholder: 'Please select'
      }
    });
    
    const placeholderOption = wrapper.find('option[value=""]');
    expect(placeholderOption.exists()).toBe(true);
    expect(placeholderOption.text()).toBe('Please select');
  });
  
  it('clears selection when clearable and clear button is clicked', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'option2',
        options: defaultOptions,
        clearable: true
      }
    });
    
    const clearButton = wrapper.find('.select-clear');
    expect(clearButton.exists()).toBe(true);
    
    await clearButton.trigger('click');
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);
  });
  
  it('handles multiple selection correctly', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ['option1'],
        options: defaultOptions,
        multiple: true
      }
    });
    
    expect(wrapper.classes()).toContain('is-multiple');
    
    const select = wrapper.find('select');
    expect(select.element.multiple).toBe(true);
    
    // Note: Testing multiple select changes is difficult with JSDOM,
    // so we'll test the implementation directly
    const handleChangeFn = wrapper.vm.handleChange;
    
    // Mock event with selectedOptions
    const mockEvent = {
      target: {
        selectedOptions: [
          { value: 'option1' },
          { value: 'option3' }
        ]
      }
    };
    
    handleChangeFn(mockEvent);
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option1', 'option3']]);
  });
  
  it('shows error message when error prop is provided', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: defaultOptions,
        error: 'This field is required'
      }
    });
    
    expect(wrapper.classes()).toContain('has-error');
    expect(wrapper.text()).toContain('This field is required');
    
    const errorDiv = wrapper.find('.select-error');
    expect(errorDiv.exists()).toBe(true);
  });
});