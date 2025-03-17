/**
 * Customer API Validation Schemas
 * Defines validation rules for customer API requests
 */
import Joi from 'joi';
import { objectIdSchema, paginationSchema } from './common.validator';

// Address schema
const addressSchema = Joi.object({
  street: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.base': 'Street address must be a string',
      'string.empty': 'Street address is required',
      'string.min': 'Street address must be at least {#limit} characters',
      'string.max': 'Street address cannot exceed {#limit} characters',
      'any.required': 'Street address is required'
    }),
    
  city: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.base': 'City must be a string',
      'string.empty': 'City is required',
      'string.min': 'City must be at least {#limit} characters',
      'string.max': 'City cannot exceed {#limit} characters',
      'any.required': 'City is required'
    }),
    
  state: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.base': 'State/Province must be a string',
      'string.empty': 'State/Province is required',
      'string.min': 'State/Province must be at least {#limit} characters',
      'string.max': 'State/Province cannot exceed {#limit} characters',
      'any.required': 'State/Province is required'
    }),
    
  postalCode: Joi.string().trim().pattern(/^[A-Za-z0-9\s-]{3,10}$/).required()
    .messages({
      'string.base': 'Postal code must be a string',
      'string.empty': 'Postal code is required',
      'string.pattern.base': 'Postal code must be a valid format (3-10 alphanumeric characters)',
      'any.required': 'Postal code is required'
    }),
    
  country: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.base': 'Country must be a string',
      'string.empty': 'Country is required',
      'string.min': 'Country must be at least {#limit} characters',
      'string.max': 'Country cannot exceed {#limit} characters',
      'any.required': 'Country is required'
    }),
});

// Emergency contact schema
const emergencyContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Emergency contact name must be a string',
      'string.empty': 'Emergency contact name is required',
      'string.min': 'Emergency contact name must be at least {#limit} characters',
      'string.max': 'Emergency contact name cannot exceed {#limit} characters',
      'any.required': 'Emergency contact name is required'
    }),
    
  phone: Joi.string().trim().pattern(/^[\d\s\(\)\-\+]{7,20}$/).required()
    .messages({
      'string.base': 'Emergency contact phone must be a string',
      'string.empty': 'Emergency contact phone is required',
      'string.pattern.base': 'Emergency contact phone must be a valid format',
      'any.required': 'Emergency contact phone is required'
    }),
    
  relationship: Joi.string().valid('family', 'spouse', 'partner', 'friend', 'colleague', 'other').required()
    .messages({
      'string.base': 'Relationship must be a string',
      'any.only': 'Relationship must be one of: family, spouse, partner, friend, colleague, other',
      'any.required': 'Relationship is required'
    }),
});

// Notification preferences schema
const notificationPreferencesSchema = Joi.object({
  email: Joi.boolean().default(true),
  sms: Joi.boolean().default(false),
  push: Joi.boolean().default(false),
});

// Preferences schema
const preferencesSchema = Joi.object({
  bikeTypes: Joi.array().items(
    Joi.string().valid('mountain', 'road', 'hybrid', 'electric', 'city', 'kids')
  ).default([])
    .messages({
      'array.base': 'Bike types must be an array',
      'any.only': 'Each bike type must be one of: mountain, road, hybrid, electric, city, kids'
    }),
    
  bikeSize: Joi.string().valid('xs', 's', 'm', 'l', 'xl')
    .messages({
      'string.base': 'Bike size must be a string',
      'any.only': 'Bike size must be one of: xs, s, m, l, xl'
    }),
    
  notificationPreferences: notificationPreferencesSchema.default({
    email: true,
    sms: false,
    push: false,
  }),
  
  preferredPickupStations: Joi.array().items(objectIdSchema).default([]),
  
  preferredRentalDuration: Joi.string().valid('hourly', 'daily', 'weekly')
    .messages({
      'string.base': 'Preferred rental duration must be a string',
      'any.only': 'Preferred rental duration must be one of: hourly, daily, weekly'
    }),
});

