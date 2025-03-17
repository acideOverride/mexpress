/**
 * Bike API Validation Schemas
 * Defines validation rules for bike API requests
 */
import Joi from 'joi';
import { BikeType, BikeSize, BikeStatus } from '../../../shared/types/models';
import { objectIdSchema, paginationSchema } from './common.validator';

// Validation for creating a new bike
export const createBikeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name cannot exceed {#limit} characters',
      'any.required': 'Name is required'
    }),
  
  type: Joi.string().valid(...Object.values(BikeType)).required()
    .messages({
      'string.base': 'Type must be a string',
      'any.only': 'Type must be one of: ' + Object.values(BikeType).join(', '),
      'any.required': 'Type is required'
    }),
  
  size: Joi.string().valid(...Object.values(BikeSize)).required()
    .messages({
      'string.base': 'Size must be a string',
      'any.only': 'Size must be one of: ' + Object.values(BikeSize).join(', '),
      'any.required': 'Size is required'
    }),
  
  modelYear: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required()
    .messages({
      'number.base': 'Model year must be a number',
      'number.integer': 'Model year must be a whole number',
      'number.min': 'Model year must be {#limit} or later',
      'number.max': 'Model year cannot exceed {#limit}',
      'any.required': 'Model year is required'
    }),
  
  color: Joi.string().trim().min(2).max(30).required()
    .messages({
      'string.base': 'Color must be a string',
      'string.empty': 'Color is required',
      'string.min': 'Color must be at least {#limit} characters',
      'string.max': 'Color cannot exceed {#limit} characters',
      'any.required': 'Color is required'
    }),
  
  description: Joi.string().trim().min(10).max(1000).required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least {#limit} characters',
      'string.max': 'Description cannot exceed {#limit} characters',
      'any.required': 'Description is required'
    }),
  
  frameNumber: Joi.string().trim().min(5).max(50).pattern(/^[A-Za-z0-9-]+$/).required()
    .messages({
      'string.base': 'Frame number must be a string',
      'string.empty': 'Frame number is required',
      'string.min': 'Frame number must be at least {#limit} characters',
      'string.max': 'Frame number cannot exceed {#limit} characters',
      'string.pattern.base': 'Frame number must contain only alphanumeric characters and hyphens',
      'any.required': 'Frame number is required'
    }),
  
  features: Joi.array().items(
    Joi.string().trim().min(2).max(50)
      .messages({
        'string.base': 'Feature must be a string',
        'string.min': 'Feature must be at least {#limit} characters',
        'string.max': 'Feature cannot exceed {#limit} characters'
      })
  ).default([]),
  
  specifications: Joi.object({
    weight: Joi.number().min(0).max(100)
      .messages({
        'number.base': 'Weight must be a number',
        'number.min': 'Weight cannot be negative',
        'number.max': 'Weight cannot exceed {#limit} kg'
      }),
    
    frameType: Joi.string().valid('aluminum', 'carbon fiber', 'steel', 'titanium', 'composite')
      .messages({
        'string.base': 'Frame type must be a string',
        'any.only': 'Frame type must be one of: aluminum, carbon fiber, steel, titanium, composite'
      }),
    
    suspension: Joi.string().valid('none', 'front', 'full', 'micro', 'air')
      .messages({
        'string.base': 'Suspension must be a string',
        'any.only': 'Suspension must be one of: none, front, full, micro, air'
      }),
    
    gears: Joi.number().integer().min(0).max(33)
      .valid(0, 1, 3, 6, 7, 8, 9, 10, 11, 12, 14, 18, 21, 24, 27, 30, 33)
      .messages({
        'number.base': 'Gears must be a number',
        'number.integer': 'Gears must be a whole number',
        'number.min': 'Gears cannot be negative',
        'number.max': 'Gears cannot exceed {#limit}',
        'any.only': 'Gears must be one of standard gear configurations'
      }),
    
    brakeType: Joi.string().valid('rim', 'disc-mechanical', 'disc-hydraulic', 'drum', 'coaster')
      .messages({
        'string.base': 'Brake type must be a string',
        'any.only': 'Brake type must be one of: rim, disc-mechanical, disc-hydraulic, drum, coaster'
      }),
    
    wheelSize: Joi.number().min(0)
      .valid(12, 16, 20, 24, 26, 27.5, 29, 650/25.4, 700/25.4)
      .messages({
        'number.base': 'Wheel size must be a number',
        'number.min': 'Wheel size cannot be negative',
        'any.only': 'Wheel size must be one of standard wheel sizes'
      }),
    
    electricRange: Joi.number().min(0).max(200)
      .messages({
        'number.base': 'Electric range must be a number',
        'number.min': 'Electric range cannot be negative',
        'number.max': 'Electric range cannot exceed {#limit} km'
      }),
  }).default({}),
  
  dailyRate: Joi.number().precision(2).min(0).max(1000).required()
    .messages({
      'number.base': 'Daily rate must be a number',
      'number.min': 'Daily rate cannot be negative',
      'number.max': 'Daily rate cannot exceed {#limit}',
      'number.precision': 'Daily rate cannot have more than 2 decimal places',
      'any.required': 'Daily rate is required'
    }),
  
  hourlyRate: Joi.number().precision(2).min(0).max(100).required()
    .messages({
      'number.base': 'Hourly rate must be a number',
      'number.min': 'Hourly rate cannot be negative',
      'number.max': 'Hourly rate cannot exceed {#limit}',
      'number.precision': 'Hourly rate cannot have more than 2 decimal places',
      'any.required': 'Hourly rate is required'
    }),
  
  weeklyRate: Joi.number().precision(2).min(0).max(5000).required()
    .messages({
      'number.base': 'Weekly rate must be a number',
      'number.min': 'Weekly rate cannot be negative',
      'number.max': 'Weekly rate cannot exceed {#limit}',
      'number.precision': 'Weekly rate cannot have more than 2 decimal places',
      'any.required': 'Weekly rate is required'
    }),
  
  condition: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'needs_repair').required()
    .messages({
      'string.base': 'Condition must be a string',
      'any.only': 'Condition must be one of: excellent, good, fair, poor, needs_repair',
      'any.required': 'Condition is required'
    }),
  
  currentLocation: objectIdSchema.required()
    .messages({
      'string.base': 'Current location must be a string',
      'any.required': 'Current location is required',
      'any.invalid': 'Current location must be a valid ID'
    }),
  
  imageUrls: Joi.array().items(
    Joi.string().uri()
      .messages({
        'string.base': 'Image URL must be a string',
        'string.uri': 'Image URL must be a valid URI'
      })
  ).default([]),
  
  purchaseDate: Joi.date().max('now')
    .messages({
      'date.base': 'Purchase date must be a valid date',
      'date.max': 'Purchase date cannot be in the future'
    }),
  
  purchasePrice: Joi.number().precision(2).min(0).max(50000)
    .messages({
      'number.base': 'Purchase price must be a number',
      'number.min': 'Purchase price cannot be negative',
      'number.max': 'Purchase price cannot exceed {#limit}',
      'number.precision': 'Purchase price cannot have more than 2 decimal places'
    }),
  
  mileage: Joi.number().precision(1).min(0).max(100000).default(0)
    .messages({
      'number.base': 'Mileage must be a number',
      'number.min': 'Mileage cannot be negative',
      'number.max': 'Mileage cannot exceed {#limit}',
      'number.precision': 'Mileage cannot have more than 1 decimal place'
    }),
});

