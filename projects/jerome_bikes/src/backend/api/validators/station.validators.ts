/**
 * Station API Validators
 * Defines Joi validation schemas for station-related endpoints
 */
import Joi from 'joi';

// Regular expression for time format (HH:MM)
const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Regular expression for postal/ZIP code
const postalCodeRegex = /^[A-Za-z0-9\s-]+$/;

// Valid amenity types
const validAmenities = [
  'restroom', 'wifi', 'repair_station', 'air_pump', 
  'water_fountain', 'seating', 'parking', 'shelter',
  'charging_station', 'lockers', 'security_camera', 
  'information_kiosk', 'vending_machine', 'first_aid'
];

// Valid status values
const validStatusValues = ['active', 'inactive', 'maintenance'];

// Address schema
const addressSchema = Joi.object({
  street: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Street address is required',
    'string.max': 'Street address cannot exceed 100 characters',
    'any.required': 'Street address is required'
  }),
  city: Joi.string().trim().max(50).required().messages({
    'string.empty': 'City is required',
    'string.max': 'City name cannot exceed 50 characters',
    'any.required': 'City is required'
  }),
  state: Joi.string().trim().max(50).required().messages({
    'string.empty': 'State/Province is required',
    'string.max': 'State/Province name cannot exceed 50 characters',
    'any.required': 'State/Province is required'
  }),
  postalCode: Joi.string().trim().pattern(postalCodeRegex).required().messages({
    'string.empty': 'Postal/ZIP code is required',
    'string.pattern.base': 'Please enter a valid postal/ZIP code',
    'any.required': 'Postal/ZIP code is required'
  }),
  country: Joi.string().trim().max(50).required().messages({
    'string.empty': 'Country is required',
    'string.max': 'Country name cannot exceed 50 characters',
    'any.required': 'Country is required'
  })
});

// Time slot schema
const timeSlotSchema = Joi.object({
  open: Joi.string().pattern(timeFormatRegex).required().messages({
    'string.empty': 'Opening time is required',
    'string.pattern.base': 'Opening time must be in HH:MM format (24-hour)',
    'any.required': 'Opening time is required'
  }),
  close: Joi.string().pattern(timeFormatRegex).required().messages({
    'string.empty': 'Closing time is required',
    'string.pattern.base': 'Closing time must be in HH:MM format (24-hour)',
    'any.required': 'Closing time is required'
  })
}).custom((value, helpers) => {
  // Check that closing time is after opening time
  if (value.open > value.close) {
    return helpers.error('time.invalid', { message: 'Closing time must be after opening time' });
  }
  return value;
}, 'closing time validation');

// Opening hours schema
const openingHoursSchema = Joi.object({
  monday: timeSlotSchema.required(),
  tuesday: timeSlotSchema.required(),
  wednesday: timeSlotSchema.required(),
  thursday: timeSlotSchema.required(),
  friday: timeSlotSchema.required(),
  saturday: timeSlotSchema.required(),
  sunday: timeSlotSchema.required()
});

// Location schema
const locationSchema = Joi.object({
  type: Joi.string().valid('Point').required().messages({
    'string.empty': 'Location type is required',
    'any.only': 'Location type must be Point',
    'any.required': 'Location type is required'
  }),
  coordinates: Joi.array().items(
    Joi.number().required(),
    Joi.number().min(-90).max(90).required()
  ).length(2).required().messages({
    'array.base': 'Coordinates must be an array',
    'array.length': 'Coordinates must contain exactly 2 elements [longitude, latitude]',
    'array.includes': 'Coordinates must be valid numbers',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Coordinates are required'
  }).custom((value, helpers) => {
    // Check longitude range (-180 to 180)
    if (value[0] < -180 || value[0] > 180) {
      return helpers.error('longitude.range', { message: 'Longitude must be between -180 and 180' });
    }
    return value;
  }, 'coordinate validation')
});

// Create station schema
export const createStationSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Station name is required',
    'string.max': 'Station name cannot exceed 100 characters',
    'any.required': 'Station name is required'
  }),
  address: addressSchema.required().messages({
    'any.required': 'Address information is required'
  }),
  location: locationSchema.required().messages({
    'any.required': 'Location information is required'
  }),
  capacity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Capacity must be a number',
    'number.integer': 'Capacity must be a whole number',
    'number.min': 'Capacity must be at least 1',
    'any.required': 'Capacity is required'
  }),
  status: Joi.string().valid(...validStatusValues).default('active').messages({
    'any.only': 'Status must be active, inactive, or maintenance'
  }),
  amenities: Joi.array().items(
    Joi.string().valid(...validAmenities)
  ).default([]).messages({
    'array.base': 'Amenities must be an array',
    'any.only': 'One or more amenities are not valid'
  }),
  openingHours: openingHoursSchema.required().messages({
    'any.required': 'Opening hours are required'
  }),
  contactPhone: Joi.string().pattern(/^\+?[\d\s\-()]{7,20}$/).allow('').messages({
    'string.pattern.base': 'Please enter a valid phone number'
  }),
  isAccessControlled: Joi.boolean().default(false),
  accessMethod: Joi.string().when('isAccessControlled', {
    is: true,
    then: Joi.string().required().messages({
      'string.empty': 'Access method is required when access is controlled',
      'any.required': 'Access method is required when access is controlled'
    }),
    otherwise: Joi.string().allow('', null)
  })
});

