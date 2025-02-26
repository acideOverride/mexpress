/**
 * Tests for customer validation functions
 */

import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
  validateStatus,
  validateNotes,
  validateContactMethods,
  sanitizeCustomerData,
  validateCreateCustomer,
  validateUpdateCustomer,
  ValidationOptions
} from '../../../src/validation/customerValidation';
import { CustomerStatus } from '../../../src/models/customer';

describe('Customer Validation', () => {
  // validateName tests
  describe('validateName', () => {
    it('should pass for valid names', () => {
      expect(validateName('John Doe')).toEqual({ valid: true });
      expect(validateName('Mary-Jane')).toEqual({ valid: true });
      expect(validateName("O'Reilly")).toEqual({ valid: true });
      expect(validateName('John Smith-Jones')).toEqual({ valid: true });
    });

    it('should fail for missing names', () => {
      expect(validateName(undefined)).toEqual({ 
        valid: false, 
        errors: { name: 'Name is required' } 
      });
      expect(validateName(null)).toEqual({ 
        valid: false, 
        errors: { name: 'Name is required' } 
      });
    });

    it('should fail for empty names', () => {
      expect(validateName('')).toEqual({ 
        valid: false, 
        errors: { name: 'Name cannot be empty' } 
      });
      expect(validateName('   ')).toEqual({ 
        valid: false, 
        errors: { name: 'Name cannot be empty' } 
      });
    });

    it('should fail for non-string names', () => {
      expect(validateName(123 as any)).toEqual({ 
        valid: false, 
        errors: { name: 'Name must be a string' } 
      });
      expect(validateName({} as any)).toEqual({ 
        valid: false, 
        errors: { name: 'Name must be a string' } 
      });
    });

    it('should fail for names exceeding max length', () => {
      const longName = 'A'.repeat(101);
      expect(validateName(longName)).toEqual({ 
        valid: false, 
        errors: { name: 'Name cannot exceed 100 characters' } 
      });
    });

    it('should fail for names with invalid characters', () => {
      expect(validateName('John Doe!')).toEqual({ 
        valid: false, 
        errors: { name: 'Name can only contain letters, spaces, hyphens, and apostrophes' } 
      });
      expect(validateName('John@Doe')).toEqual({ 
        valid: false, 
        errors: { name: 'Name can only contain letters, spaces, hyphens, and apostrophes' } 
      });
      expect(validateName('John123')).toEqual({ 
        valid: false, 
        errors: { name: 'Name can only contain letters, spaces, hyphens, and apostrophes' } 
      });
    });
  });

  // validateEmail tests
  describe('validateEmail', () => {
    it('should pass for valid emails', () => {
      expect(validateEmail('test@example.com')).toEqual({ valid: true });
      expect(validateEmail('user.name+tag@example.co.uk')).toEqual({ valid: true });
      expect(validateEmail('customer-support@company-name.com')).toEqual({ valid: true });
    });

    it('should fail for missing emails in create mode', () => {
      expect(validateEmail(undefined)).toEqual({ 
        valid: false, 
        errors: { email: 'Email is required' } 
      });
      expect(validateEmail(null)).toEqual({ 
        valid: false, 
        errors: { email: 'Email is required' } 
      });
    });

    it('should pass for missing emails in update mode', () => {
      expect(validateEmail(undefined, { isUpdate: true })).toEqual({ valid: true });
      expect(validateEmail(null, { isUpdate: true })).toEqual({ valid: true });
    });

    it('should fail for empty emails', () => {
      expect(validateEmail('')).toEqual({ 
        valid: false, 
        errors: { email: 'Email cannot be empty' } 
      });
      expect(validateEmail('   ')).toEqual({ 
        valid: false, 
        errors: { email: 'Email cannot be empty' } 
      });
    });

    it('should fail for non-string emails', () => {
      expect(validateEmail(123 as any)).toEqual({ 
        valid: false, 
        errors: { email: 'Email must be a string' } 
      });
      expect(validateEmail({} as any)).toEqual({ 
        valid: false, 
        errors: { email: 'Email must be a string' } 
      });
    });

    it('should fail for invalid email formats', () => {
      expect(validateEmail('notanemail')).toEqual({ 
        valid: false, 
        errors: { email: 'Invalid email format' } 
      });
      expect(validateEmail('missing@tld')).toEqual({ 
        valid: false, 
        errors: { email: 'Invalid email format' } 
      });
      expect(validateEmail('no spaces@example.com')).toEqual({ 
        valid: false, 
        errors: { email: 'Invalid email format' } 
      });
      expect(validateEmail('@missing-username.com')).toEqual({ 
        valid: false, 
        errors: { email: 'Invalid email format' } 
      });
    });
  });

  // validatePhone tests
  describe('validatePhone', () => {
    it('should pass for valid phone numbers', () => {
      expect(validatePhone('123-456-7890')).toEqual({ valid: true });
      expect(validatePhone('(123) 456-7890')).toEqual({ valid: true });
      expect(validatePhone('1234567890')).toEqual({ valid: true });
      expect(validatePhone('+1-123-456-7890')).toEqual({ valid: true });
    });

    it('should pass for missing phone numbers', () => {
      expect(validatePhone(undefined)).toEqual({ valid: true });
      expect(validatePhone(null)).toEqual({ valid: true });
      expect(validatePhone('')).toEqual({ valid: true });
    });

    it('should fail for non-string phone numbers', () => {
      expect(validatePhone(123 as any)).toEqual({ 
        valid: false, 
        errors: { phone: 'Phone must be a string' } 
      });
      expect(validatePhone({} as any)).toEqual({ 
        valid: false, 
        errors: { phone: 'Phone must be a string' } 
      });
    });

    it('should fail for invalid phone formats', () => {
      expect(validatePhone('not-a-phone')).toEqual({ 
        valid: false, 
        errors: { phone: 'Invalid phone number format' } 
      });
      expect(validatePhone('123')).toEqual({ 
        valid: false, 
        errors: { phone: 'Invalid phone number format' } 
      });
      expect(validatePhone('123-abc-7890')).toEqual({ 
        valid: false, 
        errors: { phone: 'Invalid phone number format' } 
      });
    });
  });

  // validateAddress tests
  describe('validateAddress', () => {
    it('should pass for valid addresses', () => {
      expect(validateAddress({
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zip: '12345'
      })).toEqual({ valid: true });

      expect(validateAddress({
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zip: '12345-6789'
      })).toEqual({ valid: true });
    });

    it('should pass for missing addresses', () => {
      expect(validateAddress(undefined)).toEqual({ valid: true });
      expect(validateAddress(null)).toEqual({ valid: true });
    });

    it('should pass for partial addresses', () => {
      expect(validateAddress({
        street: '123 Main St'
      })).toEqual({ valid: true });

      expect(validateAddress({
        city: 'Anytown',
        state: 'NY'
      })).toEqual({ valid: true });
    });

    it('should fail for non-object addresses', () => {
      expect(validateAddress('string-address' as any)).toEqual({ 
        valid: false, 
        errors: { address: 'Address must be an object' } 
      });
      expect(validateAddress(123 as any)).toEqual({ 
        valid: false, 
        errors: { address: 'Address must be an object' } 
      });
    });

    it('should fail for invalid street', () => {
      expect(validateAddress({
        street: 123,
        city: 'Anytown',
        state: 'NY',
        zip: '12345'
      } as any)).toEqual({ 
        valid: false, 
        errors: { 'address.street': 'Street must be a string' } 
      });

      const longStreet = 'A'.repeat(101);
      expect(validateAddress({
        street: longStreet,
        city: 'Anytown',
        state: 'NY',
        zip: '12345'
      })).toEqual({ 
        valid: false, 
        errors: { 'address.street': 'Street cannot exceed 100 characters' } 
      });
    });

    it('should fail for invalid city', () => {
      expect(validateAddress({
        street: '123 Main St',
        city: 123,
        state: 'NY',
        zip: '12345'
      } as any)).toEqual({ 
        valid: false, 
        errors: { 'address.city': 'City must be a string' } 
      });

      const longCity = 'A'.repeat(51);
      expect(validateAddress({
        street: '123 Main St',
        city: longCity,
        state: 'NY',
        zip: '12345'
      })).toEqual({ 
        valid: false, 
        errors: { 'address.city': 'City cannot exceed 50 characters' } 
      });
    });

    it('should fail for invalid state', () => {
      expect(validateAddress({
        street: '123 Main St',
        city: 'Anytown',
        state: 123,
        zip: '12345'
      } as any)).toEqual({ 
        valid: false, 
        errors: { 'address.state': 'State must be a string' } 
      });

      const longState = 'A'.repeat(51);
      expect(validateAddress({
        street: '123 Main St',
        city: 'Anytown',
        state: longState,
        zip: '12345'
      })).toEqual({ 
        valid: false, 
        errors: { 'address.state': 'State cannot exceed 50 characters' } 
      });
    });

    it('should fail for invalid zip', () => {
      expect(validateAddress({
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zip: 12345 as any
      })).toEqual({ 
        valid: false, 
        errors: { 'address.zip': 'Zip must be a string' } 
      });

      expect(validateAddress({
        street: '123 Main St',
        city: 'Anytown',
        state: 'NY',
        zip: 'invalid'
      })).toEqual({ 
        valid: false, 
        errors: { 'address.zip': 'Invalid zip code format' } 
      });
    });
  });

  // validateStatus tests
  describe('validateStatus', () => {
    it('should pass for valid statuses', () => {
      expect(validateStatus(CustomerStatus.ACTIVE)).toEqual({ valid: true });
      expect(validateStatus(CustomerStatus.INACTIVE)).toEqual({ valid: true });
      expect(validateStatus(CustomerStatus.PENDING)).toEqual({ valid: true });
      expect(validateStatus(CustomerStatus.BLOCKED)).toEqual({ valid: true });
    });

    it('should fail for missing statuses in create mode', () => {
      expect(validateStatus(undefined)).toEqual({ 
        valid: false, 
        errors: { status: 'Status is required' } 
      });
      expect(validateStatus(null)).toEqual({ 
        valid: false, 
        errors: { status: 'Status is required' } 
      });
    });

    it('should pass for missing statuses in update mode', () => {
      expect(validateStatus(undefined, { isUpdate: true })).toEqual({ valid: true });
      expect(validateStatus(null, { isUpdate: true })).toEqual({ valid: true });
    });

    it('should fail for non-string statuses', () => {
      expect(validateStatus(123 as any)).toEqual({ 
        valid: false, 
        errors: { status: 'Status must be a string' } 
      });
      expect(validateStatus({} as any)).toEqual({ 
        valid: false, 
        errors: { status: 'Status must be a string' } 
      });
    });

    it('should fail for invalid status values', () => {
      expect(validateStatus('INVALID_STATUS')).toEqual({ 
        valid: false, 
        errors: { status: `Status must be one of: ACTIVE, INACTIVE, PENDING, BLOCKED` } 
      });
      expect(validateStatus('active')).toEqual({ 
        valid: false, 
        errors: { status: `Status must be one of: ACTIVE, INACTIVE, PENDING, BLOCKED` } 
      });
    });
  });

  // validateNotes tests
  describe('validateNotes', () => {
    it('should pass for valid notes', () => {
      expect(validateNotes('These are some notes')).toEqual({ valid: true });
      expect(validateNotes('Short note')).toEqual({ valid: true });
    });

    it('should pass for missing notes', () => {
      expect(validateNotes(undefined)).toEqual({ valid: true });
      expect(validateNotes(null)).toEqual({ valid: true });
      expect(validateNotes('')).toEqual({ valid: true });
    });

    it('should fail for non-string notes', () => {
      expect(validateNotes(123 as any)).toEqual({ 
        valid: false, 
        errors: { notes: 'Notes must be a string' } 
      });
      expect(validateNotes({} as any)).toEqual({ 
        valid: false, 
        errors: { notes: 'Notes must be a string' } 
      });
    });

    it('should fail for notes exceeding max length', () => {
      const longNotes = 'A'.repeat(1001);
      expect(validateNotes(longNotes)).toEqual({ 
        valid: false, 
        errors: { notes: 'Notes cannot exceed 1000 characters' } 
      });
    });
  });

  // validateContactMethods tests
  describe('validateContactMethods', () => {
    it('should pass when email is provided', () => {
      expect(validateContactMethods('test@example.com', undefined)).toEqual({ valid: true });
      expect(validateContactMethods('test@example.com', null)).toEqual({ valid: true });
      expect(validateContactMethods('test@example.com', '')).toEqual({ valid: true });
    });

    it('should pass when phone is provided', () => {
      expect(validateContactMethods(undefined, '123-456-7890')).toEqual({ valid: true });
      expect(validateContactMethods(null, '123-456-7890')).toEqual({ valid: true });
      expect(validateContactMethods('', '123-456-7890')).toEqual({ valid: true });
    });

    it('should pass when both email and phone are provided', () => {
      expect(validateContactMethods('test@example.com', '123-456-7890')).toEqual({ valid: true });
    });

    it('should fail when neither email nor phone is provided', () => {
      expect(validateContactMethods(undefined, undefined)).toEqual({ 
        valid: false, 
        errors: { contact: 'At least one contact method (email or phone) is required' } 
      });
      expect(validateContactMethods(null, null)).toEqual({ 
        valid: false, 
        errors: { contact: 'At least one contact method (email or phone) is required' } 
      });
      expect(validateContactMethods('', '')).toEqual({ 
        valid: false, 
        errors: { contact: 'At least one contact method (email or phone) is required' } 
      });
    });
  });

  // sanitizeCustomerData tests
  describe('sanitizeCustomerData', () => {
    it('should trim string fields', () => {
      const data = {
        name: '  John Doe  ',
        email: ' test@example.com ',
        phone: ' 123-456-7890 ',
        address: {
          street: ' 123 Main St ',
          city: ' Anytown ',
          state: ' NY ',
          zip: ' 12345 '
        },
        notes: ' These are some notes ',
        status: CustomerStatus.ACTIVE
      };

      const sanitized = sanitizeCustomerData(data);
      expect(sanitized).toEqual({
        name: 'John Doe',
        email: 'test@example.com',
        phone: '123-456-7890',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          zip: '12345'
        },
        notes: 'These are some notes',
        status: CustomerStatus.ACTIVE
      });
    });

    it('should handle missing fields', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        status: CustomerStatus.ACTIVE
      };

      const sanitized = sanitizeCustomerData(data);
      expect(sanitized).toEqual({
        name: 'John Doe',
        email: 'test@example.com',
        status: CustomerStatus.ACTIVE
      });
    });

    it('should handle partial address', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        address: {
          street: '123 Main St',
          city: 'Anytown'
        },
        status: CustomerStatus.ACTIVE
      };

      const sanitized = sanitizeCustomerData(data);
      expect(sanitized).toEqual({
        name: 'John Doe',
        email: 'test@example.com',
        address: {
          street: '123 Main St',
          city: 'Anytown'
        },
        status: CustomerStatus.ACTIVE
      });
    });
  });

  // validateCreateCustomer tests
  describe('validateCreateCustomer', () => {
    it('should pass for valid customer creation data', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '123-456-7890',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          zip: '12345'
        },
        status: CustomerStatus.ACTIVE,
        notes: 'These are some notes'
      };

      expect(validateCreateCustomer(data)).toEqual({ valid: true });
    });

    it('should pass for minimal valid customer creation data', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        status: CustomerStatus.ACTIVE
      };

      expect(validateCreateCustomer(data)).toEqual({ valid: true });
    });

    it('should pass when phone is provided instead of email', () => {
      const data = {
        name: 'John Doe',
        phone: '123-456-7890',
        status: CustomerStatus.ACTIVE
      };

      expect(validateCreateCustomer(data)).toEqual({ valid: true });
    });

    it('should fail for non-object data', () => {
      expect(validateCreateCustomer('not-an-object' as any)).toEqual({ 
        valid: false, 
        errors: { data: 'Customer data must be an object' } 
      });
      expect(validateCreateCustomer(null)).toEqual({ 
        valid: false, 
        errors: { data: 'Customer data must be an object' } 
      });
      expect(validateCreateCustomer(undefined)).toEqual({ 
        valid: false, 
        errors: { data: 'Customer data must be an object' } 
      });
    });

    it('should fail for missing required fields', () => {
      const missingName = {
        email: 'test@example.com',
        status: CustomerStatus.ACTIVE
      };
      expect(validateCreateCustomer(missingName)).toEqual({ 
        valid: false, 
        errors: { name: 'Name is required' } 
      });

      const missingEmail = {
        name: 'John Doe',
        status: CustomerStatus.ACTIVE
      };
      // Since we've modified the validation to allow phone instead of email,
      // we need to check for the contact error message
      const result = validateCreateCustomer(missingEmail);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveProperty('contact');
      expect(result.errors?.contact).toBe('At least one contact method (email or phone) is required');

      const missingStatus = {
        name: 'John Doe',
        email: 'test@example.com'
      };
      expect(validateCreateCustomer(missingStatus)).toEqual({ 
        valid: false, 
        errors: { status: 'Status is required' } 
      });
    });

    it('should fail for missing contact methods', () => {
      const missingContacts = {
        name: 'John Doe',
        status: CustomerStatus.ACTIVE
      };
      // Since we've modified the validation to check for contact methods,
      // we need to check for the contact error message
      const result = validateCreateCustomer(missingContacts);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveProperty('contact');
      expect(result.errors?.contact).toBe('At least one contact method (email or phone) is required');
    });

    it('should fail when individual field validations fail', () => {
      const invalidData = {
        name: 'John Doe!', // Invalid name
        email: 'not-an-email', // Invalid email
        phone: 'not-a-phone', // Invalid phone
        address: {
          street: 123, // Invalid street
          city: 'Anytown',
          state: 'NY',
          zip: 'invalid-zip' // Invalid zip
        },
        status: 'INVALID_STATUS', // Invalid status
        notes: 'A'.repeat(1001) // Notes too long
      };

      const result = validateCreateCustomer(invalidData as any);
      expect(result.valid).toBe(false);
      
      // Check for individual error messages
      if (result.errors) {
        expect(result.errors.name).toBeDefined();
        expect(result.errors.email).toBeDefined();
        expect(result.errors.phone).toBeDefined();
        expect(result.errors['address.street']).toBeDefined();
        expect(result.errors['address.zip']).toBeDefined();
        expect(result.errors.status).toBeDefined();
        expect(result.errors.notes).toBeDefined();
      }
    });
  });

  // validateUpdateCustomer tests
  describe('validateUpdateCustomer', () => {
    it('should pass for valid update data', () => {
      const data = {
        name: 'John Doe',
        email: 'test@example.com',
        phone: '123-456-7890',
        status: CustomerStatus.ACTIVE
      };

      expect(validateUpdateCustomer(data)).toEqual({ valid: true });
    });

    it('should pass for partial update data', () => {
      expect(validateUpdateCustomer({ name: 'John Doe' })).toEqual({ valid: true });
      expect(validateUpdateCustomer({ email: 'test@example.com' })).toEqual({ valid: true });
      expect(validateUpdateCustomer({ phone: '123-456-7890' })).toEqual({ valid: true });
      expect(validateUpdateCustomer({ status: CustomerStatus.ACTIVE })).toEqual({ valid: true });
      expect(validateUpdateCustomer({ notes: 'New notes' })).toEqual({ valid: true });
      expect(validateUpdateCustomer({ 
        address: { street: '123 Main St' } 
      })).toEqual({ valid: true });
    });

    it('should fail for non-object data', () => {
      expect(validateUpdateCustomer('not-an-object' as any)).toEqual({ 
        valid: false, 
        errors: { data: 'Customer data must be an object' } 
      });
      expect(validateUpdateCustomer(null)).toEqual({ 
        valid: false, 
        errors: { data: 'Customer data must be an object' } 
      });
      expect(validateUpdateCustomer(undefined)).toEqual({ 
        valid: false, 
        errors: { data: 'Customer data must be an object' } 
      });
    });

    it('should fail for empty update data', () => {
      expect(validateUpdateCustomer({})).toEqual({ 
        valid: false, 
        errors: { data: 'At least one field must be provided for update' } 
      });
    });

    it('should fail when individual field validations fail', () => {
      const invalidData = {
        name: 'John Doe!', // Invalid name
        email: 'not-an-email', // Invalid email
        phone: 'not-a-phone', // Invalid phone
      };

      const result = validateUpdateCustomer(invalidData as any);
      expect(result.valid).toBe(false);
      
      // Check for individual error messages
      if (result.errors) {
        expect(result.errors.name).toBeDefined();
        expect(result.errors.email).toBeDefined();
        expect(result.errors.phone).toBeDefined();
      }
    });

    it('should fail when both email and phone are invalid', () => {
      const invalidContacts = {
        email: '',
        phone: ''
      };
      expect(validateUpdateCustomer(invalidContacts)).toEqual({ 
        valid: false, 
        errors: { 
          email: 'Email cannot be empty',
          contact: 'At least one contact method (email or phone) is required'
        } 
      });
    });
  });
});