// Validation for updating an existing bike
export const updateBikeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100)
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name cannot exceed {#limit} characters'
    }),
  
  type: Joi.string().valid(...Object.values(BikeType))
    .messages({
      'string.base': 'Type must be a string',
      'any.only': 'Type must be one of: ' + Object.values(BikeType).join(', ')
    }),
  
  size: Joi.string().valid(...Object.values(BikeSize))
    .messages({
      'string.base': 'Size must be a string',
      'any.only': 'Size must be one of: ' + Object.values(BikeSize).join(', ')
    }),
  
  modelYear: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1)
    .messages({
      'number.base': 'Model year must be a number',
      'number.integer': 'Model year must be a whole number',
      'number.min': 'Model year must be {#limit} or later',
      'number.max': 'Model year cannot exceed {#limit}'
    }),
  
  color: Joi.string().trim().min(2).max(30)
    .messages({
      'string.base': 'Color must be a string',
      'string.min': 'Color must be at least {#limit} characters',
      'string.max': 'Color cannot exceed {#limit} characters'
    }),
  
  description: Joi.string().trim().min(10).max(1000)
    .messages({
      'string.base': 'Description must be a string',
      'string.min': 'Description must be at least {#limit} characters',
      'string.max': 'Description cannot exceed {#limit} characters'
    }),
  
  frameNumber: Joi.string().trim().min(5).max(50).pattern(/^[A-Za-z0-9-]+$/)
    .messages({
      'string.base': 'Frame number must be a string',
      'string.min': 'Frame number must be at least {#limit} characters',
      'string.max': 'Frame number cannot exceed {#limit} characters',
      'string.pattern.base': 'Frame number must contain only alphanumeric characters and hyphens'
    }),
  
  features: Joi.array().items(
    Joi.string().trim().min(2).max(50)
      .messages({
        'string.base': 'Feature must be a string',
        'string.min': 'Feature must be at least {#limit} characters',
        'string.max': 'Feature cannot exceed {#limit} characters'
      })
  ),
  
  specifications: Joi.object({
    weight: Joi.number().min(0).max(100)
      .messages({
        'number.base': 'Weight must be a number',
        'number.min': 'Weight cannot be negative',
        'number.max': 'Weight cannot exceed {#limit} kg'
      }),
    
    frameType: Joi.string().valid('aluminum', 'carbon fiber', 'steel', 'titanium', 'composite')
      .messages({
        'string.base': 'Frame type must be a string',
        'any.only': 'Frame type must be one of: aluminum, carbon fiber, steel, titanium, composite'
      }),
    
    suspension: Joi.string().valid('none', 'front', 'full', 'micro', 'air')
      .messages({
        'string.base': 'Suspension must be a string',
        'any.only': 'Suspension must be one of: none, front, full, micro, air'
      }),
    
    gears: Joi.number().integer().min(0).max(33)
      .valid(0, 1, 3, 6, 7, 8, 9, 10, 11, 12, 14, 18, 21, 24, 27, 30, 33)
      .messages({
        'number.base': 'Gears must be a number',
        'number.integer': 'Gears must be a whole number',
        'number.min': 'Gears cannot be negative',
        'number.max': 'Gears cannot exceed {#limit}',
        'any.only': 'Gears must be one of standard gear configurations'
      }),
    
    brakeType: Joi.string().valid('rim', 'disc-mechanical', 'disc-hydraulic', 'drum', 'coaster')
      .messages({
        'string.base': 'Brake type must be a string',
        'any.only': 'Brake type must be one of: rim, disc-mechanical, disc-hydraulic, drum, coaster'
      }),
    
    wheelSize: Joi.number().min(0)
      .valid(12, 16, 20, 24, 26, 27.5, 29, 650/25.4, 700/25.4)
      .messages({
        'number.base': 'Wheel size must be a number',
        'number.min': 'Wheel size cannot be negative',
        'any.only': 'Wheel size must be one of standard wheel sizes'
      }),
    
    electricRange: Joi.number().min(0).max(200)
      .messages({
        'number.base': 'Electric range must be a number',
        'number.min': 'Electric range cannot be negative',
        'number.max': 'Electric range cannot exceed {#limit} km'
      }),
  }),
  
  dailyRate: Joi.number().precision(2).min(0).max(1000)
    .messages({
      'number.base': 'Daily rate must be a number',
      'number.min': 'Daily rate cannot be negative',
      'number.max': 'Daily rate cannot exceed {#limit}',
      'number.precision': 'Daily rate cannot have more than 2 decimal places'
    }),
  
  hourlyRate: Joi.number().precision(2).min(0).max(100)
    .messages({
      'number.base': 'Hourly rate must be a number',
      'number.min': 'Hourly rate cannot be negative',
      'number.max': 'Hourly rate cannot exceed {#limit}',
      'number.precision': 'Hourly rate cannot have more than 2 decimal places'
    }),
  
  weeklyRate: Joi.number().precision(2).min(0).max(5000)
    .messages({
      'number.base': 'Weekly rate must be a number',
      'number.min': 'Weekly rate cannot be negative',
      'number.max': 'Weekly rate cannot exceed {#limit}',
      'number.precision': 'Weekly rate cannot have more than 2 decimal places'
    }),
  
  status: Joi.string().valid(...Object.values(BikeStatus))
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: ' + Object.values(BikeStatus).join(', ')
    }),
  
  condition: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'needs_repair')
    .messages({
      'string.base': 'Condition must be a string',
      'any.only': 'Condition must be one of: excellent, good, fair, poor, needs_repair'
    }),
  
  currentLocation: objectIdSchema
    .messages({
      'string.base': 'Current location must be a string',
      'any.invalid': 'Current location must be a valid ID'
    }),
  
  imageUrls: Joi.array().items(
    Joi.string().uri()
      .messages({
        'string.base': 'Image URL must be a string',
        'string.uri': 'Image URL must be a valid URI'
      })
  ),
  
  purchaseDate: Joi.date().max('now')
    .messages({
      'date.base': 'Purchase date must be a valid date',
      'date.max': 'Purchase date cannot be in the future'
    }),
  
  purchasePrice: Joi.number().precision(2).min(0).max(50000)
    .messages({
      'number.base': 'Purchase price must be a number',
      'number.min': 'Purchase price cannot be negative',
      'number.max': 'Purchase price cannot exceed {#limit}',
      'number.precision': 'Purchase price cannot have more than 2 decimal places'
    }),
  
  mileage: Joi.number().precision(1).min(0).max(100000)
    .messages({
      'number.base': 'Mileage must be a number',
      'number.min': 'Mileage cannot be negative',
      'number.max': 'Mileage cannot exceed {#limit}',
      'number.precision': 'Mileage cannot have more than 1 decimal place'
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Validation for bike query parameters
export const getBikesQuerySchema = Joi.object({
  ...paginationSchema.extract(['page', 'limit', 'sort']),
  
  type: Joi.alternatives().try(
    Joi.string().valid(...Object.values(BikeType)),
    Joi.array().items(Joi.string().valid(...Object.values(BikeType)))
  ).messages({
    'string.base': 'Type must be a string',
    'any.only': 'Type must be one of: ' + Object.values(BikeType).join(', ')
  }),
  
  size: Joi.alternatives().try(
    Joi.string().valid(...Object.values(BikeSize)),
    Joi.array().items(Joi.string().valid(...Object.values(BikeSize)))
  ).messages({
    'string.base': 'Size must be a string',
    'any.only': 'Size must be one of: ' + Object.values(BikeSize).join(', ')
  }),
  
  status: Joi.alternatives().try(
    Joi.string().valid(...Object.values(BikeStatus)),
    Joi.array().items(Joi.string().valid(...Object.values(BikeStatus)))
  ).messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be one of: ' + Object.values(BikeStatus).join(', ')
  }),
  
  condition: Joi.alternatives().try(
    Joi.string().valid('excellent', 'good', 'fair', 'poor', 'needs_repair'),
    Joi.array().items(Joi.string().valid('excellent', 'good', 'fair', 'poor', 'needs_repair'))
  ).messages({
    'string.base': 'Condition must be a string',
    'any.only': 'Condition must be one of: excellent, good, fair, poor, needs_repair'
  }),
  
  minDailyRate: Joi.number().min(0)
    .messages({
      'number.base': 'Minimum daily rate must be a number',
      'number.min': 'Minimum daily rate cannot be negative'
    }),
  
  maxDailyRate: Joi.number().min(0)
    .messages({
      'number.base': 'Maximum daily rate must be a number',
      'number.min': 'Maximum daily rate cannot be negative'
    }),
  
  location: objectIdSchema
    .messages({
      'string.base': 'Location must be a string',
      'any.invalid': 'Location must be a valid ID'
    }),
  
  search: Joi.string().trim().min(2).max(100)
    .messages({
      'string.base': 'Search query must be a string',
      'string.min': 'Search query must be at least {#limit} characters',
      'string.max': 'Search query cannot exceed {#limit} characters'
    }),
  
  minYear: Joi.number().integer().min(1900)
    .messages({
      'number.base': 'Minimum year must be a number',
      'number.integer': 'Minimum year must be a whole number',
      'number.min': 'Minimum year must be at least 1900'
    }),
  
  maxYear: Joi.number().integer().max(new Date().getFullYear() + 1)
    .messages({
      'number.base': 'Maximum year must be a number',
      'number.integer': 'Maximum year must be a whole number',
      'number.max': 'Maximum year cannot exceed ' + (new Date().getFullYear() + 1)
    }),
});

