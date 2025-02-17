import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Customer, ListResponse } from '../../types';

export const CustomerList = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<ListResponse<Customer>>({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading customers: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => navigate('/customers/new')}
          className="btn btn-primary"
        >
          Add Customer
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Email</th>
              <th className="table-header-cell">Phone</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {data?.items.map((customer: Customer) => (
              <tr key={customer.id} className="table-row">
                <td className="table-cell">{customer.name}</td>
                <td className="table-cell">{customer.email}</td>
                <td className="table-cell">{customer.phone || '-'}</td>
                <td className="table-cell">
                  <button
                    onClick={() => navigate(`/customers/${customer.id}/edit`)}
                    className="btn btn-secondary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement delete functionality
                      alert('Delete functionality to be implemented');
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={4} className="table-cell text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};