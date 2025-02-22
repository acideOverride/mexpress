export interface Customer {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'inactive';
  devices: string[];
  email: string;
}

export interface CustomerListProps {
  /**
   * Array of customer data to display in the list
   */
  customers: Customer[];
  
  /**
   * Optional callback for when a row is clicked
   * @param customerId - The ID of the clicked customer
   */
  onRowClick?: (customerId: string) => void;
  
  /**
   * Optional callback for when an action button is clicked
   * @param customerId - The ID of the customer
   * @param action - The type of action performed
   */
  onAction?: (customerId: string, action: string) => void;
  
  /**
   * Optional CSS class name for additional styling
   */
  className?: string;
}