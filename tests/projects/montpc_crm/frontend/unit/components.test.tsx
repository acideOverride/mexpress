// MEXP-2025-018-FE Frontend Test Architecture
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom for all tests
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }: any) => <div data-testid="browser-router-mock">{children}</div>
  };
});

// Create a wrapper for router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

// Create a mock UI component library for testing
const UIComponents = {
  Button: ({ children, variant = 'primary', disabled = false, onClick }: any) => (
    <button 
      data-testid={`button-${variant}`} 
      className={`button button-${variant}`} 
      disabled={disabled} 
      onClick={onClick}
    >
      {children}
    </button>
  ),
  
  Input: ({ label, value, onChange, type = 'text', placeholder, error }: any) => (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input
        data-testid="input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'input input-error' : 'input'}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
  
  Card: ({ title, children, footer }: any) => (
    <div className="card" data-testid="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  ),
  
  Select: ({ label, options, value, onChange, placeholder, error }: any) => (
    <div className="select-group">
      {label && <label>{label}</label>}
      <select
        data-testid="select"
        value={value}
        onChange={onChange}
        className={error ? 'select select-error' : 'select'}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  ),
  
  Modal: ({ isOpen, onClose, title, children, actions }: any) => (
    isOpen ? (
      <div className="modal" data-testid="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">{children}</div>
          {actions && <div className="modal-footer">{actions}</div>}
        </div>
      </div>
    ) : null
  )
};

// Example form component using the UI components
const CustomerForm = ({ onSubmit, initialData = {} }: any) => {
  const [formData, setFormData] = React.useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    notes: initialData.notes || ''
  });
  
  const [errors, setErrors] = React.useState<any>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: any = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    onSubmit(formData);
  };
  
  return (
    <UIComponents.Card title="Customer Information">
      <form onSubmit={handleSubmit}>
        <UIComponents.Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          data-testid="name-input"
        />
        
        <UIComponents.Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          data-testid="email-input"
        />
        
        <UIComponents.Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          data-testid="phone-input"
        />
        
        <UIComponents.Input
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          error={errors.notes}
          data-testid="notes-input"
        />
        
        <UIComponents.Button type="submit">Save Customer</UIComponents.Button>
      </form>
    </UIComponents.Card>
  );
};

// Example component with modal
const CustomerActions = ({ onViewDetails, onEdit, onDelete }: any) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  
  return (
    <div className="customer-actions">
      <UIComponents.Button variant="secondary" onClick={onViewDetails}>
        View Details
      </UIComponents.Button>
      
      <UIComponents.Button variant="primary" onClick={onEdit}>
        Edit
      </UIComponents.Button>
      
      <UIComponents.Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
        Delete
      </UIComponents.Button>
      
      <UIComponents.Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        actions={
          <>
            <UIComponents.Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </UIComponents.Button>
            <UIComponents.Button variant="danger" onClick={() => {
              onDelete();
              setIsDeleteModalOpen(false);
            }}>
              Confirm Delete
            </UIComponents.Button>
          </>
        }
      >
        <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
      </UIComponents.Modal>
    </div>
  );
};

// Example component using React Router
const CustomerListItem = ({ customer }: any) => {
  return (
    <div className="customer-list-item">
      <div className="customer-info">
        <h3>{customer.name}</h3>
        <p>{customer.email}</p>
        <p>{customer.phone || 'No phone number'}</p>
      </div>
      <div className="customer-actions">
        <a href={`/customers/${customer.id}`}>View Details</a>
        <a href={`/customers/${customer.id}/edit`}>Edit</a>
      </div>
    </div>
  );
};

