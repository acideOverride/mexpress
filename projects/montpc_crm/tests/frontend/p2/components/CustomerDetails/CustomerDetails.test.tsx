import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import CustomerDetails from './CustomerDetails';

expect.extend(toHaveNoViolations);

describe('CustomerDetails', () => {
  const mockCustomer = {
    id: '123',
    name: 'John Doe',
    status: 'Active',
    email: 'john@example.com',
    phone: '+1234567890',
    devices: [
      { id: 'd1', name: 'iPhone 12', status: 'Connected' },
      { id: 'd2', name: 'MacBook Pro', status: 'Offline' }
    ],
    activities: [
      { id: 'a1', type: 'Call', date: '2025-02-19T14:30:00', description: 'Support call' },
      { id: 'a2', type: 'Email', date: '2025-02-18T09:15:00', description: 'Follow-up email' }
    ]
  };

  it('renders customer header information', () => {
    render(<CustomerDetails customer={mockCustomer} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays customer contact information', () => {
    render(<CustomerDetails customer={mockCustomer} />);
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('renders device list panel', () => {
    render(<CustomerDetails customer={mockCustomer} />);
    
    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('iPhone 12')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('displays activity timeline', () => {
    render(<CustomerDetails customer={mockCustomer} />);
    
    expect(screen.getByText('Activity Timeline')).toBeInTheDocument();
    expect(screen.getByText('Support call')).toBeInTheDocument();
    expect(screen.getByText('Follow-up email')).toBeInTheDocument();
  });

  it('provides edit functionality', () => {
    const onEdit = jest.fn();
    render(<CustomerDetails customer={mockCustomer} onEdit={onEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockCustomer.id);
  });

  it('provides delete functionality', () => {
    const onDelete = jest.fn();
    render(<CustomerDetails customer={mockCustomer} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith(mockCustomer.id);
  });

  it('handles empty device list gracefully', () => {
    const customerWithNoDevices = {
      ...mockCustomer,
      devices: []
    };
    
    render(<CustomerDetails customer={customerWithNoDevices} />);
    
    expect(screen.getByText('No devices found')).toBeInTheDocument();
  });

  it('handles empty activity timeline gracefully', () => {
    const customerWithNoActivities = {
      ...mockCustomer,
      activities: []
    };
    
    render(<CustomerDetails customer={customerWithNoActivities} />);
    
    expect(screen.getByText('No activities found')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CustomerDetails customer={mockCustomer} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains accessibility with empty states', async () => {
    const customerWithNoData = {
      ...mockCustomer,
      devices: [],
      activities: []
    };
    
    const { container } = render(<CustomerDetails customer={customerWithNoData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});