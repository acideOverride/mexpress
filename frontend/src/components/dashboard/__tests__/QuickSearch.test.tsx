import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickSearch from '../QuickSearch';

describe('QuickSearch', () => {
  const mockOnSearch = jest.fn();
  const mockRecentSearches = ['customer1', 'phone number', 'company'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should handle search input', async () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'test query');

    // Debounced search should be called
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should show recent searches', () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    userEvent.click(searchInput);

    mockRecentSearches.forEach(search => {
      expect(screen.getByText(search)).toBeInTheDocument();
    });
  });

  it('should handle recent search selection', async () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    await userEvent.click(searchInput);

    const recentSearch = screen.getByText(mockRecentSearches[0]);
    await userEvent.click(recentSearch);

    expect(mockOnSearch).toHaveBeenCalledWith(mockRecentSearches[0]);
  });

  it('should clear search input', async () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'test query');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should handle keyboard navigation', async () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    await userEvent.click(searchInput);

    // Press arrow down to navigate to first recent search
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByText(mockRecentSearches[0])).toHaveFocus();

    // Press enter to select
    await userEvent.keyboard('{Enter}');
    expect(mockOnSearch).toHaveBeenCalledWith(mockRecentSearches[0]);
  });

  it('should be accessible', () => {
    render(
      <QuickSearch
        onSearch={mockOnSearch}
        recentSearches={mockRecentSearches}
      />
    );

    // Check ARIA attributes
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveAttribute('aria-label', 'Quick search');
    expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    expect(searchInput).toHaveAttribute('aria-controls', 'quick-search-suggestions');
    expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
  });
});