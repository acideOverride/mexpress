/**
 * Maintenance Controller Tests
 * Tests for the bike maintenance API endpoints
 */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { MaintenanceController } from '../../../src/backend/api/controllers/maintenance.controller';
import { MaintenanceService } from '../../../src/backend/api/services/maintenance.service';
import { MaintenanceType, MaintenanceStatus } from '../../../src/shared/types/models';
import { ApiError } from '../../../src/backend/api/utils/api-error';
import { createMockMaintenance, createMockMaintenanceList } from '../../mocks/maintenance.mock';

// Mock the MaintenanceService
jest.mock('../../../src/backend/api/services/maintenance.service');

describe('MaintenanceController', () => {
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
  
  describe('getAllMaintenance', () => {
    it('should return all maintenance records with pagination', async () => {
      // Arrange
      const mockMaintenance = {
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: new Date(),
        description: 'Routine maintenance',
      };
      
      const mockMaintenanceRecords = createMockMaintenanceList([mockMaintenance], {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      });
      
      mockRequest.query = { page: '1', limit: '10' };
      mockMaintenanceService.getAllMaintenance.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getAllMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getAllMaintenance).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaintenanceRecords.data,
        metadata: mockMaintenanceRecords.metadata,
      });
    });
    
    it('should handle filter parameters correctly', async () => {
      // Arrange
      const mockMaintenanceRecords = createMockMaintenanceList([], {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      });
      
      mockRequest.query = { 
        status: MaintenanceStatus.SCHEDULED,
        maintenanceType: MaintenanceType.REPAIR,
        bikeId: mockBikeId,
        technician: mockTechnicianId,
        fromDate: '2025-01-01',
        toDate: '2025-12-31',
      };
      
      mockMaintenanceService.getAllMaintenance.mockResolvedValue(mockMaintenanceRecords);
      
      // Act
      await maintenanceController.getAllMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getAllMaintenance).toHaveBeenCalledWith({
        status: MaintenanceStatus.SCHEDULED,
        maintenanceType: MaintenanceType.REPAIR,
        bikeId: mockBikeId,
        technician: mockTechnicianId,
        fromDate: new Date('2025-01-01'),
        toDate: new Date('2025-12-31'),
        page: 1,
        limit: 10,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
    
    it('should handle errors from service layer', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockMaintenanceService.getAllMaintenance.mockRejectedValue(new Error(errorMessage));
      
      // Act
      await maintenanceController.getAllMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: errorMessage,
          code: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      });
    });
  });
  
  describe('getMaintenanceById', () => {
    it('should return a maintenance record by id', async () => {
      // Arrange
      const mockMaintenance = createMockMaintenance({
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: new Date(),
        description: 'Routine maintenance',
      });
      
      mockRequest.params = { id: mockMaintenanceId };
      mockMaintenanceService.getMaintenanceById.mockResolvedValue(mockMaintenance);
      
      // Act
      await maintenanceController.getMaintenanceById(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.getMaintenanceById).toHaveBeenCalledWith(mockMaintenanceId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMaintenance,
      });
    });
    
    it('should handle not found errors', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockMaintenanceService.getMaintenanceById.mockRejectedValue(
        new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${mockMaintenanceId} not found`)
      );
      
      // Act
      await maintenanceController.getMaintenanceById(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: `Maintenance with ID ${mockMaintenanceId} not found`,
          code: StatusCodes.NOT_FOUND,
        },
      });
    });
  });
  
  describe('createMaintenance', () => {
    it('should create a new maintenance record', async () => {
      // Arrange
      const newMaintenance = {
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        scheduledDate: new Date(),
        description: 'Routine maintenance',
      };
      
      const createdMaintenance = createMockMaintenance({
        _id: mockMaintenanceId,
        ...newMaintenance,
        status: MaintenanceStatus.SCHEDULED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      mockRequest.body = newMaintenance;
      mockMaintenanceService.createMaintenance.mockResolvedValue(createdMaintenance);
      
      // Act
      await maintenanceController.createMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.createMaintenance).toHaveBeenCalledWith(newMaintenance);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdMaintenance,
      });
    });
    
    it('should handle validation errors', async () => {
      // Arrange
      const invalidMaintenance = {
        // Missing required fields
        maintenanceType: MaintenanceType.ROUTINE,
      };
      
      mockRequest.body = invalidMaintenance;
      mockMaintenanceService.createMaintenance.mockRejectedValue(
        new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed: bikeId is required, scheduledDate is required, description is required')
      );
      
      // Act
      await maintenanceController.createMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed: bikeId is required, scheduledDate is required, description is required',
          code: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });
  
  describe('updateMaintenance', () => {
    it('should update an existing maintenance record', async () => {
      // Arrange
      const updateData = {
        description: 'Updated maintenance description',
        scheduledDate: new Date(),
      };
      
      const updatedMaintenance = createMockMaintenance({
        _id: mockMaintenanceId,
        bikeId: mockBikeId,
        maintenanceType: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: updateData.scheduledDate,
        description: updateData.description,
        updatedAt: new Date(),
      });
      
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = updateData;
      mockMaintenanceService.updateMaintenance.mockResolvedValue(updatedMaintenance);
      
      // Act
      await maintenanceController.updateMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.updateMaintenance).toHaveBeenCalledWith(mockMaintenanceId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMaintenance,
      });
    });
    
    it('should handle not found errors', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockRequest.body = { description: 'Updated description' };
      
      mockMaintenanceService.updateMaintenance.mockRejectedValue(
        new ApiError(StatusCodes.NOT_FOUND, `Maintenance with ID ${mockMaintenanceId} not found`)
      );
      
      // Act
      await maintenanceController.updateMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });
  });
  
  describe('deleteMaintenance', () => {
    it('should delete a maintenance record', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockMaintenanceService.deleteMaintenance.mockResolvedValue({ success: true, message: 'Maintenance deleted successfully' });
      
      // Act
      await maintenanceController.deleteMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockMaintenanceService.deleteMaintenance).toHaveBeenCalledWith(mockMaintenanceId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { success: true, message: 'Maintenance deleted successfully' },
      });
    });
    
    it('should handle deletion conflicts', async () => {
      // Arrange
      mockRequest.params = { id: mockMaintenanceId };
      mockMaintenanceService.deleteMaintenance.mockRejectedValue(
        new ApiError(StatusCodes.CONFLICT, 'Cannot delete maintenance in progress')
      );
      
      // Act
      await maintenanceController.deleteMaintenance(mockRequest as Request, mockResponse as Response, mockNext);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Cannot delete maintenance in progress',
          code: StatusCodes.CONFLICT,
        },
      });
    });
  });
});