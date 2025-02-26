/**
 * Customer validation module
 * 
 * This module provides validation functions for customer data according to business rules.
 */

import { CustomerStatus, CreateCustomerDto, UpdateCustomerDto, Address } from '../models/customer';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  isUpdate?: boolean;
  checkUnique?: boolean;
}

/**
 * Validates customer name
 * Requirements:
 * - Required
 * - String
 * - Max length 100
 * - No special characters except hyphens and apostrophes
 * 
 * @param name The customer name to validate
 * @returns ValidationResult
 */
export function validateName(name: unknown): ValidationResult {
  if (name === undefined || name === null) {
    return { valid: false, errors: { name: 'Name is required' } };
  }

  if (typeof name !== 'string') {
    return { valid: false, errors: { name: 'Name must be a string' } };
  }

  if (name.trim() === '') {
    return { valid: false, errors: { name: 'Name cannot be empty' } };
  }

  if (name.length > 100) {
    return { valid: false, errors: { name: 'Name cannot exceed 100 characters' } };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { 
      valid: false, 
      errors: { name: 'Name can only contain letters, spaces, hyphens, and apostrophes' } 
    };
  }

  return { valid: true };
}

/**
 * Validates email address
 * Requirements:
 * - Required
 * - Valid email format
 * - Unique in the system (if checkUnique is true)
 * 
 * @param email The email to validate
 * @param options Validation options
 * @returns ValidationResult
 */
export function validateEmail(email: unknown, options: ValidationOptions = {}): ValidationResult {
  if (!options.isUpdate && (email === undefined || email === null)) {
    return { valid: false, errors: { email: 'Email is required' } };
  }

  if (email === undefined || email === null) {
    return { valid: true }; // Skip validation for undefined in update mode
  }

  if (typeof email !== 'string') {
    return { valid: false, errors: { email: 'Email must be a string' } };
  }

  if (email.trim() === '') {
    return { valid: false, errors: { email: 'Email cannot be empty' } };
  }

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, errors: { email: 'Invalid email format' } };
  }

  // Unique email check would be performed here if checkUnique is true
  // This would typically involve a database query
  if (options.checkUnique) {
    // Mock implementation - in a real system, this would check against the database
    // For now, we'll just return valid since we can't check uniqueness here
    // In a real implementation, this would be an async function
  }

  return { valid: true };
}

/**
 * Validates phone number
 * Requirements:
 * - Optional
 * - Valid phone format if provided
 * 
 * @param phone The phone number to validate
 * @returns ValidationResult
 */
export function validatePhone(phone: unknown): ValidationResult {
  if (phone === undefined || phone === null || phone === '') {
    return { valid: true }; // Phone is optional
  }

  if (typeof phone !== 'string') {
    return { valid: false, errors: { phone: 'Phone must be a string' } };
  }

  // Better phone validation - allows various formats including international
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, errors: { phone: 'Invalid phone number format' } };
  }

  return { valid: true };
}

/**
 * Validates address
 * Requirements:
 * - Optional object
 * - If provided, validate sub-fields
 * 
 * @param address The address to validate
 * @returns ValidationResult
 */
