interface Customer {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  hiboutikId?: string;
  communicationPreferences?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Repair {
  id: number;
  customerId: number;
  deviceType: string;
  issue: string;
  status: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedCompletion?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

class MemoryStore {
  private customers: Customer[] = [];
  private repairs: Repair[] = [];
  private customerIdCounter = 1;
  private repairIdCounter = 1;

  // Customer methods
  async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const customer: Customer = {
      id: this.customerIdCounter++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.push(customer);
    return customer;
  }

  async getCustomers(): Promise<Customer[]> {
    return this.customers;
  }

  // Repair methods
  async createRepair(data: Omit<Repair, 'id' | 'createdAt' | 'updatedAt'>): Promise<Repair> {
    const repair: Repair = {
      id: this.repairIdCounter++,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.repairs.push(repair);
    return repair;
  }

  async getRepairs(): Promise<Repair[]> {
    return this.repairs;
  }
}

export const db = new MemoryStore();
export type { Customer, Repair };
