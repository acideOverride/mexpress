/**
 * MetricsDisplay Component
 * 
 * Displays metrics cards with loading, error, and data states.
 */

import React from 'react';
import { mockApi } from '../../services/mockApi';

interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  changePercentage?: number;
}

function MetricsDisplay() {
  // State without type parameters to avoid TypeScript issues in test
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [metrics, setMetrics] = React.useState([]);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await mockApi.getMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="animate-pulse" data-testid="loading-skeleton">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              data-testid="skeleton-item"
              className="bg-white rounded-lg p-4 shadow"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          data-testid="metric-card"
          className="bg-white rounded-lg p-4 shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-500">
              {metric.label}
            </h3>
            {metric.trend && (
              <div 
                data-testid={`trend-${metric.trend}-${metric.id}`}
                className={`flex items-center text-sm font-medium
                  ${metric.trend === 'up' ? 'text-green-600' : ''}
                  ${metric.trend === 'down' ? 'text-red-600' : ''}
                  ${metric.trend === 'stable' ? 'text-gray-600' : ''}`}
              >
                {metric.trend === 'up' && '↑'}
                {metric.trend === 'down' && '↓'}
                {metric.trend === 'stable' && '→'}
                {metric.changePercentage !== undefined && (
                  <span className="ml-1">
                    {metric.changePercentage > 0 ? '+' : ''}
                    {metric.changePercentage}%
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-2xl font-semibold text-gray-900">
            {metric.value} {metric.unit}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MetricsDisplay;