// Validation for bike status update
export const updateBikeStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(BikeStatus)).required()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: ' + Object.values(BikeStatus).join(', '),
      'any.required': 'Status is required'
    }),
  
  reason: Joi.string().trim().min(2).max(200)
    .messages({
      'string.base': 'Reason must be a string',
      'string.min': 'Reason must be at least {#limit} characters',
      'string.max': 'Reason cannot exceed {#limit} characters'
    }),
});

// Validation for bike rating
export const addBikeRatingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be a whole number',
      'number.min': 'Rating must be at least {#limit}',
      'number.max': 'Rating cannot exceed {#limit}',
      'any.required': 'Rating is required'
    }),
  
  comment: Joi.string().trim().min(2).max(500)
    .messages({
      'string.base': 'Comment must be a string',
      'string.min': 'Comment must be at least {#limit} characters',
      'string.max': 'Comment cannot exceed {#limit} characters'
    }),
});

// Validation for bike transfer
export const transferBikeSchema = Joi.object({
  stationId: objectIdSchema.required()
    .messages({
      'string.base': 'Station ID must be a string',
      'any.required': 'Station ID is required',
      'any.invalid': 'Station ID must be a valid ID'
    }),
  
  reason: Joi.string().trim().min(2).max(200)
    .messages({
      'string.base': 'Reason must be a string',
      'string.min': 'Reason must be at least {#limit} characters',
      'string.max': 'Reason cannot exceed {#limit} characters'
    }),
});

// Validation for mileage update
export const updateMileageSchema = Joi.object({
  additionalKm: Joi.number().precision(1).min(0.1).required()
    .messages({
      'number.base': 'Additional kilometers must be a number',
      'number.min': 'Additional kilometers must be positive',
      'number.precision': 'Additional kilometers cannot have more than 1 decimal place',
      'any.required': 'Additional kilometers is required'
    }),
});