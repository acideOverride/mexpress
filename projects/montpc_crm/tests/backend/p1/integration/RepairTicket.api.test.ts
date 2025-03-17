import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { repairTicketRoutes } from '../../../../backend/src/routes/repairTicket.routes';
import { RepairTicket, TicketStatus, TicketPriority } from '../../../../backend/src/models/RepairTicket';
import { RepairTicketRepository } from '../../../../backend/src/repositories/RepairTicketRepository';
import { RepairTicketService } from '../../../../backend/src/services/RepairTicketService';
import { RepairTicketController } from '../../../../backend/src/controllers/RepairTicketController';

describe('RepairTicket API Integration', () => {
  let app: Express;
  let mongoServer: MongoMemoryServer;
  let repository: RepairTicketRepository;
  let service: RepairTicketService;
  let controller: RepairTicketController;
  let customerId: mongoose.Types.ObjectId;
  let deviceId: mongoose.Types.ObjectId;
  let technicianId: mongoose.Types.ObjectId;
  let ticketId: mongoose.Types.ObjectId;
  
  beforeAll(async () => {
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    
    // Create test IDs
    customerId = new mongoose.Types.ObjectId();
    deviceId = new mongoose.Types.ObjectId();
    technicianId = new mongoose.Types.ObjectId();
    
    // Setup Express app
    app = express();
    app.use(express.json());
    
    // Setup repository, service, and controller with real implementations
    repository = new RepairTicketRepository();
    service = new RepairTicketService(repository);
    controller = new RepairTicketController(service);
    
    // Register routes
    app.use('/api/repair-tickets', repairTicketRoutes);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Clear the collection
    await RepairTicket.deleteMany({});
    
    // Create a test ticket
    const ticket = new RepairTicket({
      customerId,
      deviceId,
      problem: 'Test problem',
      status: TicketStatus.PENDING,
      priority: TicketPriority.MEDIUM,
      estimatedCost: 100
    });
    
    const savedTicket = await ticket.save();
    ticketId = savedTicket._id;
  });
  
  describe('GET /api/repair-tickets', () => {
    it('should return all repair tickets', async () => {
      const response = await request(app).get('/api/repair-tickets');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);
      expect(response.body[0].problem).toBe('Test problem');
    });
    
    it('should filter tickets by status', async () => {
      // Create a second ticket with different status
      const secondTicket = new RepairTicket({
        customerId,
        deviceId,
        problem: 'Another problem',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.HIGH,
        estimatedCost: 150
      });
      await secondTicket.save();
      
      // Get tickets filtered by PENDING status
      const response = await request(app)
        .get('/api/repair-tickets')
        .query({ status: TicketStatus.PENDING });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);
      expect(response.body[0].status).toBe(TicketStatus.PENDING);
      
      // Get tickets filtered by IN_PROGRESS status
      const response2 = await request(app)
        .get('/api/repair-tickets')
        .query({ status: TicketStatus.IN_PROGRESS });
      
      expect(response2.status).toBe(200);
      expect(Array.isArray(response2.body)).toBeTruthy();
      expect(response2.body.length).toBe(1);
      expect(response2.body[0].status).toBe(TicketStatus.IN_PROGRESS);
    });
  });
  
  describe('GET /api/repair-tickets/:id', () => {
    it('should return a single repair ticket', async () => {
      const response = await request(app).get(`/api/repair-tickets/${ticketId}`);
      
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(ticketId.toString());
      expect(response.body.problem).toBe('Test problem');
    });
    
    it('should return 404 for non-existent ticket', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/repair-tickets/${nonExistentId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Repair ticket not found');
    });
    
    it('should return 500 for invalid ID format', async () => {
      const response = await request(app).get('/api/repair-tickets/invalid-id');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Error fetching repair ticket');
    });
  });
  
  describe('POST /api/repair-tickets', () => {
    it('should create a new repair ticket', async () => {
      const newTicketData = {
        customerId: customerId.toString(),
        deviceId: deviceId.toString(),
        problem: 'New test problem',
        priority: TicketPriority.HIGH,
        estimatedCost: 150
      };
      
      const response = await request(app)
        .post('/api/repair-tickets')
        .send(newTicketData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.problem).toBe('New test problem');
      expect(response.body.status).toBe(TicketStatus.PENDING); // Default status
      expect(response.body.priority).toBe(TicketPriority.HIGH);
      expect(response.body.estimatedCost).toBe(150);
      
      // Verify it was actually saved to the database
      const savedTicket = await RepairTicket.findById(response.body._id);
      expect(savedTicket).toBeTruthy();
      expect(savedTicket?.problem).toBe('New test problem');
    });
    
    it('should return 400 for missing required fields', async () => {
      // Missing customerId and deviceId
      const invalidData = {
        problem: 'Test problem',
        estimatedCost: 100
      };
      
      const response = await request(app)
        .post('/api/repair-tickets')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Validation error');
    });
  });
  
  describe('PUT /api/repair-tickets/:id', () => {
    it('should update an existing repair ticket', async () => {
      const updateData = {
        problem: 'Updated problem',
        priority: TicketPriority.URGENT,
        estimatedCost: 200
      };
      
      const response = await request(app)
        .put(`/api/repair-tickets/${ticketId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(ticketId.toString());
      expect(response.body.problem).toBe('Updated problem');
      expect(response.body.priority).toBe(TicketPriority.URGENT);
      expect(response.body.estimatedCost).toBe(200);
      
      // Verify it was actually updated in the database
      const updatedTicket = await RepairTicket.findById(ticketId);
      expect(updatedTicket?.problem).toBe('Updated problem');
      expect(updatedTicket?.priority).toBe(TicketPriority.URGENT);
    });
    
    it('should return 404 for non-existent ticket', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateData = {
        problem: 'Updated problem'
      };
      
      const response = await request(app)
        .put(`/api/repair-tickets/${nonExistentId}`)
        .send(updateData);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Repair ticket not found');
    });
  });
  
  describe('DELETE /api/repair-tickets/:id', () => {
    it('should delete an existing repair ticket', async () => {
      const response = await request(app).delete(`/api/repair-tickets/${ticketId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Repair ticket deleted successfully');
      
      // Verify it was actually deleted from the database
      const deletedTicket = await RepairTicket.findById(ticketId);
      expect(deletedTicket).toBeNull();
    });
    
    it('should return 404 for non-existent ticket', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/repair-tickets/${nonExistentId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Repair ticket not found');
    });
  });
  
  describe('PUT /api/repair-tickets/:id/status', () => {
    it('should update the status of a repair ticket', async () => {
      const statusData = {
        status: TicketStatus.IN_PROGRESS,
        notes: 'Starting repair work'
      };
      
      const response = await request(app)
        .put(`/api/repair-tickets/${ticketId}/status`)
        .send(statusData);
      
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(ticketId.toString());
      expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);
      
      // Verify it was actually updated in the database
      const updatedTicket = await RepairTicket.findById(ticketId);
      expect(updatedTicket?.status).toBe(TicketStatus.IN_PROGRESS);
      
      // Check if status history was updated (this depends on the actual implementation)
      if (updatedTicket?.statusHistory) {
        expect(updatedTicket.statusHistory.length).toBeGreaterThan(0);
        expect(updatedTicket.statusHistory[updatedTicket.statusHistory.length - 1].status).toBe(TicketStatus.IN_PROGRESS);
        expect(updatedTicket.statusHistory[updatedTicket.statusHistory.length - 1].notes).toBe('Starting repair work');
      }
    });
    
    it('should return 400 for invalid status', async () => {
      const invalidStatusData = {
        status: 'INVALID_STATUS'
      };
      
      const response = await request(app)
        .put(`/api/repair-tickets/${ticketId}/status`)
        .send(invalidStatusData);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid repair ticket status');
    });
    
    it('should return 404 for non-existent ticket', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const statusData = {
        status: TicketStatus.IN_PROGRESS
      };
      
      const response = await request(app)
        .put(`/api/repair-tickets/${nonExistentId}/status`)
        .send(statusData);
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Repair ticket not found');
    });
  });
});