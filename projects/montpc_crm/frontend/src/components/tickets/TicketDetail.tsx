import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketsService } from '../../api/services';
import { Ticket, TicketStatus, TicketPriority } from '../../api/types/ticket';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | ''>('');

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await ticketsService.getById(id);
        setTicket(response.data);
        setSelectedStatus(response.data.status);
        setError(null);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Failed to load ticket details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as TicketStatus);
  };

  const updateTicketStatus = async () => {
    if (!id || !selectedStatus || selectedStatus === ticket?.status) return;
    
    try {
      setUpdatingStatus(true);
      const response = await ticketsService.updateStatus(id, { status: selectedStatus as TicketStatus });
      setTicket(response.data);
      setError(null);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError('Failed to update ticket status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    return <div className="text-center p-4">Loading ticket details...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center p-4">Ticket not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repair Ticket Details</h1>
        <div>
          <button
            onClick={() => navigate('/tickets')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Ticket Information</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Priority</p>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityBadgeColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              
              {typeof ticket.customerId === 'object' ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{ticket.customerId.name}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{ticket.customerId.email}</p>
                  </div>
                  
                  {ticket.customerId.phone && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{ticket.customerId.phone}</p>
                    </div>
                  )}
                  
                  <Link 
                    to={`/customers/${ticket.customerId.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Customer Profile
                  </Link>
                </>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-medium">{ticket.customerId}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Problem Description</h2>
            <p className="whitespace-pre-line">{ticket.problem}</p>
          </div>
          
          {ticket.notes && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Additional Notes</h2>
              <p className="whitespace-pre-line">{ticket.notes}</p>
            </div>
          )}
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            
            <div className="flex items-end gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Object.values(TicketStatus).map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={updateTicketStatus}
                disabled={updatingStatus || selectedStatus === ticket.status}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;