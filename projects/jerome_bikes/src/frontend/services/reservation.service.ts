/**
 * Reservation Service
 * Handles API requests related to reservations
 */
import ApiService from './api.service';
import { Reservation, PaginatedResponse, ReservationFilter, ReservationCreate } from '@/frontend/types/models';

class ReservationService {
  /**
   * Create a new reservation
   */
  static async createReservation(data: ReservationCreate): Promise<Reservation> {
    return await ApiService.post<Reservation>('/reservations', data);
  }
  
  /**
   * Get all reservations for the current user
   */
  static async getReservations(
    filters?: ReservationFilter,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Reservation>> {
    const params = { page, limit, ...filters };
    return await ApiService.get<PaginatedResponse<Reservation>>('/reservations', { params });
  }
  
  /**
   * Get a specific reservation by ID
   */
  static async getReservationById(id: string): Promise<Reservation> {
    return await ApiService.get<Reservation>(`/reservations/${id}`);
  }
  
  /**
   * Update a reservation
   */
  static async updateReservation(
    id: string,
    data: Partial<ReservationCreate>
  ): Promise<Reservation> {
    return await ApiService.put<Reservation>(`/reservations/${id}`, data);
  }
  
  /**
   * Cancel a reservation
   */
  static async cancelReservation(id: string): Promise<Reservation> {
    return await ApiService.post<Reservation>(`/reservations/${id}/cancel`);
  }
  
  /**
   * Get active reservations for the current user
   */
  static async getActiveReservations(): Promise<Reservation[]> {
    return await ApiService.get<Reservation[]>('/reservations/active');
  }
  
  /**
   * Get past reservations for the current user
   */
  static async getPastReservations(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Reservation>> {
    const params = { page, limit };
    return await ApiService.get<PaginatedResponse<Reservation>>('/reservations/past', { params });
  }
  
  /**
   * Check availability of a bike for a date range
   */
  static async checkAvailability(
    bikeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ available: boolean; conflictingReservations?: Reservation[] }> {
    const params = {
      bikeId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    return await ApiService.get<{ available: boolean; conflictingReservations?: Reservation[] }>(
      '/reservations/check-availability',
      { params }
    );
  }
}

export default ReservationService;