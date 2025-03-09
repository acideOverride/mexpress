/**
 * ActivityFeed Component Test
 * 
 * Tests the ActivityFeed component which displays a list of recent activities
 * with loading, error, and data states.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ActivityFeed from '../../../../../frontend/src/components/dashboard/ActivityFeed';

// Mock the mockApi import
jest.mock('../../../../../frontend/src/services/mockApi', () => ({
  mockApi: {
    getActivities: jest.fn()
  }
}));

// Import the mocked module
import { mockApi } from '../../../../../frontend/src/services/mockApi';

describe('ActivityFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    // Mock the API to return a pending promise that never resolves
    (mockApi.getActivities as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {})
    );
    
    await act(async () => {
      render(<ActivityFeed />);
    });

    const loadingSkeleton = screen.getByTestId('loading-skeleton');
    expect(loadingSkeleton).toBeInTheDocument();
    expect(loadingSkeleton).toHaveClass('animate-pulse');

    // Should render 5 skeleton items
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    expect(skeletonItems).toHaveLength(5);
  });

  it('should handle error state', async () => {
    // Mock the API to simulate error
    (mockApi.getActivities as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Failed to load activity feed'))
    );
    
    await act(async () => {
      render(<ActivityFeed />);
    });

    // Should show error message
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load activity feed');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should render activity feed data', async () => {
    // Mock successful API response
    const mockActivities = [
      {
        id: '1',
        type: 'call' as const,
        description: 'Phone call with John Doe',
        timestamp: '2025-02-19T09:00:00Z',
        status: 'completed' as const
      },
      {
        id: '2',
        type: 'message' as const,
        description: 'SMS sent to +1234567890',
        timestamp: '2025-02-19T08:30:00Z',
        status: 'completed' as const
      }
    ];

    // Mock the API to return the mock data
    (mockApi.getActivities as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve(mockActivities)
    );
    
    await act(async () => {
      render(<ActivityFeed />);
    });

    // Should render activity list
    const activityList = screen.getByRole('list');
    expect(activityList).toBeInTheDocument();

    // Should render activity items
    const activityItems = screen.getAllByRole('listitem');
    expect(activityItems).toHaveLength(2);

    // Should render activity details
    expect(screen.getByText('Phone call with John Doe')).toBeInTheDocument();
    expect(screen.getByText('SMS sent to +1234567890')).toBeInTheDocument();

    // Should render activity types
    expect(screen.getByTestId('activity-type-call')).toBeInTheDocument();
    expect(screen.getByTestId('activity-type-message')).toBeInTheDocument();
  });
});