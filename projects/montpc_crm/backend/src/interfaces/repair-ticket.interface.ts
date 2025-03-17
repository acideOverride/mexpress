import { Document, Types } from 'mongoose';

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

export interface IRepairNote {
  note: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

export interface IStatusHistoryEntry {
  status: TicketStatus;
  changedBy: Types.ObjectId;
  changedAt: Date;
  notes?: string;
}

export interface IPart {
  name: string;
  partNumber?: string;
  cost: number;
  quantity: number;
}

export interface IRepairTicket extends Document {
  customerId: Types.ObjectId;
  deviceId: Types.ObjectId;
  technicianId?: Types.ObjectId;
  problem: string;
  diagnosis?: string;
  status: TicketStatus;
  priority: TicketPriority;
  estimatedCost: number;
  actualCost?: number;
  estimatedCompletionDate?: Date;
  completedDate?: Date;
  notes?: string;
  repairNotes: IRepairNote[];
  statusHistory: IStatusHistoryEntry[];
  parts: IPart[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRepairTicketCreate {
  customerId: Types.ObjectId;
  deviceId: Types.ObjectId;
  technicianId?: Types.ObjectId;
  problem: string;
  diagnosis?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  estimatedCost: number;
  actualCost?: number;
  estimatedCompletionDate?: Date;
  completedDate?: Date;
  notes?: string;
  repairNotes?: IRepairNote[];
  statusHistory?: IStatusHistoryEntry[];
  parts?: IPart[];
}

export interface IRepairTicketUpdate {
  technicianId?: Types.ObjectId;
  diagnosis?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  estimatedCost?: number;
  actualCost?: number;
  estimatedCompletionDate?: Date;
  completedDate?: Date;
  notes?: string;
  repairNotes?: IRepairNote[];
  statusHistory?: IStatusHistoryEntry[];
  parts?: IPart[];
}

export interface IRepairTicketDTO {
  _id: string;
  customerId: string;
  deviceId: string;
  technicianId?: string;
  problem: string;
  diagnosis?: string;
  status: TicketStatus;
  priority: TicketPriority;
  estimatedCost: number;
  actualCost?: number;
  estimatedCompletionDate?: Date | string;
  completedDate?: Date | string;
  notes?: string;
  repairNotes: {
    note: string;
    createdBy: string;
    createdAt: Date | string;
  }[];
  statusHistory: {
    status: TicketStatus;
    changedBy: string;
    changedAt: Date | string;
    notes?: string;
  }[];
  parts: {
    name: string;
    partNumber?: string;
    cost: number;
    quantity: number;
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IPaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}