import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  RepairTicketSchema, 
  TicketStatus, 
  TicketPriority 
} from '../../../../backend/src/schemas/RepairTicket.schema';

describe('RepairTicket Schema', () => {
  let mongoServer: MongoMemoryServer;
  let RepairTicketModel: mongoose.Model<any>;
  let customerId: mongoose.Types.ObjectId;
  let deviceId: mongoose.Types.ObjectId;
  let technicianId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    
    RepairTicketModel = mongoose.model('RepairTicketSchema', RepairTicketSchema);
    
    // Create mock IDs for testing
    customerId = new mongoose.Types.ObjectId();
    deviceId = new mongoose.Types.ObjectId();
    technicianId = new mongoose.Types.ObjectId();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await RepairTicketModel.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should validate required fields', async () => {
      const emptyTicket = new RepairTicketModel({});
      
      try {
        await emptyTicket.validate();
        fail('Validation should have failed');
      } catch (error: any) {
        expect(error.errors.customerId).toBeDefined();
        expect(error.errors.deviceId).toBeDefined();
        expect(error.errors.problem).toBeDefined();
      }
    });

    it('should validate field types', async () => {
      const invalidTypes = new RepairTicketModel({
        customerId: 'invalid-id', // Should be ObjectId
        deviceId: 'invalid-id',   // Should be ObjectId
        problem: 123,             // Should be String
        estimatedCost: 'invalid', // Should be Number
        status: 'INVALID_STATUS'  // Should be enum value
      });
      
      try {
        await invalidTypes.validate();
        fail('Validation should have failed');
      } catch (error: any) {
        expect(error.errors).toBeDefined();
      }
    });

    it('should validate enum values for status', async () => {
      const invalidStatus = new RepairTicketModel({
        customerId,
        deviceId,
        problem: 'Test problem',
        status: 'UNKNOWN_STATUS' // Invalid enum value
      });
      
      try {
        await invalidStatus.validate();
        fail('Validation should have failed');
      } catch (error: any) {
        expect(error.errors.status).toBeDefined();
      }
    });

    it('should validate enum values for priority', async () => {
      const invalidPriority = new RepairTicketModel({
        customerId,
        deviceId,
        problem: 'Test problem',
        priority: 'SUPER_HIGH' // Invalid enum value
      });
      
      try {
        await invalidPriority.validate();
        fail('Validation should have failed');
      } catch (error: any) {
        expect(error.errors.priority).toBeDefined();
      }
    });

    it('should apply default values correctly', async () => {
      const ticket = new RepairTicketModel({
        customerId,
        deviceId,
        problem: 'Test problem'
      });
      
      // Manually validate to check defaults
      await ticket.validate();
      
      expect(ticket.status).toBe(TicketStatus.PENDING);
      expect(ticket.priority).toBe(TicketPriority.MEDIUM);
      expect(ticket.repairNotes).toEqual([]);
      expect(ticket.statusHistory).toEqual([]);
      expect(ticket.parts).toEqual([]);
    });
  });

  describe('Schema Relationships', () => {
    it('should correctly reference Customer model', async () => {
      const ticket = new RepairTicketModel({
        customerId,
        deviceId,
        problem: 'Test problem'
      });
      
      // Check if the schema path references the correct model
      expect(RepairTicketSchema.path('customerId').instance).toBe('ObjectID');
      expect(RepairTicketSchema.path('customerId').options.ref).toBe('Customer');
    });

    it('should correctly reference Device model', async () => {
      const ticket = new RepairTicketModel({
        customerId,
        deviceId,
        problem: 'Test problem'
      });
      
      // Check if the schema path references the correct model
      expect(RepairTicketSchema.path('deviceId').instance).toBe('ObjectID');
      expect(RepairTicketSchema.path('deviceId').options.ref).toBe('Device');
    });

    it('should correctly reference User model for technicians', async () => {
      const ticket = new RepairTicketModel({
        customerId,
        deviceId,
        technicianId,
        problem: 'Test problem'
      });
      
      // Check if the schema path references the correct model
      expect(RepairTicketSchema.path('technicianId').instance).toBe('ObjectID');
      expect(RepairTicketSchema.path('technicianId').options.ref).toBe('User');
    });
  });

  describe('Schema Indexing', () => {
    it('should have an index on customerId', () => {
      const indexes = RepairTicketSchema.indexes();
      const hasCustomerIdIndex = indexes.some(index => 
        index[0] && index[0].customerId === 1
      );
      
      expect(hasCustomerIdIndex).toBe(true);
    });

    it('should have an index on deviceId', () => {
      const indexes = RepairTicketSchema.indexes();
      const hasDeviceIdIndex = indexes.some(index => 
        index[0] && index[0].deviceId === 1
      );
      
      expect(hasDeviceIdIndex).toBe(true);
    });

    it('should have a compound index on status and priority', () => {
      const indexes = RepairTicketSchema.indexes();
      const hasCompoundIndex = indexes.some(index => 
        index[0] && index[0].status === 1 && index[0].priority === -1
      );
      
      expect(hasCompoundIndex).toBe(true);
    });
  });

  describe('Schema Timestamps', () => {
    it('should add createdAt and updatedAt fields', async () => {
      const ticket = new RepairTicketModel({
        customerId,
        deviceId,
        problem: 'Test problem'
      });
      
      await ticket.save();
      
      expect(ticket.createdAt).toBeDefined();
      expect(ticket.updatedAt).toBeDefined();
      expect(ticket.createdAt instanceof Date).toBe(true);
      expect(ticket.updatedAt instanceof Date).toBe(true);
    });
  });
});