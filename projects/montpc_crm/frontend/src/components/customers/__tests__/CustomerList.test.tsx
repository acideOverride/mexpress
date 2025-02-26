import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { CustomerList } from '../CustomerList';
import { CustomerStatus } from '../../../types/customer';

// Mock the fetch function
global.fetch = jest.fn();

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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
      updatedAt: '2025-01-10T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      status: CustomerStatus.PENDING,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-11T00:00:00.000Z',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: CustomerStatus.INACTIVE,
      createdAt: '2025-01-03T00:00:00.000Z',
      updatedAt: '2025-01-12T00:00:00.000Z',
    },
  ],
  total: 3,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

// Setup function for component rendering
const renderCustomerList = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CustomerList />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  
  // Mock successful API response by default
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => mockCustomers,
  });
});

describe('CustomerList Component', () => {
  describe('Rendering States', () => {
    it('should show loading state initially', async () => {
      renderCustomerList();
      
      // Should show loading state
      expect(screen.getByText('Customers')).toBeInTheDocument();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
    
    it('should show error state when API fails', async () => {
      // Mock API failure
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      
      renderCustomerList();
      
      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/Error loading customers/i)).toBeInTheDocument();
      });
      
      // Should show retry button
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
    
    it('should show empty state when no customers found', async () => {
      // Mock empty response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
          totalPages: 0,
        }),
      });
      
      renderCustomerList();
      
      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText('No customers found')).toBeInTheDocument();
      });
      
      // Should show add customer button in empty state
      expect(screen.getByText('Add Customer')).toBeInTheDocument();
    });
    
    it('should render customer list when data is loaded', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
      
      // Should show email column
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      
      // Should show phone column
      expect(screen.getByText('123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('098-765-4321')).toBeInTheDocument();
      
      // Should show status badges
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('PENDING')).toBeInTheDocument();
      expect(screen.getByText('INACTIVE')).toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('should apply search filter', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get search input
      const searchInput = screen.getByLabelText('Search customers');
      
      // Enter search term
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      // Verify search parameter was included in API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('search=John'));
      });
    });
    
    it('should apply status filter', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get status filter
      const statusFilter = screen.getByLabelText('Filter by status');
      
      // Select ACTIVE status
      fireEvent.change(statusFilter, { target: { value: CustomerStatus.ACTIVE } });
      
      // Verify status parameter was included in API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('status=ACTIVE'));
      });
    });
    
    it('should apply date range filters', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get date filters
      const fromDateFilter = screen.getByLabelText('Filter from date');
      const toDateFilter = screen.getByLabelText('Filter to date');
      
      // Set date range
      fireEvent.change(fromDateFilter, { target: { value: '2025-01-01' } });
      fireEvent.change(toDateFilter, { target: { value: '2025-01-31' } });
      
      // Verify date parameters were included in API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('dateFrom=2025-01-01'));
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('dateTo=2025-01-31'));
      });
    });
    
    it('should show active filters indicator and allow clearing filters', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Apply a filter
      const searchInput = screen.getByLabelText('Search customers');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      // Check for active filters indicator
      await waitFor(() => {
        expect(screen.getByText('Filters active')).toBeInTheDocument();
      });
      
      // Clear filters
      const clearButton = screen.getByLabelText('Clear all filters');
      fireEvent.click(clearButton);
      
      // Verify filter was cleared
      await waitFor(() => {
        expect(screen.queryByText('Filters active')).not.toBeInTheDocument();
        expect(searchInput).toHaveValue('');
      });
    });
  });
  
  describe('Sorting Functionality', () => {
    it('should sort by name column', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Find name column header
      const nameColumn = screen.getByText('Name');
      
      // Click to sort by name
      fireEvent.click(nameColumn);
      
      // Verify sort parameters were included in API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('sortField=name&sortDirection=asc'));
      });
      
      // Click again to reverse sort
      fireEvent.click(nameColumn);
      
      // Verify sort direction changed
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('sortField=name&sortDirection=desc'));
      });
    });
  });
  
  describe('Pagination Functionality', () => {
    it('should change page size', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get page size selector
      const pageSizeSelect = screen.getByLabelText('Items per page');
      
      // Change to 25 items per page
      fireEvent.change(pageSizeSelect, { target: { value: '25' } });
      
      // Verify page size parameter was included in API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('pageSize=25'));
        // Should also reset to page 1
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
      });
    });
    
    it('should navigate between pages', async () => {
      // Mock multi-page response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          ...mockCustomers,
          total: 25,
          totalPages: 3,
        }),
      });
      
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get next page button
      const nextPageButton = screen.getByLabelText('Go to next page');
      
      // Go to next page
      fireEvent.click(nextPageButton);
      
      // Verify page parameter was updated
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      });
      
      // Go to last page
      const lastPageButton = screen.getByLabelText('Go to last page');
      fireEvent.click(lastPageButton);
      
      // Verify page parameter was updated
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=3'));
      });
      
      // Go to previous page
      const prevPageButton = screen.getByLabelText('Go to previous page');
      fireEvent.click(prevPageButton);
      
      // Verify page parameter was updated
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      });
      
      // Go to first page
      const firstPageButton = screen.getByLabelText('Go to first page');
      fireEvent.click(firstPageButton);
      
      // Verify page parameter was updated
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
      });
    });
  });
  
  describe('Column Configuration', () => {
    it('should open column configuration menu', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get columns button
      const columnsButton = screen.getByText('Columns');
      
      // Open column menu
      fireEvent.click(columnsButton);
      
      // Check column checkboxes are visible
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
      expect(screen.getByLabelText('Created Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Actions')).toBeInTheDocument();
    });
    
    it('should toggle column visibility', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Phone column should be visible initially
      expect(screen.getByText('Phone')).toBeInTheDocument();
      
      // Open column menu
      const columnsButton = screen.getByText('Columns');
      fireEvent.click(columnsButton);
      
      // Toggle phone column off
      const phoneCheckbox = screen.getByLabelText('Phone');
      fireEvent.click(phoneCheckbox);
      
      // Close menu by clicking outside (simulated by another click)
      fireEvent.mouseDown(document.body);
      
      // Wait for re-render
      await waitFor(() => {
        // Phone column header should no longer be in the document
        expect(screen.queryByText('Phone')).not.toBeInTheDocument();
      });
      
      // Verify localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const setItemCalls = localStorageMock.setItem as jest.Mock;
      const savedConfig = JSON.parse(setItemCalls.mock.calls[0][1]);
      expect(savedConfig).toContainEqual(
        expect.objectContaining({
          field: 'phone',
          visible: false
        })
      );
    });
  });
  
  describe('Row Selection and Actions', () => {
    it('should select a row when clicked', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Get the first row (by name cell)
      const firstRowName = screen.getByText('John Doe');
      const firstRow = firstRowName.closest('tr');
      
      // Click the row
      if (firstRow) {
        fireEvent.click(firstRow);
      }
      
      // Verify the row is selected (with aria-selected attribute)
      expect(firstRow).toHaveAttribute('aria-selected', 'true');
    });
    
    it('should navigate to edit page when edit button is clicked', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Find all edit buttons
      const editButtons = screen.getAllByText('Edit');
      
      // Click the first edit button
      fireEvent.click(editButtons[0]);
      
      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith('/customers/1/edit');
    });
    
    it('should navigate to new customer page when add button is clicked', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Find add button
      const addButton = screen.getByText('Add Customer');
      
      // Click add button
      fireEvent.click(addButton);
      
      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith('/customers/new');
    });
  });
  
  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes for sortable columns', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Check aria-sort attribute for Name column
      const nameColumn = screen.getByText('Name').closest('th');
      expect(nameColumn).toHaveAttribute('aria-sort', 'none');
      
      // Sort by name
      fireEvent.click(nameColumn!);
      
      // Check updated aria-sort attribute
      await waitFor(() => {
        expect(nameColumn).toHaveAttribute('aria-sort', 'ascending');
      });
    });
    
    it('should have proper ARIA attributes for table', async () => {
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Check table role
      const table = screen.getByRole('grid');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label', 'Customer list');
    });
    
    it('should have proper ARIA attributes for pagination', async () => {
      // Mock multi-page response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          ...mockCustomers,
          total: 25,
          totalPages: 3,
        }),
      });
      
      renderCustomerList();
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      // Check pagination buttons have proper aria-labels
      expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
      expect(screen.getByLabelText('Items per page')).toBeInTheDocument();
    });
  });
});