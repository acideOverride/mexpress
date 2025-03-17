/**
 * Reservation API Validation Schemas
 * Defines validation rules for reservation API requests
 */
import Joi from 'joi';
import { objectIdSchema, paginationSchema } from './common.validator';
import { ReservationStatus } from '../../../shared/types/models';

// Weather conditions schema
const weatherConditionsSchema = Joi.object({
  forecast: Joi.string().valid(
    'sunny', 'partly cloudy', 'cloudy', 'rainy', 
    'stormy', 'snowy', 'windy', 'foggy'
  ),
  
  temperature: Joi.number()
    .min(-50)
    .max(60)
    .pattern(/^-?\d+(\.\d)?$/)
    .messages({
      'number.base': 'Temperature must be a number',
      'number.min': 'Temperature must be at least -50°C',
      'number.max': 'Temperature cannot exceed 60°C',
      'string.pattern.base': 'Temperature can only have 1 decimal place'
    }),
    
  precipitation: Joi.number()
    .min(0)
    .max(100)
    .pattern(/^\d+(\.\d)?$/)
    .messages({
      'number.base': 'Precipitation must be a number',
      'number.min': 'Precipitation cannot be negative',
      'number.max': 'Precipitation cannot exceed 100%',
      'string.pattern.base': 'Precipitation can only have 1 decimal place'
    }),
    
  windSpeed: Joi.number()
    .min(0)
    .max(200)
    .messages({
      'number.base': 'Wind speed must be a number',
      'number.min': 'Wind speed cannot be negative',
      'number.max': 'Wind speed cannot exceed 200 km/h'
    }),
    
  forecastDate: Joi.date().iso()
});

// Additional service schema
const additionalServiceSchema = Joi.object({
  name: Joi.string().required()
    .messages({
      'string.base': 'Service name must be a string',
      'string.empty': 'Service name is required',
      'any.required': 'Service name is required'
    }),
    
  price: Joi.number().precision(2).min(0).max(1000).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed 1000',
      'number.precision': 'Price can only have 2 decimal places',
      'any.required': 'Price is required'
    }),
    
  quantity: Joi.number().integer().min(1).max(10).default(1)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 10'
    }),
    
  description: Joi.string()
});

// Insurance schema
const insuranceSchema = Joi.object({
  type: Joi.string().valid('basic', 'premium', 'comprehensive').required()
    .messages({
      'string.base': 'Insurance type must be a string',
      'any.only': 'Insurance type must be one of: basic, premium, comprehensive',
      'any.required': 'Insurance type is required'
    }),
    
  coverageAmount: Joi.number().precision(2).min(0).max(10000).required()
    .messages({
      'number.base': 'Coverage amount must be a number',
      'number.min': 'Coverage amount cannot be negative',
      'number.max': 'Coverage amount cannot exceed 10000',
      'number.precision': 'Coverage amount can only have 2 decimal places',
      'any.required': 'Coverage amount is required'
    }),
    
  premium: Joi.number().precision(2).min(0).max(1000).required()
    .messages({
      'number.base': 'Premium must be a number',
      'number.min': 'Premium cannot be negative',
      'number.max': 'Premium cannot exceed 1000',
      'number.precision': 'Premium can only have 2 decimal places',
      'any.required': 'Premium is required'
    }),
    
  termsAccepted: Joi.boolean().valid(true).required()
    .messages({
      'boolean.base': 'Terms accepted must be a boolean',
      'any.only': 'Terms must be accepted',
      'any.required': 'Terms accepted is required'
    }),
    
  notes: Joi.string()
});

// Return details schema
const returnDetailsSchema = Joi.object({
  returnDate: Joi.date().iso()
    .messages({
      'date.base': 'Return date must be a valid date',
      'date.format': 'Return date must be in ISO format'
    }),
    
  returnLocation: objectIdSchema
    .messages({
      'string.pattern.base': 'Return location must be a valid MongoDB ID'
    }),
    
  processedBy: objectIdSchema
    .messages({
      'string.pattern.base': 'Processed by must be a valid MongoDB ID'
    }),
    
  bikeConditions: Joi.array().items(Joi.object({
    bikeId: objectIdSchema.required()
      .messages({
        'string.pattern.base': 'Bike ID must be a valid MongoDB ID',
        'any.required': 'Bike ID is required'
      }),
      
    condition: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'damaged').required()
      .messages({
        'string.base': 'Condition must be a string',
        'any.only': 'Condition must be one of: excellent, good, fair, poor, damaged',
        'any.required': 'Condition is required'
      }),
      
    notes: Joi.string(),
    
    damageDescription: Joi.string().when('condition', {
      is: Joi.string().valid('poor', 'damaged'),
      then: Joi.string().required(),
      otherwise: Joi.string()
    })
      .messages({
        'string.base': 'Damage description must be a string',
        'any.required': 'Damage description is required when condition is poor or damaged'
      })
  })),
  
  bikeMileage: Joi.array().items(Joi.object({
    bikeId: objectIdSchema.required()
      .messages({
        'string.pattern.base': 'Bike ID must be a valid MongoDB ID',
        'any.required': 'Bike ID is required'
      }),
      
    distance: Joi.number().min(0).max(1000).required()
      .messages({
        'number.base': 'Distance must be a number',
        'number.min': 'Distance cannot be negative',
        'number.max': 'Distance cannot exceed 1000 km',
        'any.required': 'Distance is required'
      })
  })),
  
  additionalCharges: Joi.array().items(Joi.object({
    description: Joi.string().required()
      .messages({
        'string.base': 'Charge description must be a string',
        'string.empty': 'Charge description is required',
        'any.required': 'Charge description is required'
      }),
      
    amount: Joi.number().precision(2).min(0).max(1000).required()
      .messages({
        'number.base': 'Amount must be a number',
        'number.min': 'Amount cannot be negative',
        'number.max': 'Amount cannot exceed 1000',
        'number.precision': 'Amount can only have 2 decimal places',
        'any.required': 'Amount is required'
      })
  })),
  
  notes: Joi.string()
});

// Validation for creating a new reservation
export const createReservationSchema = Joi.object({
  customerId: objectIdSchema.required()
    .messages({
      'string.pattern.base': 'Customer ID must be a valid MongoDB ID',
      'any.required': 'Customer ID is required'
    }),
    
  bikes: Joi.array().items(objectIdSchema).min(1).max(10).required()
    .messages({
      'array.base': 'Bikes must be an array',
      'array.min': 'At least one bike is required',
      'array.max': 'Cannot reserve more than 10 bikes',
      'any.required': 'Bikes are required'
    }),
    
  startStation: objectIdSchema.required()
    .messages({
      'string.pattern.base': 'Start station must be a valid MongoDB ID',
      'any.required': 'Start station is required'
    }),
    
  endStation: objectIdSchema
    .messages({
      'string.pattern.base': 'End station must be a valid MongoDB ID'
    }),
    
  startDate: Joi.date().iso().min('now').required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format',
      'date.min': 'Start date cannot be in the past',
      'any.required': 'Start date is required'
    }),
    
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format',
      'date.greater': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
    
  totalAmount: Joi.number().precision(2).min(0).max(10000)
    .messages({
      'number.base': 'Total amount must be a number',
      'number.min': 'Total amount cannot be negative',
      'number.max': 'Total amount cannot exceed 10000',
      'number.precision': 'Total amount can only have 2 decimal places'
    }),
    
  paymentStatus: Joi.string().valid('pending', 'paid', 'refunded', 'partial').default('pending')
    .messages({
      'string.base': 'Payment status must be a string',
      'any.only': 'Payment status must be one of: pending, paid, refunded, partial'
    }),
    
  discountCode: Joi.string(),
  
  discountAmount: Joi.number().precision(2).min(0)
    .messages({
      'number.base': 'Discount amount must be a number',
      'number.min': 'Discount amount cannot be negative',
      'number.precision': 'Discount amount can only have 2 decimal places'
    }),
    
  createdBy: objectIdSchema
    .messages({
      'string.pattern.base': 'Created by must be a valid MongoDB ID'
    }),
    
  notes: Joi.string(),
  
  weatherConditions: weatherConditionsSchema,
  
  additionalServices: Joi.array().items(additionalServiceSchema),
  
  specialRequirements: Joi.string(),
  
  insurance: insuranceSchema
});

