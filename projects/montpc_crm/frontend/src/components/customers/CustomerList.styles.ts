import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #1f2937;
  background-color: white;
  outline: none;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const FilterBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #e0f2fe;
  color: #0369a1;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeadCell = styled.th<{ sortable?: boolean; sortDirection?: 'asc' | 'desc' | null }>`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${(props) => props.sortable && `
    cursor: pointer;
    position: relative;
    
    &:hover {
      background-color: #f3f4f6;
    }
    
    &:after {
      content: '${props.sortDirection === 'asc' ? '↑' : props.sortDirection === 'desc' ? '↓' : ''}';
      position: absolute;
      right: 0.5rem;
      color: ${props.sortDirection ? '#3b82f6' : '#9ca3af'};
    }
  `}
`;

export const TableBody = styled.tbody`
  background-color: white;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }

  &.selected {
    background-color: #e0f2fe;
  }
`;

export const TableCell = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #1f2937;
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  
  ${(props) => {
    switch (props.status) {
      case 'ACTIVE':
        return `
          background-color: #d1fae5;
          color: #065f46;
        `;
      case 'INACTIVE':
        return `
          background-color: #f3f4f6;
          color: #4b5563;
        `;
      case 'PENDING':
        return `
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'BLOCKED':
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
      default:
        return `
          background-color: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

export const ShimmerRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const ShimmerCell = styled.div`
  height: 1.25rem;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
  margin-right: 1rem;
  
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 0.375rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  color: ${(props) => (props.disabled ? '#9ca3af' : '#1f2937')};
  font-size: 0.875rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  
  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }
  
  &:focus:not(:disabled) {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const PaginationSelect = styled.select`
  padding: 0.375rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  color: #1f2937;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const ColumnConfigButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  color: #4b5563;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

export const ColumnConfigMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  padding: 0.5rem 0;
`;

export const ColumnConfigItem = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #1f2937;
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

export const ColumnDragHandle = styled.div`
  cursor: grab;
  color: #9ca3af;
  margin-right: 0.5rem;
  
  &:active {
    cursor: grabbing;
  }
`;