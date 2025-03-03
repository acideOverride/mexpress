import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customersService, ticketsService } from '../../api/services';

interface DashboardProps {
  onSearch?: (query: string) => void;
  onActionSelect?: (action: string) => void;
}

interface DashboardStats {
  customerCount: number;
  ticketCount: number;
  pendingTickets: number;
  completedTickets: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onSearch, onActionSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    customerCount: 0,
    ticketCount: 0,
    pendingTickets: 0,
    completedTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers and tickets data
        const customersResponse = await customersService.getAll();
        const ticketsResponse = await ticketsService.getAll();
        
        // Handle both response formats (for backward compatibility)
        const customers = 'data' in customersResponse 
          ? customersResponse.data as any[]
          : 'items' in customersResponse
            ? customersResponse.items as any[]
            : [] as any[];
        const tickets = ticketsResponse || [] as any[];
        
        // Calculate dashboard stats
        const pendingTickets = Array.isArray(tickets) ? tickets.filter((ticket: any) =>
          ['PENDING', 'IN_PROGRESS', 'WAITING_FOR_PARTS'].includes(ticket.status)
        ).length : 0;
        
        const completedTickets = Array.isArray(tickets) ? tickets.filter((ticket: any) =>
          ticket.status === 'COMPLETED'
        ).length : 0;
        
        setStats({
          customerCount: customers.length,
          ticketCount: Array.isArray(tickets) ? tickets.length : 0,
          pendingTickets,
          completedTickets
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleActionClick = (action: string) => {
    if (onActionSelect) {
      onActionSelect(action);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to MontPC CRM System</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers, tickets..."
            className="flex-grow p-2 border border-gray-300 rounded-l"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/customers/new"
            className="bg-blue-100 hover:bg-blue-200 p-4 rounded text-center"
            onClick={() => handleActionClick('new-customer')}
          >
            <div className="text-blue-800 font-medium">New Customer</div>
          </Link>
          <Link
            to="/tickets/new"
            className="bg-green-100 hover:bg-green-200 p-4 rounded text-center"
            onClick={() => handleActionClick('new-ticket')}
          >
            <div className="text-green-800 font-medium">New Repair Ticket</div>
          </Link>
          <button
            className="bg-purple-100 hover:bg-purple-200 p-4 rounded text-center"
            onClick={() => handleActionClick('sync-data')}
          >
            <div className="text-purple-800 font-medium">Sync Data</div>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <div className="text-center p-4">Loading dashboard data...</div>
      ) : error ? (
        <div className="text-center p-4 text-red-600">{error}</div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Total Customers</div>
              <div className="text-2xl font-bold">{stats.customerCount}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Total Tickets</div>
              <div className="text-2xl font-bold">{stats.ticketCount}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Pending Tickets</div>
              <div className="text-2xl font-bold">{stats.pendingTickets}</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-gray-500">Completed Tickets</div>
              <div className="text-2xl font-bold">{stats.completedTickets}</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white p-4 rounded shadow">
          <div className="divide-y">
            <div className="py-2">
              <div className="text-sm text-gray-500">Today</div>
              <div className="flex justify-between items-center">
                <div>New customer added: John Doe</div>
                <div className="text-xs text-gray-500">10:30 AM</div>
              </div>
            </div>
            <div className="py-2">
              <div className="text-sm text-gray-500">Today</div>
              <div className="flex justify-between items-center">
                <div>Ticket #1234 status changed to "In Progress"</div>
                <div className="text-xs text-gray-500">9:15 AM</div>
              </div>
            </div>
            <div className="py-2">
              <div className="text-sm text-gray-500">Yesterday</div>
              <div className="flex justify-between items-center">
                <div>New repair ticket created for Jane Smith</div>
                <div className="text-xs text-gray-500">4:45 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/customers"
            className="bg-white p-4 rounded shadow hover:shadow-md"
          >
            <div className="font-medium">Customer Management</div>
            <div className="text-sm text-gray-500">View and manage all customers</div>
          </Link>
          <Link
            to="/tickets"
            className="bg-white p-4 rounded shadow hover:shadow-md"
          >
            <div className="font-medium">Repair Ticket Management</div>
            <div className="text-sm text-gray-500">View and manage all repair tickets</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;