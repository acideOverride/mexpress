import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customersService, ticketsService } from '../../api/services';

// Types
interface DashboardProps {
  onSearch?: (query: string) => void;
  onActionSelect?: (action: string) => void;
}

interface DashboardStats {
  totalCustomers: number;
  totalTickets: number;
  pendingTickets: number;
  completedTickets: number;
}

// Recent activity mock data - in real app this would come from API
const recentActivities = [
  { id: 1, text: 'New customer added: John Doe', timestamp: new Date().toISOString() },
  { id: 2, text: 'Ticket #1234 status changed to "In Progress"', timestamp: new Date().toISOString() },
  { id: 3, text: 'New repair ticket created for Jane Smith', timestamp: new Date().toISOString() }
];

// Quick actions available on dashboard
const quickActions = [
  { id: 'new-customer', label: 'New Customer', icon: '👤' },
  { id: 'new-ticket', label: 'New Ticket', icon: '🎫' },
  { id: 'sync-data', label: 'Sync Data', icon: '🔄' },
  { id: 'reports', label: 'Reports', icon: '📊' }
];

const Dashboard: React.FC<DashboardProps> = ({ onSearch, onActionSelect }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalTickets: 0,
    pendingTickets: 0,
    completedTickets: 0
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch customer data
        const customersResponse = await customersService.getAll();
        const customers = customersResponse.data || [];

        // Fetch ticket data
        const tickets = await ticketsService.getAll();

        // Calculate stats
        const completedTickets = tickets.filter((ticket: any) => ticket.status === 'COMPLETED');
        const pendingTickets = tickets.filter((ticket: any) => ticket.status !== 'COMPLETED');

        setStats({
          totalCustomers: customers.length,
          totalTickets: tickets.length,
          pendingTickets: pendingTickets.length,
          completedTickets: completedTickets.length
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        console.error('Dashboard data fetch error:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleActionClick = (actionId: string) => {
    if (onActionSelect) {
      onActionSelect(actionId);
    }
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <h1>Dashboard</h1>
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to MontPC CRM System</p>
      </header>

      {loading ? (
        <div className="loading-indicator">Loading dashboard data...</div>
      ) : (
        <>
          {/* Search bar */}
          <div className="search-section">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers, tickets..."
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  className="action-button"
                >
                  <span className="action-icon">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="stats-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Customers</h3>
                <div className="stat-value">{stats.totalCustomers}</div>
                <Link to="/customers">View all customers</Link>
              </div>
              <div className="stat-card">
                <h3>Total Tickets</h3>
                <div className="stat-value">{stats.totalTickets}</div>
                <Link to="/tickets">View all tickets</Link>
              </div>
              <div className="stat-card">
                <h3>Pending Tickets</h3>
                <div className="stat-value">{stats.pendingTickets}</div>
                <Link to="/tickets?status=pending">View pending</Link>
              </div>
              <div className="stat-card">
                <h3>Completed Tickets</h3>
                <div className="stat-value">{stats.completedTickets}</div>
                <Link to="/tickets?status=completed">View completed</Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-section">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              {recentActivities.map(activity => (
                <li key={activity.id} className="activity-item">
                  <div className="activity-text">{activity.text}</div>
                  <div className="activity-time">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/activity" className="view-all-link">View all activity</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;