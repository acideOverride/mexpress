import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickSearch from '../QuickSearch';

describe('QuickSearch', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render search input', () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByRole('searchbox', { name: /quick search/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search customers, calls or companies...');
    expect(searchInput).toHaveAttribute('aria-label', 'Quick search');
  });

  it('should handle search input with debounce', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <QuickSearch
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    
    // Type in the search input
    await user.type(searchInput, 'test query');

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward timers and update component
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Should call with debounced value
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});