import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  const mockOnSearch = jest.fn();
  const mockOnActionSelect = jest.fn();
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all dashboard components', async () => {
    // Mock successful API responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({ // Metrics
        ok: true,
        json: () => Promise.resolve([
          { id: '1', label: 'Total Calls', value: 150, unit: 'calls' }
        ])
      }))
      .mockImplementationOnce(() => Promise.resolve({ // Recent Calls
        ok: true,
        json: () => Promise.resolve([
          { id: '1', callerName: 'John Doe', timestamp: '2025-02-19T09:00:00Z' }
        ])
      }))
      .mockImplementationOnce(() => Promise.resolve({ // Activities
        ok: true,
        json: () => Promise.resolve([
          { id: '1', type: 'call', description: 'Call with John Doe' }
        ])
      }));

    await act(async () => {
      render(
        <Dashboard
          onSearch={mockOnSearch}
          onActionSelect={mockOnActionSelect}
        />
      );
    });

    // Should render QuickSearch
    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    // Should render ActionShortcuts
    expect(screen.getByTestId('action-shortcuts')).toBeInTheDocument();

    // Should render MetricsDisplay
    expect(screen.getByText('Total Calls')).toBeInTheDocument();
    expect(screen.getByText('150 calls')).toBeInTheDocument();

    // Should render RecentCalls
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Should render ActivityFeed
    expect(screen.getByText('Call with John Doe')).toBeInTheDocument();
  });

  it('should handle component interactions', async () => {
    const user = userEvent.setup({ delay: null });

    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    await act(async () => {
      render(
        <Dashboard
          onSearch={mockOnSearch}
          onActionSelect={mockOnActionSelect}
        />
      );
    });

    // Test search interaction
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'test query');

    // Wait for debounce
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledWith('test query');

    // Test action selection
    const actionButton = screen.getByRole('button', { name: /new call/i });
    await user.click(actionButton);
    expect(mockOnActionSelect).toHaveBeenCalledWith('new-call');
  });
});