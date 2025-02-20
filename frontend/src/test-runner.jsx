import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/dashboard/Dashboard';
import QuickSearch from './components/dashboard/QuickSearch';
import RecentCalls from './components/dashboard/RecentCalls';
import ActivityFeed from './components/dashboard/ActivityFeed';
import MetricsDisplay from './components/dashboard/MetricsDisplay';
import { createMockFn } from './test-utils';

// Test Runner Component
const TestRunner = () => {
  const [activeTest, setActiveTest] = React.useState(null);
  const [testResults, setTestResults] = React.useState({});

  const runTest = async (component, test) => {
    setActiveTest(component);
    try {
      const result = await test();
      setTestResults(prev => ({ ...prev, [component]: result }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [component]: false }));
      console.error(`Test failed for ${component}:`, error);
    }
    setActiveTest(null);
  };

  const tests = {
    Dashboard: async () => {
      // Test Dashboard component
      const mockOnSearch = createMockFn();
      const mockOnActionSelect = createMockFn();
      
      ReactDOM.createRoot(document.getElementById('test-container')).render(
        <Dashboard onSearch={mockOnSearch} onActionSelect={mockOnActionSelect} />
      );
      
      // Verify components are rendered
      const hasQuickSearch = document.querySelector('[data-testid="quick-search"]');
      const hasRecentCalls = document.querySelector('[data-testid="recent-calls"]');
      const hasActivityFeed = document.querySelector('[data-testid="activity-feed"]');
      const hasMetricsDisplay = document.querySelector('[data-testid="metrics-display"]');
      
      return Boolean(hasQuickSearch && hasRecentCalls && hasActivityFeed && hasMetricsDisplay);
    },

    QuickSearch: async () => {
      // Test QuickSearch component
      const mockOnSearch = createMockFn();
      
      ReactDOM.createRoot(document.getElementById('test-container')).render(
        <QuickSearch onSearch={mockOnSearch} recentSearches={['test']} />
      );
      
      const searchInput = document.querySelector('input[type="search"]');
      if (!searchInput) return false;
      
      // Test input functionality
      searchInput.value = 'test query';
      searchInput.dispatchEvent(new Event('input'));
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockOnSearch.mock.calls.length > 0;
    },

    RecentCalls: async () => {
      ReactDOM.createRoot(document.getElementById('test-container')).render(
        <RecentCalls />
      );
      
      // Verify loading state is shown initially
      const loadingSkeleton = document.querySelector('[data-testid="loading-skeleton"]');
      return Boolean(loadingSkeleton);
    },

    ActivityFeed: async () => {
      ReactDOM.createRoot(document.getElementById('test-container')).render(
        <ActivityFeed />
      );
      
      // Verify loading state is shown initially
      const loadingSkeleton = document.querySelector('[data-testid="loading-skeleton"]');
      return Boolean(loadingSkeleton);
    },

    MetricsDisplay: async () => {
      ReactDOM.createRoot(document.getElementById('test-container')).render(
        <MetricsDisplay />
      );
      
      // Verify loading state is shown initially
      const loadingSkeleton = document.querySelector('[data-testid="loading-skeleton"]');
      return Boolean(loadingSkeleton);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Component Tests</h1>
      
      {/* Test Container */}
      <div id="test-container" className="mb-8 p-4 border rounded-lg"></div>
      
      {/* Test Controls */}
      <div className="space-y-4">
        {Object.entries(tests).map(([component, test]) => (
          <div key={component} className="flex items-center space-x-4">
            <button
              onClick={() => runTest(component, test)}
              disabled={activeTest !== null}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test {component}
            </button>
            {testResults[component] !== undefined && (
              <span className={testResults[component] ? 'text-green-500' : 'text-red-500'}>
                {testResults[component] ? '✓ Passed' : '✗ Failed'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Mount Test Runner
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestRunner />
  </React.StrictMode>
);