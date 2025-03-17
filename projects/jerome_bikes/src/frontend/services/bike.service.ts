/**
 * Bike Service
 * Handles API requests related to bikes
 */
import ApiService from './api.service';
import { Bike, BikeFilter, PaginatedResponse } from '@/frontend/types/models';

class BikeService {
  /**
   * Get all bikes with optional filtering and pagination
   */
  static async getAllBikes(
    filters?: BikeFilter,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Bike>> {
    const params = { page, limit, ...filters };
    return await ApiService.get<PaginatedResponse<Bike>>('/bikes', { params });
  }
  
  /**
   * Get a bike by ID
   */
  static async getBikeById(id: string): Promise<Bike> {
    return await ApiService.get<Bike>(`/bikes/${id}`);
  }
  
  /**
   * Get bikes by station ID
   */
  static async getBikesByStation(
    stationId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Bike>> {
    const params = { page, limit };
    return await ApiService.get<PaginatedResponse<Bike>>(`/stations/${stationId}/bikes`, { params });
  }
  
  /**
   * Get bikes available for a specific date range
   */
  static async getAvailableBikes(
    startDate: Date,
    endDate: Date,
    stationId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Bike>> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      stationId,
      page,
      limit
    };
    return await ApiService.get<PaginatedResponse<Bike>>('/bikes/available', { params });
  }
  
  /**
   * Search bikes by query
   */
  static async searchBikes(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Bike>> {
    const params = { q: query, page, limit };
    return await ApiService.get<PaginatedResponse<Bike>>('/bikes/search', { params });
  }
  
  /**
   * Get featured bikes
   */
  static async getFeaturedBikes(limit: number = 4): Promise<Bike[]> {
    const params = { limit };
    return await ApiService.get<Bike[]>('/bikes/featured', { params });
  }
}

export default BikeService;