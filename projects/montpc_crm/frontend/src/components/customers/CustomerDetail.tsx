import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Customer } from '../../types/customer';
import { customersService } from '../../api/services';
import { apiToUiCustomer, ExtendedAddress } from '../../api/adapters/customer.adapter';

// Create extended customer type that includes the country field in address
interface ExtendedCustomer extends Omit<Customer, 'address'> {
  address?: ExtendedAddress;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      try {
        // Use the service to get API data then convert to UI format with adapter
        const apiCustomer = await customersService.getById(id as string);
        
        // If API returns null, we should return null too
        if (!apiCustomer) {
          return null;
        }
        
        // Use our adapter to convert API format to UI format
        const uiCustomer = apiToUiCustomer(apiCustomer) as ExtendedCustomer;
        return uiCustomer;
      } catch (err) {
        setError('Failed to load customer details. Please try again later.');
        throw err;
      }
    },
  });

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <div>
          <button
            onClick={() => navigate('/customers')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Back to List
          </button>
          <Link
            to={`/customers/${id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Customer
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{customer.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Address</h2>
              
              {customer.address ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Street</p>
                    <p className="font-medium">{customer.address.street || 'Not provided'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{customer.address.city || 'Not provided'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">State</p>
                    <p className="font-medium">{customer.address.state || 'Not provided'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">ZIP Code</p>
                    <p className="font-medium">{customer.address.zip || 'Not provided'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{customer.address.country || 'Not provided'}</p>
                  </div>
                </>
              ) : (
                <p>No address information provided</p>
              )}
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Customer Activity</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">
                {new Date(customer.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">
                {new Date(customer.updatedAt).toLocaleString()}
              </p>
            </div>
            
            {/* This would be where you'd show repair tickets for this customer */}
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Repair Tickets</h3>
              <Link
                to={`/tickets/new?customerId=${customer.id}`}
                className="text-blue-500 hover:underline"
              >
                Create New Repair Ticket
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;