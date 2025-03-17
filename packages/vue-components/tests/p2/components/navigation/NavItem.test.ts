import { mount } from '@vue/test-utils';

// Mock component that will be implemented
const NavItem = {
  name: 'NavItem',
  template: `
    <div 
      class="nav-item"
      :class="{ 
        'nav-item--active': active,
        'nav-item--disabled': disabled,
        'nav-item--dropdown': hasDropdown,
        'nav-item--open': open
      }"
      role="menuitem"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @click="!disabled && handleClick"
      @keydown.enter="!disabled && handleClick"
      @keydown.space.prevent="!disabled && handleClick"
    >
      <div class="nav-item__content">
        <slot name="icon"></slot>
        <span class="nav-item__label"><slot></slot></span>
        <span v-if="badge" class="nav-item__badge">{{ badge }}</span>
        <span v-if="hasDropdown" class="nav-item__dropdown-icon"></span>
      </div>
      <div v-if="hasDropdown" class="nav-item__dropdown" v-show="open">
        <slot name="dropdown"></slot>
      </div>
    </div>
  `,
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    badge: {
      type: [String, Number],
      default: null
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'update:open'],
  setup(props: any, { slots, emit }: any) {
    const hasDropdown = !!slots.dropdown;
    
    const handleClick = () => {
      if (hasDropdown) {
        emit('update:open', !props.open);
      }
      emit('click');
    };
    
    return {
      hasDropdown,
      handleClick
    };
  }
};

describe('NavItem', () => {
  it('renders properly with default props', () => {
    const wrapper = mount(NavItem, {
      slots: {
        default: 'Home'
      }
    });
    expect(wrapper.find('.nav-item').exists()).toBe(true);
    expect(wrapper.find('.nav-item__label').text()).toBe('Home');
    expect(wrapper.attributes('role')).toBe('menuitem');
    expect(wrapper.attributes('tabindex')).toBe('0');
  });

  it('applies active class when active prop is true', () => {
    const wrapper = mount(NavItem, {
      props: {
        active: true
      }
    });
    expect(wrapper.classes()).toContain('nav-item--active');
  });

  it('applies disabled class and aria-disabled when disabled prop is true', () => {
    const wrapper = mount(NavItem, {
      props: {
        disabled: true
      }
    });
    expect(wrapper.classes()).toContain('nav-item--disabled');
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('-1');
  });

  it('renders icon in icon slot', () => {
    const wrapper = mount(NavItem, {
      slots: {
        icon: '<span class="custom-icon">🏠</span>',
        default: 'Home'
      }
    });
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.find('.custom-icon').text()).toBe('🏠');
  });

  it('displays badge when badge prop is provided', () => {
    const wrapper = mount(NavItem, {
      props: {
        badge: '5'
      }
    });
    expect(wrapper.find('.nav-item__badge').exists()).toBe(true);
    expect(wrapper.find('.nav-item__badge').text()).toBe('5');
  });

  it('handles click events when not disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(NavItem, {
      slots: {
        default: 'Click me'
      },
      listeners: {
        click: onClick
      }
    });
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    
    await wrapper.trigger('keydown.enter');
    expect(wrapper.emitted('click')?.length).toBe(2);
    
    await wrapper.trigger('keydown.space');
    expect(wrapper.emitted('click')?.length).toBe(3);
  });

  it('does not emit click events when disabled', async () => {
    const wrapper = mount(NavItem, {
      props: {
        disabled: true
      }
    });
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
    
    await wrapper.trigger('keydown.enter');
    expect(wrapper.emitted('click')).toBeFalsy();
    
    await wrapper.trigger('keydown.space');
    expect(wrapper.emitted('click')).toBeFalsy();
  });

  it('detects and renders dropdown content', async () => {
    const wrapper = mount(NavItem, {
      slots: {
        default: 'Products',
        dropdown: '<div class="dropdown-menu">Dropdown content</div>'
      },
      props: {
        open: false
      }
    });
    
    expect(wrapper.classes()).toContain('nav-item--dropdown');
    expect(wrapper.find('.nav-item__dropdown-icon').exists()).toBe(true);
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    expect(wrapper.find('.dropdown-menu').isVisible()).toBe(false);
    
    await wrapper.setProps({ open: true });
    expect(wrapper.classes()).toContain('nav-item--open');
    expect(wrapper.find('.dropdown-menu').isVisible()).toBe(true);
  });

  it('toggles dropdown open state on click', async () => {
    const wrapper = mount(NavItem, {
      slots: {
        default: 'Products',
        dropdown: '<div class="dropdown-menu">Dropdown content</div>'
      }
    });
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:open')).toBeTruthy();
    expect(wrapper.emitted('update:open')![0]).toEqual([true]);
    
    // Simulate v-model behavior
    await wrapper.setProps({ open: true });
    
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:open')![1]).toEqual([false]);
  });
});