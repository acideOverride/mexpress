import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Customer, Repair } from '../../types';
import { useNavigate } from 'react-router-dom';

interface SearchResults {
  customers: Customer[];
  repairs: Repair[];
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return { customers: [], repairs: [] };
      const response = await axios.get<SearchResults>(`/api/search?q=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: query.length > 2
  });

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="search"
          placeholder="Search or create new..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* Quick Actions */}
          <div className="p-2 border-b">
            <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigate('/customers/new', { state: { initialName: query } });
                  setIsOpen(false);
                  setQuery('');
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-blue-50 rounded-md"
              >
                <span className="text-xl">👤</span>
                <div>
                  <div className="font-medium text-blue-600">New Customer</div>
                  <div className="text-xs text-gray-500">
                    {query ? `Create: "${query}"` : 'Create new customer'}
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  navigate('/repairs/new');
                  setIsOpen(false);
                  setQuery('');
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-blue-50 rounded-md"
              >
                <span className="text-xl">🔧</span>
                <div>
                  <div className="font-medium text-blue-600">New Repair</div>
                  <div className="text-xs text-gray-500">Create repair ticket</div>
                </div>
              </button>
            </div>
          </div>

          {/* Search Results */}
          {query.length > 2 && (
            <>
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : (!results?.customers.length && !results?.repairs.length) ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No results found</p>
                </div>
              ) : (
                <>
                  {results?.customers.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
                        Customers
                      </h3>
                      {results.customers.map(customer => (
                        <button
                          key={customer.id}
                          onClick={() => {
                            navigate(`/customers/${customer.id}`);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {results?.repairs.length > 0 && (
                    <div className="p-2 border-t">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">
                        Repairs
                      </h3>
                      {results.repairs.map(repair => (
                        <button
                          key={repair.id}
                          onClick={() => {
                            navigate(`/repairs/${repair.id}`);
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                        >
                          <div className="font-medium">{repair.deviceType}</div>
                          <div className="text-sm text-gray-600">{repair.issue}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              repair.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              repair.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              repair.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {repair.priority}
                            </span>
                            <span className="text-xs text-gray-500">
                              Status: {repair.status.replace('_', ' ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
