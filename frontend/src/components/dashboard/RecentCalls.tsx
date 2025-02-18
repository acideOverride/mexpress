import React, { useEffect, useState } from 'react';

// TODO: Replace with actual service import once frontend services are set up
interface RingoverCall {
  id: string;
  callerNumber: string;
  recipientNumber: string;
  durationSeconds: number;
  status: string;
  timestamp: string;
  recordingUrl: string;
}

interface RecentCallsProps {
  'data-testid'?: string;
}

const RecentCalls: React.FC<RecentCallsProps> = ({ 'data-testid': testId }) => {
  const [calls, setCalls] = useState<RingoverCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        // TODO: Replace with actual service call
        const response = await fetch('/api/calls/recent');
        const data = await response.json();
        setCalls(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recent calls');
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="animate-pulse" data-testid="loading-skeleton">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 py-3">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
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
      <h2 className="text-lg font-semibold mb-4">Recent Calls</h2>
      <div className="space-y-4">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {call.callerNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(call.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div className="mt-1 flex items-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  call.status === 'completed' ? 'bg-green-100 text-green-800' :
                  call.status === 'missed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {call.status}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {Math.floor(call.durationSeconds / 60)}:{(call.durationSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCalls;