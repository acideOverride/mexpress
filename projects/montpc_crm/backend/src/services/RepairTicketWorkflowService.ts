import mongoose from 'mongoose';
import { 
  TicketStatus, 
  isValidStatusTransition,
  createStatusHistoryEntry 
} from '../models/RepairTicket';
import { RepairTicketRepository } from '../repositories/RepairTicketRepository';
import { 
  IRepairTicket,
  IStatusHistoryEntry 
} from '../interfaces/repair-ticket.interface';

/**
 * Service class for managing repair ticket workflow transitions
 */
export class RepairTicketWorkflowService {
  private repository: RepairTicketRepository;

  constructor(repository: RepairTicketRepository) {
    this.repository = repository;
  }

  /**
   * Updates a repair ticket's status with validation and history tracking
   * 
   * @param id The repair ticket ID
   * @param newStatus The new status to set
   * @param options Additional options for the status change
   * @returns The updated repair ticket or null if not found
   */
  async updateTicketStatus(
    id: string,
    newStatus: TicketStatus,
    options: {
      technicianId?: mongoose.Types.ObjectId;
      notes?: string;
      validateTransition?: boolean;
      additionalData?: Record<string, any>;
    } = {}
  ): Promise<IRepairTicket | null> {
    // Set default options
    const {
      validateTransition = true,
      additionalData = {}
    } = options;

    // Check if ticket exists
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      return null;
    }

    // Validate the status value
    if (!Object.values(TicketStatus).includes(newStatus)) {
      throw new Error('Invalid status value');
    }

    // Check if status transition is allowed
    if (validateTransition && !isValidStatusTransition(ticket.status, newStatus)) {
      throw new Error(`Invalid status transition from ${ticket.status} to ${newStatus}`);
    }

    // If status is unchanged, just return the ticket
    if (ticket.status === newStatus) {
      return ticket;
    }

    // Create status history entry if technicianId is provided
    let statusHistory = [...(ticket.statusHistory || [])];
    
    if (options.technicianId) {
      const historyEntry = createStatusHistoryEntry(
        newStatus,
        options.technicianId,
        options.notes
      );
      statusHistory.push(historyEntry);
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      status: newStatus,
      statusHistory,
      ...additionalData,
    };

    // Add status-specific data
    if (newStatus === TicketStatus.COMPLETED) {
      updateData.completedDate = new Date();
    }

    // Send notifications or trigger events based on status change
    await this.handleStatusChangeEvents(ticket, newStatus, options);

    // Update and return ticket
    return this.repository.update(id, updateData);
  }

  /**
   * Handle any side effects or events triggered by status changes
   * 
   * @param ticket The repair ticket being updated
   * @param newStatus The new status being set
   * @param options Additional options for the status change
   */
  private async handleStatusChangeEvents(
    ticket: IRepairTicket, 
    newStatus: TicketStatus,
    options: {
      technicianId?: mongoose.Types.ObjectId;
      notes?: string;
    }
  ): Promise<void> {
    // This method would include notification logic, customer emails, etc.
    // For now it's just a placeholder for future implementation
    
    // Examples of what could be done here:
    switch (newStatus) {
      case TicketStatus.WAITING_FOR_PARTS:
        // Potentially trigger parts ordering workflow
        // await this.partsService.createOrderRequest(ticket.parts);
        break;
        
      case TicketStatus.READY_FOR_PICKUP:
        // Potentially send customer notification
        // await this.notificationService.sendCustomerNotification(ticket.customerId, 'READY_FOR_PICKUP');
        break;
        
      case TicketStatus.COMPLETED:
        // Potentially generate invoice or update billing
        // await this.billingService.generateInvoice(ticket._id);
        break;
        
      case TicketStatus.CANCELLED:
        // Potentially update inventory or cancel parts orders
        // await this.inventoryService.returnPartsToInventory(ticket.parts);
        break;
    }
  }

  /**
   * Get detailed information about allowed status transitions
   * 
   * @returns Object containing valid transitions for each status
   */
  getStatusTransitionRules(): Record<TicketStatus, { 
    to: TicketStatus[], 
    description: string 
  }> {
    return {
      [TicketStatus.PENDING]: {
        to: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
        description: 'Initial state, ticket has been created but work has not started.'
      },
      [TicketStatus.IN_PROGRESS]: {
        to: [
          TicketStatus.WAITING_FOR_PARTS, 
          TicketStatus.READY_FOR_PICKUP, 
          TicketStatus.COMPLETED, 
          TicketStatus.CANCELLED
        ],
        description: 'Work is actively being performed on the repair.'
      },
      [TicketStatus.WAITING_FOR_PARTS]: {
        to: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
        description: 'Work is paused while waiting for required parts to arrive.'
      },
      [TicketStatus.READY_FOR_PICKUP]: {
        to: [TicketStatus.COMPLETED, TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
        description: 'Repair is complete and ready for customer pickup.'
      },
      [TicketStatus.COMPLETED]: {
        to: [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
        description: 'Final state, repair has been completed and device returned.'
      },
      [TicketStatus.CANCELLED]: {
        to: [TicketStatus.PENDING, TicketStatus.IN_PROGRESS],
        description: 'Repair has been cancelled.'
      }
    };
  }
}

export const repairTicketWorkflowService = new RepairTicketWorkflowService(
  new RepairTicketRepository()
);