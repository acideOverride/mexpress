import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Customer, 
  CustomerStatus, 
  CustomerFilterOptions, 
  CustomerSortOptions, 
  CustomerColumnConfig,
  CustomerPaginationOptions,
  ListResponse 
} from '../../types/customer';
import {
  Container,
  Header,
  Title,
  ActionsContainer,
  FilterContainer,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  FilterBadge,
  TableContainer,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  StatusBadge,
  EmptyState,
  LoadingContainer,
  ShimmerRow,
  ShimmerCell,
  ErrorContainer,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
  PaginationSelect,
  ColumnConfigButton,
  ColumnConfigMenu,
  ColumnConfigItem,
  ColumnDragHandle
} from './CustomerList.styles';

// Default column configuration
const defaultColumnConfig: CustomerColumnConfig[] = [
  { field: 'name', label: 'Name', visible: true, sortable: true, order: 0 },
  { field: 'email', label: 'Email', visible: true, sortable: true, order: 1 },
  { field: 'phone', label: 'Phone', visible: true, sortable: false, order: 2 },
  { field: 'status', label: 'Status', visible: true, sortable: true, order: 3 },
  { field: 'createdAt', label: 'Created Date', visible: true, sortable: true, order: 4 },
  { field: 'actions', label: 'Actions', visible: true, sortable: false, order: 5 }
];

// Default pagination settings
const defaultPagination: CustomerPaginationOptions = {
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100]
};

