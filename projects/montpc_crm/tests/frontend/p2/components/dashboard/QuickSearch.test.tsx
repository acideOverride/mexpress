/**
 * QuickSearch Component Test
 * 
 * Tests the QuickSearch component which provides a search input with debounce functionality.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickSearch from '../../../../../frontend/src/components/dashboard/QuickSearch';

// Mock the useDebounce hook
jest.mock('../../../../../frontend/src/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value) // Simple implementation that returns the value immediately
}));

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

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search customers, calls or activities...');
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

    // Fast-forward timers
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // Should call onSearch with the input value
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should clear search when the clear button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <QuickSearch
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    
    // Type in the search input
    await user.type(searchInput, 'test query');
    
    // Clear button should appear
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
    
    // Click the clear button
    await user.click(clearButton);
    
    // Input should be cleared
    expect(searchInput).toHaveValue('');
    
    // onSearch should be called with empty string
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});