import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerList from '../CustomerList';
import { Customer } from '../types';

describe('CustomerList Component', () => {
  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: '/avatars/john.jpg',
      status: 'active',
      devices: ['iPhone', 'MacBook'],
      email: 'john@example.com'
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: '/avatars/jane.jpg',
      status: 'inactive',
      devices: ['Android'],
      email: 'jane@example.com'
    }
  ];

  it('renders customer list table with correct headers', () => {
    render(<CustomerList customers={mockCustomers} />);
    
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders customer rows with correct data', () => {
    render(<CustomerList customers={mockCustomers} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe avatar')).toBeInTheDocument();
    expect(screen.getByAltText('Jane Smith avatar')).toBeInTheDocument();
  });

  it('renders status badges with correct classes', () => {
    render(<CustomerList customers={mockCustomers} />);
    
    const activeStatus = screen.getByText('active');
    const inactiveStatus = screen.getByText('inactive');
    
    expect(activeStatus).toHaveClass('customer-list__status-badge--active');
    expect(inactiveStatus).toHaveClass('customer-list__status-badge--inactive');
  });

  it('renders device tags for each customer', () => {
    render(<CustomerList customers={mockCustomers} />);
    
    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('MacBook')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();
  });

  it('handles row click events', () => {
    const onRowClick = jest.fn();
    render(<CustomerList customers={mockCustomers} onRowClick={onRowClick} />);
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow!);
    
    expect(onRowClick).toHaveBeenCalledWith('1');
  });

  it('handles action button clicks', () => {
    const onAction = jest.fn();
    render(<CustomerList customers={mockCustomers} onAction={onAction} />);
    
    const actionButtons = screen.getAllByRole('button');
    fireEvent.click(actionButtons[0]);
    
    expect(onAction).toHaveBeenCalledWith('1', 'menu');
  });

  it('maintains responsive layout', () => {
    const { container } = render(<CustomerList customers={mockCustomers} />);
    
    expect(container.firstChild).toHaveClass('customer-list__container');
    expect(screen.getByRole('table')).toHaveClass('customer-list__table');
  });

  it('handles empty customer list', () => {
    render(<CustomerList customers={[]} />);
    
    expect(screen.getByText('No customers found')).toBeInTheDocument();
  });

  it('applies correct accessibility attributes', () => {
    render(<CustomerList customers={mockCustomers} />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', 'Customer List');
    expect(table).toHaveAttribute('role', 'table');
  });
});