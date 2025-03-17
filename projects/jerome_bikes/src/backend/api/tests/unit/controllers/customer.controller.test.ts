/**
 * Unit tests for CustomerController
 * @eslint-disable @typescript-eslint/no-explicit-any
 */
import { Request, Response } from 'express';
import { CustomerController } from '../../../controllers/customer.controller';
import { CustomerService } from '../../../services/customer.service';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../../utils/api-error';
import mongoose from 'mongoose';

// Mock CustomerService
jest.mock('../../../services/customer.service');

describe('CustomerController', () => {
  let customerController: CustomerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockCustomerService: jest.Mocked<CustomerService>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    // Set up CustomerController with mocked service
    customerController = new CustomerController();
    
    // Get the mocked CustomerService instance
    mockCustomerService = (CustomerService as jest.Mock<CustomerService>).mock.instances[0] as jest.Mocked<CustomerService>;
  });
  
  describe('createCustomer', () => {
    const testCustomerData = {
      userId: new mongoose.Types.ObjectId().toString(),
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
        country: 'Test Country'
      }
    };
    
    const testCustomer = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...testCustomerData,
      loyaltyPoints: 0,
      memberSince: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('should create a customer and return 201 status code', async () => {
      // Arrange
      mockRequest = {
        body: testCustomerData
      };
      
      mockCustomerService.createCustomer.mockResolvedValue(testCustomer);
      
      // Act
      await (customerController as any).createCustomer(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.createCustomer).toHaveBeenCalledWith(testCustomerData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testCustomer
      });
    });
    
    it('should handle service errors and pass them through', async () => {
      // Arrange
      mockRequest = {
        body: testCustomerData
      };
      
      const testError = ApiError.badRequest('Test error');
      mockCustomerService.createCustomer.mockRejectedValue(testError);
      
      // Act
      await (customerController as any).createCustomer(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.createCustomer).toHaveBeenCalledWith(testCustomerData);
      expect(mockResponse.status).toHaveBeenCalledWith(testError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: testError.message,
          code: testError.statusCode
        }
      });
    });
  });
  
  describe('getCustomerById', () => {
    const testCustomerId = new mongoose.Types.ObjectId().toString();
    const testCustomer = {
      _id: testCustomerId,
      userId: new mongoose.Types.ObjectId().toString(),
      phone: '+1 (555) 123-4567',
      loyaltyPoints: 100,
      memberSince: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('should get a customer by ID and return 200 status code', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId }
      };
      
      mockCustomerService.getCustomerById.mockResolvedValue(testCustomer);
      
      // Act
      await (customerController as any).getCustomerById(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(testCustomerId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testCustomer
      });
    });
    
    it('should handle customer not found error', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId }
      };
      
      const testError = ApiError.notFound(`Customer with ID ${testCustomerId} not found`);
      mockCustomerService.getCustomerById.mockRejectedValue(testError);
      
      // Act
      await (customerController as any).getCustomerById(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(testCustomerId);
      expect(mockResponse.status).toHaveBeenCalledWith(testError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: testError.message,
          code: testError.statusCode
        }
      });
    });
  });
  
  describe('getCustomers', () => {
    const testCustomers = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: new mongoose.Types.ObjectId().toString(),
        phone: '+1 (555) 123-4567',
        loyaltyPoints: 100
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        userId: new mongoose.Types.ObjectId().toString(),
        phone: '+1 (555) 987-6543',
        loyaltyPoints: 200
      }
    ];
    
    const testMetadata = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 2,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false
    };
    
    it('should get customers with filters and return 200 status code', async () => {
      // Arrange
      mockRequest = {
        query: {
          page: '1',
          limit: '10',
          sort: 'loyaltyPoints:desc',
          minLoyaltyPoints: '50'
        }
      };
      
      mockCustomerService.getCustomers.mockResolvedValue({
        data: testCustomers,
        metadata: testMetadata
      });
      
      // Act
      await (customerController as any).getCustomers(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.getCustomers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sort: 'loyaltyPoints:desc',
        minLoyaltyPoints: 50,
        maxLoyaltyPoints: undefined,
        verificationStatus: undefined,
        bikeTypes: undefined,
        bikeSize: undefined,
        search: undefined,
        phone: undefined,
        postalCode: undefined,
        city: undefined,
        country: undefined,
        hasPendingVerification: undefined
      });
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testCustomers
      });
    });
  });
  
  describe('addLoyaltyPoints', () => {
    const testCustomerId = new mongoose.Types.ObjectId().toString();
    const testCustomer = {
      _id: testCustomerId,
      userId: new mongoose.Types.ObjectId().toString(),
      phone: '+1 (555) 123-4567',
      loyaltyPoints: 150, // Updated points
      memberSince: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('should add loyalty points and return updated customer', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId },
        body: {
          points: 50,
          reason: 'Test loyalty points addition'
        }
      };
      
      mockCustomerService.addLoyaltyPoints.mockResolvedValue(testCustomer);
      
      // Act
      await (customerController as any).addLoyaltyPoints(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.addLoyaltyPoints).toHaveBeenCalledWith(
        testCustomerId,
        50,
        'Test loyalty points addition'
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testCustomer
      });
    });
  });
  
  describe('updateCustomer', () => {
    const testCustomerId = new mongoose.Types.ObjectId().toString();
    const testUpdateData = {
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 New St',
        city: 'New City',
        state: 'New State',
        postalCode: '54321',
        country: 'New Country'
      }
    };
    
    const testUpdatedCustomer = {
      _id: testCustomerId,
      userId: new mongoose.Types.ObjectId().toString(),
      phone: testUpdateData.phone,
      address: testUpdateData.address,
      loyaltyPoints: 100,
      memberSince: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('should update a customer and return 200 status code', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId },
        body: testUpdateData
      };
      
      mockCustomerService.updateCustomer.mockResolvedValue(testUpdatedCustomer);
      
      // Act
      await (customerController as any).updateCustomer(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.updateCustomer).toHaveBeenCalledWith(testCustomerId, testUpdateData);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: testUpdatedCustomer
      });
    });
  });
  
  describe('deleteCustomer', () => {
    const testCustomerId = new mongoose.Types.ObjectId().toString();
    const deleteResult = {
      success: true,
      message: 'Customer deleted successfully'
    };
    
    it('should delete a customer and return success message', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId }
      };
      
      mockCustomerService.deleteCustomer.mockResolvedValue(deleteResult);
      
      // Act
      await (customerController as any).deleteCustomer(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.deleteCustomer).toHaveBeenCalledWith(testCustomerId);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: deleteResult
      });
    });
    
    it('should handle conflict error when customer has active reservations', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId }
      };
      
      const testError = ApiError.conflict('Cannot delete customer with active reservations');
      mockCustomerService.deleteCustomer.mockRejectedValue(testError);
      
      // Act
      await (customerController as any).deleteCustomer(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.deleteCustomer).toHaveBeenCalledWith(testCustomerId);
      expect(mockResponse.status).toHaveBeenCalledWith(testError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: testError.message,
          code: testError.statusCode
        }
      });
    });
  });
  
  describe('updateVerificationStatus', () => {
    const testCustomerId = new mongoose.Types.ObjectId().toString();
    const verificationData = {
      status: 'verified',
      note: 'ID document verified'
    };
    
    const updatedCustomer = {
      _id: testCustomerId,
      userId: new mongoose.Types.ObjectId().toString(),
      phone: '+1 (555) 123-4567',
      verificationStatus: 'verified',
      notes: '[Verification verified] ID document verified - 2025-03-13T12:00:00.000Z',
      loyaltyPoints: 100,
      memberSince: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    it('should update verification status and return updated customer', async () => {
      // Arrange
      mockRequest = {
        params: { id: testCustomerId },
        body: verificationData
      };
      
      mockCustomerService.updateVerificationStatus.mockResolvedValue(updatedCustomer);
      
      // Act
      await (customerController as any).updateVerificationStatus(mockRequest, mockResponse);
      
      // Assert
      expect(mockCustomerService.updateVerificationStatus).toHaveBeenCalledWith(
        testCustomerId,
        verificationData.status,
        verificationData.note
      );
      
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedCustomer
      });
    });
  });
});