/**
 * Maintenance Status Management Tests
 * Tests for the maintenance status management API endpoints
 */
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { MaintenanceController } from '../../../src/backend/api/controllers/maintenance.controller';
import { MaintenanceService } from '../../../src/backend/api/services/maintenance.service';
import { MaintenanceType, MaintenanceStatus } from '../../../src/shared/types/models';
import { ApiError } from '../../../src/backend/api/utils/api-error';

// Mock the MaintenanceService
jest.mock('../../../src/backend/api/services/maintenance.service');

describe('MaintenanceController - Status Management', () => {
  let maintenanceController: MaintenanceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockMaintenanceService: jest.Mocked<MaintenanceService>;
  
  const mockMaintenanceId = new mongoose.Types.ObjectId().toString();
  const mockBikeId = new mongoose.Types.ObjectId().toString();
  const mockTechnicianId = new mongoose.Types.ObjectId().toString();
  
  beforeEach(() => {
    // Reset mocks and create fresh instances for each test
    jest.clearAllMocks();
    
    mockMaintenanceService = new MaintenanceService() as jest.Mocked<MaintenanceService>;
    maintenanceController = new MaintenanceController();
    mockNext = jest.fn();
    
    // Create request and response mocks
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    // Replace the controller's service with our mock
    (maintenanceController as any).maintenanceService = mockMaintenanceService;
  });
  
  describe('updateMaintenanceStatus', () => {
    it('should update the maintenance status', async () => {
      // Arrange
      const statusUpdateData = {
        status: MaintenanceStatus.IN_PROGRESS,
        notes: 'Starting maintenance work',
      };
      
      const updatedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.IN_PROGRESS,
        scheduledDate: new Date(),
        description: 'Routine maintenance',
        notes: 'Starting maintenance work',
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = statusUpdateData;
      mockMaintenanceService.updateMaintenanceStatus.mockResolvedValue(updatedMaintenance);
      
      // Act
      await maintenanceController.updateMaintenanceStatus(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.updateMaintenanceStatus).toHaveBeenCalledWith(
        mockMaintenanceId, 
        statusUpdateData.status, 
        { notes: statusUpdateData.notes }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMaintenance,
      });
    });
    
    it('should handle invalid status transitions', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = { status: MaintenanceStatus.COMPLETED };
      
      mockMaintenanceService.updateMaintenanceStatus.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          `Invalid status transition to ${MaintenanceStatus.COMPLETED}`
        )
      );
      
      // Act
      await maintenanceController.updateMaintenanceStatus(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: `Invalid status transition to ${MaintenanceStatus.COMPLETED}`,
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
  
  describe('completeMaintenance', () => {
    it('should mark maintenance as completed', async () => {
      // Arrange
      const completionData = {
        laborHours: 2.5,
        mileageAfter: 1250,
        notes: 'Completed routine maintenance',
        nextMaintenanceDate: new Date('2025-06-01'),
      };
      
      const completedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.COMPLETED,
        scheduledDate: new Date(),
        completedDate: new Date(),
        description: 'Routine maintenance',
        laborHours: completionData.laborHours,
        mileageAfter: completionData.mileageAfter,
        notes: 'Completed routine maintenance',
        nextMaintenanceDate: completionData.nextMaintenanceDate,
        nextMaintenanceType: MaintenanceType.ROUTINE,
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = completionData;
      mockMaintenanceService.completeMaintenance.mockResolvedValue(completedMaintenance);
      
      // Act
      await maintenanceController.completeMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.completeMaintenance).toHaveBeenCalledWith(
        mockMaintenanceId, 
        completionData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: completedMaintenance,
      });
    });
    
    it('should handle completion of already completed maintenance', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = { laborHours: 2 };
      
      mockMaintenanceService.completeMaintenance.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'Maintenance is already completed'
        )
      );
      
      // Act
      await maintenanceController.completeMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Maintenance is already completed',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
  
  describe('cancelMaintenance', () => {
    it('should cancel a scheduled maintenance', async () => {
      // Arrange
      const cancelData = {
        reason: 'Bike no longer available',
      };
      
      const cancelledMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.CANCELLED,
        scheduledDate: new Date(),
        description: 'Routine maintenance',
        notes: 'Bike no longer available',
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = cancelData;
      mockMaintenanceService.cancelMaintenance.mockResolvedValue(cancelledMaintenance);
      
      // Act
      await maintenanceController.cancelMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.cancelMaintenance).toHaveBeenCalledWith(
        mockMaintenanceId, 
        cancelData.reason
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: cancelledMaintenance,
      });
    });
    
    it('should handle cancellation of completed maintenance', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = { reason: 'No longer needed' };
      
      mockMaintenanceService.cancelMaintenance.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'Cannot cancel completed maintenance'
        )
      );
      
      // Act
      await maintenanceController.cancelMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    });
  });
  
  describe('postponeMaintenance', () => {
    it('should postpone a scheduled maintenance', async () => {
      // Arrange
      const postponeData = {
        newDate: new Date('2025-06-15'),
        reason: 'Scheduling conflict',
      };
      
      const postponedMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.POSTPONED,
        scheduledDate: postponeData.newDate,
        description: 'Routine maintenance',
        notes: 'Scheduling conflict',
        updatedAt: new Date(),
      };
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = postponeData;
      mockMaintenanceService.postponeMaintenance.mockResolvedValue(postponedMaintenance);
      
      // Act
      await maintenanceController.postponeMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.postponeMaintenance).toHaveBeenCalledWith(
        mockMaintenanceId, 
        postponeData.newDate,
        postponeData.reason
      );
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: postponedMaintenance,
      });
    });
    
    it('should handle invalid postpone dates', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = { 
        newDate: new Date('2023-01-01'), // Past date
        reason: 'Test reason'
      };
      
      mockMaintenanceService.postponeMaintenance.mockRejectedValue(
        new ApiError(
          StatusCodes.BAD_REQUEST, 
          'New date must be in the future'
        )
      );
      
      // Act
      await maintenanceController.postponeMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'New date must be in the future',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
});