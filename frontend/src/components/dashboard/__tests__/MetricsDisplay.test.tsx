import { render, screen, waitFor } from '@testing-library/react';
import MetricsDisplay from '../MetricsDisplay';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('MetricsDisplay', () => {
  const mockMetrics = {
    totalCalls: 1234,
    missedCalls: 45,
    averageCallDuration: 125, // in minutes
    activeCustomers: 567,
    customerSatisfaction: 92,
    syncStatus: {
      lastSync: '2025-02-18T12:00:00Z',
      status: 'success' as const,
      message: 'Last sync successful'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<MetricsDisplay />);

    const skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toHaveClass('animate-pulse');
  });

  it('should render metrics when loaded', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMetrics)
      })
    );

    render(<MetricsDisplay />);

    // Wait for metrics to be rendered
    await waitFor(() => {
      expect(screen.getByText('Total Calls')).toBeInTheDocument();
    });

    // Verify all metrics are rendered
    expect(screen.getByText(mockMetrics.totalCalls.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(`${mockMetrics.missedCalls} missed`)).toBeInTheDocument();
    expect(screen.getByText('2h 5m')).toBeInTheDocument(); // 125 minutes formatted
    expect(screen.getByText(mockMetrics.activeCustomers.toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(`${mockMetrics.customerSatisfaction}%`)).toBeInTheDocument();
    expect(screen.getByText(mockMetrics.syncStatus.message)).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to load metrics';
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<MetricsDisplay />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should apply correct status styles for sync status', async () => {
    const successMetrics = {
      ...mockMetrics,
      syncStatus: { ...mockMetrics.syncStatus, status: 'success' as const }
    };
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(successMetrics)
      })
    );

    render(<MetricsDisplay />);

    await waitFor(() => {
      const statusBadge = screen.getByText(successMetrics.syncStatus.message);
      expect(statusBadge).toHaveClass('bg-green-100 text-green-800');
    });

    // Re-render with warning status
    const warningMetrics = {
      ...mockMetrics,
      syncStatus: {
        ...mockMetrics.syncStatus,
        status: 'warning' as const,
        message: 'Sync delayed'
      }
    };
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(warningMetrics)
      })
    );

    render(<MetricsDisplay />);

    await waitFor(() => {
      const statusBadge = screen.getByText(warningMetrics.syncStatus.message);
      expect(statusBadge).toHaveClass('bg-yellow-100 text-yellow-800');
    });
  });

  it('should handle data-testid prop', () => {
    const testId = 'metrics-display';
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMetrics)
      })
    );

    render(<MetricsDisplay data-testid={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});