// Validation for updating a reservation
export const updateReservationSchema = Joi.object({
  bikes: Joi.array().items(objectIdSchema).min(1).max(10)
    .messages({
      'array.base': 'Bikes must be an array',
      'array.min': 'At least one bike is required',
      'array.max': 'Cannot reserve more than 10 bikes'
    }),
    
  startStation: objectIdSchema
    .messages({
      'string.pattern.base': 'Start station must be a valid MongoDB ID'
    }),
    
  endStation: objectIdSchema
    .messages({
      'string.pattern.base': 'End station must be a valid MongoDB ID'
    }),
    
  startDate: Joi.date().iso()
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format'
    }),
    
  endDate: Joi.date().iso().greater(Joi.ref('startDate'))
    .messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format',
      'date.greater': 'End date must be after start date'
    }),
    
  paymentStatus: Joi.string().valid('pending', 'paid', 'refunded', 'partial')
    .messages({
      'string.base': 'Payment status must be a string',
      'any.only': 'Payment status must be one of: pending, paid, refunded, partial'
    }),
    
  notes: Joi.string(),
  
  specialRequirements: Joi.string(),
  
  additionalServices: Joi.array().items(additionalServiceSchema)
})
.min(1) // At least one field must be provided
.messages({
  'object.min': 'At least one field is required for update'
});

// Validation for cancelling a reservation
export const cancelReservationSchema = Joi.object({
  reason: Joi.string().required()
    .messages({
      'string.base': 'Reason must be a string',
      'string.empty': 'Reason is required',
      'any.required': 'Reason is required'
    }),
    
  cancelledById: objectIdSchema
    .messages({
      'string.pattern.base': 'Cancelled by ID must be a valid MongoDB ID'
    })
});

// Validation for updating reservation status
export const updateReservationStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(ReservationStatus)).required()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': `Status must be one of: ${Object.values(ReservationStatus).join(', ')}`,
      'any.required': 'Status is required'
    }),
    
  note: Joi.string()
    .messages({
      'string.base': 'Note must be a string'
    })
});

// Validation for completing a reservation
export const completeReservationSchema = Joi.object({
  returnDetails: returnDetailsSchema.required()
    .messages({
      'any.required': 'Return details are required'
    })
})
.required()
.messages({
  'object.base': 'Return details must be an object'
});

// Validation for adding a service
export const addServiceSchema = Joi.object({
  name: Joi.string().required()
    .messages({
      'string.base': 'Service name must be a string',
      'string.empty': 'Service name is required',
      'any.required': 'Service name is required'
    }),
    
  price: Joi.number().precision(2).min(0).max(1000).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed 1000',
      'number.precision': 'Price can only have 2 decimal places',
      'any.required': 'Price is required'
    }),
    
  quantity: Joi.number().integer().min(1).max(10).default(1)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 10'
    }),
    
  description: Joi.string()
});

// Validation for applying insurance
export const insuranceSchema = Joi.object({
  type: Joi.string().valid('basic', 'premium', 'comprehensive').required()
    .messages({
      'string.base': 'Insurance type must be a string',
      'any.only': 'Insurance type must be one of: basic, premium, comprehensive',
      'any.required': 'Insurance type is required'
    }),
    
  coverageAmount: Joi.number().precision(2).min(0).max(10000).required()
    .messages({
      'number.base': 'Coverage amount must be a number',
      'number.min': 'Coverage amount cannot be negative',
      'number.max': 'Coverage amount cannot exceed 10000',
      'number.precision': 'Coverage amount can only have 2 decimal places',
      'any.required': 'Coverage amount is required'
    }),
    
  premium: Joi.number().precision(2).min(0).max(1000).required()
    .messages({
      'number.base': 'Premium must be a number',
      'number.min': 'Premium cannot be negative',
      'number.max': 'Premium cannot exceed 1000',
      'number.precision': 'Premium can only have 2 decimal places',
      'any.required': 'Premium is required'
    }),
    
  termsAccepted: Joi.boolean().valid(true).required()
    .messages({
      'boolean.base': 'Terms accepted must be a boolean',
      'any.only': 'Terms must be accepted',
      'any.required': 'Terms accepted is required'
    }),
    
  notes: Joi.string()
});

