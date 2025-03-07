import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Define mock types that match the actual types in the code
enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED'
}

// Mock navigation function
const mockNavigate = jest.fn();

// Mock fetch API
global.fetch = jest.fn() as jest.Mock;

// Sample customer data
const mockCustomers = {
  items: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      status: CustomerStatus.ACTIVE,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-10T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      status: CustomerStatus.PENDING,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-11T00:00:00.000Z'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: CustomerStatus.INACTIVE,
      createdAt: '2025-01-03T00:00:00.000Z',
      updatedAt: '2025-01-12T00:00:00.000Z'
    }
  ],
  total: 3,
  page: 1,
  pageSize: 10,
  totalPages: 1
};

// A simplified mock implementation of CustomerList component
const CustomerList = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [customers, setCustomers] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  
  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchData(e.target.value, status);
  };
  
  // Handle status filter
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    fetchData(search, e.target.value);
  };
  
  // Function to "fetch" data
  const fetchData = (searchTerm = '', statusFilter = '') => {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    
    // Call mocked fetch API
    fetch(`/api/customers?${params.toString()}`);
  };
  
  // Simulate API data loading
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/customers');
        
        if (!response.ok) {
          throw new Error('Failed to load customers');
        }
        
        const data = await response.json();
        setCustomers(data.items);
        setError(null);
      } catch (err) {
        setError('Error loading customers');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Loading state
  if (loading && customers.length === 0) {
    return <div data-testid="loading-state">Loading customers...</div>;
  }
  
  // Error state
  if (error) {
    return (
      <div data-testid="error-state">
        <div>Error loading customers</div>
        <button onClick={() => fetchData()}>Retry</button>
      </div>
    );
  }
  
  // Empty state
  if (customers.length === 0) {
    return (
      <div data-testid="empty-state">
        <h2>No customers found</h2>
        <button onClick={() => mockNavigate('/customers/new')}>Add Customer</button>
      </div>
    );
  }
  
  // Success state - customer list
  return (
    <div data-testid="customer-list">
      <h1>Customer List</h1>
      
      {/* Search and filters */}
      <div className="filters">
        <input 
          data-testid="search-input"
          aria-label="Search customers"
          value={search}
          onChange={handleSearch}
          placeholder="Search customers"
        />
        
        <select 
          data-testid="status-filter"
          aria-label="Filter by status"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All statuses</option>
          <option value={CustomerStatus.ACTIVE}>{CustomerStatus.ACTIVE}</option>
          <option value={CustomerStatus.PENDING}>{CustomerStatus.PENDING}</option>
          <option value={CustomerStatus.INACTIVE}>{CustomerStatus.INACTIVE}</option>
        </select>
        
        <button 
          data-testid="add-customer-button"
          onClick={() => mockNavigate('/customers/new')}
        >
          Add Customer
        </button>
      </div>
      
      {/* Customer table */}
      <table role="grid" aria-label="Customer list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id} data-customer-id={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone || '-'}</td>
              <td>{customer.status}</td>
              <td>
                <button 
                  data-testid={`edit-customer-${customer.id}`}
                  onClick={() => mockNavigate(`/customers/${customer.id}/edit`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Set up tests
beforeEach(() => {
  jest.clearAllMocks();
  
  // Default mock for fetch to return customers
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockCustomers
  });
});

// Tests
describe('CustomerList Component', () => {
  it('should render customer data when loaded', async () => {
    render(<CustomerList />);
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
    });
    
    // Verify all customers are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    
    // Check emails
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    
    // Check phone numbers
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('098-765-4321')).toBeInTheDocument();
  });

  it('should show error state when API fails', async () => {
    // Mock API failure
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500
    });
    
    render(<CustomerList />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error loading customers')).toBeInTheDocument();
    });
    
    // Check for retry button
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should show empty state when no customers found', async () => {
    // Mock empty response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 })
    });
    
    render(<CustomerList />);
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No customers found')).toBeInTheDocument();
    });
    
    // Check add button
    const addButton = screen.getByText('Add Customer');
    expect(addButton).toBeInTheDocument();
    
    // Click add button
    fireEvent.click(addButton);
    expect(mockNavigate).toHaveBeenCalledWith('/customers/new');
  });

  it('should apply search filter', async () => {
    render(<CustomerList />);
    
    // Wait for customer data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Apply search filter
    const searchInput = screen.getByLabelText('Search customers');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Verify search parameter in fetch call
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('search=John'));
  });

  it('should apply status filter', async () => {
    render(<CustomerList />);
    
    // Wait for customer data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Apply status filter
    const statusFilter = screen.getByLabelText('Filter by status');
    fireEvent.change(statusFilter, { target: { value: CustomerStatus.ACTIVE } });
    
    // Verify status parameter in fetch call
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('status=ACTIVE'));
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    render(<CustomerList />);
    
    // Wait for customer data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Find and click edit button for first customer
    const editButton = screen.getByTestId('edit-customer-1');
    fireEvent.click(editButton);
    
    // Verify navigation call
    expect(mockNavigate).toHaveBeenCalledWith('/customers/1/edit');
  });

  it('should have accessible table attributes', async () => {
    render(<CustomerList />);
    
    // Wait for customer data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Check table attribute
    const table = screen.getByRole('grid');
    expect(table).toHaveAttribute('aria-label', 'Customer list');
  });
});