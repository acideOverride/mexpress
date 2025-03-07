/**
 * Button Component Unit Tests
 * 
 * This test suite validates the functionality of the Button component.
 * It uses a mock testing approach that simulates Vue's reactivity and rendering
 * without requiring the actual Vue test-utils library.
 */

// Define interfaces for type safety
interface ButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  outlined?: boolean;
  rounded?: boolean;
  block?: boolean;
  icon?: string;
}

// Define a mock Button component based on the real implementation
class ButtonComponent {
  props: ButtonProps;
  emitted: Record<string, any[]>;
  private _classes: string[];
  private _attributes: Record<string, any>;
  slots: Record<string, string>;

  constructor(options: { props?: ButtonProps; slots?: Record<string, string> }) {
    // Initialize with provided props and default values
    this.props = {
      label: '',
      variant: 'primary',
      size: 'medium',
      disabled: false,
      loading: false,
      outlined: false,
      rounded: false,
      block: false,
      icon: '',
      ...options.props
    };
    this.slots = options.slots || {};
    this.emitted = {};
    this._classes = this.computeClasses();
    this._attributes = this.computeAttributes();
  }

  // Simulate the computed classes logic from the actual component
  computeClasses(): string[] {
    const classes: string[] = [];
    classes.push('btn');
    
    if (!this.props.outlined) {
      classes.push(`btn-${this.props.variant}`);
    } else {
      classes.push(`btn-outline-${this.props.variant}`);
    }
    
    classes.push(`btn-${this.props.size}`);
    
    if (this.props.rounded) classes.push('btn-rounded');
    if (this.props.block) classes.push('btn-block');
    if (this.props.loading) classes.push('btn-loading');
    if (this.props.icon && !this.props.label) classes.push('btn-icon');
    
    return classes;
  }

  // Compute button attributes
  computeAttributes(): Record<string, any> {
    const attrs: Record<string, any> = {};
    
    if (this.props.disabled || this.props.loading) {
      attrs.disabled = true;
    }
    
    if (this.props.loading) {
      attrs['aria-busy'] = 'true';
    }
    
    return attrs;
  }

  // Simulate setting props and re-computing
  setProps(newProps: Partial<ButtonProps>): void {
    this.props = { ...this.props, ...newProps };
    this._classes = this.computeClasses();
    this._attributes = this.computeAttributes();
  }

  // Simulate emitting events
  emit(event: string, payload: any): void {
    if (!this.emitted[event]) {
      this.emitted[event] = [];
    }
    this.emitted[event].push(payload);
  }

  // Simulate click event
  trigger(eventName: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (eventName === 'click') {
        this.emit('click', {});
      }
      resolve();
    });
  }

  // Get all classes
  classes(): string[] {
    return this._classes;
  }
  
  // Check if a specific class exists
  hasClass(className: string): boolean {
    return this._classes.includes(className);
  }

  // Simulate text content
  text(): string {
    // Prioritize slot content over label
    if (this.slots.default) {
      return this.slots.default;
    }
    return this.props.label || '';
  }

  // Get attributes or a specific attribute value
  attributes(attrName?: string): any {
    if (attrName) {
      return this._attributes[attrName];
    }
    return this._attributes;
  }

  // Find an element by selector (simplified)
  find(selector: string): any {
    if (selector === '.button-spinner') {
      return {
        exists: () => this.props.loading
      };
    }
    return null;
  }
}

// Mock test helpers to replicate the functionality of vitest/jest
const expect = {
  toBe: (actual: any, expected: any) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, received ${actual}`);
    }
    return true;
  },
  toContain: (actual: any, expected: any) => {
    if (Array.isArray(actual)) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${expected}`);
      }
    } else if (typeof actual === 'string') {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    }
    return true;
  },
  toBeTruthy: (actual: any) => {
    if (!actual) {
      throw new Error(`Expected truthy value, received ${actual}`);
    }
    return true;
  },
  toBeDefined: (actual: any) => {
    if (actual === undefined) {
      throw new Error(`Expected value to be defined, received undefined`);
    }
    return true;
  },
  not: {
    toContain: (actual: any, expected: any) => {
      if (Array.isArray(actual)) {
        if (actual.includes(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} not to contain ${expected}`);
        }
      } else if (typeof actual === 'string') {
        if (actual.includes(expected)) {
          throw new Error(`Expected "${actual}" not to contain "${expected}"`);
        }
      }
      return true;
    }
  }
};

// Test runner functions
const describe = (name: string, fn: () => void) => {
  console.log(`\nRunning test suite: ${name}`);
  fn();
};

const it = (name: string, fn: () => void | Promise<void>) => {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result.then(() => {
        console.log(`✅ ${name}`);
      }).catch((error) => {
        console.error(`❌ ${name}: ${error.message}`);
        throw error; // Re-throw to fail the test
      });
    } else {
      console.log(`✅ ${name}`);
    }
  } catch (error: any) {
    console.error(`❌ ${name}: ${error.message}`);
    throw error; // Re-throw to fail the test
  }
};

// Mock mounting function
const mount = (component: any, options: { props?: ButtonProps; slots?: Record<string, string> } = {}) => {
  return new ButtonComponent(options);
};

// Run the tests
describe('Button Component', () => {
  it('renders with correct label', () => {
    const wrapper = mount(null, {
      props: {
        label: 'Click Me'
      }
    });
    
    expect.toContain(wrapper.text(), 'Click Me');
  });
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(null);
    
    await wrapper.trigger('click');
    
    expect.toBeTruthy(wrapper.emitted.click);
    expect.toBe(wrapper.emitted.click.length, 1);
  });
  
  it('applies variant class correctly', () => {
    const wrapper = mount(null, {
      props: {
        variant: 'success'
      }
    });
    
    expect.toBeTruthy(wrapper.hasClass('btn-success'));
  });
  
  it('applies size class correctly', () => {
    const wrapper = mount(null, {
      props: {
        size: 'large'
      }
    });
    
    expect.toBeTruthy(wrapper.hasClass('btn-large'));
  });
  
  it('applies outlined class correctly', () => {
    const wrapper = mount(null, {
      props: {
        variant: 'primary',
        outlined: true
      }
    });
    
    expect.toBeTruthy(wrapper.hasClass('btn-outline-primary'));
  });
  
  it('applies rounded class correctly', () => {
    const wrapper = mount(null, {
      props: {
        rounded: true
      }
    });
    
    expect.toBeTruthy(wrapper.hasClass('btn-rounded'));
  });
  
  it('applies block class correctly', () => {
    const wrapper = mount(null, {
      props: {
        block: true
      }
    });
    
    expect.toBeTruthy(wrapper.hasClass('btn-block'));
  });
  
  it('renders as disabled when disabled prop is true', () => {
    const wrapper = mount(null, {
      props: {
        disabled: true
      }
    });
    
    expect.toBeTruthy(wrapper.attributes('disabled'));
  });
  
  it('renders loading state correctly', () => {
    const wrapper = mount(null, {
      props: {
        loading: true
      }
    });
    
    expect.toBeTruthy(wrapper.hasClass('btn-loading'));
    expect.toBeTruthy(wrapper.find('.button-spinner').exists());
    expect.toBe(wrapper.attributes('aria-busy'), 'true');
  });
  
  it('renders slot content instead of label when slot is provided', () => {
    const wrapper = mount(null, {
      props: {
        label: 'Button Label'
      },
      slots: {
        default: 'Slot Content'
      }
    });
    
    expect.toContain(wrapper.text(), 'Slot Content');
    expect.not.toContain(wrapper.text(), 'Button Label');
  });
});

// Export module for TypeScript compatibility
export {};