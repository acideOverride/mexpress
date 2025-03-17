import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  RepairTicket, 
  TicketStatus, 
  TicketPriority 
} from '../../../../backend/src/models/RepairTicket';
import { RepairTicketRepository } from '../../../../backend/src/repositories/RepairTicketRepository';

describe('RepairTicketRepository', () => {
  let mongoServer: MongoMemoryServer;
  let repository: RepairTicketRepository;
  let customerId: mongoose.Types.ObjectId;
  let deviceId: mongoose.Types.ObjectId;
  let technicianId: mongoose.Types.ObjectId;
  let otherCustomerId: mongoose.Types.ObjectId;
  let otherDeviceId: mongoose.Types.ObjectId;
  let ticketIds: mongoose.Types.ObjectId[] = [];

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    
    repository = new RepairTicketRepository();
    
    // Create mock IDs for testing
    customerId = new mongoose.Types.ObjectId();
    deviceId = new mongoose.Types.ObjectId();
    technicianId = new mongoose.Types.ObjectId();
    otherCustomerId = new mongoose.Types.ObjectId();
    otherDeviceId = new mongoose.Types.ObjectId();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create sample tickets for testing
    const sampleTickets = [
      {
        customerId,
        deviceId,
        problem: 'Screen not working',
        status: TicketStatus.PENDING,
        priority: TicketPriority.MEDIUM,
        estimatedCost: 150.00
      },
      {
        customerId,
        deviceId: otherDeviceId,
        problem: 'Battery replacement',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.HIGH,
        estimatedCost: 100.00,
        technicianId
      },
      {
        customerId: otherCustomerId,
        deviceId: otherDeviceId,
        problem: 'Software issues',
        status: TicketStatus.COMPLETED,
        priority: TicketPriority.LOW,
        estimatedCost: 75.00,
        actualCost: 75.00
      },
      {
        customerId,
        deviceId,
        problem: 'Keyboard not working',
        status: TicketStatus.WAITING_FOR_PARTS,
        priority: TicketPriority.URGENT,
        estimatedCost: 200.00
      }
    ];
    
    const createdTickets = await RepairTicket.insertMany(sampleTickets);
    ticketIds = createdTickets.map(ticket => ticket._id);
  });

  afterEach(async () => {
    await RepairTicket.deleteMany({});
    ticketIds = [];
  });

  describe('CRUD Operations', () => {
    it('should create a new repair ticket', async () => {
      const newTicketData = {
        customerId,
        deviceId,
        problem: 'New screen issue',
        priority: TicketPriority.HIGH,
        estimatedCost: 175.00
      };

      const createdTicket = await repository.create(newTicketData);
      
      expect(createdTicket._id).toBeDefined();
      expect(createdTicket.customerId.toString()).toBe(customerId.toString());
      expect(createdTicket.problem).toBe('New screen issue');
      expect(createdTicket.status).toBe(TicketStatus.PENDING); // Default status
      expect(createdTicket.priority).toBe(TicketPriority.HIGH);
    });

    it('should find a repair ticket by ID', async () => {
      const targetId = ticketIds[0];
      const foundTicket = await repository.findById(targetId);
      
      expect(foundTicket).toBeDefined();
      expect(foundTicket?._id.toString()).toBe(targetId.toString());
    });

    it('should return null when finding a non-existent ticket', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const foundTicket = await repository.findById(nonExistentId);
      
      expect(foundTicket).toBeNull();
    });

    it('should update a repair ticket', async () => {
      const targetId = ticketIds[0];
      const updateData = {
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.HIGH,
        estimatedCost: 200.00
      };
      
      const updatedTicket = await repository.update(targetId, updateData);
      
      expect(updatedTicket).toBeDefined();
      expect(updatedTicket?._id.toString()).toBe(targetId.toString());
      expect(updatedTicket?.status).toBe(TicketStatus.IN_PROGRESS);
      expect(updatedTicket?.priority).toBe(TicketPriority.HIGH);
      expect(updatedTicket?.estimatedCost).toBe(200.00);
    });

    it('should delete a repair ticket', async () => {
      const targetId = ticketIds[0];
      await repository.delete(targetId);
      
      const foundTicket = await repository.findById(targetId);
      expect(foundTicket).toBeNull();
    });
  });

  describe('Advanced Queries', () => {
    it('should find tickets by customer ID', async () => {
      const tickets = await repository.findByCustomerId(customerId);
      
      expect(tickets).toHaveLength(3); // We created 3 tickets for this customer
      tickets.forEach(ticket => {
        expect(ticket.customerId.toString()).toBe(customerId.toString());
      });
    });

    it('should find tickets by device ID', async () => {
      const tickets = await repository.findByDeviceId(deviceId);
      
      expect(tickets).toHaveLength(2); // We created 2 tickets for this device
      tickets.forEach(ticket => {
        expect(ticket.deviceId.toString()).toBe(deviceId.toString());
      });
    });

    it('should find tickets by technician ID', async () => {
      const tickets = await repository.findByTechnicianId(technicianId);
      
      expect(tickets).toHaveLength(1); // Only one ticket assigned to this technician
      expect(tickets[0].technicianId?.toString()).toBe(technicianId.toString());
    });

    it('should find tickets by status', async () => {
      const pendingTickets = await repository.findByStatus(TicketStatus.PENDING);
      const inProgressTickets = await repository.findByStatus(TicketStatus.IN_PROGRESS);
      
      expect(pendingTickets).toHaveLength(1);
      expect(inProgressTickets).toHaveLength(1);
      
      pendingTickets.forEach(ticket => {
        expect(ticket.status).toBe(TicketStatus.PENDING);
      });
      
      inProgressTickets.forEach(ticket => {
        expect(ticket.status).toBe(TicketStatus.IN_PROGRESS);
      });
    });

    it('should find tickets by priority', async () => {
      const highPriorityTickets = await repository.findByPriority(TicketPriority.HIGH);
      const urgentPriorityTickets = await repository.findByPriority(TicketPriority.URGENT);
      
      expect(highPriorityTickets).toHaveLength(1);
      expect(urgentPriorityTickets).toHaveLength(1);
      
      highPriorityTickets.forEach(ticket => {
        expect(ticket.priority).toBe(TicketPriority.HIGH);
      });
      
      urgentPriorityTickets.forEach(ticket => {
        expect(ticket.priority).toBe(TicketPriority.URGENT);
      });
    });

    it('should find tickets by multiple criteria', async () => {
      const criteria = {
        status: TicketStatus.PENDING,
        customerId
      };
      
      const tickets = await repository.findByCriteria(criteria);
      
      expect(tickets).toHaveLength(1);
      expect(tickets[0].status).toBe(TicketStatus.PENDING);
      expect(tickets[0].customerId.toString()).toBe(customerId.toString());
    });

    it('should find tickets created between specific dates', async () => {
      // Create a ticket with a specific creation date
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5); // 5 days ago
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5); // 5 days from now
      
      const tickets = await repository.findByDateRange(pastDate, futureDate);
      
      // All our test tickets should be within this range (created just now)
      expect(tickets.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Pagination and Sorting', () => {
    it('should support pagination', async () => {
      const page1 = await repository.findAll(1, 2); // Page 1, 2 items per page
      const page2 = await repository.findAll(2, 2); // Page 2, 2 items per page
      
      expect(page1.items).toHaveLength(2);
      expect(page2.items).toHaveLength(2);
      expect(page1.total).toBe(4); // Total should be 4 tickets
      expect(page1.page).toBe(1);
      expect(page1.pages).toBe(2); // 4 items ÷ 2 per page = 2 pages
      
      // Check that we get different items on different pages
      const page1Ids = page1.items.map(ticket => ticket._id.toString());
      const page2Ids = page2.items.map(ticket => ticket._id.toString());
      
      page1Ids.forEach(id => {
        expect(page2Ids).not.toContain(id);
      });
    });

    it('should support sorting', async () => {
      // Test sorting by priority (descending)
      const sortedByPriorityDesc = await repository.findAllSorted({ priority: -1 });
      
      expect(sortedByPriorityDesc[0].priority).toBe(TicketPriority.URGENT);
      
      // Test sorting by status (ascending)
      const sortedByStatusAsc = await repository.findAllSorted({ status: 1 });
      
      // PENDING comes before IN_PROGRESS alphabetically
      expect(sortedByStatusAsc[0].status).toBe(TicketStatus.COMPLETED);
    });

    it('should combine filtering, pagination, and sorting', async () => {
      const criteria = { customerId };
      const sortOptions = { priority: -1 };
      const page = 1;
      const limit = 2;
      
      const result = await repository.findByCriteriaSortedPaginated(criteria, sortOptions, page, limit);
      
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(3); // 3 tickets with this customerId
      expect(result.items[0].priority).toBe(TicketPriority.URGENT); // Highest priority should be first
    });
  });
});