// Payment method schema
const paymentMethodSchema = Joi.object({
  type: Joi.string().valid('credit', 'debit', 'paypal', 'applepay', 'googlepay', 'other').required()
    .messages({
      'string.base': 'Payment method type must be a string',
      'any.only': 'Payment method type must be one of: credit, debit, paypal, applepay, googlepay, other',
      'any.required': 'Payment method type is required'
    }),
    
  lastFour: Joi.string().pattern(/^\d{4}$/).required()
    .messages({
      'string.base': 'Last four digits must be a string',
      'string.pattern.base': 'Last four digits must be exactly 4 digits',
      'any.required': 'Last four digits are required'
    }),
    
  expiryDate: Joi.string().pattern(/^\d{2}\/\d{2}$/).required()
    .messages({
      'string.base': 'Expiry date must be a string',
      'string.pattern.base': 'Expiry date must be in format MM/YY',
      'any.required': 'Expiry date is required'
    }),
    
  cardholderName: Joi.string().trim().min(2).max(100)
    .messages({
      'string.base': 'Cardholder name must be a string',
      'string.min': 'Cardholder name must be at least {#limit} characters',
      'string.max': 'Cardholder name cannot exceed {#limit} characters'
    }),
    
  billingAddress: Joi.string().trim(),
  
  isDefault: Joi.boolean().default(false),
  
  nickname: Joi.string().trim().max(50)
    .messages({
      'string.base': 'Nickname must be a string',
      'string.max': 'Nickname cannot exceed {#limit} characters'
    }),
});

// Identification document schema
const identificationDocumentSchema = Joi.object({
  type: Joi.string().valid('passport', 'drivers_license', 'national_id', 'other').required()
    .messages({
      'string.base': 'Document type must be a string',
      'any.only': 'Document type must be one of: passport, drivers_license, national_id, other',
      'any.required': 'Document type is required'
    }),
    
  documentNumber: Joi.string().trim(),
  
  expiryDate: Joi.date().iso()
    .messages({
      'date.base': 'Expiry date must be a valid date',
      'date.format': 'Expiry date must be in ISO format (YYYY-MM-DD)'
    }),
    
  isVerified: Joi.boolean().default(false),
});

// Validation for creating a new customer
export const createCustomerSchema = Joi.object({
  userId: objectIdSchema.required()
    .messages({
      'any.required': 'User ID is required'
    }),
    
  phone: Joi.string().trim().pattern(/^[\d\s\(\)\-\+]{7,20}$/).required()
    .messages({
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be a valid format',
      'any.required': 'Phone number is required'
    }),
    
  address: addressSchema,
  
  dateOfBirth: Joi.date().iso().max('now').min('1900-01-01')
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD)',
      'date.max': 'Date of birth cannot be in the future',
      'date.min': 'Date of birth must be after 1900-01-01'
    }),
    
  emergencyContact: emergencyContactSchema,
  
  preferences: preferencesSchema,
  
  paymentMethods: Joi.array().items(paymentMethodSchema).default([]),
  
  verificationStatus: Joi.string().valid('unverified', 'pending', 'verified', 'rejected').default('unverified')
    .messages({
      'string.base': 'Verification status must be a string',
      'any.only': 'Verification status must be one of: unverified, pending, verified, rejected'
    }),
    
  identificationDocuments: Joi.array().items(identificationDocumentSchema).default([]),
  
  notes: Joi.string().trim().max(1000)
    .messages({
      'string.base': 'Notes must be a string',
      'string.max': 'Notes cannot exceed {#limit} characters'
    }),
    
  referredBy: objectIdSchema,
});

// Validation for updating a customer
export const updateCustomerSchema = Joi.object({
  phone: Joi.string().trim().pattern(/^[\d\s\(\)\-\+]{7,20}$/)
    .messages({
      'string.base': 'Phone number must be a string',
      'string.pattern.base': 'Phone number must be a valid format'
    }),
    
  address: addressSchema,
  
  dateOfBirth: Joi.date().iso().max('now').min('1900-01-01')
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'date.format': 'Date of birth must be in ISO format (YYYY-MM-DD)',
      'date.max': 'Date of birth cannot be in the future',
      'date.min': 'Date of birth must be after 1900-01-01'
    }),
    
  emergencyContact: emergencyContactSchema,
  
  preferences: preferencesSchema,
  
  notes: Joi.string().trim().max(1000)
    .messages({
      'string.base': 'Notes must be a string',
      'string.max': 'Notes cannot exceed {#limit} characters'
    }),
    
  referredBy: objectIdSchema,
})
.min(1) // At least one field must be provided
.messages({
  'object.min': 'At least one field is required for update'
});

// Validation for adding loyalty points
export const loyaltyPointsSchema = Joi.object({
  points: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Points must be a number',
      'number.integer': 'Points must be a whole number',
      'number.positive': 'Points must be positive',
      'any.required': 'Points are required'
    }),
    
  reason: Joi.string().trim().max(200)
    .messages({
      'string.base': 'Reason must be a string',
      'string.max': 'Reason cannot exceed {#limit} characters'
    }),
});

