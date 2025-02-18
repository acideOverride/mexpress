import React, { useEffect, useState } from 'react';

interface Activity {
  id: string;
  type: 'call' | 'customer_update' | 'sync';
  description: string;
  timestamp: string;
  metadata: {
    customerId?: string;
    customerName?: string;
    callId?: string;
    changes?: Record<string, any>;
  };
}

interface ActivityFeedProps {
  'data-testid'?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 'data-testid': testId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // TODO: Replace with actual service call
        const response = await fetch('/api/activities/recent');
        const data = await response.json();
        setActivities(data);
        setError(null);
      } catch (err) {
        setError('Failed to load activity feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'customer_update':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'sync':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
    }
  };

  if (error) {
    return (
      <div className="text-red-600" role="alert">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse" data-testid="loading-skeleton">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-start space-x-3 py-3">
            <div className="rounded bg-gray-200 h-5 w-5"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div data-testid={testId}>
      <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <article
            key={activity.id}
            role="article"
            className="flex items-start space-x-3 p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                {activity.description}
              </p>
              {activity.metadata.customerName && (
                <p className="text-sm text-gray-500">
                  Customer: {activity.metadata.customerName}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;