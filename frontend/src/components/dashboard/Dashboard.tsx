import React from 'react';
import QuickSearch from './QuickSearch';
import RecentCalls from './RecentCalls';
import ActivityFeed from './ActivityFeed';
import MetricsDisplay from './MetricsDisplay';
import ActionShortcuts from './ActionShortcuts';

interface DashboardProps {
  onSearch: (query: string) => void;
  onActionSelect: (action: string) => void;
  isLoading?: boolean;
  error?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  onSearch,
  onActionSelect,
  isLoading,
  error
}) => {
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg" role="alert">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Header Section */}
      <div className="col-span-12 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <ActionShortcuts
            onActionSelect={onActionSelect}
            data-testid="action-shortcuts"
          />
        </div>
        <QuickSearch
          onSearch={onSearch}
          recentSearches={[]}
          data-testid="quick-search"
        />
      </div>

      {/* Main Content */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <RecentCalls data-testid="recent-calls" />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <ActivityFeed data-testid="activity-feed" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-white rounded-lg shadow p-4">
          <MetricsDisplay data-testid="metrics-display" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;