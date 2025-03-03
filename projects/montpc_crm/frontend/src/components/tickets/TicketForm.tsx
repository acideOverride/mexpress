import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ticketsService, customersService } from '../../api/services';
import { CreateTicketDto, TicketPriority } from '../../api/types/ticket';
import { Customer } from '../../api/types/customer';

interface TicketFormProps {
  isEdit?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateTicketDto>({
    customerId: '',
    problem: '',
    priority: TicketPriority.MEDIUM,
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers for dropdown
        const customersResponse = await customersService.getAll();
        setCustomers(customersResponse.data || []);
        
        // If editing, fetch ticket data
        if (isEdit && id) {
          const ticketResponse = await ticketsService.getById(id);
          const ticket = ticketResponse.data;
          
          setFormData({
            customerId: typeof ticket.customerId === 'object' ? ticket.customerId.id : ticket.customerId,
            problem: ticket.problem,
            priority: ticket.priority,
            notes: ticket.notes || ''
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate form
      if (!formData.customerId || !formData.problem) {
        setError('Customer and problem description are required');
        return;
      }
      
      if (isEdit && id) {
        // For this example, we're only implementing status updates in the backend
        // In a real app, you would update all ticket fields
        navigate(`/tickets/${id}`);
      } else {
        // Create new ticket
        const response = await ticketsService.create(formData);
        navigate(`/tickets/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? 'Edit Repair Ticket' : 'Create Repair Ticket'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer *
          </label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={isEdit}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problem Description *
          </label>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value={TicketPriority.LOW}>Low</option>
            <option value={TicketPriority.MEDIUM}>Medium</option>
            <option value={TicketPriority.HIGH}>High</option>
            <option value={TicketPriority.URGENT}>Urgent</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;