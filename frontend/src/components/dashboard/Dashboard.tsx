import React from 'react';
import QuickSearch from './QuickSearch';
import RecentCalls from './RecentCalls';
import ActivityFeed from './ActivityFeed';
import MetricsDisplay from './MetricsDisplay';
import ActionShortcuts from './ActionShortcuts';

interface DashboardProps {
  onSearch: (query: string) => void;
  onActionSelect: (action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onSearch,
  onActionSelect
}) => {
  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-2xl">
              <QuickSearch
                onSearch={onSearch}
              />
            </div>
            <div className="ml-4">
              <ActionShortcuts
                onActionSelect={onActionSelect}
                data-testid="action-shortcuts"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Key Metrics</h2>
        <MetricsDisplay />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Calls</h2>
          <RecentCalls />
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity Feed</h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;