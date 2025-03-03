import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../../../src/App';

// Mock the components to simplify testing
jest.mock('../../../src/components/dashboard/Dashboard', () => () => <div data-testid="dashboard">Dashboard</div>);
jest.mock('../../../src/components/customers/CustomerList', () => () => <div data-testid="customer-list">Customer List</div>);
jest.mock('../../../src/components/customers/CustomerForm', () => ({ isEdit }: { isEdit?: boolean }) => (
  <div data-testid="customer-form">{isEdit ? 'Edit Customer Form' : 'New Customer Form'}</div>
));
jest.mock('../../../src/components/customers/CustomerDetail', () => () => <div data-testid="customer-detail">Customer Detail</div>);
jest.mock('../../../src/components/tickets/TicketList', () => () => <div data-testid="ticket-list">Ticket List</div>);
jest.mock('../../../src/components/tickets/TicketForm', () => ({ isEdit }: { isEdit?: boolean }) => (
  <div data-testid="ticket-form">{isEdit ? 'Edit Ticket Form' : 'New Ticket Form'}</div>
));
jest.mock('../../../src/components/tickets/TicketDetail', () => () => <div data-testid="ticket-detail">Ticket Detail</div>);

// Create a new QueryClient for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe('App Routing', () => {
  const renderWithRouter = (route: string) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should render dashboard on root route', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('should render customer list on /customers route', () => {
    renderWithRouter('/customers');
    expect(screen.getByTestId('customer-list')).toBeInTheDocument();
  });

  it('should render new customer form on /customers/new route', () => {
    renderWithRouter('/customers/new');
    expect(screen.getByTestId('customer-form')).toBeInTheDocument();
    expect(screen.getByText('New Customer Form')).toBeInTheDocument();
  });

  it('should render customer detail on /customers/:id route', () => {
    renderWithRouter('/customers/123');
    expect(screen.getByTestId('customer-detail')).toBeInTheDocument();
  });

  it('should render edit customer form on /customers/:id/edit route', () => {
    renderWithRouter('/customers/123/edit');
    expect(screen.getByTestId('customer-form')).toBeInTheDocument();
    expect(screen.getByText('Edit Customer Form')).toBeInTheDocument();
  });

  it('should render ticket list on /tickets route', () => {
    renderWithRouter('/tickets');
    expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
  });

  it('should render new ticket form on /tickets/new route', () => {
    renderWithRouter('/tickets/new');
    expect(screen.getByTestId('ticket-form')).toBeInTheDocument();
    expect(screen.getByText('New Ticket Form')).toBeInTheDocument();
  });

  it('should render ticket detail on /tickets/:id route', () => {
    renderWithRouter('/tickets/123');
    expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
  });

  it('should render edit ticket form on /tickets/:id/edit route', () => {
    renderWithRouter('/tickets/123/edit');
    expect(screen.getByTestId('ticket-form')).toBeInTheDocument();
    expect(screen.getByText('Edit Ticket Form')).toBeInTheDocument();
  });
});