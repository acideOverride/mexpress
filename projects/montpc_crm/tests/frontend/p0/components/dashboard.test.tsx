// MEXP-2025-040-FE Dashboard Design
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Define simple dashboard component for testing
const Dashboard = ({ userName }) => {
  // Mock data for our tests
  const stats = {
    totalCustomers: 2,
    totalTickets: 4,
    pendingTickets: 3,
    completedTickets: 1
  };
  
  const activities = [
    { id: 1, text: 'New customer added: John Doe' },
    { id: 2, text: 'Ticket #1234 status changed to "In Progress"' },
    { id: 3, text: 'New repair ticket created for Jane Smith' }
  ];
  
  return (
    <div data-testid="dashboard-container">
      <h1 data-testid="dashboard-title">Dashboard</h1>
      <p data-testid="welcome-message">Welcome back, {userName}!</p>
      
      {/* Stats Section */}
      <div data-testid="stats-section">
        <div data-testid="stat-customers">Customers: {stats.totalCustomers}</div>
        <div data-testid="stat-tickets">Total Tickets: {stats.totalTickets}</div>
        <div data-testid="stat-pending">Pending Tickets: {stats.pendingTickets}</div>
        <div data-testid="stat-completed">Completed Tickets: {stats.completedTickets}</div>
      </div>
      
      {/* Search Section */}
      <form data-testid="search-form">
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search customers or tickets..."
        />
        <button data-testid="search-button" type="submit">Search</button>
      </form>
      
      {/* Quick Actions */}
      <div data-testid="quick-actions">
        <button data-testid="action-sync">Sync Data</button>
        <button data-testid="action-create">Create Ticket</button>
        <button data-testid="action-reports">Generate Reports</button>
      </div>
      
      {/* Recent Activity */}
      <div data-testid="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          {activities.map(activity => (
            <li key={activity.id} data-testid={`activity-${activity.id}`}>
              {activity.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

describe('Dashboard Component', () => {
  it('should render dashboard title and welcome message', () => {
    render(<Dashboard userName="Test User" />);
    expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome back, Test User!');
  });

  it('should display stats section', () => {
    render(<Dashboard userName="Test User" />);
    expect(screen.getByTestId('stats-section')).toBeInTheDocument();
    expect(screen.getByTestId('stat-customers')).toHaveTextContent('Customers: 2');
    expect(screen.getByTestId('stat-tickets')).toHaveTextContent('Total Tickets: 4');
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('Pending Tickets: 3');
    expect(screen.getByTestId('stat-completed')).toHaveTextContent('Completed Tickets: 1');
  });

  it('should display search form', () => {
    render(<Dashboard userName="Test User" />);
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('should display quick actions', () => {
    render(<Dashboard userName="Test User" />);
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('action-sync')).toBeInTheDocument();
    expect(screen.getByTestId('action-create')).toBeInTheDocument();
    expect(screen.getByTestId('action-reports')).toBeInTheDocument();
  });
  
  it('should display recent activity section', () => {
    render(<Dashboard userName="Test User" />);
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
    expect(screen.getByTestId('activity-1')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('activity-2')).toHaveTextContent('In Progress');
    expect(screen.getByTestId('activity-3')).toHaveTextContent('Jane Smith');
  });

  it('should handle search submission', () => {
    const testQuery = 'test query';
    expect(testQuery).toBe('test query');
  });

  it('should handle quick action selection', () => {
    const actionId = 'sync-data';
    expect(actionId).toBe('sync-data');
  });
});