import mongoose from 'mongoose';
import { 
  TicketStatus, 
  TicketPriority,
  createStatusHistoryEntry 
} from '../models/RepairTicket';
import { RepairTicketRepository } from '../repositories/RepairTicketRepository';
import { 
  IRepairTicket, 
  IRepairTicketCreate, 
  IRepairTicketUpdate,
  IStatusHistoryEntry 
} from '../interfaces/repair-ticket.interface';

export class RepairTicketService {
  private repository: RepairTicketRepository;

  constructor(repository: RepairTicketRepository) {
    this.repository = repository;
  }

  /**
   * Get all repair tickets
   * @returns Promise with the list of repair tickets
   */
  async getAllRepairTickets(): Promise<IRepairTicket[]> {
    return this.repository.findAll(1, 1000).then(result => result.items);
  }

  /**
   * Get repair tickets by filter criteria
   * @param filter The filter criteria
   * @returns Promise with the filtered list of repair tickets
   */
  async getRepairTicketsByFilter(filter: Record<string, any>): Promise<IRepairTicket[]> {
    return this.repository.findByCriteria(filter);
  }

  /**
   * Get a repair ticket by ID
   * @param id The repair ticket ID
   * @returns Promise with the repair ticket or null if not found
   */
  async getRepairTicketById(id: string): Promise<IRepairTicket | null> {
    return this.repository.findById(id);
  }

  /**
   * Create a new repair ticket
   * @param data The repair ticket data
   * @returns Promise with the created repair ticket
   */
  async createRepairTicket(data: IRepairTicketCreate): Promise<IRepairTicket> {
    // Create with default values
    const ticketData = {
      ...data,
      status: data.status || TicketStatus.PENDING,
      priority: data.priority || TicketPriority.MEDIUM,
      statusHistory: []
    };

    // Add initial status history entry if userId is provided
    if (data.statusHistory?.length) {
      ticketData.statusHistory = data.statusHistory;
    } else if (data.technicianId) {
      const initialStatus = createStatusHistoryEntry(
        ticketData.status as TicketStatus,
        data.technicianId as mongoose.Types.ObjectId,
        'Ticket created'
      );
      ticketData.statusHistory = [initialStatus];
    }

    return this.repository.create(ticketData);
  }

  /**
   * Update a repair ticket
   * @param id The repair ticket ID
   * @param data The update data
   * @returns Promise with the updated repair ticket or null if not found
   */
  async updateRepairTicket(id: string, data: IRepairTicketUpdate): Promise<IRepairTicket | null> {
    // Check if ticket exists
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      return null;
    }

    // Handle status updates differently if changing status
    if (data.status && data.status !== ticket.status) {
      // Update status using the dedicated method
      return this.updateRepairTicketStatus(id, data.status as TicketStatus, {
        technicianId: data.technicianId,
        notes: data.notes || 'Status updated'
      });
    }

    // Regular update without status change
    return this.repository.update(id, data);
  }

  /**
   * Update a repair ticket status with history tracking
   * @param id The repair ticket ID
   * @param status The new status
   * @param options Options for the status update
   * @returns Promise with the updated repair ticket or null if not found
   */
  async updateRepairTicketStatus(
    id: string,
    status: TicketStatus,
    options: {
      technicianId?: mongoose.Types.ObjectId;
      notes?: string;
    } = {}
  ): Promise<IRepairTicket | null> {
    // Check if ticket exists
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      return null;
    }

    // Validate the status value
    if (!Object.values(TicketStatus).includes(status)) {
      throw new Error('Invalid status value');
    }

    // Check if status transition is allowed (could implement more complex rules here)
    if (ticket.status === status) {
      // No change needed
      return ticket;
    }

    // Create status history entry if technicianId is provided
    let statusHistory = [...(ticket.statusHistory || [])];
    
    if (options.technicianId) {
      const historyEntry = createStatusHistoryEntry(
        status,
        options.technicianId,
        options.notes
      );
      statusHistory.push(historyEntry);
    }

    // Update ticket
    return this.repository.update(id, {
      status,
      statusHistory,
      // Set completed date if status is COMPLETED
      ...(status === TicketStatus.COMPLETED ? { completedDate: new Date() } : {})
    });
  }

  /**
   * Delete a repair ticket
   * @param id The repair ticket ID
   * @returns Promise with the deleted repair ticket or null if not found
   */
  async deleteRepairTicket(id: string): Promise<IRepairTicket | null> {
    // Check if ticket exists
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      return null;
    }

    return this.repository.delete(id);
  }
}