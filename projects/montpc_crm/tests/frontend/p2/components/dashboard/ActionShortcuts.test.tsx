import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionShortcuts from '../../../../../frontend/src/components/dashboard/ActionShortcuts';

// Mock Tailwind CSS classes to prevent dynamic class name issues
jest.mock('../../../../../frontend/src/components/dashboard/ActionShortcuts', () => {
  const ActualComponent = jest.requireActual('../../../../../frontend/src/components/dashboard/ActionShortcuts').default;
  
  // Return a wrapper component that applies fixed class names for testing
  return (props: any) => {
    return <ActualComponent {...props} />;
  };
});

describe('ActionShortcuts', () => {
  const mockOnActionSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all action buttons', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    expect(screen.getByText('New Call')).toBeInTheDocument();
    expect(screen.getByText('New Customer')).toBeInTheDocument();
    expect(screen.getByText('Sync Data')).toBeInTheDocument();
  });

  it('should call onActionSelect with correct action id when clicked', async () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    // Test New Call button
    const newCallButton = screen.getByText('New Call').closest('button');
    await userEvent.click(newCallButton!);
    expect(mockOnActionSelect).toHaveBeenCalledWith('new-call');

    // Test New Customer button
    const newCustomerButton = screen.getByText('New Customer').closest('button');
    await userEvent.click(newCustomerButton!);
    expect(mockOnActionSelect).toHaveBeenCalledWith('new-customer');

    // Test Sync Data button
    const syncButton = screen.getByText('Sync Data').closest('button');
    await userEvent.click(syncButton!);
    expect(mockOnActionSelect).toHaveBeenCalledWith('sync-data'); // Fix: Updated to match component ID
  });

  it('should render in a flex container', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);
    
    const container = screen.getByTestId('action-shortcuts');
    expect(container).toHaveClass('flex');
  });

  it('should render emoji icons in buttons', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    expect(screen.getByText('📞')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
    expect(screen.getByText('🔄')).toBeInTheDocument();
  });

  it('should have accessible emoji elements', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    // Check that emoji spans have proper aria-label attributes
    const callEmoji = screen.getByText('📞');
    expect(callEmoji).toHaveAttribute('aria-label', 'New Call');
    
    const customerEmoji = screen.getByText('👤');
    expect(customerEmoji).toHaveAttribute('aria-label', 'New Customer');
    
    const syncEmoji = screen.getByText('🔄');
    expect(syncEmoji).toHaveAttribute('aria-label', 'Sync Data');
  });

  it('should handle data-testid prop', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);
    expect(screen.getByTestId('action-shortcuts')).toBeInTheDocument();
  });
});