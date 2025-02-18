import { render, screen, waitFor } from '@testing-library/react';
import RecentCalls from '../RecentCalls';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('RecentCalls', () => {
  const mockCalls = [
    {
      id: 'call1',
      callerNumber: '+1234567890',
      recipientNumber: '+0987654321',
      durationSeconds: 300,
      status: 'completed',
      timestamp: '2025-02-18T12:00:00Z',
      recordingUrl: 'https://example.com/recording1.mp3'
    },
    {
      id: 'call2',
      callerNumber: '+1234567891',
      recipientNumber: '+0987654322',
      durationSeconds: 120,
      status: 'missed',
      timestamp: '2025-02-18T12:30:00Z',
      recordingUrl: 'https://example.com/recording2.mp3'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<RecentCalls />);

    // Should show skeleton loading items
    const skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toHaveClass('animate-pulse');
  });

  it('should render calls when loaded', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCalls)
      })
    );

    render(<RecentCalls />);

    // Wait for calls to be rendered
    await waitFor(() => {
      expect(screen.getByText(mockCalls[0].callerNumber)).toBeInTheDocument();
    });

    // Verify all calls are rendered
    mockCalls.forEach(call => {
      expect(screen.getByText(call.callerNumber)).toBeInTheDocument();
      expect(screen.getByText(call.status)).toBeInTheDocument();
      
      // Verify duration format
      const minutes = Math.floor(call.durationSeconds / 60);
      const seconds = (call.durationSeconds % 60).toString().padStart(2, '0');
      expect(screen.getByText(`${minutes}:${seconds}`)).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to load recent calls';
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<RecentCalls />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should apply correct status styles', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCalls)
      })
    );

    render(<RecentCalls />);

    await waitFor(() => {
      const completedStatus = screen.getByText('completed');
      const missedStatus = screen.getByText('missed');

      expect(completedStatus).toHaveClass('bg-green-100 text-green-800');
      expect(missedStatus).toHaveClass('bg-red-100 text-red-800');
    });
  });

  it('should handle data-testid prop', () => {
    const testId = 'recent-calls';
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCalls)
      })
    );

    render(<RecentCalls data-testid={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});