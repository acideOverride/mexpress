import React from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface QuickSearchProps {
  onSearch: (query: string) => void;
}

function QuickSearch({ onSearch }: QuickSearchProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      onSearch(debouncedSearchTerm);
      // Simulate search delay
      setTimeout(() => setIsSearching(false), 500);
    } else {
      onSearch('');
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        {isSearching ? (
          <svg 
            className="animate-spin h-5 w-5 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg 
            className="h-5 w-5 text-gray-400" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </div>
      <input
        type="search"
        role="searchbox"
        className="block w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                 placeholder:text-gray-400 shadow-sm transition-colors
                 hover:border-gray-300"
        placeholder="Search customers, calls or activities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 flex items-center pr-4 
                   text-gray-400 hover:text-gray-600"
        >
          <svg 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default QuickSearch;