// Update station schema (similar to create but all fields optional)
export const updateStationSchema = Joi.object({
  name: Joi.string().trim().max(100).messages({
    'string.max': 'Station name cannot exceed 100 characters'
  }),
  address: addressSchema,
  location: locationSchema,
  capacity: Joi.number().integer().min(1).messages({
    'number.base': 'Capacity must be a number',
    'number.integer': 'Capacity must be a whole number',
    'number.min': 'Capacity must be at least 1'
  }).custom((value, helpers) => {
    // Custom validation context to check capacity vs current bikes
    // This will be enforced in the service layer since we need DB access
    return value;
  }, 'capacity validation'),
  status: Joi.string().valid(...validStatusValues).messages({
    'any.only': 'Status must be active, inactive, or maintenance'
  }),
  amenities: Joi.array().items(
    Joi.string().valid(...validAmenities)
  ).messages({
    'array.base': 'Amenities must be an array',
    'any.only': 'One or more amenities are not valid'
  }),
  openingHours: openingHoursSchema,
  contactPhone: Joi.string().pattern(/^\+?[\d\s\-()]{7,20}$/).allow('').messages({
    'string.pattern.base': 'Please enter a valid phone number'
  }),
  isAccessControlled: Joi.boolean(),
  accessMethod: Joi.string().when('isAccessControlled', {
    is: true,
    then: Joi.string().required().messages({
      'string.empty': 'Access method is required when access is controlled',
      'any.required': 'Access method is required when access is controlled'
    }),
    otherwise: Joi.string().allow('', null)
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// ID parameter validation
export const idParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.empty': 'Station ID is required',
    'string.pattern.base': 'Station ID must be a valid MongoDB ID',
    'any.required': 'Station ID is required'
  })
});

// Add bike schema
export const addBikeSchema = Joi.object({
  bikeId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.empty': 'Bike ID is required',
    'string.pattern.base': 'Bike ID must be a valid MongoDB ID',
    'any.required': 'Bike ID is required'
  })
});

// Update status schema
export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...validStatusValues).required().messages({
    'string.empty': 'Status is required',
    'any.only': 'Status must be active, inactive, or maintenance',
    'any.required': 'Status is required'
  }),
  reason: Joi.string().max(255)
});

// Nearest stations query parameters
export const nearestStationsQuerySchema = Joi.object({
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required'
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required'
  }),
  maxDistance: Joi.number().positive().default(5000).messages({
    'number.base': 'Max distance must be a number',
    'number.positive': 'Max distance must be positive'
  }),
  limit: Joi.number().integer().min(1).max(50).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 50'
  }),
  minAvailableBikes: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Minimum available bikes must be a number',
    'number.integer': 'Minimum available bikes must be an integer',
    'number.min': 'Minimum available bikes cannot be negative'
  }),
  amenities: Joi.string().custom((value, helpers) => {
    const amenitiesList = value.split(',');
    const invalidAmenities = amenitiesList.filter(a => !validAmenities.includes(a));
    
    if (invalidAmenities.length > 0) {
      return helpers.error('amenities.invalid', { 
        message: `Invalid amenities: ${invalidAmenities.join(', ')}` 
      });
    }
    
    return value;
  }, 'amenities validation')
});

