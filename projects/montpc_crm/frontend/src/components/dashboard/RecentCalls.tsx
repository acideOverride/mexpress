/**
 * RecentCalls Component
 * 
 * Displays a list of recent calls with loading, error, and data states.
 */

import React from 'react';
import { mockApi } from '../../services/mockApi';

// Define the call interface
interface Call {
  id: string;
  callerName?: string;
  callerNumber: string;
  timestamp: string;
  duration: number;
  status: 'completed' | 'missed' | 'ongoing';
}

// RecentCalls component
function RecentCalls() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [calls, setCalls] = React.useState([]);

  React.useEffect(() => {
    const fetchCalls = async () => {
      try {
        const data = await mockApi.getRecentCalls();
        setCalls(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recent calls');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
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
            <div className="rounded-full bg-gray-200 h-10 w-10" />
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
      {calls.map((call) => (
        <li 
          key={call.id}
          role="listitem" 
          className="py-4 flex items-center space-x-4"
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {call.callerName?.[0] || call.callerNumber[0]}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {call.callerName || call.callerNumber}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(call.timestamp).toLocaleString()}
            </p>
          </div>
          <div 
            className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
              ${call.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
              ${call.status === 'missed' ? 'bg-red-100 text-red-800' : ''}
              ${call.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : ''}`}
          >
            {call.status}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RecentCalls;