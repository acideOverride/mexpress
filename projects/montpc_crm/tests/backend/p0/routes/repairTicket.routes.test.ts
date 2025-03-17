import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';
import { repairTicketRoutes } from '../../../../backend/src/routes/repairTicket.routes';
import { RepairTicketController } from '../../../../backend/src/controllers/RepairTicketController';
import { RepairTicketService } from '../../../../backend/src/services/RepairTicketService';
import { RepairTicketRepository } from '../../../../backend/src/repositories/RepairTicketRepository';
import { TicketStatus, TicketPriority } from '../../../../backend/src/models/RepairTicket';
import mongoose from 'mongoose';

// Mock the controller
jest.mock('../../../../backend/src/controllers/RepairTicketController');
jest.mock('../../../../backend/src/services/RepairTicketService');
jest.mock('../../../../backend/src/repositories/RepairTicketRepository');

describe('RepairTicket Routes', () => {
  let app: Express;
  let mockController: jest.Mocked<RepairTicketController>;
  
  beforeEach(() => {
    // Create a new Express app
    app = express();
    app.use(express.json());
    
    // Create the mock controller
    const mockRepository = new RepairTicketRepository() as jest.Mocked<RepairTicketRepository>;
    const mockService = new RepairTicketService(mockRepository) as jest.Mocked<RepairTicketService>;
    mockController = new RepairTicketController(mockService) as jest.Mocked<RepairTicketController>;
    
    // Replace the controller in the routes
    (RepairTicketController as jest.Mock).mockImplementation(() => mockController);
    
    // Register repair ticket routes
    app.use('/api/repair-tickets', repairTicketRoutes);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/repair-tickets', () => {
    it('should call getAllRepairTickets controller method', async () => {
      // Setup the mock response
      const mockTickets = [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          customerId: new mongoose.Types.ObjectId().toString(),
          deviceId: new mongoose.Types.ObjectId().toString(),
          problem: 'Test problem',
          status: TicketStatus.PENDING,
          priority: TicketPriority.MEDIUM,
          estimatedCost: 100
        }
      ];
      
      // Mock controller response
      mockController.getAllRepairTickets.mockImplementation((req: Request, res: Response) => {
        res.status(200).json(mockTickets);
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app).get('/api/repair-tickets');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTickets);
      expect(mockController.getAllRepairTickets).toHaveBeenCalled();
    });
    
    it('should handle query parameters', async () => {
      // Mock controller response
      mockController.getAllRepairTickets.mockImplementation((req: Request, res: Response) => {
        res.status(200).json([]);
        return Promise.resolve();
      });
      
      // Make the request with query parameters
      await request(app).get('/api/repair-tickets?status=PENDING&priority=HIGH');
      
      // Assertions
      expect(mockController.getAllRepairTickets).toHaveBeenCalled();
      // Check that the query parameters are passed correctly
      const mockCall = mockController.getAllRepairTickets.mock.calls[0][0];
      expect(mockCall.query).toEqual({ status: 'PENDING', priority: 'HIGH' });
    });
  });
  
  describe('GET /api/repair-tickets/:id', () => {
    it('should call getRepairTicketById controller method', async () => {
      // Setup mock ticket
      const ticketId = new mongoose.Types.ObjectId().toString();
      const mockTicket = {
        _id: ticketId,
        customerId: new mongoose.Types.ObjectId().toString(),
        deviceId: new mongoose.Types.ObjectId().toString(),
        problem: 'Test problem',
        status: TicketStatus.PENDING,
        priority: TicketPriority.MEDIUM,
        estimatedCost: 100
      };
      
      // Mock controller response
      mockController.getRepairTicketById.mockImplementation((req: Request, res: Response) => {
        res.status(200).json(mockTicket);
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app).get(`/api/repair-tickets/${ticketId}`);
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTicket);
      expect(mockController.getRepairTicketById).toHaveBeenCalled();
      // Check that the id parameter is passed correctly
      const mockCall = mockController.getRepairTicketById.mock.calls[0][0];
      expect(mockCall.params.id).toBe(ticketId);
    });
    
    it('should return 404 when ticket is not found', async () => {
      // Setup non-existent ticket id
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      // Mock controller response for not found
      mockController.getRepairTicketById.mockImplementation((req: Request, res: Response) => {
        res.status(404).json({ message: 'Repair ticket not found' });
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app).get(`/api/repair-tickets/${nonExistentId}`);
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Repair ticket not found' });
      expect(mockController.getRepairTicketById).toHaveBeenCalled();
    });
  });
  
  describe('POST /api/repair-tickets', () => {
    it('should call createRepairTicket controller method', async () => {
      // Setup ticket data
      const ticketData = {
        customerId: new mongoose.Types.ObjectId().toString(),
        deviceId: new mongoose.Types.ObjectId().toString(),
        problem: 'New test problem',
        priority: TicketPriority.HIGH,
        estimatedCost: 150
      };
      
      // Mock created ticket
      const createdTicket = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...ticketData,
        status: TicketStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock controller response
      mockController.createRepairTicket.mockImplementation((req: Request, res: Response) => {
        res.status(201).json(createdTicket);
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app)
        .post('/api/repair-tickets')
        .send(ticketData);
      
      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTicket);
      expect(mockController.createRepairTicket).toHaveBeenCalled();
      // Check that the request body is passed correctly
      const mockCall = mockController.createRepairTicket.mock.calls[0][0];
      expect(mockCall.body).toEqual(ticketData);
    });
    
    it('should handle validation errors', async () => {
      // Setup invalid ticket data (missing required fields)
      const invalidData = { problem: 'Test problem' };
      
      // Mock controller response for validation error
      mockController.createRepairTicket.mockImplementation((req: Request, res: Response) => {
        res.status(400).json({
          message: 'Validation error',
          errors: ['customerId is required', 'deviceId is required']
        });
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app)
        .post('/api/repair-tickets')
        .send(invalidData);
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('errors');
      expect(mockController.createRepairTicket).toHaveBeenCalled();
    });
  });
  
  describe('PUT /api/repair-tickets/:id', () => {
    it('should call updateRepairTicket controller method', async () => {
      // Setup ticket id and update data
      const ticketId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        problem: 'Updated problem',
        priority: TicketPriority.URGENT
      };
      
      // Mock updated ticket
      const updatedTicket = {
        _id: ticketId,
        customerId: new mongoose.Types.ObjectId().toString(),
        deviceId: new mongoose.Types.ObjectId().toString(),
        ...updateData,
        status: TicketStatus.PENDING,
        estimatedCost: 100,
        updatedAt: new Date()
      };
      
      // Mock controller response
      mockController.updateRepairTicket.mockImplementation((req: Request, res: Response) => {
        res.status(200).json(updatedTicket);
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app)
        .put(`/api/repair-tickets/${ticketId}`)
        .send(updateData);
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTicket);
      expect(mockController.updateRepairTicket).toHaveBeenCalled();
      // Check that the id parameter and request body are passed correctly
      const mockCall = mockController.updateRepairTicket.mock.calls[0][0];
      expect(mockCall.params.id).toBe(ticketId);
      expect(mockCall.body).toEqual(updateData);
    });
    
    it('should return 404 when ticket is not found for update', async () => {
      // Setup non-existent ticket id
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const updateData = { problem: 'Updated problem' };
      
      // Mock controller response for not found
      mockController.updateRepairTicket.mockImplementation((req: Request, res: Response) => {
        res.status(404).json({ message: 'Repair ticket not found' });
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app)
        .put(`/api/repair-tickets/${nonExistentId}`)
        .send(updateData);
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Repair ticket not found' });
      expect(mockController.updateRepairTicket).toHaveBeenCalled();
    });
  });
  
  describe('DELETE /api/repair-tickets/:id', () => {
    it('should call deleteRepairTicket controller method', async () => {
      // Setup ticket id
      const ticketId = new mongoose.Types.ObjectId().toString();
      
      // Mock controller response
      mockController.deleteRepairTicket.mockImplementation((req: Request, res: Response) => {
        res.status(200).json({ message: 'Repair ticket deleted successfully' });
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app).delete(`/api/repair-tickets/${ticketId}`);
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Repair ticket deleted successfully' });
      expect(mockController.deleteRepairTicket).toHaveBeenCalled();
      // Check that the id parameter is passed correctly
      const mockCall = mockController.deleteRepairTicket.mock.calls[0][0];
      expect(mockCall.params.id).toBe(ticketId);
    });
    
    it('should return 404 when ticket is not found for deletion', async () => {
      // Setup non-existent ticket id
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      // Mock controller response for not found
      mockController.deleteRepairTicket.mockImplementation((req: Request, res: Response) => {
        res.status(404).json({ message: 'Repair ticket not found' });
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app).delete(`/api/repair-tickets/${nonExistentId}`);
      
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Repair ticket not found' });
      expect(mockController.deleteRepairTicket).toHaveBeenCalled();
    });
  });
  
  describe('PUT /api/repair-tickets/:id/status', () => {
    it('should call updateRepairTicketStatus controller method', async () => {
      // Setup ticket id and status data
      const ticketId = new mongoose.Types.ObjectId().toString();
      const statusData = {
        status: TicketStatus.IN_PROGRESS,
        notes: 'Starting repair work'
      };
      
      // Mock updated ticket
      const updatedTicket = {
        _id: ticketId,
        customerId: new mongoose.Types.ObjectId().toString(),
        deviceId: new mongoose.Types.ObjectId().toString(),
        problem: 'Test problem',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.MEDIUM,
        estimatedCost: 100,
        updatedAt: new Date()
      };
      
      // Mock controller response
      mockController.updateRepairTicketStatus.mockImplementation((req: Request, res: Response) => {
        res.status(200).json(updatedTicket);
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app)
        .put(`/api/repair-tickets/${ticketId}/status`)
        .send(statusData);
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTicket);
      expect(mockController.updateRepairTicketStatus).toHaveBeenCalled();
      // Check that the id parameter and request body are passed correctly
      const mockCall = mockController.updateRepairTicketStatus.mock.calls[0][0];
      expect(mockCall.params.id).toBe(ticketId);
      expect(mockCall.body).toEqual(statusData);
    });
    
    it('should return 400 for invalid status', async () => {
      // Setup ticket id and invalid status data
      const ticketId = new mongoose.Types.ObjectId().toString();
      const invalidStatusData = { status: 'INVALID_STATUS' };
      
      // Mock controller response for invalid status
      mockController.updateRepairTicketStatus.mockImplementation((req: Request, res: Response) => {
        res.status(400).json({ message: 'Invalid repair ticket status' });
        return Promise.resolve();
      });
      
      // Make the request
      const response = await request(app)
        .put(`/api/repair-tickets/${ticketId}/status`)
        .send(invalidStatusData);
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid repair ticket status' });
      expect(mockController.updateRepairTicketStatus).toHaveBeenCalled();
    });
  });
});