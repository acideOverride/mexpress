import { rest } from 'msw';
import { server } from '../../../setupTests';
import { customersService } from '../customers.service';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../../types';

describe('CustomersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all customers successfully', async () => {
      const mockCustomers: Customer[] = [
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
      expect(response.data).toEqual(mockCustomers);
    });

    it('should handle error when fetching customers fails', async () => {
      server.use(
        rest.get('http://localhost:3000/api/customers', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Internal server error' }));
        })
      );

      await expect(customersService.getAll()).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('should fetch customer by id successfully', async () => {
      const mockCustomer: Customer = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        createdAt: '2025-02-17T10:00:00Z',
        updatedAt: '2025-02-17T10:00:00Z'
      };

      server.use(
        rest.get('http://localhost:3000/api/customers/1', (req, res, ctx) => {
          return res(ctx.json({ data: mockCustomer }));
        })
      );

      const response = await customersService.getById('1');
      expect(response.data).toEqual(mockCustomer);
    });

    it('should handle error when customer is not found', async () => {
      server.use(
        rest.get('http://localhost:3000/api/customers/999', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Customer not found' }));
        })
      );

      await expect(customersService.getById('999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create customer successfully', async () => {
      const newCustomer: CreateCustomerDto = {
        name: 'New Customer',
        email: 'new@example.com',
        phone: '123-456-7890',
        address: '123 Main St'
      };

      const mockResponse = {
        data: {
          id: '3',
          ...newCustomer,
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      };

      server.use(
        rest.post('http://localhost:3000/api/customers', (req, res, ctx) => {
          return res(ctx.status(201), ctx.json(mockResponse));
        })
      );

      const response = await customersService.create(newCustomer);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle validation error when creating customer', async () => {
      const invalidCustomer: CreateCustomerDto = {
        name: '',
        email: 'invalid-email',
        phone: '',
        address: ''
      };

      server.use(
        rest.post('http://localhost:3000/api/customers', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Validation error' }));
        })
      );

      await expect(customersService.create(invalidCustomer)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update customer successfully', async () => {
      const updateData: UpdateCustomerDto = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const mockResponse = {
        data: {
          id: '1',
          ...updateData,
          phone: '123-456-7890',
          address: '123 Main St',
          createdAt: '2025-02-17T10:00:00Z',
          updatedAt: '2025-02-17T10:00:00Z'
        }
      };

      server.use(
        rest.patch('http://localhost:3000/api/customers/1', (req, res, ctx) => {
          return res(ctx.json(mockResponse));
        })
      );

      const response = await customersService.update('1', updateData);
      expect(response.data).toEqual(mockResponse.data);
    });

    it('should handle error when updating non-existent customer', async () => {
      const updateData: UpdateCustomerDto = {
        name: 'Updated Name'
      };

      server.use(
        rest.patch('http://localhost:3000/api/customers/999', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Customer not found' }));
        })
      );

      await expect(customersService.update('999', updateData)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete customer successfully', async () => {
      server.use(
        rest.delete('http://localhost:3000/api/customers/1', (req, res, ctx) => {
          return res(ctx.status(204));
        })
      );

      await expect(customersService.delete('1')).resolves.not.toThrow();
    });

    it('should handle error when deleting non-existent customer', async () => {
      server.use(
        rest.delete('http://localhost:3000/api/customers/999', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'Customer not found' }));
        })
      );

      await expect(customersService.delete('999')).rejects.toThrow();
    });
  });
});