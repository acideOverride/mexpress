import { useState, useRef, useEffect } from 'react';
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return { customers: [], repairs: [] };
      try {
        const response = await axios.get<SearchResults>(`/api/search?q=${encodeURIComponent(query)}`);
        return response.data;
      } catch (error) {
        console.error('Search error:', error);
        return { customers: [], repairs: [] };
      }
    },
    enabled: query.length > 2
  });

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="search"
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && query.length > 2 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div className="p-2 border-b">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigate('/customers/new');
                  setIsOpen(false);
                  setQuery('');
                }}
                className="flex items-center p-2 hover:bg-gray-100 rounded"
              >
                <span className="mr-2">👤</span>
                <span>New Customer</span>
              </button>
              <button
                onClick={() => {
                  navigate('/repairs/new');
                  setIsOpen(false);
                  setQuery('');
                }}
                className="flex items-center p-2 hover:bg-gray-100 rounded"
              >
                <span className="mr-2">🔧</span>
                <span>New Repair</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <>
              {results?.customers && results.customers.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Customers</h3>
                  {results.customers.map(customer => (
                    <div
                      key={customer.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate(`/customers/${customer.id}`);
                        setIsOpen(false);
                        setQuery('');
                      }}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                    </div>
                  ))}
                </div>
              )}

              {results?.repairs && results.repairs.length > 0 && (
                <div className="p-2 border-t">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Repairs</h3>
                  {results.repairs.map(repair => (
                    <div
                      key={repair.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate(`/repairs/${repair.id}`);
                        setIsOpen(false);
                        setQuery('');
                      }}
                    >
                      <div className="font-medium">{repair.deviceType}</div>
                      <div className="text-sm text-gray-600">{repair.issue}</div>
                    </div>
                  ))}
                </div>
              )}

              {(!results?.customers?.length && !results?.repairs?.length) && (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