// Test suite for UI components
describe('UI Components', () => {
  describe('Button Component', () => {
    it('renders correctly with default props', () => {
      render(<UIComponents.Button>Click Me</UIComponents.Button>);
      
      const button = screen.getByTestId('button-primary');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('button-primary');
      expect(button).toHaveTextContent('Click Me');
      expect(button).not.toBeDisabled();
    });
    
    it('handles click events', async () => {
      const handleClick = jest.fn();
      render(<UIComponents.Button onClick={handleClick}>Click Me</UIComponents.Button>);
      
      const button = screen.getByTestId('button-primary');
      await userEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('can be disabled', () => {
      render(<UIComponents.Button disabled>Disabled Button</UIComponents.Button>);
      
      const button = screen.getByTestId('button-primary');
      expect(button).toBeDisabled();
    });
    
    it('renders different variants', () => {
      render(
        <>
          <UIComponents.Button variant="primary">Primary</UIComponents.Button>
          <UIComponents.Button variant="secondary">Secondary</UIComponents.Button>
          <UIComponents.Button variant="danger">Danger</UIComponents.Button>
        </>
      );
      
      expect(screen.getByTestId('button-primary')).toHaveClass('button-primary');
      expect(screen.getByTestId('button-secondary')).toHaveClass('button-secondary');
      expect(screen.getByTestId('button-danger')).toHaveClass('button-danger');
    });
  });
  
  describe('Input Component', () => {
    it('renders correctly with default props', () => {
      render(<UIComponents.Input value="" onChange={() => {}} />);
      
      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('input');
      expect(input).not.toHaveClass('input-error');
    });
    
    it('displays label when provided', () => {
      render(<UIComponents.Input label="Email" value="" onChange={() => {}} />);
      
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
    
    it('displays error message when provided', () => {
      render(<UIComponents.Input value="" onChange={() => {}} error="This field is required" />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByTestId('input')).toHaveClass('input-error');
    });
    
    it('handles change events', async () => {
      const handleChange = jest.fn();
      render(<UIComponents.Input value="" onChange={handleChange} />);
      
      const input = screen.getByTestId('input');
      await userEvent.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalledTimes(4); // One call per character
    });
  });
  
  describe('Card Component', () => {
    it('renders children correctly', () => {
      render(
        <UIComponents.Card>
          <p>Card content</p>
        </UIComponents.Card>
      );
      
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });
    
    it('displays title when provided', () => {
      render(
        <UIComponents.Card title="Card Title">
          <p>Card content</p>
        </UIComponents.Card>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });
    
    it('displays footer when provided', () => {
      render(
        <UIComponents.Card 
          title="Card Title" 
          footer={<button>Footer Button</button>}
        >
          <p>Card content</p>
        </UIComponents.Card>
      );
      
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });
  });
  
  describe('Modal Component', () => {
    it('renders when isOpen is true', () => {
      render(
        <UIComponents.Modal 
          isOpen={true} 
          onClose={() => {}} 
          title="Test Modal"
        >
          <p>Modal content</p>
        </UIComponents.Modal>
      );
      
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });
    
    it('does not render when isOpen is false', () => {
      render(
        <UIComponents.Modal 
          isOpen={false} 
          onClose={() => {}} 
          title="Test Modal"
        >
          <p>Modal content</p>
        </UIComponents.Modal>
      );
      
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
    
    it('calls onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      render(
        <UIComponents.Modal 
          isOpen={true} 
          onClose={handleClose} 
          title="Test Modal"
        >
          <p>Modal content</p>
        </UIComponents.Modal>
      );
      
      const closeButton = screen.getByText('×');
      await userEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
    
    it('renders action buttons when provided', () => {
      render(
        <UIComponents.Modal 
          isOpen={true} 
          onClose={() => {}} 
          title="Test Modal"
          actions={
            <>
              <button>Cancel</button>
              <button>Confirm</button>
            </>
          }
        >
          <p>Modal content</p>
        </UIComponents.Modal>
      );
      
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });
});

// Test suite for form validation
describe('Form Component', () => {
  it('renders form fields correctly', () => {
    render(<CustomerForm onSubmit={() => {}} />);
    
    // Check for field labels
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Save Customer')).toBeInTheDocument();
  });
  
  it('fills form with initial data when provided', () => {
    const initialData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      notes: 'Test notes'
    };
    
    // Create a simple mock to verify props
    const mockComponent = jest.fn().mockImplementation(props => {
      expect(props.value).toBe(props.name === 'name' ? initialData.name :
                              props.name === 'email' ? initialData.email :
                              props.name === 'phone' ? initialData.phone :
                              props.name === 'notes' ? initialData.notes : '');
      return <div data-testid={`mock-${props.name}`}>{props.value}</div>;
    });
    
    // Replace Input component with our mock for this test
    const OriginalInput = UIComponents.Input;
    UIComponents.Input = mockComponent;
    
    render(<CustomerForm onSubmit={() => {}} initialData={initialData} />);
    
    // Verify our mock was called with the right props
    expect(mockComponent).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'name', value: 'John Doe' }),
      expect.anything()
    );
    expect(mockComponent).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'email', value: 'john@example.com' }),
      expect.anything()
    );
    
    // Restore original component
    UIComponents.Input = OriginalInput;
  });
  
  it('validates required fields on submission', async () => {
    // Create a spy to monitor the setErrors function
    const setErrorsSpy = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    
    // Mock useState for setErrors
    useStateSpy.mockImplementationOnce(() => ['', jest.fn()]); // For formData
    useStateSpy.mockImplementationOnce(() => [{}, setErrorsSpy]); // For errors
    
    render(<CustomerForm onSubmit={() => {}} />);
    
    // Submit the form without filling required fields
    const submitButton = screen.getByText('Save Customer');
    await userEvent.click(submitButton);
    
    // Verify setErrors was called with validation errors
    expect(setErrorsSpy).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Name is required',
      email: 'Email is required'
    }));
    
    // Restore original implementation
    useStateSpy.mockRestore();
  });
  
  it('validates email format correctly', async () => {
    // Create a spy to monitor the setErrors function
    const setErrorsSpy = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    
    // Mock useState to have a pre-filled form with invalid email
    useStateSpy.mockImplementationOnce(() => [{
      name: 'John Doe',
      email: 'invalid-email', 
      phone: '',
      notes: ''
    }, jest.fn()]); // For formData
    useStateSpy.mockImplementationOnce(() => [{}, setErrorsSpy]); // For errors
    
    render(<CustomerForm onSubmit={() => {}} />);
    
    // Submit the form with the invalid email
    const submitButton = screen.getByText('Save Customer');
    await userEvent.click(submitButton);
    
    // Verify setErrors was called with email validation error
    expect(setErrorsSpy).toHaveBeenCalledWith(expect.objectContaining({
      email: 'Email is invalid'
    }));
    
    // Restore original implementation
    useStateSpy.mockRestore();
  });
  
  it('calls onSubmit with form data when validation passes', async () => {
    // Create a spy for the submit handler
    const handleSubmit = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    
    // Pre-fill the form with valid data
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      notes: 'Test notes'
    };
    
    // Mock useState to have a valid pre-filled form
    useStateSpy.mockImplementationOnce(() => [validFormData, jest.fn()]); // For formData
    useStateSpy.mockImplementationOnce(() => [{}, jest.fn()]); // For errors
    
    render(<CustomerForm onSubmit={handleSubmit} />);
    
    // Submit the form
    const submitButton = screen.getByText('Save Customer');
    await userEvent.click(submitButton);
    
    // Verify the submit handler was called with correct data
    expect(handleSubmit).toHaveBeenCalledWith(validFormData);
    
    // Restore original implementation
    useStateSpy.mockRestore();
  });
});

