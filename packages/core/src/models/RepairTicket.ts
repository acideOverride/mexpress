import mongoose, { Schema, Document } from 'mongoose';
import { ICustomer } from './Customer';

export enum TicketStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_PARTS = 'WAITING_FOR_PARTS',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface IRepairTicket extends Document {
  customerId: mongoose.Types.ObjectId | ICustomer;
  problem: string;
  status: TicketStatus;
  priority: TicketPriority;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RepairTicketSchema: Schema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  problem: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.PENDING
  },
  priority: {
    type: String,
    enum: Object.values(TicketPriority),
    default: TicketPriority.MEDIUM
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index on customerId for faster lookups
RepairTicketSchema.index({ customerId: 1 });

// Create compound index on status and priority for common queries
RepairTicketSchema.index({ status: 1, priority: -1 });

export const RepairTicket = mongoose.model<IRepairTicket>('RepairTicket', RepairTicketSchema);