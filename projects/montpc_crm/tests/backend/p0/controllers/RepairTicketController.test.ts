import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RepairTicketController } from '../../../../backend/src/controllers/RepairTicketController';
import { RepairTicket, TicketStatus, TicketPriority } from '../../../../backend/src/models/RepairTicket';
import { RepairTicketRepository } from '../../../../backend/src/repositories/RepairTicketRepository';
import { RepairTicketService } from '../../../../backend/src/services/RepairTicketService';

// Mock the repository and service
jest.mock('../../../../backend/src/repositories/RepairTicketRepository');
jest.mock('../../../../backend/src/services/RepairTicketService');

describe('RepairTicketController', () => {
  let controller: RepairTicketController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockRepository: jest.Mocked<RepairTicketRepository>;
  let mockService: jest.Mocked<RepairTicketService>;
  let mockTicket: any;
  let mockTicketId: string;

  beforeEach(() => {
    mockRepository = new RepairTicketRepository() as jest.Mocked<RepairTicketRepository>;
    mockService = new RepairTicketService(mockRepository) as jest.Mocked<RepairTicketService>;
    
    controller = new RepairTicketController(mockService);
    
    mockTicketId = new mongoose.Types.ObjectId().toString();
    mockTicket = {
      _id: mockTicketId,
      customerId: new mongoose.Types.ObjectId().toString(),
      deviceId: new mongoose.Types.ObjectId().toString(),
      problem: 'Test problem',
      status: TicketStatus.PENDING,
      priority: TicketPriority.MEDIUM,
      estimatedCost: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Setup request and response mocks
    req = {
      params: {},
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRepairTickets', () => {
    it('should return all repair tickets', async () => {
      // Mock repository response
      const mockTickets = [mockTicket, { ...mockTicket, _id: new mongoose.Types.ObjectId().toString() }];
      mockService.getAllRepairTickets.mockResolvedValue(mockTickets);
      
      // Call controller method
      await controller.getAllRepairTickets(req as Request, res as Response);
      
      // Assertions
      expect(mockService.getAllRepairTickets).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTickets);
    });

    it('should handle error when fetching tickets fails', async () => {
      // Mock repository error
      const error = new Error('Database error');
      mockService.getAllRepairTickets.mockRejectedValue(error);
      
      // Call controller method
      await controller.getAllRepairTickets(req as Request, res as Response);
      
      // Assertions
      expect(mockService.getAllRepairTickets).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching repair tickets',
        error: error.message
      });
    });

    it('should handle filtering by status', async () => {
      // Setup request with query params
      req.query = { status: TicketStatus.PENDING };
      
      // Mock service response
      const mockFilteredTickets = [mockTicket];
      mockService.getRepairTicketsByFilter.mockResolvedValue(mockFilteredTickets);
      
      // Call controller method
      await controller.getAllRepairTickets(req as Request, res as Response);
      
      // Assertions
      expect(mockService.getRepairTicketsByFilter).toHaveBeenCalledWith({ status: TicketStatus.PENDING });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilteredTickets);
    });
  });

  describe('getRepairTicketById', () => {
    it('should return a repair ticket by ID', async () => {
      // Setup request params
      req.params = { id: mockTicketId };
      
      // Mock service response
      mockService.getRepairTicketById.mockResolvedValue(mockTicket);
      
      // Call controller method
      await controller.getRepairTicketById(req as Request, res as Response);
      
      // Assertions
      expect(mockService.getRepairTicketById).toHaveBeenCalledWith(mockTicketId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTicket);
    });

    it('should return 404 when ticket not found', async () => {
      // Setup request params
      req.params = { id: mockTicketId };
      
      // Mock service response for non-existent ticket
      mockService.getRepairTicketById.mockResolvedValue(null);
      
      // Call controller method
      await controller.getRepairTicketById(req as Request, res as Response);
      
      // Assertions
      expect(mockService.getRepairTicketById).toHaveBeenCalledWith(mockTicketId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Repair ticket not found' });
    });

    it('should handle error when fetching ticket fails', async () => {
      // Setup request params
      req.params = { id: mockTicketId };
      
      // Mock service error
      const error = new Error('Database error');
      mockService.getRepairTicketById.mockRejectedValue(error);
      
      // Call controller method
      await controller.getRepairTicketById(req as Request, res as Response);
      
      // Assertions
      expect(mockService.getRepairTicketById).toHaveBeenCalledWith(mockTicketId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching repair ticket',
        error: error.message
      });
    });
  });

  describe('createRepairTicket', () => {
    it('should create a new repair ticket', async () => {
      // Setup request body
      const ticketData = {
        customerId: new mongoose.Types.ObjectId().toString(),
        deviceId: new mongoose.Types.ObjectId().toString(),
        problem: 'New test problem',
        priority: TicketPriority.HIGH,
        estimatedCost: 150
      };
      req.body = ticketData;
      
      // Mock service response
      mockService.createRepairTicket.mockResolvedValue(mockTicket);
      
      // Call controller method
      await controller.createRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.createRepairTicket).toHaveBeenCalledWith(ticketData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTicket);
    });

    it('should return 400 when validation fails', async () => {
      // Setup request with missing required fields
      req.body = { problem: 'Test problem' }; // Missing customerId and deviceId
      
      // Call controller method
      await controller.createRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.createRepairTicket).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Validation error', 
        errors: expect.any(Array) 
      });
    });

    it('should handle error when creating ticket fails', async () => {
      // Setup request body
      const ticketData = {
        customerId: new mongoose.Types.ObjectId().toString(),
        deviceId: new mongoose.Types.ObjectId().toString(),
        problem: 'New test problem',
        estimatedCost: 150
      };
      req.body = ticketData;
      
      // Mock service error
      const error = new Error('Database error');
      mockService.createRepairTicket.mockRejectedValue(error);
      
      // Call controller method
      await controller.createRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.createRepairTicket).toHaveBeenCalledWith(ticketData);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating repair ticket',
        error: error.message
      });
    });
  });

  describe('updateRepairTicket', () => {
    it('should update a repair ticket', async () => {
      // Setup request params and body
      req.params = { id: mockTicketId };
      const updateData = {
        problem: 'Updated problem',
        priority: TicketPriority.HIGH
      };
      req.body = updateData;
      
      // Mock updated ticket
      const updatedTicket = { ...mockTicket, ...updateData };
      mockService.updateRepairTicket.mockResolvedValue(updatedTicket);
      
      // Call controller method
      await controller.updateRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicket).toHaveBeenCalledWith(mockTicketId, updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTicket);
    });

    it('should return 404 when ticket not found for update', async () => {
      // Setup request params and body
      req.params = { id: mockTicketId };
      const updateData = { problem: 'Updated problem' };
      req.body = updateData;
      
      // Mock service response for non-existent ticket
      mockService.updateRepairTicket.mockResolvedValue(null);
      
      // Call controller method
      await controller.updateRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicket).toHaveBeenCalledWith(mockTicketId, updateData);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Repair ticket not found' });
    });

    it('should handle error when updating ticket fails', async () => {
      // Setup request params and body
      req.params = { id: mockTicketId };
      const updateData = { problem: 'Updated problem' };
      req.body = updateData;
      
      // Mock service error
      const error = new Error('Database error');
      mockService.updateRepairTicket.mockRejectedValue(error);
      
      // Call controller method
      await controller.updateRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicket).toHaveBeenCalledWith(mockTicketId, updateData);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating repair ticket',
        error: error.message
      });
    });
  });

  describe('deleteRepairTicket', () => {
    it('should delete a repair ticket', async () => {
      // Setup request params
      req.params = { id: mockTicketId };
      
      // Mock service response
      mockService.deleteRepairTicket.mockResolvedValue(mockTicket);
      
      // Call controller method
      await controller.deleteRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.deleteRepairTicket).toHaveBeenCalledWith(mockTicketId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Repair ticket deleted successfully' });
    });

    it('should return 404 when ticket not found for deletion', async () => {
      // Setup request params
      req.params = { id: mockTicketId };
      
      // Mock service response for non-existent ticket
      mockService.deleteRepairTicket.mockResolvedValue(null);
      
      // Call controller method
      await controller.deleteRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.deleteRepairTicket).toHaveBeenCalledWith(mockTicketId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Repair ticket not found' });
    });

    it('should handle error when deleting ticket fails', async () => {
      // Setup request params
      req.params = { id: mockTicketId };
      
      // Mock service error
      const error = new Error('Database error');
      mockService.deleteRepairTicket.mockRejectedValue(error);
      
      // Call controller method
      await controller.deleteRepairTicket(req as Request, res as Response);
      
      // Assertions
      expect(mockService.deleteRepairTicket).toHaveBeenCalledWith(mockTicketId);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting repair ticket',
        error: error.message
      });
    });
  });

  describe('updateRepairTicketStatus', () => {
    it('should update a repair ticket status', async () => {
      // Setup request params and body
      req.params = { id: mockTicketId };
      const statusData = {
        status: TicketStatus.IN_PROGRESS,
        notes: 'Starting repair work'
      };
      req.body = statusData;
      
      // Mock updated ticket
      const updatedTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };
      mockService.updateRepairTicketStatus.mockResolvedValue(updatedTicket);
      
      // Call controller method
      await controller.updateRepairTicketStatus(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicketStatus).toHaveBeenCalledWith(
        mockTicketId, 
        statusData.status, 
        expect.objectContaining({ notes: statusData.notes })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTicket);
    });

    it('should return 400 for invalid status', async () => {
      // Setup request params and body with invalid status
      req.params = { id: mockTicketId };
      req.body = { status: 'INVALID_STATUS' };
      
      // Call controller method
      await controller.updateRepairTicketStatus(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicketStatus).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid repair ticket status' });
    });

    it('should return 404 when ticket not found for status update', async () => {
      // Setup request params and body
      req.params = { id: mockTicketId };
      req.body = { status: TicketStatus.IN_PROGRESS };
      
      // Mock service response for non-existent ticket
      mockService.updateRepairTicketStatus.mockResolvedValue(null);
      
      // Call controller method
      await controller.updateRepairTicketStatus(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicketStatus).toHaveBeenCalledWith(
        mockTicketId, 
        TicketStatus.IN_PROGRESS,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Repair ticket not found' });
    });

    it('should handle error when updating status fails', async () => {
      // Setup request params and body
      req.params = { id: mockTicketId };
      req.body = { status: TicketStatus.IN_PROGRESS };
      
      // Mock service error
      const error = new Error('Invalid status transition');
      mockService.updateRepairTicketStatus.mockRejectedValue(error);
      
      // Call controller method
      await controller.updateRepairTicketStatus(req as Request, res as Response);
      
      // Assertions
      expect(mockService.updateRepairTicketStatus).toHaveBeenCalledWith(
        mockTicketId, 
        TicketStatus.IN_PROGRESS,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating repair ticket status',
        error: error.message
      });
    });
  });
});