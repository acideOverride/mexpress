import React, { useEffect, useState } from 'react';

interface Metrics {
  totalCalls: number;
  missedCalls: number;
  averageCallDuration: number;
  activeCustomers: number;
  customerSatisfaction: number;
  syncStatus: {
    lastSync: string;
    status: 'success' | 'warning' | 'error';
    message: string;
  };
}

interface MetricsDisplayProps {
  'data-testid'?: string;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ 'data-testid': testId }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // TODO: Replace with actual service call
        const response = await fetch('/api/metrics/dashboard');
        const data = await response.json();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
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
        {[...Array(6)].map((_, index) => (
          <div key={index} className="mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div data-testid={testId}>
      <h2 className="text-lg font-semibold mb-4">Metrics</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Total Calls</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {metrics.totalCalls.toLocaleString()}
          </p>
          <p className="text-sm text-red-600">
            {metrics.missedCalls} missed
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Average Call Duration</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {formatDuration(metrics.averageCallDuration)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {metrics.activeCustomers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Customer Satisfaction</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {metrics.customerSatisfaction}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500">Sync Status</h3>
          <div className="mt-1">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              metrics.syncStatus.status === 'success' ? 'bg-green-100 text-green-800' :
              metrics.syncStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {metrics.syncStatus.message}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Last sync: {new Date(metrics.syncStatus.lastSync).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;