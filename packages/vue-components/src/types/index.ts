// Common component props and types

// Size variants for components
export type SizeVariant = 'small' | 'medium' | 'large';

// Color variants for components
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

// Button types
export interface ButtonProps {
  label?: string;
  variant?: ColorVariant;
  size?: SizeVariant;
  disabled?: boolean;
  loading?: boolean;
  outlined?: boolean;
  rounded?: boolean;
  block?: boolean;
  icon?: string;
}

// Input types
export interface InputProps {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  size?: SizeVariant;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  autofocus?: boolean;
}

// Card types
export interface CardProps {
  title?: string;
  subtitle?: string;
  bordered?: boolean;
  elevated?: boolean;
  loading?: boolean;
}

// Checkbox types
export interface CheckboxProps {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
}

// Select types
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue: string | number | (string | number)[];
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  error?: string;
  required?: boolean;
  clearable?: boolean;
}

// Toggle types
export interface ToggleProps {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
  size?: SizeVariant;
}

// Dashboard layout types
export interface DashboardLayoutProps {
  sidebarCollapsed?: boolean;
  sidebarWidth?: number;
  sidebarCollapsedWidth?: number;
}

// Sidebar props
export interface SidebarProps {
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  items?: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarItem[];
}

// Table types
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  formatter?: (value: any, row: any) => string;
  cellClass?: string | ((value: any, row: any) => string);
}

export type TableFilterOperator = 
  | 'contains' 
  | 'equals' 
  | 'startsWith' 
  | 'endsWith' 
  | 'gt' 
  | 'gte' 
  | 'lt' 
  | 'lte';

export interface TableFilter {
  value: string | number | boolean;
  operator: TableFilterOperator;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn[];
  data: T[];
  loading?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  caption?: string;
  sortBy?: string;
  sortDesc?: boolean;
  filters?: Record<string, TableFilter>;
  filterEnabled?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalRows?: number;
  selectable?: boolean;
  selectedRows?: T[];
  emptyText?: string;
  responsive?: boolean;
  dense?: boolean;
}

export interface TableEvent {
  sort: {
    column: TableColumn;
    sortBy: string;
    sortDesc: boolean;
  };
  filter: {
    column: string;
    value: any;
    operator: string;
    filters: Record<string, TableFilter>;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
  };
  selection: {
    selectedRows: any[];
  };
}

// Re-export visualization types
export * from './visualization';