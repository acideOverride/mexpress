import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionShortcuts from '../ActionShortcuts';

describe('ActionShortcuts', () => {
  const mockOnActionSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all action buttons', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    expect(screen.getByRole('button', { name: /new call/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sync data/i })).toBeInTheDocument();
  });

  it('should call onActionSelect with correct action id when clicked', async () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    // Test New Call button
    const newCallButton = screen.getByRole('button', { name: /new call/i });
    await userEvent.click(newCallButton);
    expect(mockOnActionSelect).toHaveBeenCalledWith('new-call');

    // Test New Customer button
    const newCustomerButton = screen.getByRole('button', { name: /new customer/i });
    await userEvent.click(newCustomerButton);
    expect(mockOnActionSelect).toHaveBeenCalledWith('new-customer');

    // Test Sync Data button
    const syncButton = screen.getByRole('button', { name: /sync data/i });
    await userEvent.click(syncButton);
    expect(mockOnActionSelect).toHaveBeenCalledWith('sync');
  });

  it('should apply correct styles to buttons', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white');
    });
  });

  it('should render icons in buttons', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('should be accessible', () => {
    render(<ActionShortcuts onActionSelect={mockOnActionSelect} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });
  });

  it('should handle data-testid prop', () => {
    const testId = 'action-shortcuts';
    render(
      <ActionShortcuts 
        onActionSelect={mockOnActionSelect}
        data-testid={testId}
      />
    );

    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});