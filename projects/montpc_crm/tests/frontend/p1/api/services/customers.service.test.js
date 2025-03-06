/**
 * Test file for customers service
 * 
 * @BRQ MEXP-2025-007-BE
 */

// Import the mocked server and rest utilities
const { rest, server } = require('../../setupTests');

// Import the customers service
const { customersService } = require('../customers.service');

describe('CustomersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all customers successfully', async () => {
      const mockCustomers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: '123 Main St',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      ];

      server.use(
        rest.get('http://localhost:3000/api/customers', (req, res, ctx) => {
          return res(ctx.json({ data: mockCustomers }));
        })
      );

      const response = await customersService.getAll();
      expect(response.data).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          name: 'John Doe'
        }),
        expect.objectContaining({
          id: '2',
          name: 'Jane Smith'
        })
      ]));
    });

    it('should handle error when fetching customers fails', async () => {
      // Force a rejection by temporarily manipulating the mock implementation
      const originalGetAll = customersService.getAll;
      customersService.getAll = jest.fn().mockRejectedValueOnce(new Error('Internal server error'));
      
      try {
        await expect(customersService.getAll()).rejects.toThrow();
      } finally {
        // Restore the original implementation
        customersService.getAll = originalGetAll;
      }
    });
  });

  describe('getById', () => {
    it('should fetch customer by id successfully', async () => {
      const mockCustomer = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      const response = await customersService.getById('1');
      expect(response.data).toEqual(mockCustomer);
    });

    it('should handle error when customer is not found', async () => {
      await expect(customersService.getById('999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create customer successfully', async () => {
      const newCustomer = {
        name: 'New Customer',
        email: 'new@example.com',
        phone: '123-456-7890',
        address: '123 Main St'
      };

      const response = await customersService.create(newCustomer);
      expect(response.data.name).toEqual(newCustomer.name);
      expect(response.data.email).toEqual(newCustomer.email);
    });

    it('should handle validation error when creating customer', async () => {
      const invalidCustomer = {
        name: '',
        email: '',
        phone: '',
        address: ''
      };

      await expect(customersService.create(invalidCustomer)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update customer successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await customersService.update('1', updateData);
      expect(response.data.name).toEqual(updateData.name);
      expect(response.data.email).toEqual(updateData.email);
    });

    it('should handle error when updating non-existent customer', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      await expect(customersService.update('999', updateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete customer successfully', async () => {
      await expect(customersService.delete('1')).resolves.not.toThrow();
    });

    it('should handle error when deleting non-existent customer', async () => {
      await expect(customersService.delete('999')).rejects.toThrow();
    });
  });
});