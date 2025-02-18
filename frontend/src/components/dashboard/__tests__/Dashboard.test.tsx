import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  const mockOnSearch = jest.fn();
  const mockOnActionSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all main components', () => {
    render(
      <Dashboard
        onSearch={mockOnSearch}
        onActionSelect={mockOnActionSelect}
      />
    );

    // Header components
    expect(screen.getByTestId('quick-search')).toBeInTheDocument();
    expect(screen.getByTestId('action-shortcuts')).toBeInTheDocument();

    // Main content components
    expect(screen.getByTestId('recent-calls')).toBeInTheDocument();
    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();

    // Sidebar components
    expect(screen.getByTestId('metrics-display')).toBeInTheDocument();
  });

  it('should handle search', async () => {
    render(
      <Dashboard
        onSearch={mockOnSearch}
        onActionSelect={mockOnActionSelect}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    await userEvent.type(searchInput, 'test query');

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should handle action selection', async () => {
    render(
      <Dashboard
        onSearch={mockOnSearch}
        onActionSelect={mockOnActionSelect}
      />
    );

    const newCallButton = screen.getByRole('button', { name: /new call/i });
    await userEvent.click(newCallButton);

    expect(mockOnActionSelect).toHaveBeenCalledWith('new-call');
  });

  it('should be responsive', () => {
    const { container } = render(
      <Dashboard
        onSearch={mockOnSearch}
        onActionSelect={mockOnActionSelect}
      />
    );

    // Check grid classes
    expect(container.firstChild).toHaveClass('grid');
    expect(container.firstChild).toHaveClass('grid-cols-12');
    expect(container.firstChild).toHaveClass('gap-4');
  });

  it('should handle loading states', () => {
    render(
      <Dashboard
        onSearch={mockOnSearch}
        onActionSelect={mockOnActionSelect}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle error states', () => {
    const error = 'Failed to load dashboard data';
    render(
      <Dashboard
        onSearch={mockOnSearch}
        onActionSelect={mockOnActionSelect}
        error={error}
      />
    );

    expect(screen.getByText(error)).toBeInTheDocument();
  });
});