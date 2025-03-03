import { apiClient } from '../client';
import {
  Ticket,
  CreateTicketDto,
  UpdateTicketStatusDto,
  TicketResponse,
  TicketsResponse
} from '../types/ticket';

class TicketsService {
  private readonly basePath = '/tickets';

  /**
   * Get all tickets
   * @returns Promise with array of tickets
   */
  async getAll() {
    const response = await apiClient.get<TicketsResponse>(this.basePath);
    return response.data;
  }

  /**
   * Get ticket by ID
   * @param id Ticket ID
   * @returns Promise with ticket data
   */
  async getById(id: string) {
    const response = await apiClient.get<TicketResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new ticket
   * @param data Ticket creation data
   * @returns Promise with created ticket data
   */
  async create(data: CreateTicketDto) {
    const response = await apiClient.post<TicketResponse>(this.basePath, data);
    return response.data;
  }

  /**
   * Update ticket status
   * @param id Ticket ID
   * @param data Status update data
   * @returns Promise with updated ticket data
   */
  async updateStatus(id: string, data: UpdateTicketStatusDto) {
    const response = await apiClient.put<TicketResponse>(`${this.basePath}/${id}/status`, data);
    return response.data;
  }
}

export const ticketsService = new TicketsService();