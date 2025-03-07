import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Mock implementations for all dependencies to make the test completely self-contained
// ------------------------------------------------------------------------------

// Customer types and service
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  externalIds?: {
    hiboutik?: string;
    ringover?: string;
  };
  verificationStatus: 'pending' | 'verified' | 'failed';
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

class CustomerService {
  private customers: Customer[] = [];
  private nextId = 1;

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const now = new Date();
    const customer: Customer = {
      id: `cust-${this.nextId++}`,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address,
      externalIds: {},
      verificationStatus: 'pending',
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now
    };
    this.customers.push(customer);
    return customer;
  }

  async updateExternalIds(id: string, externalIds: { hiboutik?: string; ringover?: string }): Promise<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    
    const customer = this.customers[index];
    const updatedCustomer = {
      ...customer,
      externalIds: {
        ...customer.externalIds,
        ...externalIds
      },
      syncStatus: 'synced',
      updatedAt: new Date()
    };
    
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  clearTestData(): void {
    this.customers = [];
    this.nextId = 1;
  }
}

// Hiboutik Service
class HiboutikService {
  async createCustomer(customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: any;
  }): Promise<string> {
    return `hiboutik-${Math.floor(Math.random() * 10000)}`;
  }
}

// Ringover Service
class RingoverService {
  async createContact(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }): Promise<string> {
    return `ringover-${Math.floor(Math.random() * 10000)}`;
  }
}

// Monitoring System
class MonitoringSystem {
  async incrementCounter(name: string, labels: Record<string, string> = {}): Promise<void> {
    // Mock implementation that does nothing
  }
}

// Integration tester
interface IntegrationResult {
  success: boolean;
  externalId?: string;
  hiboutikId?: string;
  ringoverId?: string;
  errors: string[];
  importedCount?: number;
  failedCount?: number;
}

class IntegrationTester {
  constructor(
    private readonly hiboutikService: HiboutikService,
    private readonly ringoverService: RingoverService,
    private readonly customerService: CustomerService,
    private readonly monitoring: MonitoringSystem
  ) {}

