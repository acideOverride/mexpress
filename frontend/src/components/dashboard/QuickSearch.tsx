import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface QuickSearchProps {
  onSearch: (query: string) => void;
  recentSearches: string[];
}

const QuickSearch: React.FC<QuickSearchProps> = ({ onSearch, recentSearches }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown') {
        setIsOpen(true);
        setSelectedIndex(0);
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        setSelectedIndex(prev => 
          prev < recentSearches.length - 1 ? prev + 1 : prev
        );
        event.preventDefault();
        break;
      case 'ArrowUp':
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        event.preventDefault();
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          setQuery(recentSearches[selectedIndex]);
          onSearch(recentSearches[selectedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    onSearch(search);
    setIsOpen(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md"
      data-testid="quick-search"
    >
      <div className="relative">
        <input
          type="search"
          role="searchbox"
          className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search customers, calls, or companies..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Quick search"
          aria-expanded={isOpen}
          aria-controls="quick-search-suggestions"
          aria-autocomplete="list"
        />
        {query && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && recentSearches.length > 0 && (
        <div
          id="quick-search-suggestions"
          className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10"
          role="listbox"
        >
          {recentSearches.map((search, index) => (
            <button
              key={search}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleRecentSearchClick(search)}
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={-1}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {search}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickSearch;