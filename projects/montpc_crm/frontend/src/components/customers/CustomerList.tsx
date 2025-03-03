import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customersService } from '../../api/services';
import { 
  Customer, 
  CustomerStatus, 
  CustomerFilterOptions, 
  CustomerSortOptions, 
  CustomerColumnConfig,
  ListResponse,
  CustomerPaginationOptions
} from '../../types/customer';

// Default column configuration
const defaultColumnConfig: CustomerColumnConfig[] = [
  { field: 'name', label: 'Name', visible: true, sortable: true, order: 1 },
  { field: 'email', label: 'Email', visible: true, sortable: true, order: 2 },
  { field: 'phone', label: 'Phone', visible: true, sortable: true, order: 3 },
  { field: 'status', label: 'Status', visible: true, sortable: true, order: 4 },
  { field: 'createdAt', label: 'Created Date', visible: false, sortable: true, order: 5 },
  { field: 'actions', label: 'Actions', visible: true, sortable: false, order: 6 }
];

// Default pagination options
const defaultPaginationOptions: CustomerPaginationOptions = {
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100]
};

// Local storage keys
const COLUMN_CONFIG_KEY = 'montpc_crm_customer_columns';

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  
  // Data state
  const [customerData, setCustomerData] = useState<ListResponse<Customer> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // Filter state
  const [filters, setFilters] = useState<CustomerFilterOptions>({
    search: '',
    status: null,
    dateFrom: null,
    dateTo: null
  });
  
  // Sort state
  const [sorting, setSorting] = useState<CustomerSortOptions>({
    field: '',
    direction: 'asc'
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<CustomerPaginationOptions>(defaultPaginationOptions);
  
  // Column configuration state
  const [columnConfig, setColumnConfig] = useState<CustomerColumnConfig[]>(() => {
    // Try to load from localStorage
    const savedConfig = localStorage.getItem(COLUMN_CONFIG_KEY);
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error('Failed to parse column configuration from localStorage');
        return defaultColumnConfig;
      }
    }
    return defaultColumnConfig;
  });
  
  // Column configuration menu state
  const [columnMenuOpen, setColumnMenuOpen] = useState<boolean>(false);
  
  // Memoized visible columns
  const visibleColumns = useMemo(() => {
    return columnConfig
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }, [columnConfig]);
  
  // Check if filters are active
  const filtersActive = useMemo(() => {
    return !!(filters.search || filters.status || filters.dateFrom || filters.dateTo);
  }, [filters]);
  
  // Fetch customers with current filters, sorting, and pagination
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build parameters
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      // Add sorting
      if (sorting.field) {
        params.append('sortField', sorting.field);
        params.append('sortDirection', sorting.direction);
      }
      
      // Add pagination
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      
      // Make API request
      const response = await fetch(`/api/customers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCustomerData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Error loading customers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, sorting, pagination]);
  
  // Load data on initial render and when dependencies change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  
  // Update column configuration in localStorage when it changes
  useEffect(() => {
    localStorage.setItem(COLUMN_CONFIG_KEY, JSON.stringify(columnConfig));
  }, [columnConfig]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : e.target.value as CustomerStatus;
    setFilters(prev => ({ ...prev, status: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle date filter changes
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, dateFrom: e.target.value || null }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, dateTo: e.target.value || null }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: null,
      dateFrom: null,
      dateTo: null
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle column sort
  const handleSort = (field: keyof Customer) => {
    setSorting(prev => {
      // If already sorting by this field, toggle direction
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      // Otherwise, sort ascending by this field
      return {
        field,
        direction: 'asc'
      };
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 1 // Reset to first page when changing page size
    }));
  };
  
  // Handle pagination navigation
  const goToFirstPage = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  const goToPreviousPage = () => {
    setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  };
  
  const goToNextPage = () => {
    if (customerData) {
      setPagination(prev => ({ 
        ...prev, 
        page: Math.min(customerData.totalPages, prev.page + 1) 
      }));
    }
  };
  
  const goToLastPage = () => {
    if (customerData) {
      setPagination(prev => ({ ...prev, page: customerData.totalPages }));
    }
  };
  
  // Handle column visibility toggle
  const toggleColumnVisibility = (field: keyof Customer | 'actions') => {
    setColumnConfig(prev => 
      prev.map(col => 
        col.field === field 
          ? { ...col, visible: !col.visible } 
          : col
      )
    );
  };
  
  // Handle row selection
  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Navigation functions
  const goToEditCustomer = (id: string) => {
    navigate(`/customers/${id}/edit`);
  };
  
  const goToNewCustomer = () => {
    navigate('/customers/new');
  };
  
  // Handle retry on error
  const handleRetry = () => {
    fetchCustomers();
  };
  
  // Render loading state
  if (loading && !customerData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg">
          <p className="mb-4">Error loading customers</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Render empty state
  if (customerData && customerData.items.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="mb-4">No customers found</p>
          <button
            onClick={goToNewCustomer}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Customer
          </button>
        </div>
      </div>
    );
  }
  
  // Render data state
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={goToNewCustomer}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Customer
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search filter */}
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search customers
            </label>
            <input
              id="customer-search"
              type="text"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Search by name or email"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Status filter */}
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={filters.status || ''}
              onChange={handleStatusChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All statuses</option>
              <option value={CustomerStatus.ACTIVE}>Active</option>
              <option value={CustomerStatus.INACTIVE}>Inactive</option>
              <option value={CustomerStatus.PENDING}>Pending</option>
              <option value={CustomerStatus.BLOCKED}>Blocked</option>
            </select>
          </div>
          
          {/* Date from filter */}
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
              Filter from date
            </label>
            <input
              id="date-from"
              type="date"
              value={filters.dateFrom || ''}
              onChange={handleDateFromChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Date to filter */}
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
              Filter to date
            </label>
            <input
              id="date-to"
              type="date"
              value={filters.dateTo || ''}
              onChange={handleDateToChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Clear filters button - only show when filters are active */}
          {filtersActive && (
            <div>
              <button
                onClick={handleClearFilters}
                className="p-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
                aria-label="Clear all filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Active filters indicator */}
        {filtersActive && (
          <div className="mt-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Filters active
            </span>
          </div>
        )}
      </div>
      
      {/* Table actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {/* Selected rows count */}
          {selectedRows.length > 0 && (
            <span className="mr-4 text-sm">
              {selectedRows.length} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          {/* Column selector */}
          <div className="relative">
            <button
              onClick={() => setColumnMenuOpen(!columnMenuOpen)}
              className="px-3 py-1 mr-2 border border-gray-300 rounded flex items-center text-sm text-gray-700"
            >
              Columns
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {columnMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2">
                <div className="py-1">
                  {columnConfig.map(column => (
                    <div key={column.field} className="px-4 py-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => toggleColumnVisibility(column.field)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                          aria-label={column.label}
                        />
                        <span className="ml-2 text-sm text-gray-700">{column.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Customer list">
          <thead className="bg-gray-50">
            <tr>
              {/* Row selection column */}
              <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <span className="sr-only">Select</span>
              </th>
              
              {/* Dynamic columns */}
              {visibleColumns.map(column => (
                column.field !== 'actions' ? (
                  <th 
                    key={column.field}
                    scope="col" 
                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    aria-sort={
                      sorting.field === column.field 
                        ? (sorting.direction === 'asc' ? 'ascending' : 'descending')
                        : 'none'
                    }
                    onClick={() => column.sortable && handleSort(column.field as keyof Customer)}
                    style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <span className="ml-1">
                          {sorting.field === column.field ? (
                            sorting.direction === 'asc' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 8V10H15V8H5Z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ) : (
                  <th 
                    key={column.field}
                    scope="col" 
                    className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customerData && customerData.items.map(customer => (
              <tr 
                key={customer.id} 
                className="hover:bg-gray-50"
                onClick={() => toggleRowSelection(customer.id)}
                aria-selected={selectedRows.includes(customer.id)}
              >
                {/* Row selection column */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(customer.id)}
                    onChange={() => toggleRowSelection(customer.id)}
                    onClick={e => e.stopPropagation()}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                
                {/* Dynamic data columns */}
                {visibleColumns.map(column => {
                  if (column.field === 'actions') {
                    return (
                      <td key={column.field} className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/customers/${customer.id}`}
                          onClick={e => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToEditCustomer(customer.id);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                      </td>
                    );
                  }
                  
                  if (column.field === 'status') {
                    return (
                      <td key={column.field} className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${customer.status === CustomerStatus.ACTIVE ? 'bg-green-100 text-green-800' : ''}
                          ${customer.status === CustomerStatus.INACTIVE ? 'bg-gray-100 text-gray-800' : ''}
                          ${customer.status === CustomerStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${customer.status === CustomerStatus.BLOCKED ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {customer.status}
                        </span>
                      </td>
                    );
                  }
                  
                  if (column.field === 'createdAt' || column.field === 'updatedAt') {
                    const date = new Date(customer[column.field]);
                    return (
                      <td key={column.field} className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                        {date.toLocaleDateString()}
                      </td>
                    );
                  }
                  
                  return (
                    <td key={column.field} className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      {customer[column.field as keyof Customer] || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {customerData && customerData.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={goToPreviousPage}
              disabled={pagination.page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white 
                ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={pagination.page === customerData.totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white 
                ${pagination.page === customerData.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.pageSize) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.pageSize, customerData.total)}
                </span> of{' '}
                <span className="font-medium">{customerData.total}</span> results
              </p>
            </div>
            <div className="flex items-center">
              <label htmlFor="items-per-page" className="sr-only">
                Items per page
              </label>
              <select
                id="items-per-page"
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                className="mr-4 text-sm border-gray-300 rounded p-1"
                aria-label="Items per page"
              >
                {pagination.pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={goToFirstPage}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 
                    ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  aria-label="Go to first page"
                >
                  <span className="sr-only">First</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 
                    ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  aria-label="Go to previous page"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page number */}
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {pagination.page} of {customerData.totalPages}
                </span>
                
                <button
                  onClick={goToNextPage}
                  disabled={pagination.page === customerData.totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 
                    ${pagination.page === customerData.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  aria-label="Go to next page"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={pagination.page === customerData.totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 
                    ${pagination.page === customerData.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  aria-label="Go to last page"
                >
                  <span className="sr-only">Last</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L15.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;