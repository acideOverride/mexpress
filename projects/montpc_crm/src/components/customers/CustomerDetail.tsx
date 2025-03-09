import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customersService } from '../../api/services';
import { Customer, CustomerAddress } from '../../api/types/customer';

interface CustomerDetailProps {
  onEdit?: (customerId: string) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ onEdit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      try {
        if (!id) throw new Error('Customer ID is required');
        
        const data = await customersService.getById(id);
        
        // Parse address if it's a string
        if (data && typeof data.address === 'string') {
          try {
            data.address = JSON.parse(data.address);
          } catch (e) {
            // Keep as string if parsing fails
            console.error('Failed to parse address:', e);
          }
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer details. Please try again later.');
        throw err;
      }
    }
  });

  const handleEdit = () => {
    if (onEdit && id) {
      onEdit(id);
    } else {
      navigate(`/customers/${id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" data-testid="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  if (!customer) {
    return <div className="text-center p-4">Customer not found</div>;
  }

  // The address should now be parsed as an object
  const address = customer.address as unknown as CustomerAddress;
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <div className="space-x-2">
          <button 
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Customer
          </button>
          <Link
            to="/customers"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p>{customer.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p>{customer.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p>{customer.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Customer ID</p>
            <p>{customer.id}</p>
          </div>
        </div>
      </div>

      {address && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Street</p>
              <p>{address.street}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">City</p>
              <p>{address.city}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">State</p>
              <p>{address.state}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">ZIP Code</p>
              <p>{address.zip}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Country</p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Customer Created</p>
              <p className="text-sm text-gray-500">
                {new Date(customer.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Last Updated</p>
              <p className="text-sm text-gray-500">
                {new Date(customer.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;