// Advanced search validation schema
export const advancedSearchQuerySchema = Joi.object({
  // Basic pagination and sorting
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().pattern(/^[a-zA-Z0-9_\.]+:(asc|desc)$/),
  
  // Basic filters
  search: Joi.string().trim(),
  status: Joi.string().valid(...validStatusValues),
  city: Joi.string().trim(),
  state: Joi.string().trim(),
  country: Joi.string().trim(),
  postalCode: Joi.string().trim(),
  minCapacity: Joi.number().integer().min(1),
  maxCapacity: Joi.number().integer().min(1),
  amenities: Joi.string().custom((value, helpers) => {
    const amenitiesList = value.split(',');
    const invalidAmenities = amenitiesList.filter(a => !validAmenities.includes(a));
    
    if (invalidAmenities.length > 0) {
      return helpers.error('amenities.invalid', { 
        message: `Invalid amenities: ${invalidAmenities.join(', ')}` 
      });
    }
    
    return value;
  }, 'amenities validation'),
  hasAvailableBikes: Joi.boolean(),
  minAvailableBikes: Joi.number().integer().min(0),
  isAccessControlled: Joi.boolean(),
  
  // Advanced filters
  proximity: Joi.boolean().default(false),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  radius: Joi.number().positive(),
  openNow: Joi.boolean().default(false),
  hasMaintenance: Joi.boolean(),
  availableAfter: Joi.string().isoDate(),
  availableBefore: Joi.string().isoDate(),
  bikeTypes: Joi.string().custom((value, helpers) => {
    const bikeTypesList = value.split(',');
    const validBikeTypes = ['mountain', 'road', 'hybrid', 'electric', 'city', 'kids'];
    const invalidTypes = bikeTypesList.filter(t => !validBikeTypes.includes(t));
    
    if (invalidTypes.length > 0) {
      return helpers.error('bikeTypes.invalid', { 
        message: `Invalid bike types: ${invalidTypes.join(', ')}` 
      });
    }
    
    return value;
  }, 'bike types validation'),
  
  // Compound sorting
  sortByMultiple: Joi.string().custom((value, helpers) => {
    try {
      const parsed = JSON.parse(value);
      
      if (!Array.isArray(parsed)) {
        return helpers.error('sortByMultiple.format', {
          message: 'sortByMultiple must be a JSON array'
        });
      }
      
      // Validate each sort item
      for (const item of parsed) {
        if (!item.field || !item.direction) {
          return helpers.error('sortByMultiple.item', {
            message: 'Each sort item must have field and direction properties'
          });
        }
        
        if (!['asc', 'desc'].includes(item.direction)) {
          return helpers.error('sortByMultiple.direction', {
            message: 'Sort direction must be either "asc" or "desc"'
          });
        }
      }
      
      return value;
    } catch (error) {
      return helpers.error('sortByMultiple.json', {
        message: 'sortByMultiple must be a valid JSON string'
      });
    }
  }, 'compound sort validation'),
  
  // Filter persistence
  savedFilterId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  saveFilter: Joi.boolean().default(false),
  filterName: Joi.string().when('saveFilter', {
    is: true,
    then: Joi.string().required().trim().min(1).max(50),
    otherwise: Joi.string().trim().allow('', null)
  })
}).custom((value, helpers) => {
  // Custom validation for proximity search
  if (value.proximity === true && (!value.latitude || !value.longitude)) {
    return helpers.error('proximity.coordinates', {
      message: 'Latitude and longitude are required when proximity is true'
    });
  }
  
  // Validate that availableAfter is before availableBefore
  if (value.availableAfter && value.availableBefore) {
    const afterDate = new Date(value.availableAfter);
    const beforeDate = new Date(value.availableBefore);
    
    if (afterDate >= beforeDate) {
      return helpers.error('availability.dates', {
        message: 'availableAfter must be before availableBefore'
      });
    }
  }
  
  return value;
});

// Available bikes query parameters
export const availableBikesQuerySchema = Joi.object({
  type: Joi.string().valid('mountain', 'road', 'hybrid', 'electric', 'city', 'kids'),
  size: Joi.string().valid('xs', 's', 'm', 'l', 'xl')
});

// Stations with available bikes query parameters
export const availableStationsQuerySchema = Joi.object({
  city: Joi.string().trim(),
  minAvailable: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Minimum available must be a number',
    'number.integer': 'Minimum available must be an integer',
    'number.min': 'Minimum available must be at least 1'
  }),
  bikeType: Joi.string().valid('mountain', 'road', 'hybrid', 'electric', 'city', 'kids')
});

// Amenities query parameter
export const amenitiesQuerySchema = Joi.object({
  amenities: Joi.string().required().custom((value, helpers) => {
    const amenitiesList = value.split(',');
    const invalidAmenities = amenitiesList.filter(a => !validAmenities.includes(a));
    
    if (invalidAmenities.length > 0) {
      return helpers.error('amenities.invalid', { 
        message: `Invalid amenities: ${invalidAmenities.join(', ')}` 
      });
    }
    
    return value;
  }, 'amenities validation').messages({
    'string.empty': 'At least one amenity is required',
    'any.required': 'At least one amenity is required'
  })
});

// Stations with capacity query parameters
export const capacityQuerySchema = Joi.object({
  minSpots: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Minimum spots must be a number',
    'number.integer': 'Minimum spots must be an integer',
    'number.min': 'Minimum spots must be at least 1'
  })
});

// City parameter validation
export const cityParamSchema = Joi.object({
  city: Joi.string().trim().required().messages({
    'string.empty': 'City name is required',
    'any.required': 'City name is required'
  })
});

// Bike ID parameter validation
export const bikeIdParamSchema = Joi.object({
  bikeId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.empty': 'Bike ID is required',
    'string.pattern.base': 'Bike ID must be a valid MongoDB ID',
    'any.required': 'Bike ID is required'
  })
});