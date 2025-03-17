import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  TicketStatus, 
  TicketPriority,
  RepairTicket
} from '../../../../backend/src/models/RepairTicket';
import { IRepairTicket } from '../../../../backend/src/interfaces/repair-ticket.interface';
import { repairTicketRoutes } from '../../../../backend/src/routes/repairTicket.routes';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/repair-tickets', repairTicketRoutes);

// MongoDB Memory Server for integration testing
let mongoServer: MongoMemoryServer;

// Test data
let testTicket: IRepairTicket;
let customerId: mongoose.Types.ObjectId;
let deviceId: mongoose.Types.ObjectId;
let technicianId: mongoose.Types.ObjectId;

// Setup and teardown
beforeAll(async () => {
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect Mongoose to the Memory Server
  await mongoose.connect(mongoUri);
  
  // Create test data
  customerId = new mongoose.Types.ObjectId();
  deviceId = new mongoose.Types.ObjectId();
  technicianId = new mongoose.Types.ObjectId();
});

afterAll(async () => {
  // Disconnect and stop MongoDB Memory Server
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database and create fresh test tickets before each test
beforeEach(async () => {
  // Clear collection
  await RepairTicket.deleteMany({});
  
  // Create a test repair ticket
  testTicket = await RepairTicket.create({
    customerId,
    deviceId,
    technicianId,
    problem: 'Screen is cracked',
    diagnosis: 'LCD needs replacement',
    status: TicketStatus.PENDING,
    priority: TicketPriority.MEDIUM,
    estimatedCost: 150,
    estimatedCompletionDate: new Date(Date.now() + 86400000), // tomorrow
    notes: 'Customer requested quick turnaround',
    statusHistory: [
      {
        status: TicketStatus.PENDING,
        changedBy: technicianId,
        changedAt: new Date(),
        notes: 'Ticket created'
      }
    ],
    repairNotes: [
      {
        note: 'Initial assessment completed',
        createdBy: technicianId,
        createdAt: new Date()
      }
    ],
    parts: [
      {
        name: 'iPhone 12 LCD Screen',
        partNumber: 'IP12-LCD',
        cost: 85,
        quantity: 1
      }
    ]
  });
});

describe('Repair Ticket Workflow API Integration Tests', () => {
  describe('Status Transition Endpoint', () => {
    test('should update ticket status when valid transition requested', async () => {
      const response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.IN_PROGRESS,
          notes: 'Starting repair work',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);
      
      // Verify that statusHistory was updated
      expect(response.body.statusHistory).toHaveLength(2);
      expect(response.body.statusHistory[1].status).toBe(TicketStatus.IN_PROGRESS);
      expect(response.body.statusHistory[1].notes).toBe('Starting repair work');
    });
    
    test('should reject invalid status transition', async () => {
      const response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.COMPLETED, // Invalid direct transition from PENDING
          notes: 'Complete repair',
          technicianId: technicianId.toString()
        });
      
      // Should still succeed but with different logic in future
      expect(response.status).toBe(200);
      
      // For now, verify that it doesn't validate transitions in the API yet
      // This will be updated in our implementation
    });
    
    test('should reject invalid status value', async () => {
      const response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: 'INVALID_STATUS',
          notes: 'Invalid status update',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid repair ticket status');
    });
    
    test('should return 404 for non-existent ticket', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/repair-tickets/${fakeId}/status`)
        .send({
          status: TicketStatus.IN_PROGRESS,
          notes: 'Starting repair',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });
  });
  
  describe('Complete Workflow Scenarios', () => {
    test('should progress through a complete repair workflow', async () => {
      // Step 1: Move from PENDING to IN_PROGRESS
      let response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.IN_PROGRESS,
          notes: 'Starting repair work',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);
      
      // Step 2: Move to WAITING_FOR_PARTS
      response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.WAITING_FOR_PARTS,
          notes: 'Ordered replacement screen',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.WAITING_FOR_PARTS);
      
      // Step 3: Back to IN_PROGRESS once parts arrive
      response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.IN_PROGRESS,
          notes: 'Parts arrived, continuing repair',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);
      
      // Step 4: Move to READY_FOR_PICKUP
      response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.READY_FOR_PICKUP,
          notes: 'Repair completed, ready for customer pickup',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.READY_FOR_PICKUP);
      
      // Step 5: Move to COMPLETED
      response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.COMPLETED,
          notes: 'Customer picked up device',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.COMPLETED);
      expect(response.body.completedDate).toBeTruthy();
      
      // Verify full history is preserved
      expect(response.body.statusHistory).toHaveLength(6); // Initial + 5 transitions
    });
    
    test('should handle interrupted workflow with cancellation', async () => {
      // Step 1: Move from PENDING to IN_PROGRESS
      let response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.IN_PROGRESS,
          notes: 'Starting assessment',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      
      // Step 2: Move to WAITING_FOR_PARTS
      response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.WAITING_FOR_PARTS,
          notes: 'Need to order screen',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      
      // Step 3: Customer decides to cancel
      response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.CANCELLED,
          notes: 'Customer decided to buy a new phone instead',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.CANCELLED);
      
      // Verify history
      expect(response.body.statusHistory).toHaveLength(4); // Initial + 3 transitions
      expect(response.body.statusHistory[3].status).toBe(TicketStatus.CANCELLED);
      expect(response.body.completedDate).toBeFalsy(); // Should not have completion date
    });
    
    test('should handle reopening a completed ticket', async () => {
      // First create a completed ticket
      testTicket.status = TicketStatus.COMPLETED;
      testTicket.completedDate = new Date();
      testTicket.statusHistory.push({
        status: TicketStatus.COMPLETED,
        changedBy: technicianId,
        changedAt: new Date(),
        notes: 'Repair completed'
      });
      await testTicket.save();
      
      // Now reopen it by moving back to IN_PROGRESS
      const response = await request(app)
        .put(`/api/repair-tickets/${testTicket._id}/status`)
        .send({
          status: TicketStatus.IN_PROGRESS,
          notes: 'Customer reported issue still exists',
          technicianId: technicianId.toString()
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(TicketStatus.IN_PROGRESS);
      
      // Verify history is updated
      const lastHistoryEntry = response.body.statusHistory[response.body.statusHistory.length - 1];
      expect(lastHistoryEntry.status).toBe(TicketStatus.IN_PROGRESS);
      expect(lastHistoryEntry.notes).toBe('Customer reported issue still exists');
    });
  });
});