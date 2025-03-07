/**
 * MetricsDisplay Component Test
 * 
 * Tests the MetricsDisplay component which shows metrics cards with loading, error and data states.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import MetricsDisplay from '../../../../../frontend/src/components/dashboard/MetricsDisplay';

// Mock the mockApi import
jest.mock('../../../../../frontend/src/services/mockApi', () => ({
  mockApi: {
    getMetrics: jest.fn()
  }
}));

// Import the mocked module
import { mockApi } from '../../../../../frontend/src/services/mockApi';

describe('MetricsDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    // Mock the API to return a pending promise that never resolves
    (mockApi.getMetrics as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {})
    );
    
    await act(async () => {
      render(<MetricsDisplay />);
    });

    const loadingSkeleton = screen.getByTestId('loading-skeleton');
    expect(loadingSkeleton).toBeInTheDocument();
    expect(loadingSkeleton).toHaveClass('animate-pulse');

    // Should render 4 metric card skeletons
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    expect(skeletonItems).toHaveLength(4);
  });

  it('should handle error state', async () => {
    // Mock the API to simulate error
    (mockApi.getMetrics as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Failed to load metrics'))
    );
    
    await act(async () => {
      render(<MetricsDisplay />);
    });

    // Should show error message
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load metrics');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should render metrics data', async () => {
    // Mock successful API response
    const mockMetrics = [
      {
        id: '1',
        label: 'Total Calls',
        value: 150,
        unit: 'calls',
        trend: 'up' as const,
        changePercentage: 12.5
      },
      {
        id: '2',
        label: 'Average Duration',
        value: 5.2,
        unit: 'minutes',
        trend: 'down' as const,
        changePercentage: -3.1
      },
      {
        id: '3',
        label: 'Success Rate',
        value: 98.5,
        unit: '%',
        trend: 'stable' as const
      },
      {
        id: '4',
        label: 'Active Users',
        value: 45,
        unit: 'users',
        trend: 'up' as const,
        changePercentage: 8.7
      }
    ];

    // Mock the API to return the mock data
    (mockApi.getMetrics as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve(mockMetrics)
    );
    
    await act(async () => {
      render(<MetricsDisplay />);
    });

    // Should render metric cards
    const metricCards = screen.getAllByTestId('metric-card');
    expect(metricCards).toHaveLength(4);

    // Should render metric values and labels
    expect(screen.getByText('Total Calls')).toBeInTheDocument();
    expect(screen.getByText('150 calls')).toBeInTheDocument();
    expect(screen.getByText('Average Duration')).toBeInTheDocument();
    expect(screen.getByText('5.2 minutes')).toBeInTheDocument();

    // Should render trend indicators
    expect(screen.getByTestId('trend-up-1')).toBeInTheDocument();
    expect(screen.getByTestId('trend-down-2')).toBeInTheDocument();
    expect(screen.getByTestId('trend-stable-3')).toBeInTheDocument();

    // Should render change percentages
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('-3.1%')).toBeInTheDocument();
  });
});