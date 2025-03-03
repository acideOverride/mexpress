// MEXP-2025-040-FE Dashboard Design
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // Make sure jest-dom is explicitly imported
import Dashboard from '../../../src/components/dashboard/Dashboard';

// Mock the entire api/services module
jest.mock('../../../src/api/services', () => ({
  customersService: {
    getAll: jest.fn()
  },
  ticketsService: {
    getAll: jest.fn()
  }
}));

// Import services after mocking
import { customersService, ticketsService } from '../../../src/api/services';

// Mock the response types to match the implementation in Dashboard.tsx
interface MockCustomerResponse {
  data: any[]; // This matches what Dashboard.tsx expects
}

interface MockTicketResponse {
  id: string;
  status: string;
}

// Create a wrapper to provide context if needed
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dashboard title', async () => {
    // Mock service responses using our mock types
    (customersService.getAll as jest.Mock).mockResolvedValue({ data: [] } as MockCustomerResponse);
    (ticketsService.getAll as jest.Mock).mockResolvedValue([]);

    renderWithRouter(<Dashboard />);

    // Title should be visible immediately
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome to MontPC CRM System')).toBeInTheDocument();
    
    // Wait for loading to finish to avoid act() warnings
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });
  });

  it('should show loading state initially', async () => {
    // Mock service responses with delayed resolution to ensure loading state is visible
    (customersService.getAll as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: [] } as MockCustomerResponse), 100))
    );
    (ticketsService.getAll as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    renderWithRouter(<Dashboard />);

    // Loading state should be visible initially
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
    
    // Wait for loading to finish to avoid act() warnings
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });
  });

  it('should display stats after loading', async () => {
    // Mock customer data
    const mockCustomers = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' }
    ];

    // Mock tickets data
    const mockTickets = [
      { id: '1', status: 'PENDING' },
      { id: '2', status: 'IN_PROGRESS' },
      { id: '3', status: 'COMPLETED' },
      { id: '4', status: 'WAITING_FOR_PARTS' }
    ];

    // Mock service responses
    (customersService.getAll as jest.Mock).mockResolvedValue({ data: mockCustomers } as MockCustomerResponse);
    (ticketsService.getAll as jest.Mock).mockResolvedValue(mockTickets);

    renderWithRouter(<Dashboard />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });

    // Check for overview section
    expect(screen.getByText('Overview')).toBeInTheDocument();

    // Check for stats - use findByText for more reliable async finding
    await screen.findByText('Total Customers');
    await screen.findByText('2'); // 2 customers
    await screen.findByText('Total Tickets');
    await screen.findByText('4'); // 4 tickets
    await screen.findByText('Pending Tickets');
    await screen.findByText('3'); // 3 pending tickets (PENDING, IN_PROGRESS, WAITING_FOR_PARTS)
    await screen.findByText('Completed Tickets');
    await screen.findByText('1'); // 1 completed ticket
  });

  it('should display error message when data fetch fails', async () => {
    // Mock service error
    (customersService.getAll as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    // Need to mock ticketsService even if it won't be called due to the error
    (ticketsService.getAll as jest.Mock).mockResolvedValue([]);

    renderWithRouter(<Dashboard />);

    // Wait for error message
    await screen.findByText('Failed to load dashboard data. Please try again later.');
  });

  it('should handle search submission', async () => {
    // Mock service responses
    (customersService.getAll as jest.Mock).mockResolvedValue({ data: [] } as MockCustomerResponse);
    (ticketsService.getAll as jest.Mock).mockResolvedValue([]);

    // Mock onSearch function
    const mockOnSearch = jest.fn();

    renderWithRouter(<Dashboard onSearch={mockOnSearch} />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });

    // Type in search input
    const searchInput = await screen.findByPlaceholderText('Search customers, tickets...');
    await userEvent.type(searchInput, 'test query');

    // Submit the search form
    const searchButton = await screen.findByRole('button', { name: 'Search' });
    await userEvent.click(searchButton);

    // Check if onSearch was called with the correct query
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should handle quick action selection', async () => {
    // Mock service responses
    (customersService.getAll as jest.Mock).mockResolvedValue({ data: [] } as MockCustomerResponse);
    (ticketsService.getAll as jest.Mock).mockResolvedValue([]);

    // Mock onActionSelect function
    const mockOnActionSelect = jest.fn();

    renderWithRouter(<Dashboard onActionSelect={mockOnActionSelect} />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });

    // Click on sync data button
    const syncButton = await screen.findByText('Sync Data');
    await userEvent.click(syncButton);

    // Check if onActionSelect was called with the correct action
    expect(mockOnActionSelect).toHaveBeenCalledWith('sync-data');
  });
  
  it('should display recent activity section', async () => {
    // Mock service responses
    (customersService.getAll as jest.Mock).mockResolvedValue({ data: [] } as MockCustomerResponse);
    (ticketsService.getAll as jest.Mock).mockResolvedValue([]);

    renderWithRouter(<Dashboard />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard data...')).not.toBeInTheDocument();
    });

    // Check for recent activity section
    await screen.findByText('Recent Activity');
    
    // Find all text items in the recent activity section - using more reliable findByText
    await screen.findByText('New customer added: John Doe');
    await screen.findByText('Ticket #1234 status changed to "In Progress"');
    await screen.findByText('New repair ticket created for Jane Smith');
  });
});