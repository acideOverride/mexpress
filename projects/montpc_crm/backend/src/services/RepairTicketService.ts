import mongoose from 'mongoose';
import { 
  TicketStatus, 
  TicketPriority,
  createStatusHistoryEntry,
  isValidStatusTransition
} from '../models/RepairTicket';
import { RepairTicketRepository } from '../repositories/RepairTicketRepository';
import { RepairTicketWorkflowService } from './RepairTicketWorkflowService';
import { 
  IRepairTicket, 
  IRepairTicketCreate, 
  IRepairTicketUpdate,
  IStatusHistoryEntry 
} from '../interfaces/repair-ticket.interface';

export class RepairTicketService {
  private repository: RepairTicketRepository;
  private workflowService: RepairTicketWorkflowService;

  constructor(
    repository: RepairTicketRepository,
    workflowService?: RepairTicketWorkflowService
  ) {
    this.repository = repository;
    this.workflowService = workflowService || new RepairTicketWorkflowService(repository);
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
      // Update status using the workflow service
      return this.updateRepairTicketStatus(id, data.status as TicketStatus, {
        technicianId: data.technicianId,
        notes: data.notes || 'Status updated'
      });
    }

    // Regular update without status change
    return this.repository.update(id, data);
  }

  /**
   * Update a repair ticket status with workflow handling
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
      validateTransition?: boolean;
    } = {}
  ): Promise<IRepairTicket | null> {
    // Use the workflow service for status transitions
    return this.workflowService.updateTicketStatus(id, status, options);
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

  /**
   * Get available status transitions for a ticket
   * @param id The repair ticket ID
   * @returns Promise with allowed transitions or null if ticket not found
   */
  async getTicketStatusTransitions(id: string): Promise<{
    currentStatus: TicketStatus;
    allowedTransitions: TicketStatus[];
  } | null> {
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      return null;
    }

    // Get all transition rules
    const rules = this.workflowService.getStatusTransitionRules();
    
    // Return current status and allowed transitions
    return {
      currentStatus: ticket.status,
      allowedTransitions: rules[ticket.status].to
    };
  }
}