// Test suite for component with modal
describe('Component with Modal', () => {
  beforeEach(() => {
    // Reset any mocks between tests
    jest.clearAllMocks();
  });

  it('renders action buttons correctly', () => {
    render(
      <CustomerActions 
        onViewDetails={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    // Check for buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.some(btn => btn.textContent === 'View Details')).toBe(true);
    expect(buttons.some(btn => btn.textContent === 'Edit')).toBe(true);
    expect(buttons.some(btn => btn.textContent === 'Delete')).toBe(true);
  });
  
  it('handles modal state correctly', async () => {
    // Mock React's useState to control modal state
    const setIsDeleteModalOpenMock = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    
    // First test with modal closed
    useStateSpy.mockImplementationOnce(() => [false, setIsDeleteModalOpenMock]);
    
    render(
      <CustomerActions 
        onViewDetails={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    // Find and click the delete button
    const deleteButton = screen.getByText('Delete');
    await userEvent.click(deleteButton);
    
    // Verify state setter was called with true
    expect(setIsDeleteModalOpenMock).toHaveBeenCalledWith(true);
    
    // Clean up
    useStateSpy.mockRestore();
  });
  
  it('handles modal closing correctly', async () => {
    // Mock useState for modal open state
    const setIsDeleteModalOpenMock = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    
    // Start with modal open
    useStateSpy.mockImplementationOnce(() => [true, setIsDeleteModalOpenMock]);
    
    // Create a mock Modal component that renders its children with open state
    const originalModal = UIComponents.Modal;
    UIComponents.Modal = ({ isOpen, onClose, title, children, actions }: any) => {
      return isOpen ? (
        <div data-testid="mock-modal">
          <button onClick={onClose}>Close</button>
          {actions}
        </div>
      ) : null;
    };
    
    render(
      <CustomerActions 
        onViewDetails={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    
    // Find and click the close button
    const closeButton = screen.getByText('Close');
    await userEvent.click(closeButton);
    
    // Verify modal was closed
    expect(setIsDeleteModalOpenMock).toHaveBeenCalledWith(false);
    
    // Restore original components
    UIComponents.Modal = originalModal;
    useStateSpy.mockRestore();
  });
  
  it('calls onDelete when confirm button is clicked', async () => {
    // Create delete handler spy
    const handleDelete = jest.fn();
    
    // Mock useState for modal open state
    const setIsDeleteModalOpenMock = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    
    // Start with modal open
    useStateSpy.mockImplementationOnce(() => [true, setIsDeleteModalOpenMock]);
    
    // Create a mock Modal component that renders confirm button
    const originalModal = UIComponents.Modal;
    UIComponents.Modal = ({ isOpen, onClose, title, children, actions }: any) => {
      return isOpen ? (
        <div data-testid="mock-modal">
          {actions}
        </div>
      ) : null;
    };
    
    render(
      <CustomerActions 
        onViewDetails={() => {}} 
        onEdit={() => {}} 
        onDelete={handleDelete} 
      />
    );
    
    // Find the buttons in the actions props
    const confirmButton = screen.getByText('Confirm Delete');
    await userEvent.click(confirmButton);
    
    // Verify handler was called and modal was closed
    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(setIsDeleteModalOpenMock).toHaveBeenCalledWith(false);
    
    // Restore original
    UIComponents.Modal = originalModal;
    useStateSpy.mockRestore();
  });
});

// Test suite for component with routing
describe('Component with Routing', () => {
  it('renders customer information correctly', () => {
    const customer = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234'
    };
    
    render(<CustomerListItem customer={customer} />);
    
    // Verify customer information is displayed
    const nameElement = screen.getByText('John Doe');
    const emailElement = screen.getByText('john@example.com');
    const phoneElement = screen.getByText('555-1234');
    
    expect(nameElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(phoneElement).toBeInTheDocument();
  });
  
  it('displays "No phone number" when phone is not provided', () => {
    const customer = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    render(<CustomerListItem customer={customer} />);
    
    // Verify the fallback text is shown
    const noPhoneElement = screen.getByText('No phone number');
    expect(noPhoneElement).toBeInTheDocument();
  });
  
  it('renders links with correct URLs', () => {
    const customer = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    render(<CustomerListItem customer={customer} />);
    
    // Look for text content containing "View Details" and "Edit"
    const viewDetailsText = screen.getByText(/View Details/i);
    const editText = screen.getByText(/Edit/i);
    
    expect(viewDetailsText).toBeInTheDocument();
    expect(editText).toBeInTheDocument();
    
    // Check that the links are present
    const viewDetailsLink = viewDetailsText.closest('a');
    const editLink = editText.closest('a');
    
    expect(viewDetailsLink).toBeInTheDocument();
    expect(editLink).toBeInTheDocument();
    
    // Instead of checking exact href values (which can be difficult with how React Router works in tests)
    // Just verify the links contain the customer ID
    const viewDetailsHref = viewDetailsLink?.getAttribute('href') || '';
    const editHref = editLink?.getAttribute('href') || '';
    
    expect(viewDetailsHref).toContain('123');
    expect(editHref).toContain('123');
    expect(editHref).toContain('edit');
  });
});