// Mock data for development and testing
export const mockMetrics = [
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

export const mockRecentCalls = [
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
  },
  {
    id: '3',
    callerName: 'Alice Smith',
    callerNumber: '+1122334455',
    timestamp: '2025-02-19T08:00:00Z',
    duration: 180,
    status: 'completed' as const
  }
];

export const mockActivities = [
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
  },
  {
    id: '3',
    type: 'note' as const,
    description: 'Added follow-up notes for Alice Smith',
    timestamp: '2025-02-19T08:00:00Z'
  }
];