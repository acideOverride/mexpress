import mongoose, { Schema } from 'mongoose';
import { 
  TicketStatus, 
  TicketPriority 
} from '../interfaces/repair-ticket.interface';

// Repair Note Schema
const RepairNoteSchema: Schema = new Schema({
  note: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Note creator is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// Status History Entry Schema
const StatusHistorySchema: Schema = new Schema({
  status: {
    type: String,
    enum: Object.values(TicketStatus),
    required: [true, 'Status is required']
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Status changer is required']
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, { _id: true });

// Part Schema
const PartSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  partNumber: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    required: [true, 'Part cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
}, { _id: true });

// Main Repair Ticket Schema
export const RepairTicketSchema: Schema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required'],
    index: true
  },
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: [true, 'Device ID is required'],
    index: true
  },
  technicianId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  problem: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true
  },
  diagnosis: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.PENDING,
    index: true
  },
  priority: {
    type: String,
    enum: Object.values(TicketPriority),
    default: TicketPriority.MEDIUM,
    index: true
  },
  estimatedCost: {
    type: Number,
    required: [true, 'Estimated cost is required'],
    min: [0, 'Cost cannot be negative']
  },
  actualCost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  estimatedCompletionDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  repairNotes: {
    type: [RepairNoteSchema],
    default: []
  },
  statusHistory: {
    type: [StatusHistorySchema],
    default: []
  },
  parts: {
    type: [PartSchema],
    default: []
  }
}, {
  timestamps: true
});

// Create indexes for common queries
RepairTicketSchema.index({ customerId: 1 });
RepairTicketSchema.index({ deviceId: 1 });
RepairTicketSchema.index({ technicianId: 1 });
RepairTicketSchema.index({ status: 1, priority: -1 });
RepairTicketSchema.index({ createdAt: -1 });

// Export the defined enums for consistency
export { TicketStatus, TicketPriority };