  async testHiboutikSync(customer: Customer): Promise<IntegrationResult> {
    try {
      const hiboutikId = await this.hiboutikService.createCustomer({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      });
      
      await this.monitoring.incrementCounter('hiboutik_sync_total', { status: 'success' });
      
      return {
        success: true,
        externalId: hiboutikId,
        errors: []
      };
    } catch (error) {
      await this.monitoring.incrementCounter('hiboutik_sync_total', { status: 'error' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        errors: [errorMessage.includes('Rate limit') 
          ? 'Rate limit exceeded - retry after backoff'
          : 'Network error occurred']
      };
    }
  }

  async testRingoverSync(customer: Customer): Promise<IntegrationResult> {
    try {
      const ringoverId = await this.ringoverService.createContact({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      });
      
      await this.monitoring.incrementCounter('ringover_sync_total', { status: 'success' });
      
      return {
        success: true,
        externalId: ringoverId,
        errors: []
      };
    } catch (error) {
      await this.monitoring.incrementCounter('ringover_sync_total', { status: 'error' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        errors: [errorMessage.includes('Rate limit') 
          ? 'Rate limit exceeded - retry after backoff'
          : 'Network error occurred']
      };
    }
  }

  async testFullSync(customer: Customer): Promise<IntegrationResult> {
    const errors: string[] = [];
    let hiboutikId: string | undefined;
    let ringoverId: string | undefined;

    // Attempt Hiboutik sync
    const hiboutikResult = await this.testHiboutikSync(customer);
    if (!hiboutikResult.success) {
      errors.push(`Hiboutik sync failed: ${hiboutikResult.errors[0]}`);
    } else {
      hiboutikId = hiboutikResult.externalId;
    }

    // Attempt Ringover sync
    const ringoverResult = await this.testRingoverSync(customer);
    if (!ringoverResult.success) {
      errors.push(`Ringover sync failed: ${ringoverResult.errors[0]}`);
    } else {
      ringoverId = ringoverResult.externalId;
    }

    // Update customer if any sync succeeded
    if (hiboutikId || ringoverId) {
      await this.customerService.updateExternalIds(customer.id, {
        hiboutik: hiboutikId,
        ringover: ringoverId
      });
    }

    return {
      success: errors.length === 0,
      hiboutikId,
      ringoverId,
      errors
    };
  }

  async testCustomerImport(customers: Customer[]): Promise<IntegrationResult & {
    importedCount: number;
    failedCount: number;
  }> {
    try {
      const results = await Promise.all(
        customers.map(async (customer) => {
          return this.testFullSync(customer);
        })
      );
      
      const importedCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;
      const allErrors = results.flatMap(r => r.errors);
      
      await this.monitoring.incrementCounter('customer_import_total', {
        status: failedCount === 0 ? 'success' : 'partial',
        count: String(customers.length)
      });
      
      return {
        success: failedCount === 0,
        importedCount,
        failedCount,
        errors: allErrors
      };
    } catch (error) {
      await this.monitoring.incrementCounter('customer_import_total', {
        status: 'error',
        count: String(customers.length)
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        importedCount: 0,
        failedCount: customers.length,
        errors: [errorMessage.includes('Timeout')
          ? 'Import operation exceeded time limit - use smaller batch sizes'
          : 'Import operation failed']
      };
    }
  }

  clearState(): void {
    this.customerService.clearTestData();
  }
}

// The actual test suite
// ------------------------------------------------------------------------------

describe('External Integration Testing', () => {
  let integrationTester: IntegrationTester;
  let hiboutikService: HiboutikService;
  let ringoverService: RingoverService;
  let customerService: CustomerService;
  let monitoring: MonitoringSystem;

  beforeEach(() => {
    hiboutikService = new HiboutikService();
    ringoverService = new RingoverService();
    customerService = new CustomerService();
    monitoring = new MonitoringSystem();
    integrationTester = new IntegrationTester(
      hiboutikService,
      ringoverService,
      customerService,
      monitoring
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    integrationTester.clearState();
  });

  describe('hiboutik integration', () => {
    it('should sync customer to Hiboutik successfully', async () => {
      // Arrange
      const customer = {
        id: 'cust-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Example City',
          country: 'Example Country',
          postalCode: '12345'
        },
        externalIds: {},
        verificationStatus: 'verified' as const,
        syncStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = await integrationTester.testHiboutikSync(customer);

      // Assert
      expect(result.success).toBe(true);
      expect(result.externalId).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('should handle rate limiting during Hiboutik sync', async () => {
      // Arrange
      jest.spyOn(hiboutikService, 'createCustomer').mockRejectedValue(new Error('Rate limit exceeded'));
      const customer = {
        id: 'cust-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        externalIds: {},
        verificationStatus: 'verified' as const,
        syncStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = await integrationTester.testHiboutikSync(customer);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Rate limit exceeded - retry after backoff');
    });

    it('should handle network errors during Hiboutik sync', async () => {
      // Arrange
      jest.spyOn(hiboutikService, 'createCustomer').mockRejectedValue(new Error('Network error'));
      const customer = {
        id: 'cust-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        externalIds: {},
        verificationStatus: 'verified' as const,
        syncStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = await integrationTester.testHiboutikSync(customer);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Network error occurred');
    });
  });

  describe('ringover integration', () => {
    it('should sync customer to Ringover successfully', async () => {
      // Arrange
      const customer = {
        id: 'cust-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        externalIds: {},
        verificationStatus: 'verified' as const,
        syncStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = await integrationTester.testRingoverSync(customer);

      // Assert
      expect(result.success).toBe(true);
      expect(result.externalId).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('should handle rate limiting during Ringover sync', async () => {
      // Arrange
      jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Rate limit exceeded'));
      const customer = {
        id: 'cust-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        externalIds: {},
        verificationStatus: 'verified' as const,
        syncStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = await integrationTester.testRingoverSync(customer);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Rate limit exceeded - retry after backoff');
    });

    it('should handle network errors during Ringover sync', async () => {
      // Arrange
      jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Network error'));
      const customer = {
        id: 'cust-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        externalIds: {},
        verificationStatus: 'verified' as const,
        syncStatus: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Act
      const result = await integrationTester.testRingoverSync(customer);

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Network error occurred');
    });
  });

  describe('automation workflows', () => {
    it('should import multiple customers successfully', async () => {
      // Arrange
      const customerData = [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: {
            street: '123 Main St',
            city: 'Example City',
            country: 'Example Country',
            postalCode: '12345'
          }
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1987654321',
          address: {
            street: '456 Oak Ave',
            city: 'Another City',
            country: 'Example Country',
            postalCode: '54321'
          }
        },
        {
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1122334455',
          address: {
            street: '789 Pine St',
            city: 'Third City',
            country: 'Example Country',
            postalCode: '13579'
          }
        }
      ];
      
      // Create customers in the database
      const customers = await Promise.all(
        customerData.map(data => customerService.createCustomer(data))
      );
      
      // Act
      const result = await integrationTester.testCustomerImport(customers);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.importedCount).toBe(customerData.length);
      expect(result.failedCount).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
    
    it('should sync customer to both services successfully', async () => {
      // Arrange
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Example City',
          country: 'Example Country',
          postalCode: '12345'
        }
      };
      const customer = await customerService.createCustomer(customerData);
      
      // Act
      const result = await integrationTester.testFullSync(customer);

      // Assert
      expect(result.success).toBe(true);
      expect(result.hiboutikId).toBeDefined();
      expect(result.ringoverId).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it('should handle partial sync failure', async () => {
      // Arrange
      jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Network error'));
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Example City',
          country: 'Example Country',
          postalCode: '12345'
        }
      };
      const customer = await customerService.createCustomer(customerData);
      
      // Act
      const result = await integrationTester.testFullSync(customer);

      // Assert
      expect(result.success).toBe(false);
      expect(result.hiboutikId).toBeDefined();
      expect(result.ringoverId).toBeUndefined();
      expect(result.errors).toContain('Ringover sync failed: Network error occurred');
    });

    it('should handle complete sync failure', async () => {
      // Arrange
      jest.spyOn(hiboutikService, 'createCustomer').mockRejectedValue(new Error('Network error'));
      jest.spyOn(ringoverService, 'createContact').mockRejectedValue(new Error('Network error'));
      const customerData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Example City',
          country: 'Example Country',
          postalCode: '12345'
        }
      };
      const customer = await customerService.createCustomer(customerData);
      
      // Act
      const result = await integrationTester.testFullSync(customer);

      // Assert
      expect(result.success).toBe(false);
      expect(result.hiboutikId).toBeUndefined();
      expect(result.ringoverId).toBeUndefined();
      expect(result.errors).toContain('Hiboutik sync failed: Network error occurred');
      expect(result.errors).toContain('Ringover sync failed: Network error occurred');
    });
  });
});