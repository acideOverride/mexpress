/**
 * Unit tests for ReservationController
 * @eslint-disable @typescript-eslint/no-explicit-any
 */
import { Request, Response } from 'express';
import { ReservationController } from '../../../controllers/reservation.controller';
import { ReservationService } from '../../../services/reservation.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../../utils/api-error';
import { ReservationStatus } from '../../../../shared/types/models';
import mongoose from 'mongoose';

// Mock ReservationService
jest.mock('../../../services/reservation.service');

describe('ReservationController', () => {
  let reservationController: ReservationController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockReservationService: jest.Mocked<ReservationService>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    // Set up ReservationController with mocked service
    reservationController = new ReservationController();
    
    // Get the mocked ReservationService instance
    mockReservationService = (ReservationService as jest.Mock<ReservationService>).mock.instances[0] as jest.Mocked<ReservationService>;
  });
  
  describe('createReservation', () => {
    const testCustomerId = new mongoose.Types.ObjectId().toString();
    const testBikeId = new mongoose.Types.ObjectId().toString();
    const testStationId = new mongoose.Types.ObjectId().toString();
    
    const testReservationData = {
      customerId: testCustomerId,
      bikes: [testBikeId],
      startStation: testStationId,
      startDate: new Date('2025-04-01T10:00:00Z'),
      endDate: new Date('2025-04-01T16:00:00Z'),
      totalAmount: 50.00,
    };
    
    const testReservation = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...testReservationData,
      status: ReservationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    it('should create a reservation and return 201 status code', async () => {
      // Arrange
      mockRequest = {
        body: testReservationData,
      };
      
      mockReservationService.createReservation.mockResolvedValue(testReservation);
      
      // Act
      await (reservationController as any).createReservation(mockRequest, mockResponse);
      
      // Assert
      expect(mockReservationService.createReservation).toHaveBeenCalledWith(testReservationData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testReservation,
      });
    });
    
    it('should handle bike availability conflict', async () => {
      // Arrange
      mockRequest = {
        body: testReservationData,
      };
      
      const testError = ApiError.conflict('One or more bikes are not available for the selected dates');
      mockReservationService.createReservation.mockRejectedValue(testError);
      
      // Act
      await (reservationController as any).createReservation(mockRequest, mockResponse);
      
      // Assert
      expect(mockReservationService.createReservation).toHaveBeenCalledWith(testReservationData);
      expect(mockResponse.status).toHaveBeenCalledWith(testError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: testError.message,
          code: testError.statusCode,
        },
      });
    });
  });
  
  describe('getReservations', () => {
    const testReservations = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        customerId: new mongoose.Types.ObjectId().toString(),
        bikes: [new mongoose.Types.ObjectId().toString()],
        startStation: new mongoose.Types.ObjectId().toString(),
        startDate: new Date('2025-04-01T10:00:00Z'),
        endDate: new Date('2025-04-01T16:00:00Z'),
        status: ReservationStatus.CONFIRMED,
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        customerId: new mongoose.Types.ObjectId().toString(),
        bikes: [new mongoose.Types.ObjectId().toString()],
        startStation: new mongoose.Types.ObjectId().toString(),
        startDate: new Date('2025-04-02T10:00:00Z'),
        endDate: new Date('2025-04-02T16:00:00Z'),
        status: ReservationStatus.PENDING,
      },
    ];
    
    const testMetadata = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
    
    it('should get reservations with filter options', async () => {
      // Arrange
      mockRequest = {
        query: {
          page: '1',
          limit: '10',
          sort: 'startDate:desc',
          status: 'PENDING,CONFIRMED',
          startDateFrom: '2025-04-01T00:00:00Z',
        },
      };
      
      mockReservationService.getReservations.mockResolvedValue({
        data: testReservations,
        metadata: testMetadata,
      });
      
      // Act
      await (reservationController as any).getReservations(mockRequest, mockResponse);
      
      // Assert
      expect(mockReservationService.getReservations).toHaveBeenCalledWith(expect.objectContaining({
        page: 1,
        limit: 10,
        sort: 'startDate:desc',
        status: 'PENDING,CONFIRMED',
        startDateFrom: expect.any(Date),
      }));
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testReservations,
      });
    });
  });
  
  describe('cancelReservation', () => {
    const testReservationId = new mongoose.Types.ObjectId().toString();
    const testCancelData = {
      reason: 'Customer requested cancellation',
      cancelledById: new mongoose.Types.ObjectId().toString(),
    };
    
    const testCancelledReservation = {
      _id: testReservationId,
      status: ReservationStatus.CANCELLED,
      cancelReason: testCancelData.reason,
      cancelledById: testCancelData.cancelledById,
      cancelledAt: new Date(),
    };
    
    it('should cancel a reservation and return updated reservation', async () => {
      // Arrange
      mockRequest = {
        params: { id: testReservationId },
        body: testCancelData,
      };
      
      mockReservationService.cancelReservation.mockResolvedValue(testCancelledReservation);
      
      // Act
      await (reservationController as any).cancelReservation(mockRequest, mockResponse);
      
      // Assert
      expect(mockReservationService.cancelReservation).toHaveBeenCalledWith(
        testReservationId,
        testCancelData.reason,
        testCancelData.cancelledById
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testCancelledReservation,
      });
    });
    
    it('should handle conflict when cancelling a non-cancellable reservation', async () => {
      // Arrange
      mockRequest = {
        params: { id: testReservationId },
        body: testCancelData,
      };
      
      const testError = ApiError.conflict('Cannot cancel reservation with status COMPLETED');
      mockReservationService.cancelReservation.mockRejectedValue(testError);
      
      // Act
      await (reservationController as any).cancelReservation(mockRequest, mockResponse);
      
      // Assert
      expect(mockReservationService.cancelReservation).toHaveBeenCalledWith(
        testReservationId,
        testCancelData.reason,
        testCancelData.cancelledById
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(testError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: testError.message,
          code: testError.statusCode,
        },
      });
    });
  });
  
  describe('checkAvailability', () => {
    const testBikeIds = [
      new mongoose.Types.ObjectId().toString(),
      new mongoose.Types.ObjectId().toString(),
    ];
    const testStartDate = new Date('2025-04-01T10:00:00Z');
    const testEndDate = new Date('2025-04-01T16:00:00Z');
    
    const testAvailabilityResult = {
      isAvailable: true,
      conflicts: [],
      bikeIds: testBikeIds,
      availableBikes: testBikeIds,
      startDate: testStartDate,
      endDate: testEndDate,
    };
    
    it('should check bike availability and return result', async () => {
      // Arrange
      mockRequest = {
        query: {
          bikeIds: testBikeIds.join(','),
          startDate: testStartDate.toISOString(),
          endDate: testEndDate.toISOString(),
        },
      };
      
      mockReservationService.checkAvailability.mockResolvedValue(testAvailabilityResult);
      
      // Act
      await (reservationController as any).checkAvailability(mockRequest, mockResponse);
      
      // Assert
      expect(mockReservationService.checkAvailability).toHaveBeenCalledWith(
        testBikeIds,
        expect.any(Date),
        expect.any(Date),
        undefined
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testAvailabilityResult,
      });
    });
  });
});