// Validation for applying discount
export const discountSchema = Joi.object({
  code: Joi.string().required()
    .messages({
      'string.base': 'Discount code must be a string',
      'string.empty': 'Discount code is required',
      'any.required': 'Discount code is required'
    }),
    
  amount: Joi.number().precision(2).min(0).required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.min': 'Amount cannot be negative',
      'number.precision': 'Amount can only have 2 decimal places',
      'any.required': 'Amount is required'
    })
});

// Validation for checking availability
export const availabilityQuerySchema = Joi.object({
  bikeIds: Joi.string().required()
    .messages({
      'string.base': 'Bike IDs must be a string (comma-separated)',
      'string.empty': 'Bike IDs are required',
      'any.required': 'Bike IDs are required'
    }),
    
  startDate: Joi.date().iso().required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'date.format': 'Start date must be in ISO format',
      'any.required': 'Start date is required'
    }),
    
  endDate: Joi.date().iso().required()
    .messages({
      'date.base': 'End date must be a valid date',
      'date.format': 'End date must be in ISO format',
      'any.required': 'End date is required'
    }),
    
  excludeReservationId: objectIdSchema
    .messages({
      'string.pattern.base': 'Exclude reservation ID must be a valid MongoDB ID'
    })
});

// Validation for reservation list query parameters
export const getReservationsQuerySchema = Joi.object({
  ...paginationSchema,
  
  sort: Joi.string().pattern(/^[a-zA-Z0-9_\-.]+:(asc|desc)(,[a-zA-Z0-9_\-.]+:(asc|desc))*$/)
    .messages({
      'string.base': 'Sort must be a string',
      'string.pattern.base': 'Sort must be in format field:asc or field:desc (comma-separated for multiple)'
    }),
    
  status: Joi.alternatives().try(
    Joi.string().valid(...Object.values(ReservationStatus)),
    Joi.string().pattern(new RegExp(`^(${Object.values(ReservationStatus).join('|')})(,(${Object.values(ReservationStatus).join('|')}))*$`))
  )
    .messages({
      'alternatives.types': 'Status must be a valid status or comma-separated list of statuses'
    }),
    
  startDateFrom: Joi.date().iso()
    .messages({
      'date.base': 'Start date from must be a valid date',
      'date.format': 'Start date from must be in ISO format'
    }),
    
  startDateTo: Joi.date().iso()
    .messages({
      'date.base': 'Start date to must be a valid date',
      'date.format': 'Start date to must be in ISO format'
    }),
    
  endDateFrom: Joi.date().iso()
    .messages({
      'date.base': 'End date from must be a valid date',
      'date.format': 'End date from must be in ISO format'
    }),
    
  endDateTo: Joi.date().iso()
    .messages({
      'date.base': 'End date to must be a valid date',
      'date.format': 'End date to must be in ISO format'
    }),
    
  customerId: objectIdSchema
    .messages({
      'string.pattern.base': 'Customer ID must be a valid MongoDB ID'
    }),
    
  bikeId: objectIdSchema
    .messages({
      'string.pattern.base': 'Bike ID must be a valid MongoDB ID'
    }),
    
  stationId: objectIdSchema
    .messages({
      'string.pattern.base': 'Station ID must be a valid MongoDB ID'
    }),
    
  includeCompleted: Joi.boolean()
    .messages({
      'boolean.base': 'Include completed must be a boolean'
    }),
    
  includeCancelled: Joi.boolean()
    .messages({
      'boolean.base': 'Include cancelled must be a boolean'
    })
});