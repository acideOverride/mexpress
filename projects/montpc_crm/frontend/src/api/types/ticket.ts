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

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Ticket {
  id: string;
  customerId: string | CustomerSummary;
  problem: string;
  status: TicketStatus;
  priority: TicketPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  customerId: string;
  problem: string;
  priority?: TicketPriority;
  notes?: string;
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
}

export interface TicketResponse {
  data: Ticket;
}

export interface TicketsResponse {
  data: Ticket[];
}