// Validation for adding a payment method
export const addPaymentMethodSchema = Joi.object({
  paymentMethod: paymentMethodSchema.required()
    .messages({
      'any.required': 'Payment method is required'
    }),
    
  setAsDefault: Joi.boolean().default(false),
});

// Validation for verification status update
export const verificationStatusSchema = Joi.object({
  status: Joi.string().valid('unverified', 'pending', 'verified', 'rejected').required()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: unverified, pending, verified, rejected',
      'any.required': 'Status is required'
    }),
    
  note: Joi.string().trim().max(500)
    .messages({
      'string.base': 'Note must be a string',
      'string.max': 'Note cannot exceed {#limit} characters'
    }),
});

// Validation for preferences update
export const updatePreferencesSchema = Joi.object({
  bikeTypes: Joi.array().items(
    Joi.string().valid('mountain', 'road', 'hybrid', 'electric', 'city', 'kids')
  )
    .messages({
      'array.base': 'Bike types must be an array',
      'any.only': 'Each bike type must be one of: mountain, road, hybrid, electric, city, kids'
    }),
    
  bikeSize: Joi.string().valid('xs', 's', 'm', 'l', 'xl')
    .messages({
      'string.base': 'Bike size must be a string',
      'any.only': 'Bike size must be one of: xs, s, m, l, xl'
    }),
    
  notificationPreferences: notificationPreferencesSchema,
  
  preferredPickupStations: Joi.array().items(objectIdSchema),
  
  preferredRentalDuration: Joi.string().valid('hourly', 'daily', 'weekly')
    .messages({
      'string.base': 'Preferred rental duration must be a string',
      'any.only': 'Preferred rental duration must be one of: hourly, daily, weekly'
    }),
})
.min(1) // At least one field must be provided
.messages({
  'object.min': 'At least one preference is required for update'
});

// Validation for customer list query parameters
export const getCustomersQuerySchema = Joi.object({
  ...paginationSchema,
  
  sort: Joi.string().pattern(/^[a-zA-Z0-9_\-.]+:(asc|desc)(,[a-zA-Z0-9_\-.]+:(asc|desc))*$/)
    .messages({
      'string.base': 'Sort must be a string',
      'string.pattern.base': 'Sort must be in format field:asc or field:desc (comma-separated for multiple)'
    }),
    
  minLoyaltyPoints: Joi.number().integer().min(0)
    .messages({
      'number.base': 'Minimum loyalty points must be a number',
      'number.integer': 'Minimum loyalty points must be a whole number',
      'number.min': 'Minimum loyalty points cannot be negative'
    }),
    
  maxLoyaltyPoints: Joi.number().integer().min(0)
    .messages({
      'number.base': 'Maximum loyalty points must be a number',
      'number.integer': 'Maximum loyalty points must be a whole number',
      'number.min': 'Maximum loyalty points cannot be negative'
    }),
    
  verificationStatus: Joi.alternatives().try(
    Joi.string().valid('unverified', 'pending', 'verified', 'rejected'),
    Joi.string().pattern(/^(unverified|pending|verified|rejected)(,(unverified|pending|verified|rejected))*$/)
  )
    .messages({
      'alternatives.types': 'Verification status must be a valid status or comma-separated list of statuses'
    }),
    
  bikeTypes: Joi.alternatives().try(
    Joi.string().valid('mountain', 'road', 'hybrid', 'electric', 'city', 'kids'),
    Joi.string().pattern(/^(mountain|road|hybrid|electric|city|kids)(,(mountain|road|hybrid|electric|city|kids))*$/)
  )
    .messages({
      'alternatives.types': 'Bike types must be a valid type or comma-separated list of types'
    }),
    
  bikeSize: Joi.string().valid('xs', 's', 'm', 'l', 'xl')
    .messages({
      'string.base': 'Bike size must be a string',
      'any.only': 'Bike size must be one of: xs, s, m, l, xl'
    }),
    
  search: Joi.string().trim().min(2).max(100)
    .messages({
      'string.base': 'Search must be a string',
      'string.min': 'Search must be at least {#limit} characters',
      'string.max': 'Search cannot exceed {#limit} characters'
    }),
    
  phone: Joi.string().trim()
    .messages({
      'string.base': 'Phone must be a string'
    }),
    
  postalCode: Joi.string().trim()
    .messages({
      'string.base': 'Postal code must be a string'
    }),
    
  city: Joi.string().trim()
    .messages({
      'string.base': 'City must be a string'
    }),
    
  country: Joi.string().trim()
    .messages({
      'string.base': 'Country must be a string'
    }),
    
  hasPendingVerification: Joi.boolean()
    .messages({
      'boolean.base': 'Has pending verification must be a boolean'
    }),
});