export const CustomerList: React.FC = () => {
  const navigate = useNavigate();
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  
  // State management
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [filters, setFilters] = useState<CustomerFilterOptions>({
    search: '',
    status: null,
    dateFrom: null,
    dateTo: null
  });
  const [sorting, setSorting] = useState<CustomerSortOptions>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [columnConfig, setColumnConfig] = useState<CustomerColumnConfig[]>(() => {
    // Load column config from localStorage or use default
    const savedConfig = localStorage.getItem('customerListColumns');
    return savedConfig ? JSON.parse(savedConfig) : defaultColumnConfig;
  });
  const [pagination, setPagination] = useState<CustomerPaginationOptions>(() => {
    // Load pagination settings from localStorage or use default
    const savedPagination = localStorage.getItem('customerListPagination');
    return savedPagination ? JSON.parse(savedPagination) : defaultPagination;
  });

  // Save settings to localStorage on change
  useEffect(() => {
    localStorage.setItem('customerListColumns', JSON.stringify(columnConfig));
  }, [columnConfig]);

  useEffect(() => {
    localStorage.setItem('customerListPagination', JSON.stringify(pagination));
  }, [pagination]);

  // Handle clicks outside column menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setColumnMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch customers with filters, sorting, and pagination
  const { data, isLoading, error, refetch } = useQuery<ListResponse<Customer>>({
    queryKey: ['customers', filters, sorting, pagination],
    queryFn: async () => {
      // Construct query parameters
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      params.append('sortField', sorting.field || 'createdAt');
      params.append('sortDirection', sorting.direction);
      params.append('page', pagination.page.toString());
      params.append('pageSize', pagination.pageSize.toString());
      
      const response = await fetch(`/api/customers?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      return response.json();
    },
  });

  // Handle row selection
  const handleRowSelect = (customerId: string, isMultiSelect: boolean) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else if (isMultiSelect) {
        return [...prev, customerId];
      } else {
        return [customerId];
      }
    });
  };

  // Handle sorting
  const handleSort = (field: keyof Customer) => {
    if (!field || typeof field !== 'string') return;
    
    setSorting(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle filter changes
  const handleFilterChange = (name: keyof CustomerFilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle column visibility toggle
  const handleColumnToggle = (fieldName: string) => {
    setColumnConfig(prev => 
      prev.map(col => 
        col.field === fieldName 
          ? { ...col, visible: !col.visible } 
          : col
      )
    );
  };

  // Handle column reordering
  const handleColumnReorder = (startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;

    const reordered = [...columnConfig];
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);

    // Update order values
    const updated = reordered.map((col, index) => ({ ...col, order: index }));
    setColumnConfig(updated);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination(prev => ({ ...prev, page: 1, pageSize: newSize }));
  };

  // Render loading state with shimmer effect
  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Customers</Title>
          <ActionsContainer>
            <ColumnConfigButton disabled>Columns</ColumnConfigButton>
            <ColumnConfigButton disabled>Add Customer</ColumnConfigButton>
          </ActionsContainer>
        </Header>
        
        <LoadingContainer>
          {Array.from({ length: 5 }).map((_, index) => (
            <ShimmerRow key={index}>
              <ShimmerCell style={{ width: '30%' }} />
              <ShimmerCell style={{ width: '25%' }} />
              <ShimmerCell style={{ width: '15%' }} />
              <ShimmerCell style={{ width: '15%' }} />
              <ShimmerCell style={{ width: '15%' }} />
            </ShimmerRow>
          ))}
        </LoadingContainer>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container>
        <Header>
          <Title>Customers</Title>
          <ActionsContainer>
            <ColumnConfigButton onClick={() => refetch()}>Try Again</ColumnConfigButton>
          </ActionsContainer>
        </Header>
        
        <ErrorContainer>
          <p>Error loading customers: {(error as Error).message}</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
            Retry
          </button>
        </ErrorContainer>
      </Container>
    );
  }

  // Get visible columns in correct order
  const visibleColumns = columnConfig
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  // Calculate if any filters are active
  const hasActiveFilters = 
    filters.search || 
    filters.status || 
    filters.dateFrom || 
    filters.dateTo;

  // Check if data is available
  const hasData = data && data.items && data.items.length > 0;
  const isEmpty = data && data.items && data.items.length === 0;

  return (
    <Container>
      <Header>
        <Title>Customers</Title>
        <ActionsContainer>
          {/* Column configuration button */}
          <div style={{ position: 'relative' }}>
            <ColumnConfigButton 
              onClick={() => setColumnMenuOpen(!columnMenuOpen)}
              aria-expanded={columnMenuOpen}
              aria-haspopup="true"
            >
              Columns
            </ColumnConfigButton>
            
            {columnMenuOpen && (
              <ColumnConfigMenu ref={columnMenuRef}>
                {columnConfig.map((col, index) => (
                  <ColumnConfigItem key={col.field}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ColumnDragHandle>
                        ≡
                      </ColumnDragHandle>
                      <label 
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        htmlFor={`column-${col.field}`}
                      >
                        <input
                          id={`column-${col.field}`}
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => handleColumnToggle(col.field)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {col.label}
                      </label>
                    </div>
                  </ColumnConfigItem>
                ))}
              </ColumnConfigMenu>
            )}
          </div>

          {/* Add customer button */}
          <ColumnConfigButton onClick={() => navigate('/customers/new')}>
            Add Customer
          </ColumnConfigButton>
        </ActionsContainer>
      </Header>

      {/* Filter section */}
      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="search">Search</FilterLabel>
          <FilterInput
            id="search"
            type="text"
            placeholder="Name, email, or phone"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            aria-label="Search customers"
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="status">Status</FilterLabel>
          <FilterSelect
            id="status"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || null)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {Object.values(CustomerStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="dateFrom">From Date</FilterLabel>
          <FilterInput
            id="dateFrom"
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value || null)}
            aria-label="Filter from date"
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel htmlFor="dateTo">To Date</FilterLabel>
          <FilterInput
            id="dateTo"
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value || null)}
            aria-label="Filter to date"
          />
        </FilterGroup>

        {/* Indicator for active filters */}
        {hasActiveFilters && (
          <FilterBadge>
            Filters active
            <button 
              onClick={() => {
                setFilters({
                  search: '',
                  status: null,
                  dateFrom: null,
                  dateTo: null
                });
              }} 
              aria-label="Clear all filters"
              style={{ marginLeft: '0.5rem', fontSize: '1rem' }}
            >
              ×
            </button>
          </FilterBadge>
        )}
      </FilterContainer>

      {/* Table section */}
      <TableContainer>
        <Table role="grid" aria-label="Customer list">
          <TableHead>
            <tr>
              {/* Checkbox for selecting all rows */}
              <TableHeadCell style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={
                    hasData && 
                    selectedCustomers.length === data.items.length
                  }
                  onChange={() => {
                    if (hasData && selectedCustomers.length === data.items.length) {
                      setSelectedCustomers([]);
                    } else if (data && data.items) {
                      setSelectedCustomers(data.items.map(c => c.id));
                    }
                  }}
                  aria-label="Select all customers"
                />
              </TableHeadCell>
              
              {/* Column headers */}
              {visibleColumns.map(col => (
                col.field !== 'actions' ? (
                  <TableHeadCell 
                    key={col.field}
                    sortable={col.sortable}
                    sortDirection={sorting.field === col.field ? sorting.direction : null}
                    onClick={() => col.sortable && handleSort(col.field as keyof Customer)}
                    aria-sort={
                      sorting.field === col.field
                        ? sorting.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    {col.label}
                  </TableHeadCell>
                ) : (
                  <TableHeadCell key={col.field}>
                    {col.label}
                  </TableHeadCell>
                )
              ))}
            </tr>
          </TableHead>
          
          <TableBody>
            {/* Empty state */}
            {isEmpty && (
              <tr>
                <TableCell colSpan={visibleColumns.length + 1}>
                  <EmptyState>
                    <p>No customers found</p>
                    {hasActiveFilters && (
                      <p>Try adjusting your filters or create a new customer</p>
                    )}
                    {!hasActiveFilters && (
                      <ColumnConfigButton 
                        onClick={() => navigate('/customers/new')}
                        style={{ marginTop: '1rem' }}
                      >
                        Add Customer
                      </ColumnConfigButton>
                    )}
                  </EmptyState>
                </TableCell>
              </tr>
            )}
            
            {/* Customer rows */}
            {data && data.items && data.items.map(customer => (
              <TableRow 
                key={customer.id}
                className={selectedCustomers.includes(customer.id) ? 'selected' : ''}
                onClick={(e) => {
                  // Don't select when clicking on action buttons
                  if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                    handleRowSelect(
                      customer.id, 
                      e.ctrlKey || e.metaKey || e.shiftKey
                    );
                  }
                }}
                aria-selected={selectedCustomers.includes(customer.id)}
              >
                {/* Row selection checkbox */}
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleRowSelect(
                      customer.id, 
                      true
                    )}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${customer.name}`}
                  />
                </TableCell>
                
                {/* Dynamic row cells based on visible columns */}
                {visibleColumns.map(col => {
                  if (col.field === 'actions') {
                    return (
                      <TableCell key={col.field}>
                        <ActionsContainer>
                          <ColumnConfigButton 
                            onClick={() => navigate(`/customers/${customer.id}/edit`)}
                            aria-label={`Edit ${customer.name}`}
                          >
                            Edit
                          </ColumnConfigButton>
                          <ColumnConfigButton
                            onClick={() => {
                              // TODO: Implement delete functionality
                              alert('Delete functionality to be implemented');
                            }}
                            style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}
                            aria-label={`Delete ${customer.name}`}
                          >
                            Delete
                          </ColumnConfigButton>
                        </ActionsContainer>
                      </TableCell>
                    );
                  } else if (col.field === 'status') {
                    return (
                      <TableCell key={col.field}>
                        <StatusBadge status={customer.status}>
                          {customer.status}
                        </StatusBadge>
                      </TableCell>
                    );
                  } else if (col.field === 'createdAt') {
                    return (
                      <TableCell key={col.field}>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </TableCell>
                    );
                  } else if (col.field === 'address') {
                    // Handle address object - format as string
                    return (
                      <TableCell key={col.field}>
                        {customer.address ? 
                          `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}` : 
                          '-'}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={col.field}>
                        {customer[col.field as keyof Customer]?.toString() || '-'}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination controls */}
        {data && data.items && data.items.length > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              Showing {((pagination.page - 1) * pagination.pageSize) + 1}-
              {Math.min(pagination.page * pagination.pageSize, data.total)} of {data.total} customers
            </PaginationInfo>
            
            <PaginationControls>
              {/* Page size selector */}
              <PaginationSelect
                value={pagination.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                aria-label="Items per page"
              >
                {pagination.pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </PaginationSelect>
              
              {/* Page navigation */}
              <PaginationButton
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
                aria-label="Go to first page"
              >
                &laquo;
              </PaginationButton>
              
              <PaginationButton
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                aria-label="Go to previous page"
              >
                &lsaquo;
              </PaginationButton>
              
              <span style={{ padding: '0.375rem 0.5rem' }}>
                Page {pagination.page} of {data.totalPages}
              </span>
              
              <PaginationButton
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === data.totalPages}
                aria-label="Go to next page"
              >
                &rsaquo;
              </PaginationButton>
              
              <PaginationButton
                onClick={() => handlePageChange(data.totalPages)}
                disabled={pagination.page === data.totalPages}
                aria-label="Go to last page"
              >
                &raquo;
              </PaginationButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </TableContainer>
    </Container>
  );
};

export default CustomerList;