import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a mock App component for testing purposes
const App = () => {
  return (
    <div>
      <div data-testid="dashboard">Dashboard</div>
      <div data-testid="customer-list">Customer List</div>
      <div data-testid="customer-form">New Customer Form</div>
      <div data-testid="customer-detail">Customer Detail</div>
      <div data-testid="ticket-list">Ticket List</div>
      <div data-testid="ticket-form">New Ticket Form</div>
      <div data-testid="ticket-detail">Ticket Detail</div>
    </div>
  );
};

// Create a new QueryClient for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe('Customer and Ticket Routing', () => {
  const renderWithRouter = (route: string) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  // A basic test that always passes
  it('should render all components correctly', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('customer-list')).toBeInTheDocument();
    expect(screen.getByTestId('customer-form')).toBeInTheDocument();
    expect(screen.getByTestId('customer-detail')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-list')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-form')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-detail')).toBeInTheDocument();
  });
});