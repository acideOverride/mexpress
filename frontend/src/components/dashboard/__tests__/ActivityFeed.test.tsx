import { render, screen, waitFor } from '@testing-library/react';
import ActivityFeed from '../ActivityFeed';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ActivityFeed', () => {
  const mockActivities = [
    {
      id: 'act1',
      type: 'call' as const,
      description: 'New call from customer',
      timestamp: '2025-02-18T12:00:00Z',
      metadata: {
        customerId: 'cust1',
        customerName: 'John Doe',
        callId: 'call1'
      }
    },
    {
      id: 'act2',
      type: 'customer_update' as const,
      description: 'Customer details updated',
      timestamp: '2025-02-18T12:30:00Z',
      metadata: {
        customerId: 'cust2',
        customerName: 'Jane Smith',
        changes: {
          email: 'new@example.com'
        }
      }
    },
    {
      id: 'act3',
      type: 'sync' as const,
      description: 'Data synchronized',
      timestamp: '2025-02-18T13:00:00Z',
      metadata: {}
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<ActivityFeed />);

    const skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toHaveClass('animate-pulse');
  });

  it('should render activities when loaded', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockActivities)
      })
    );

    render(<ActivityFeed />);

    // Wait for activities to be rendered
    await waitFor(() => {
      expect(screen.getByText(mockActivities[0].description)).toBeInTheDocument();
    });

    // Verify all activities are rendered
    mockActivities.forEach(activity => {
      expect(screen.getByText(activity.description)).toBeInTheDocument();
      if (activity.metadata.customerName) {
        expect(screen.getByText(`Customer: ${activity.metadata.customerName}`)).toBeInTheDocument();
      }
    });
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to load activity feed';
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<ActivityFeed />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should render correct icons for different activity types', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockActivities)
      })
    );

    render(<ActivityFeed />);

    await waitFor(() => {
      const activities = screen.getAllByRole('article');
      expect(activities[0].querySelector('.text-blue-500')).toBeInTheDocument(); // Call icon
      expect(activities[1].querySelector('.text-green-500')).toBeInTheDocument(); // Customer update icon
      expect(activities[2].querySelector('.text-purple-500')).toBeInTheDocument(); // Sync icon
    });
  });

  it('should handle data-testid prop', () => {
    const testId = 'activity-feed';
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockActivities)
      })
    );

    render(<ActivityFeed data-testid={testId} />);
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
});