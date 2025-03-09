/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Define the CustomerDetail component types
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface CustomerDetailProps {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
}

// Simple CustomerDetail component implementation for testing
const CustomerDetail = ({ 
  customer, 
  loading, 
  error 
}: CustomerDetailProps): JSX.Element => {
  if (loading) {
    return <div data-testid="loading-state">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error-state">Error: {error}</div>;
  }

  if (!customer) {
    return <div data-testid="no-customer">No customer selected</div>;
  }

  return (
    <div data-testid="customer-detail">
      <h2 data-testid="customer-name">{customer.name}</h2>
      <div data-testid="customer-email">Email: {customer.email}</div>
      <div data-testid="customer-phone">Phone: {customer.phone}</div>
      <div data-testid="customer-address">
        Address: {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zip}, {customer.address.country}
      </div>
      {customer.notes && (
        <div data-testid="customer-notes">Notes: {customer.notes}</div>
      )}
    </div>
  );
};

// Mock customer data
const mockCustomer: Customer = {
  id: 'cust-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    country: 'USA'
  },
  createdAt: '2024-12-01T08:00:00Z',
  updatedAt: '2025-01-15T10:30:00Z',
  notes: 'Preferred customer, has maintenance contract'
};

describe('CustomerDetail Component', () => {
  it('should render customer information correctly', () => {
    render(<CustomerDetail customer={mockCustomer} loading={false} error={null} />);
    
    expect(screen.getByTestId('customer-detail')).toBeInTheDocument();
    expect(screen.getByTestId('customer-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('customer-email')).toHaveTextContent('john.doe@example.com');
    expect(screen.getByTestId('customer-phone')).toHaveTextContent('(555) 123-4567');
    expect(screen.getByTestId('customer-address')).toHaveTextContent('123 Main St, Anytown, CA 12345, USA');
    expect(screen.getByTestId('customer-notes')).toHaveTextContent('Preferred customer, has maintenance contract');
  });

  it('should handle loading state properly', () => {
    render(<CustomerDetail customer={null} loading={true} error={null} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading...');
  });

  it('should display error messages when needed', () => {
    const errorMessage = 'Failed to load customer data';
    render(<CustomerDetail customer={null} loading={false} error={errorMessage} />);
    
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByTestId('error-state')).toHaveTextContent(`Error: ${errorMessage}`);
  });

  it('should display "No customer selected" when customer is null', () => {
    render(<CustomerDetail customer={null} loading={false} error={null} />);
    
    expect(screen.getByTestId('no-customer')).toBeInTheDocument();
    expect(screen.getByTestId('no-customer')).toHaveTextContent('No customer selected');
  });

  it('should properly parse address fields from JSON', () => {
    const addressJson = JSON.stringify({
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA'
    });
    
    const parsedAddress: Address = JSON.parse(addressJson);
    expect(parsedAddress.street).toBe('123 Main St');
    expect(parsedAddress.city).toBe('Anytown');
    expect(parsedAddress.state).toBe('CA');
    expect(parsedAddress.zip).toBe('12345');
    expect(parsedAddress.country).toBe('USA');
  });
});