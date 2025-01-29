import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api';

export function CustomerList() {
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll
  });

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-gray-600">Loading customers...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      Error loading customers
    </div>
  );

  if (!customers?.length) return (
    <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-lg">
      No customers found. Add your first customer above.
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold p-4 border-b">Customers</h2>
      <div className="divide-y">
        {customers.map(customer => (
          <div key={customer.id} className="p-4 hover:bg-gray-50">
            <h3 className="font-bold text-lg">{customer.name}</h3>
            <p className="text-gray-600">{customer.email}</p>
            {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
            {customer.address && (
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Address:</span> {customer.address}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