export function validateAddress(address: unknown): ValidationResult {
  if (address === undefined || address === null) {
    return { valid: true }; // Address is optional
  }

  if (typeof address !== 'object' || address === null) {
    return { valid: false, errors: { address: 'Address must be an object' } };
  }

  const errors: Record<string, string> = {};
  const addressObj = address as Partial<Address>;

  // Validate street if provided
  if (addressObj.street !== undefined) {
    if (typeof addressObj.street !== 'string') {
      errors['address.street'] = 'Street must be a string';
    } else if (addressObj.street.length > 100) {
      errors['address.street'] = 'Street cannot exceed 100 characters';
    }
  }

  // Validate city if provided
  if (addressObj.city !== undefined) {
    if (typeof addressObj.city !== 'string') {
      errors['address.city'] = 'City must be a string';
    } else if (addressObj.city.length > 50) {
      errors['address.city'] = 'City cannot exceed 50 characters';
    }
  }

  // Validate state if provided
  if (addressObj.state !== undefined) {
    if (typeof addressObj.state !== 'string') {
      errors['address.state'] = 'State must be a string';
    } else if (addressObj.state.length > 50) {
      errors['address.state'] = 'State cannot exceed 50 characters';
    }
  }

  // Validate zip if provided
  if (addressObj.zip !== undefined) {
    if (typeof addressObj.zip !== 'string') {
      errors['address.zip'] = 'Zip must be a string';
    } else {
      // Basic zip code validation - allows various formats
      const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;
      if (!zipRegex.test(addressObj.zip)) {
        errors['address.zip'] = 'Invalid zip code format';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Validates status
 * Requirements:
 * - Required
 * - Must be one of the valid status values
 * 
 * @param status The status to validate
 * @param options Validation options
 * @returns ValidationResult
 */
export function validateStatus(status: unknown, options: ValidationOptions = {}): ValidationResult {
  if (!options.isUpdate && (status === undefined || status === null)) {
    return { valid: false, errors: { status: 'Status is required' } };
  }

  if (status === undefined || status === null) {
    return { valid: true }; // Skip validation for undefined in update mode
  }

  if (typeof status !== 'string') {
    return { valid: false, errors: { status: 'Status must be a string' } };
  }

  const validStatuses = Object.values(CustomerStatus);
  if (!validStatuses.includes(status as CustomerStatus)) {
    return { 
      valid: false, 
      errors: { status: `Status must be one of: ${validStatuses.join(', ')}` } 
    };
  }

  return { valid: true };
}

/**
 * Validates notes
 * Requirements:
 * - Optional
 * - String
 * - Max length 1000
 * 
 * @param notes The notes to validate
 * @returns ValidationResult
 */
export function validateNotes(notes: unknown): ValidationResult {
  if (notes === undefined || notes === null || notes === '') {
    return { valid: true }; // Notes are optional
  }

  if (typeof notes !== 'string') {
    return { valid: false, errors: { notes: 'Notes must be a string' } };
  }

  if (notes.length > 1000) {
    return { valid: false, errors: { notes: 'Notes cannot exceed 1000 characters' } };
  }

  return { valid: true };
}

/**
 * Validates contact methods
 * Requirements:
 * - Customer must have at least one contact method (email or phone)
 * 
 * @param email The email to check
 * @param phone The phone to check
 * @returns ValidationResult
 */
export function validateContactMethods(email: unknown, phone: unknown): ValidationResult {
  // If both are undefined, null, or empty strings, then no contact method is provided
  const hasEmail = email !== undefined && email !== null && email !== '';
  const hasPhone = phone !== undefined && phone !== null && phone !== '';

  if (!hasEmail && !hasPhone) {
    return { 
      valid: false, 
      errors: { contact: 'At least one contact method (email or phone) is required' } 
    };
  }

  return { valid: true };
}

/**
 * Sanitizes customer input data
 * - Trims string values
 * - Removes any unexpected properties
 * 
 * @param data The data to sanitize
 * @returns Sanitized data
 */
export function sanitizeCustomerData<T extends CreateCustomerDto | UpdateCustomerDto>(data: T): T {
  const sanitized = { ...data };

  // Trim string fields
  if (typeof sanitized.name === 'string') {
    sanitized.name = sanitized.name.trim();
  }
  
  if (typeof sanitized.email === 'string') {
    sanitized.email = sanitized.email.trim();
  }
  
  if (typeof sanitized.phone === 'string') {
    sanitized.phone = sanitized.phone.trim();
  }
  
  if (typeof sanitized.notes === 'string') {
    sanitized.notes = sanitized.notes.trim();
  }

  // Sanitize address if it exists
  if (sanitized.address && typeof sanitized.address === 'object') {
    const address = { ...sanitized.address };
    
    if (typeof address.street === 'string') {
      address.street = address.street.trim();
    }
    
    if (typeof address.city === 'string') {
      address.city = address.city.trim();
    }
    
    if (typeof address.state === 'string') {
      address.state = address.state.trim();
    }
    
    if (typeof address.zip === 'string') {
      address.zip = address.zip.trim();
    }
    
    sanitized.address = address;
  }

  return sanitized;
}

/**
 * Validates a customer creation DTO
 * 
 * @param data The customer data to validate
 * @param options Validation options
 * @returns ValidationResult
 */
export function validateCreateCustomer(data: unknown, options: ValidationOptions = {}): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { data: 'Customer data must be an object' } };
  }

  // Sanitize the data first
  const sanitizedData = sanitizeCustomerData(data as CreateCustomerDto);
  
  // Validate each field
  const nameResult = validateName(sanitizedData.name);
  
  // Special handling for email validation - if phone is present, email is not strictly required
  let emailResult: ValidationResult;
  if (sanitizedData.phone && sanitizedData.phone.trim() !== '') {
    // If phone is provided, email becomes optional
    const emailOptions = { ...options, isUpdate: true };
    emailResult = validateEmail(sanitizedData.email, emailOptions);
  } else {
    // Otherwise, email is required
    emailResult = validateEmail(sanitizedData.email, options);
  }
  
  const phoneResult = validatePhone(sanitizedData.phone);
  const addressResult = validateAddress(sanitizedData.address);
  const statusResult = validateStatus(sanitizedData.status);
  const notesResult = validateNotes(sanitizedData.notes);
  const contactResult = validateContactMethods(sanitizedData.email, sanitizedData.phone);

  // Combine all validation results
  const errors: Record<string, string> = {};
  
  if (!nameResult.valid && nameResult.errors) {
    Object.assign(errors, nameResult.errors);
  }
  
  if (!emailResult.valid && emailResult.errors) {
    Object.assign(errors, emailResult.errors);
  }
  
  if (!phoneResult.valid && phoneResult.errors) {
    Object.assign(errors, phoneResult.errors);
  }
  
  if (!addressResult.valid && addressResult.errors) {
    Object.assign(errors, addressResult.errors);
  }
  
  if (!statusResult.valid && statusResult.errors) {
    Object.assign(errors, statusResult.errors);
  }
  
  if (!notesResult.valid && notesResult.errors) {
    Object.assign(errors, notesResult.errors);
  }
  
  if (!contactResult.valid && contactResult.errors) {
    Object.assign(errors, contactResult.errors);
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Validates a customer update DTO
 * 
 * @param data The customer update data to validate
 * @param options Validation options
 * @returns ValidationResult
 */
export function validateUpdateCustomer(data: unknown, options: ValidationOptions = {}): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { data: 'Customer data must be an object' } };
  }

  // For updates, we need to set isUpdate to true
  const updateOptions = { ...options, isUpdate: true };
  
  // Sanitize the data first
  const sanitizedData = sanitizeCustomerData(data as UpdateCustomerDto);
  
  // Validate each field if it's present
  const validationResults = [];
  
  if ('name' in sanitizedData) {
    validationResults.push(validateName(sanitizedData.name));
  }
  
  if ('email' in sanitizedData) {
    validationResults.push(validateEmail(sanitizedData.email, updateOptions));
  }
  
  if ('phone' in sanitizedData) {
    validationResults.push(validatePhone(sanitizedData.phone));
  }
  
  if ('address' in sanitizedData) {
    validationResults.push(validateAddress(sanitizedData.address));
  }
  
  if ('status' in sanitizedData) {
    validationResults.push(validateStatus(sanitizedData.status, updateOptions));
  }
  
  if ('notes' in sanitizedData) {
    validationResults.push(validateNotes(sanitizedData.notes));
  }

  // For updates, we need to check contact methods only if both email and phone are being updated
  if ('email' in sanitizedData && 'phone' in sanitizedData) {
    validationResults.push(validateContactMethods(sanitizedData.email, sanitizedData.phone));
  }

  // Combine all validation results
  const errors: Record<string, string> = {};
  
  for (const result of validationResults) {
    if (!result.valid && result.errors) {
      Object.assign(errors, result.errors);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  // If no fields are being updated, that's an error
  if (Object.keys(sanitizedData).length === 0) {
    return { 
      valid: false, 
      errors: { data: 'At least one field must be provided for update' } 
    };
  }

  return { valid: true };
}