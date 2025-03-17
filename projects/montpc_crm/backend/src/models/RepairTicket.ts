import mongoose from 'mongoose';
import { 
  RepairTicketSchema, 
  TicketStatus, 
  TicketPriority 
} from '../schemas/RepairTicket.schema';
import {
  IRepairTicket,
  IRepairNote,
  IStatusHistoryEntry,
  IPart
} from '../interfaces/repair-ticket.interface';

// Create model from schema
const RepairTicket = mongoose.model<IRepairTicket>('RepairTicket', RepairTicketSchema);

/**
 * Validates if the given status transition is allowed
 * 
 * @param currentStatus The current status of the repair ticket
 * @param newStatus The new status to transition to
 * @returns Boolean indicating if the transition is valid
 */
export function isValidStatusTransition(currentStatus: TicketStatus, newStatus: TicketStatus): boolean {
  // Define allowed transitions
  const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.PENDING]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.CANCELLED
    ],
    [TicketStatus.IN_PROGRESS]: [
      TicketStatus.WAITING_FOR_PARTS,
      TicketStatus.READY_FOR_PICKUP,
      TicketStatus.COMPLETED,
      TicketStatus.CANCELLED
    ],
    [TicketStatus.WAITING_FOR_PARTS]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.CANCELLED
    ],
    [TicketStatus.READY_FOR_PICKUP]: [
      TicketStatus.COMPLETED,
      TicketStatus.IN_PROGRESS, // In case additional work is needed
      TicketStatus.CANCELLED
    ],
    [TicketStatus.COMPLETED]: [
      TicketStatus.IN_PROGRESS, // Reopen if issues emerge
      TicketStatus.CANCELLED    // Rare but possible if completed in error
    ],
    [TicketStatus.CANCELLED]: [
      TicketStatus.PENDING,     // Reopen a cancelled ticket
      TicketStatus.IN_PROGRESS  // Reopen directly to in progress
    ]
  };

  // If staying in the same status, always allowed
  if (currentStatus === newStatus) {
    return true;
  }

  // If changing status, check allowed transitions
  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Creates a repair ticket status history entry
 * 
 * @param status The status of the ticket
 * @param changedBy ID of the user who changed the status
 * @param notes Optional notes about the status change
 * @returns A status history entry object
 */
export function createStatusHistoryEntry(
  status: TicketStatus, 
  changedBy: mongoose.Types.ObjectId, 
  notes?: string
): IStatusHistoryEntry {
  return {
    status,
    changedBy,
    changedAt: new Date(),
    notes
  };
}

/**
 * Creates a repair note entry
 * 
 * @param note The content of the note
 * @param createdBy ID of the user who created the note
 * @returns A repair note object
 */
export function createRepairNote(
  note: string,
  createdBy: mongoose.Types.ObjectId
): IRepairNote {
  return {
    note,
    createdBy,
    createdAt: new Date()
  };
}

/**
 * Creates a part entry for repair tickets
 * 
 * @param name Name of the part
 * @param cost Cost of the part
 * @param quantity Quantity of the part (defaults to 1)
 * @param partNumber Optional part number/SKU
 * @returns A part object
 */
export function createPart(
  name: string,
  cost: number,
  quantity: number = 1,
  partNumber?: string
): IPart {
  return {
    name,
    partNumber,
    cost,
    quantity
  };
}

export { 
  RepairTicket,
  TicketStatus,
  TicketPriority
};