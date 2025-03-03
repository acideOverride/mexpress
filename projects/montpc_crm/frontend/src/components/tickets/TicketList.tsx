import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketsService } from '../../api/services';
import { Ticket, TicketStatus, TicketPriority } from '../../api/types/ticket';

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await ticketsService.getAll();
        setTickets(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: TicketStatus): string => {
    switch (status) {
      case TicketStatus.PENDING:
        return 'bg-yellow-200 text-yellow-800';
      case TicketStatus.IN_PROGRESS:
        return 'bg-blue-200 text-blue-800';
      case TicketStatus.WAITING_FOR_PARTS:
        return 'bg-purple-200 text-purple-800';
      case TicketStatus.READY_FOR_PICKUP:
        return 'bg-green-200 text-green-800';
      case TicketStatus.COMPLETED:
        return 'bg-gray-200 text-gray-800';
      case TicketStatus.CANCELLED:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Helper function to get priority badge color
  const getPriorityBadgeColor = (priority: TicketPriority): string => {
    switch (priority) {
      case TicketPriority.LOW:
        return 'bg-green-200 text-green-800';
      case TicketPriority.MEDIUM:
        return 'bg-blue-200 text-blue-800';
      case TicketPriority.HIGH:
        return 'bg-orange-200 text-orange-800';
      case TicketPriority.URGENT:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center p-4">
        <p>No repair tickets found.</p>
        <Link 
          to="/tickets/new" 
          className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Ticket
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Repair Tickets</h1>
        <Link 
          to="/tickets/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Ticket
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Customer</th>
              <th className="py-2 px-4 border-b text-left">Problem</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Priority</th>
              <th className="py-2 px-4 border-b text-left">Created</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {typeof ticket.customerId === 'object' 
                    ? ticket.customerId.name 
                    : 'Customer ID: ' + ticket.customerId}
                </td>
                <td className="py-2 px-4 border-b">
                  {ticket.problem.length > 50 
                    ? `${ticket.problem.substring(0, 50)}...` 
                    : ticket.problem}
                </td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityBadgeColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link 
                    to={`/tickets/${ticket.id}`}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/tickets/${ticket.id}/edit`}
                    className="text-green-500 hover:underline"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;