// First, mock the modules that will be imported by the service
jest.mock('../../../src/models/customer', () => ({
  CustomerModel: {
    findOne: jest.fn()
  }
}));

jest.mock('../../../src/lib/resilience/retry-strategy', () => {
  return {
    RetryStrategy: jest.fn().mockImplementation(() => {
      return {
        execute: jest.fn(operation => operation())
      };
    })
  };
});

// Now import the service
import { CustomerValidationService, CustomerInput } from '../../../src/services/validation/customer-validation.service';
import { CustomerModel } from '../../../src/models/customer';
import { Model } from 'mongoose';

describe('CustomerValidationService', () => {
  let validationService: CustomerValidationService;
  const mockFindOne = CustomerModel.findOne as jest.MockedFunction<typeof CustomerModel.findOne>;

  beforeEach(() => {
    validationService = new CustomerValidationService();
    jest.clearAllMocks();
  });

  describe('validateCustomer', () => {
    const validInput: CustomerInput = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+33123456789'
    };

    it('should validate a correct customer input', async () => {
      const result = await validationService.validateCustomer(validInput);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid first name', async () => {
      const input = { ...validInput, firstName: 'J' };
      const result = await validationService.validateCustomer(input);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('firstName');
      expect(result.errors[0].code).toBe('INVALID_FIRST_NAME');
    });

    it('should reject invalid last name', async () => {
      const input = { ...validInput, lastName: 'D' };
      const result = await validationService.validateCustomer(input);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('lastName');
      expect(result.errors[0].code).toBe('INVALID_LAST_NAME');
    });

    it('should reject invalid email', async () => {
      const input = { ...validInput, email: 'invalid-email' };
      const result = await validationService.validateCustomer(input);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('email');
      expect(result.errors[0].code).toBe('INVALID_EMAIL');
    });

    it('should reject invalid phone number', async () => {
      const input = { ...validInput, phone: '123' };
      const result = await validationService.validateCustomer(input);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].field).toBe('phone');
      expect(result.errors[0].code).toBe('INVALID_PHONE');
    });

    it('should normalize phone number with country code', async () => {
      const input = { ...validInput, phone: '33123456789' };
      const result = await validationService.validateCustomer(input);
      expect(result.isValid).toBe(true);
    });
  });

  describe('checkDuplicates', () => {
    const validInput: CustomerInput = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+33123456789'
    };

    const mockCustomer = {
      _id: '123',
      ...validInput
    };

    it('should detect duplicate email', async () => {
      mockFindOne.mockResolvedValueOnce(mockCustomer as any);

      const result = await validationService.checkDuplicates(validInput);
      expect(result.isDuplicate).toBe(true);
      expect(result.matchedFields).toContain('email');
    });

    it('should detect duplicate phone', async () => {
      mockFindOne
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(mockCustomer as any); // phone check

      const result = await validationService.checkDuplicates(validInput);
      expect(result.isDuplicate).toBe(true);
      expect(result.matchedFields).toContain('phone');
    });

    it('should detect duplicate name combination', async () => {
      mockFindOne
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(null) // phone check
        .mockResolvedValueOnce(mockCustomer as any); // name check

      const result = await validationService.checkDuplicates(validInput);
      expect(result.isDuplicate).toBe(true);
      expect(result.matchedFields).toContain('name');
    });

    it('should return no duplicates when customer is unique', async () => {
      mockFindOne.mockResolvedValue(null);

      const result = await validationService.checkDuplicates(validInput);
      expect(result.isDuplicate).toBe(false);
      expect(result.matchedFields).toHaveLength(0);
      expect(result.existingCustomer).toBeUndefined();
    });
  });

  describe('verifyExternalIds', () => {
    it('should validate correct external IDs', async () => {
      const result = await validationService.verifyExternalIds({
        hiboutik: 'valid-id',
        ringover: 'valid-id'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle missing external IDs', async () => {
      const result = await validationService.verifyExternalIds({});
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    // Note: More specific tests will be added once actual API verification is implemented
  });
});