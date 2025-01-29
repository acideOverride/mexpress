import { useState } from 'react';

export function CustomerList() {
  const [searchQuery, setSearchQuery] = useState('');

  // Temporary mock data
  const customers = [
    { id: 1, name: 'Customer Test1', phone: '+33102030405', email: 'email@customer.com' },
    { id: 2, name: 'Customer Test2', phone: '+33102030405', email: 'email@customer.com' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Search Section */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="search"
          placeholder="Search customers..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="mt-2 text-sm text-gray-500">
          Found: {customers.length} from {customers.length}
        </div>
      </div>

      {/* Customers List */}
      <div className="flex-1 overflow-y-auto">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            <div className="font-medium text-red-500">{customer.name}</div>
            <div className="text-red-500">{customer.phone}</div>
            <div className="text-red-500">{customer.email}</div>
          </div>
        ))}
      </div>

      {/* Add Contact Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          + ADD CONTACT
        </button>
      </div>
    </div>
  );
}
