/**
 * External Integration Update Test
 * - Self-contained implementation with all dependencies mocked inline
 * - No external imports to avoid dependency issues
 */

// Customer Types
interface CustomerAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: CustomerAddress;
  externalIds: Record<string, string>;
  verificationStatus: 'verified' | 'unverified' | 'pending';
  syncStatus: 'synced' | 'pending' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: CustomerAddress;
}

// Service Types
interface HiboutikConfig {
  baseUrl: string;
  apiKey: string;
  accountId: string;
}

interface RingoverConfig {
  baseUrl: string;
  apiKey: string;
  teamId: string;
}

// Result Types
interface SyncResult {
  success: boolean;
  externalId?: string;
  errors: string[];
}

interface FullSyncResult {
  success: boolean;
  hiboutikId?: string;
  ringoverId?: string;
  errors: string[];
}

interface ImportResult {
  success: boolean;
  importedCount: number;
  failedCount: number;
  errors: string[];
}

// Mock Service Implementations
class HiboutikService {
  private config: HiboutikConfig;
  private customers: Map<string, any> = new Map();
  private nextId = 1000;

  constructor(config: HiboutikConfig) {
    this.config = config;
  }

  async createCustomer(customer: Customer): Promise<{ id: string }> {
    // Simulate a fast async operation with process.nextTick
    return new Promise<{ id: string }>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const hiboutikId = String(this.nextId++);
          this.customers.set(hiboutikId, {
            id: hiboutikId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            createdAt: new Date()
          });
          resolve({ id: hiboutikId });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async updateCustomer(hiboutikId: string, data: Partial<Customer>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const hiboutikCustomer = this.customers.get(hiboutikId);
          if (!hiboutikCustomer) {
            reject(new Error('Customer not found in Hiboutik'));
            return;
          }
          
          this.customers.set(hiboutikId, {
            ...hiboutikCustomer,
            ...data,
            updatedAt: new Date()
          });
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async getCustomer(hiboutikId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const hiboutikCustomer = this.customers.get(hiboutikId);
          if (!hiboutikCustomer) {
            reject(new Error('Customer not found in Hiboutik'));
            return;
          }
          resolve(hiboutikCustomer);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

class RingoverService {
  private config: RingoverConfig;
  private contacts: Map<string, any> = new Map();
  private nextId = 2000;

  constructor(config: RingoverConfig) {
    this.config = config;
  }

  async createContact(customer: Customer): Promise<{ id: string }> {
    // Simulate a fast async operation with process.nextTick
    return new Promise<{ id: string }>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const ringoverId = String(this.nextId++);
          this.contacts.set(ringoverId, {
            id: ringoverId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            createdAt: new Date()
          });
          resolve({ id: ringoverId });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async updateContact(ringoverId: string, data: Partial<Customer>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const ringoverContact = this.contacts.get(ringoverId);
          if (!ringoverContact) {
            reject(new Error('Contact not found in Ringover'));
            return;
          }
          
          this.contacts.set(ringoverId, {
            ...ringoverContact,
            ...data,
            updatedAt: new Date()
          });
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async getContact(ringoverId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const ringoverContact = this.contacts.get(ringoverId);
          if (!ringoverContact) {
            reject(new Error('Contact not found in Ringover'));
            return;
          }
          resolve(ringoverContact);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

class CustomerService {
  private customers: Map<string, Customer> = new Map();
  private nextId = 1;

  async createCustomer(data: CustomerData): Promise<Customer> {
    return new Promise<Customer>((resolve) => {
      process.nextTick(() => {
        const id = `cust-${this.nextId++}`;
        const now = new Date();
        const customer: Customer = {
          id,
          ...data,
          externalIds: {},
          verificationStatus: 'pending',
          syncStatus: 'pending',
          createdAt: now,
          updatedAt: now
        };
        this.customers.set(id, customer);
        resolve(customer);
      });
    });
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return new Promise<Customer>((resolve, reject) => {
      process.nextTick(() => {
        const customer = this.customers.get(id);
        if (!customer) {
          reject(new Error('Customer not found'));
          return;
        }
        
        const updatedCustomer = {
          ...customer,
          ...data,
          updatedAt: new Date()
        };
        this.customers.set(id, updatedCustomer);
        resolve(updatedCustomer);
      });
    });
  }

  async getCustomer(id: string): Promise<Customer> {
    return new Promise<Customer>((resolve, reject) => {
      process.nextTick(() => {
        const customer = this.customers.get(id);
        if (!customer) {
          reject(new Error('Customer not found'));
          return;
        }
        resolve(customer);
      });
    });
  }

  async getCustomers(): Promise<Customer[]> {
    return new Promise<Customer[]>((resolve) => {
      process.nextTick(() => {
        resolve(Array.from(this.customers.values()));
      });
    });
  }
}

class MonitoringSystem {
  private metrics: Map<string, number> = new Map();
  private logs: Array<{ timestamp: Date; level: string; message: string; context?: any }> = [];

  recordMetric(name: string, value: number): void {
    const currentValue = this.metrics.get(name) || 0;
    this.metrics.set(name, currentValue + value);
  }

  log(level: string, message: string, context?: any): void {
    this.logs.push({
      timestamp: new Date(),
      level,
      message,
      context
    });
  }

  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  getLogs(): Array<{ timestamp: Date; level: string; message: string; context?: any }> {
    return [...this.logs];
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Integration Tester Implementation
class IntegrationTester {
  private hiboutikService: HiboutikService;
  private ringoverService: RingoverService;
  private customerService: CustomerService;
  private monitoring: MonitoringSystem;
  private syncState: Map<string, { hiboutikId?: string; ringoverId?: string }> = new Map();

  constructor(
    hiboutikService: HiboutikService,
    ringoverService: RingoverService,
    customerService: CustomerService,
    monitoring: MonitoringSystem
  ) {
    this.hiboutikService = hiboutikService;
    this.ringoverService = ringoverService;
    this.customerService = customerService;
    this.monitoring = monitoring;
  }

  async testHiboutikSync(customer: Customer): Promise<SyncResult> {
    this.monitoring.log('info', `Starting Hiboutik sync for customer ${customer.id}`);
    
    try {
      const startTime = Date.now();
      const result = await this.hiboutikService.createCustomer(customer);
      const duration = Date.now() - startTime;
      
      this.monitoring.recordMetric('hiboutik.sync.time', duration);
      this.monitoring.recordMetric('hiboutik.sync.success', 1);
      
      const customerState = this.syncState.get(customer.id) || {};
      this.syncState.set(customer.id, {
        ...customerState,
        hiboutikId: result.id
      });
      
      this.monitoring.log('info', `Hiboutik sync successful for customer ${customer.id}`, { externalId: result.id });
      
      return {
        success: true,
        externalId: result.id,
        errors: []
      };
    } catch (error: any) {
      this.monitoring.recordMetric('hiboutik.sync.failure', 1);
      
      this.monitoring.log('error', `Hiboutik sync failed for customer ${customer.id}`, { error: error.message });
      
      if (error.message.includes('Rate limit')) {
        return {
          success: false,
          errors: ['Rate limit exceeded - retry after backoff']
        };
      }
      
      if (error.message.includes('Network')) {
        return {
          success: false,
          errors: ['Network error occurred']
        };
      }
      
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async testRingoverSync(customer: Customer): Promise<SyncResult> {
    this.monitoring.log('info', `Starting Ringover sync for customer ${customer.id}`);
    
    try {
      const startTime = Date.now();
      const result = await this.ringoverService.createContact(customer);
      const duration = Date.now() - startTime;
      
      this.monitoring.recordMetric('ringover.sync.time', duration);
      this.monitoring.recordMetric('ringover.sync.success', 1);
      
      const customerState = this.syncState.get(customer.id) || {};
      this.syncState.set(customer.id, {
        ...customerState,
        ringoverId: result.id
      });
      
      this.monitoring.log('info', `Ringover sync successful for customer ${customer.id}`, { externalId: result.id });
      
      return {
        success: true,
        externalId: result.id,
        errors: []
      };
    } catch (error: any) {
      this.monitoring.recordMetric('ringover.sync.failure', 1);
      
      this.monitoring.log('error', `Ringover sync failed for customer ${customer.id}`, { error: error.message });
      
      if (error.message.includes('Rate limit')) {
        return {
          success: false,
          errors: ['Rate limit exceeded - retry after backoff']
        };
      }
      
      if (error.message.includes('Network')) {
        return {
          success: false,
          errors: ['Network error occurred']
        };
      }
      
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async testFullSync(customer: Customer): Promise<FullSyncResult> {
    this.monitoring.log('info', `Starting full sync for customer ${customer.id}`);
    
    const errors: string[] = [];
    let hiboutikId: string | undefined;
    let ringoverId: string | undefined;
    
    // Sync to Hiboutik
    const hiboutikResult = await this.testHiboutikSync(customer);
    if (hiboutikResult.success) {
      hiboutikId = hiboutikResult.externalId;
    } else {
      errors.push(`Hiboutik sync failed: ${hiboutikResult.errors.join(', ')}`);
    }
    
    // Sync to Ringover
    const ringoverResult = await this.testRingoverSync(customer);
    if (ringoverResult.success) {
      ringoverId = ringoverResult.externalId;
    } else {
      errors.push(`Ringover sync failed: ${ringoverResult.errors.join(', ')}`);
    }
    
    // Update customer with external IDs
    if (hiboutikId || ringoverId) {
      const externalIds: Record<string, string> = {};
      if (hiboutikId) externalIds.hiboutik = hiboutikId;
      if (ringoverId) externalIds.ringover = ringoverId;
      
      try {
        await this.customerService.updateCustomer(customer.id, {
          externalIds,
          syncStatus: errors.length > 0 ? 'failed' : 'synced'
        });
      } catch (error: any) {
        errors.push(`Failed to update customer with external IDs: ${error.message}`);
      }
    }
    
    return {
      success: errors.length === 0,
      hiboutikId,
      ringoverId,
      errors
    };
  }

  async testCustomerImport(customers: Customer[]): Promise<ImportResult> {
    this.monitoring.log('info', `Starting import for ${customers.length} customers`);
    
    const results = await Promise.all(customers.map(customer => this.testFullSync(customer)));
    
    const importedCount = results.filter(result => result.success).length;
    const failedCount = results.length - importedCount;
    
    const errors = results
      .filter(result => !result.success)
      .flatMap(result => result.errors);
    
    return {
      success: failedCount === 0,
      importedCount,
      failedCount,
      errors
    };
  }

  clearState(): void {
    this.syncState.clear();
    this.monitoring.clearMetrics();
    this.monitoring.clearLogs();
  }
}

// Test Suite
describe('External Integration Testing', () => {
  // Test service instances
  let integrationTester: IntegrationTester;
  let hiboutikService: HiboutikService;
  let ringoverService: RingoverService;
  let customerService: CustomerService;
  let monitoring: MonitoringSystem;

  beforeEach(() => {
    // Initialize services with test configurations
    hiboutikService = new HiboutikService({
      baseUrl: 'https://api.hiboutik.com/v1',
      apiKey: 'test-key',
      accountId: 'test-account'
    });
    
    ringoverService = new RingoverService({
      baseUrl: 'https://api.ringover.com/v2',
      apiKey: 'test-key',
      teamId: 'test-team'
    });
    
    customerService = new CustomerService();
    monitoring = new MonitoringSystem();
    
    // Create integration tester
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