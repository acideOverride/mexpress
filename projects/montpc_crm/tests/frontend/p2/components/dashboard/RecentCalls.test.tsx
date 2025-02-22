import { render, screen, act } from '@testing-library/react';
import RecentCalls from '../RecentCalls';

describe('RecentCalls', () => {
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    // Mock fetch to return a pending promise that never resolves
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(() => {})
    );
    
    await act(async () => {
      render(<RecentCalls />);
    });

    const loadingSkeleton = screen.getByTestId('loading-skeleton');
    expect(loadingSkeleton).toBeInTheDocument();
    expect(loadingSkeleton).toHaveClass('animate-pulse');

    // Should render 5 skeleton items
    const skeletonItems = screen.getAllByTestId('skeleton-item');
    expect(skeletonItems).toHaveLength(5);
  });

  it('should handle error state', async () => {
    // Mock fetch to simulate error
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Failed to load recent calls'))
    );
    
    await act(async () => {
      render(<RecentCalls />);
    });

    // Should show error message
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Failed to load recent calls');
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('should render recent calls data', async () => {
    // Mock successful API response
    const mockCalls = [
      {
        id: '1',
        callerName: 'John Doe',
        callerNumber: '+1234567890',
        timestamp: '2025-02-19T09:00:00Z',
        duration: 300,
        status: 'completed' as const
      },
      {
        id: '2',
        callerNumber: '+1987654321',
        timestamp: '2025-02-19T08:30:00Z',
        duration: 0,
        status: 'missed' as const
      }
    ];

    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCalls)
      })
    );
    
    await act(async () => {
      render(<RecentCalls />);
    });

    // Should render call list
    const callList = screen.getByRole('list');
    expect(callList).toBeInTheDocument();

    // Should render call items
    const callItems = screen.getAllByRole('listitem');
    expect(callItems).toHaveLength(2);

    // Should render caller info
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('+1987654321')).toBeInTheDocument();

    // Should render call status
    expect(screen.getByTestId('status-completed')).toBeInTheDocument();
    expect(screen.getByTestId('status-missed')).toBeInTheDocument();
  });
});