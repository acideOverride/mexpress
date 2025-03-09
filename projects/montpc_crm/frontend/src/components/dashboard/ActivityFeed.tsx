/**
 * ActivityFeed Component
 * 
 * Displays a list of recent activities with loading, error, and data states.
 */

import React from 'react';
import { mockApi } from '../../services/mockApi';

interface Activity {
  id: string;
  type: 'call' | 'message' | 'note' | 'task';
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

function ActivityFeed() {
  // State without type parameters to avoid TypeScript issues in test
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [activities, setActivities] = React.useState([]);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await mockApi.getActivities();
        setActivities(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity feed');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (error) {
    return (
      <div className="text-red-600" role="alert">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse" data-testid="loading-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            data-testid="skeleton-item"
            className="flex items-center space-x-4 py-3"
          >
            <div className="rounded-full bg-gray-200 h-8 w-8" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <li 
          key={activity.id}
          role="listitem" 
          className="py-4 flex items-center space-x-4"
        >
          <div className="flex-shrink-0">
            <div 
              data-testid={`activity-type-${activity.type}`}
              className={`h-8 w-8 rounded-full flex items-center justify-center
                ${activity.type === 'call' ? 'bg-blue-100 text-blue-800' : ''}
                ${activity.type === 'message' ? 'bg-green-100 text-green-800' : ''}
                ${activity.type === 'note' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${activity.type === 'task' ? 'bg-purple-100 text-purple-800' : ''}`}
            >
              {activity.type === 'call' && '📞'}
              {activity.type === 'message' && '💬'}
              {activity.type === 'note' && '📝'}
              {activity.type === 'task' && '✓'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.description}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
          {activity.status && (
            <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
              ${activity.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
              ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${activity.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}`}
            >
              {activity.status}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ActivityFeed;