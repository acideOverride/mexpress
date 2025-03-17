/**
 * Station model
 * Represents bike stations or rental locations in the Jerome Bikes system
 * Complete implementation with validation, methods, and indexes
 */
import mongoose, { Schema, Query } from 'mongoose';
import { IStationDocument } from '../../shared/types/models';
import logger from '../../utils/logger';

/**
 * Address sub-schema for the station physical location
 */
const AddressSchema: Schema = new Schema(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [100, 'Street address cannot exceed 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [50, 'City name cannot exceed 50 characters'],
    },
    state: {
      type: String,
      required: [true, 'State/Province is required'],
      trim: true,
      maxlength: [50, 'State/Province name cannot exceed 50 characters'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal/ZIP code is required'],
      trim: true,
      match: [/^[A-Za-z0-9\s-]+$/, 'Please enter a valid postal/ZIP code'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [50, 'Country name cannot exceed 50 characters'],
    },
  },
  { _id: false }
);

/**
 * Opening hours sub-schema for managing station availability
 */
const OpeningHoursSchema: Schema = new Schema(
  {
    monday: {
      open: { 
        type: String, 
        required: [true, 'Monday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Monday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
    tuesday: {
      open: { 
        type: String, 
        required: [true, 'Tuesday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Tuesday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
    wednesday: {
      open: { 
        type: String, 
        required: [true, 'Wednesday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Wednesday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
    thursday: {
      open: { 
        type: String, 
        required: [true, 'Thursday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Thursday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
    friday: {
      open: { 
        type: String, 
        required: [true, 'Friday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Friday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
    saturday: {
      open: { 
        type: String, 
        required: [true, 'Saturday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Saturday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
    sunday: {
      open: { 
        type: String, 
        required: [true, 'Sunday opening time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Opening time must be in HH:MM format (24-hour)']
      },
      close: { 
        type: String, 
        required: [true, 'Sunday closing time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Closing time must be in HH:MM format (24-hour)']
      },
    },
  },
  { _id: false }
);

/**
 * Main Station schema
 */
const StationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Station name is required'],
      trim: true,
      maxlength: [100, 'Station name cannot exceed 100 characters'],
      index: true,
    },
    address: {
      type: AddressSchema,
      required: [true, 'Address information is required'],
      validate: {
        validator: function(address) {
          return address && 
                 address.street && 
                 address.city && 
                 address.state && 
                 address.postalCode && 
                 address.country;
        },
        message: 'Complete address information is required'
      }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: [true, 'Location type must be Point']
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(coordinates) {
            return Array.isArray(coordinates) && 
                   coordinates.length === 2 && 
                   coordinates[0] >= -180 && 
                   coordinates[0] <= 180 && 
                   coordinates[1] >= -90 && 
                   coordinates[1] <= 90;
          },
          message: 'Coordinates must be a valid [longitude, latitude] pair'
        }
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      validate: {
        validator: function(value) {
          return Number.isInteger(value);
        },
        message: 'Capacity must be a whole number'
      }
    },
    currentBikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bike',
        validate: {
          validator: async function(bikeId) {
            try {
              // Check if the bike exists
              const Bike = mongoose.model('Bike');
              const bike = await Bike.findById(bikeId);
              return !!bike;
            } catch (error) {
              return false;
            }
          },
          message: 'Referenced bike does not exist'
        }
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'maintenance'],
        message: 'Status must be active, inactive, or maintenance'
      },
      default: 'active',
      index: true,
    },
    amenities: {
      type: [String],
      default: [],
      validate: {
        validator: function(amenities) {
          // Valid amenity types for validation
          const validAmenities = [
            'restroom', 'wifi', 'repair_station', 'air_pump', 
            'water_fountain', 'seating', 'parking', 'shelter',
            'charging_station', 'lockers', 'security_camera', 
            'information_kiosk', 'vending_machine', 'first_aid'
          ];
          
          if (!amenities.length) return true;
          
          // Check that all amenities are in the valid list
          return amenities.every(a => validAmenities.includes(a));
        },
        message: 'One or more amenities are not valid'
      }
    },
    openingHours: {
      type: OpeningHoursSchema,
      required: [true, 'Opening hours are required'],
      validate: {
        validator: function(hours) {
          // Check that closing times are after opening times
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          return days.every(day => {
            return hours[day] && hours[day].open && hours[day].close &&
                   hours[day].open <= hours[day].close;
          });
        },
        message: 'Closing time must be after opening time for all days'
      }
    },
    contactPhone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number']
    },
    isAccessControlled: {
      type: Boolean,
      default: false,
    },
    accessMethod: {
      type: String,
      trim: true,
      validate: {
        validator: function(value) {
          // Only required if isAccessControlled is true
          return !this.isAccessControlled || (this.isAccessControlled && value && value.length > 0);
        },
        message: 'Access method is required when access is controlled'
      }
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// --- INDEXES ---

// Create a 2dsphere index for geospatial queries (required for $near operations)
StationSchema.index({ location: '2dsphere' }, { name: 'idx_station_location' });

// Indexes for frequent queries
StationSchema.index({ 'address.city': 1 }, { name: 'idx_station_city' });
StationSchema.index({ status: 1 }, { name: 'idx_station_status' });
StationSchema.index({ name: 'text' }, { name: 'idx_station_name_text' });

// Composite index for finding stations by city and status
StationSchema.index({ 'address.city': 1, status: 1 }, { name: 'idx_station_city_status' });

// Capacity index for finding stations with available space
StationSchema.index({ capacity: -1 }, { name: 'idx_station_capacity' });

// --- VIRTUALS ---

// Virtual for current capacity utilization
StationSchema.virtual('utilizationPercentage').get(function() {
  if (!this.capacity) return 0;
  return Math.min(100, Math.round((this.currentBikes.length / this.capacity) * 100));
});

// Virtual for available bikes count
StationSchema.virtual('availableBikesCount').get(function() {
  return this.currentBikes.length;
});

// Virtual for available spots count
StationSchema.virtual('availableSpotsCount').get(function() {
  return this.capacity - this.currentBikes.length;
});

// Virtual for formatted address
StationSchema.virtual('formattedAddress').get(function() {
  if (!this.address) return '';
  const { street, city, state, postalCode, country } = this.address;
  return `${street}, ${city}, ${state} ${postalCode}, ${country}`;
});

// Virtual for is24Hour operation
StationSchema.virtual('is24Hour').get(function() {
  if (!this.openingHours) return false;
  
  // Check if all days have 00:00 to 23:59 hours
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.every(day => 
    this.openingHours[day].open === '00:00' && 
    this.openingHours[day].close === '23:59'
  );
});

// Virtual for current day's hours
StationSchema.virtual('todayHours').get(function() {
  if (!this.openingHours) return '';
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIndex = new Date().getDay();
  const today = days[todayIndex];
  
  if (this.is24Hour) return '24 hours';
  
  const { open, close } = this.openingHours[today];
  return `${open} - ${close}`;
});

// --- INSTANCE METHODS ---

// Method to check if station is at capacity
StationSchema.methods.isAtCapacity = function(): boolean {
  return this.currentBikes.length >= this.capacity;
};

// Method to check if station is open at a given time
StationSchema.methods.isOpenAt = function(dateTime: Date = new Date()): boolean {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[dateTime.getDay()];
  
  // For 24-hour stations, always return true
  if (this.is24Hour) return true;
  
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  const dayHours = this.openingHours[day];
  return timeString >= dayHours.open && timeString <= dayHours.close;
};

// Method to add a bike to the station
StationSchema.methods.addBike = async function(bikeId: string): Promise<boolean> {
  try {
    // Check capacity
    if (this.isAtCapacity()) {
      logger.warn(`Station ${this.name} (${this._id}) is at capacity. Cannot add bike ${bikeId}`);
      return false;
    }
    
    // Check if bike exists
    const Bike = mongoose.model('Bike');
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      logger.error(`Cannot add bike ${bikeId} to station ${this.name} (${this._id}): Bike not found`);
      return false;
    }
    
    // Check if bike is already at this station
    if (this.currentBikes.some(id => id.toString() === bikeId.toString())) {
      logger.info(`Bike ${bikeId} is already at station ${this.name} (${this._id})`);
      return true;
    }
    
    // Add bike to station
    this.currentBikes.push(bikeId);
    logger.info(`Added bike ${bikeId} to station ${this.name} (${this._id})`);
    
    // Update bike's location
    await Bike.findByIdAndUpdate(bikeId, { currentLocation: this._id });
    
    return true;
  } catch (error) {
    logger.error(`Error adding bike ${bikeId} to station ${this.name} (${this._id}): ${error.message}`);
    return false;
  }
};

// Method to remove a bike from the station
StationSchema.methods.removeBike = async function(bikeId: string): Promise<boolean> {
  try {
    const index = this.currentBikes.findIndex(id => id.toString() === bikeId.toString());
    if (index === -1) {
      logger.warn(`Bike ${bikeId} not found at station ${this.name} (${this._id})`);
      return false;
    }
    
    // Remove bike from station
    this.currentBikes.splice(index, 1);
    logger.info(`Removed bike ${bikeId} from station ${this.name} (${this._id})`);
    
    return true;
  } catch (error) {
    logger.error(`Error removing bike ${bikeId} from station ${this.name} (${this._id}): ${error.message}`);
    return false;
  }
};

// Method to get available bike types at this station
StationSchema.methods.getAvailableBikeTypes = async function(): Promise<{ type: string; count: number }[]> {
  try {
    if (!this.currentBikes.length) return [];
    
    const Bike = mongoose.model('Bike');
    const bikesAggregate = await Bike.aggregate([
      { $match: { _id: { $in: this.currentBikes }, status: 'available' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { _id: 0, type: '$_id', count: 1 } },
      { $sort: { count: -1 } }
    ]);
    
    return bikesAggregate;
  } catch (error) {
    logger.error(`Error getting available bike types for station ${this.name} (${this._id}): ${error.message}`);
    return [];
  }
};

// Method to find available bikes at this station
StationSchema.methods.findAvailableBikes = function(type?: string, size?: string): Promise<any[]> {
  try {
    const Bike = mongoose.model('Bike');
    const query: any = { 
      _id: { $in: this.currentBikes }, 
      status: 'available' 
    };
    
    if (type) query.type = type;
    if (size) query.size = size;
    
    return Bike.find(query).sort({ dailyRate: 1 }).exec();
  } catch (error) {
    logger.error(`Error finding available bikes at station ${this.name} (${this._id}): ${error.message}`);
    return Promise.resolve([]);
  }
};

// Method to update station status with logging
StationSchema.methods.updateStatus = function(newStatus: 'active' | 'inactive' | 'maintenance', reason?: string): void {
  const oldStatus = this.status;
  this.status = newStatus;
  
  logger.info(`Updated station ${this.name} (${this._id}) status from ${oldStatus} to ${newStatus}${reason ? `: ${reason}` : ''}`);
};

// Method to check if station supports specific amenities
StationSchema.methods.hasAmenities = function(requiredAmenities: string[]): boolean {
  if (!requiredAmenities || !requiredAmenities.length) return true;
  return requiredAmenities.every(amenity => this.amenities.includes(amenity));
};

// Method to calculate distance from a point
StationSchema.methods.distanceFromPoint = function(longitude: number, latitude: number): number {
  // Uses the Haversine formula to calculate distance in kilometers
  const toRadians = (degrees: number): number => degrees * Math.PI / 180;
  
  const lon1 = toRadians(this.location.coordinates[0]);
  const lat1 = toRadians(this.location.coordinates[1]);
  const lon2 = toRadians(longitude);
  const lat2 = toRadians(latitude);
  
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  
  const a = Math.sin(dlat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Earth radius in kilometers
  const R = 6371;
  
  return R * c;
};

// --- STATIC METHODS ---

// Static method to find nearest stations
StationSchema.statics.findNearest = function(
  longitude: number, 
  latitude: number, 
  options: { 
    maxDistance?: number; 
    minAvailableBikes?: number;
    limit?: number;
    amenities?: string[];
  } = {}
) {
  const { 
    maxDistance = 5000, // meters
    minAvailableBikes = 0,
    limit = 10,
    amenities = []
  } = options;
  
  const query: any = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
    status: 'active',
  };
  
  // Only include stations with enough available bikes
  if (minAvailableBikes > 0) {
    query.currentBikes = { $exists: true, $not: { $size: 0 } };
  }
  
  // Include required amenities if specified
  if (amenities.length > 0) {
    query.amenities = { $all: amenities };
  }
  
  return this.find(query)
    .limit(limit)
    .select('name address location capacity currentBikes status amenities openingHours')
    .exec();
};

// Static method to find stations with available bikes
StationSchema.statics.findWithAvailableBikes = function(options: {
  city?: string;
  minAvailable?: number;
  bikeType?: string;
} = {}) {
  const { city, minAvailable = 1, bikeType } = options;
  
  const query: any = {
    status: 'active',
  };
  
  // Filter by city if specified
  if (city) {
    query['address.city'] = { $regex: new RegExp(city, 'i') };
  }
  
  // Use aggregation to check for available bikes
  return this.aggregate([
    { $match: query },
    { $lookup: {
        from: 'bikes',
        localField: 'currentBikes',
        foreignField: '_id',
        as: 'availableBikes'
    }},
    { $addFields: {
        availableBikes: {
          $filter: {
            input: '$availableBikes',
            as: 'bike',
            cond: { 
              $and: [
                { $eq: ['$$bike.status', 'available'] },
                // Apply bike type filter if specified
                bikeType ? { $eq: ['$$bike.type', bikeType] } : true
              ]
            }
          }
        }
    }},
    { $match: { 'availableBikes.0': { $exists: true }, $expr: { $gte: [{ $size: '$availableBikes' }, minAvailable] } } },
    { $project: {
        name: 1,
        address: 1,
        location: 1,
        capacity: 1,
        status: 1,
        amenities: 1,
        availableBikeCount: { $size: '$availableBikes' },
        availableBikeTypes: { $map: { input: '$availableBikes', as: 'bike', in: '$$bike.type' } }
    }},
    { $sort: { availableBikeCount: -1 } }
  ]);
};

// Static method to find stations by city
StationSchema.statics.findByCity = function(city: string) {
  return this.find({
    'address.city': { $regex: new RegExp(city, 'i') },
    status: 'active'
  }).sort('name');
};

// Static method to find stations with available capacity
StationSchema.statics.findWithAvailableCapacity = function(minAvailableSpots: number = 1) {
  return this.find({
    status: 'active'
  }).where('capacity').gt(0)
    .then(stations => stations.filter(station => 
      (station.capacity - station.currentBikes.length) >= minAvailableSpots
    ));
};

// Static method to find stations with specific amenities
StationSchema.statics.findByAmenities = function(amenities: string[]) {
  if (!amenities || !amenities.length) {
    return this.find({ status: 'active' });
  }
  
  return this.find({
    status: 'active',
    amenities: { $all: amenities }
  });
};

// Static method to find stations that are currently open
StationSchema.statics.findOpenNow = function() {
  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[now.getDay()];
  
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return this.find({
    status: 'active',
    $or: [
      { [`openingHours.${day}.open`]: { $lte: timeString }, [`openingHours.${day}.close`]: { $gte: timeString } },
      { $and: [{ [`openingHours.${day}.open`]: '00:00' }, { [`openingHours.${day}.close`]: '23:59' }] }
    ]
  });
};

// --- MIDDLEWARES / HOOKS ---

// Validate coordinates before saving
StationSchema.pre('save', function(next) {
  if (this.isModified('location.coordinates')) {
    const [longitude, latitude] = this.location.coordinates;
    
    if (longitude < -180 || longitude > 180) {
      return next(new Error('Longitude must be between -180 and 180'));
    }
    
    if (latitude < -90 || latitude > 90) {
      return next(new Error('Latitude must be between -90 and 90'));
    }
  }
  
  // Ensure capacity is respected
  if (this.currentBikes && this.currentBikes.length > this.capacity) {
    return next(new Error(`Station cannot have more bikes (${this.currentBikes.length}) than its capacity (${this.capacity})`));
  }
  
  // Make sure amenities are unique
  if (this.isModified('amenities')) {
    this.amenities = [...new Set(this.amenities)];
  }
  
  // Log creation/updates
  if (this.isNew) {
    logger.info(`Creating new station: ${this.name}`);
  } else if (this.isModified()) {
    logger.info(`Updating station: ${this.name} (${this._id})`);
  }
  
  next();
});

// Prevent deletion of stations with bikes
StationSchema.pre('remove', async function(next) {
  if (this.currentBikes && this.currentBikes.length > 0) {
    return next(new Error(`Cannot delete station with bikes. Please remove all bikes first.`));
  }
  
  // Check for active reservations using this station
  try {
    const Reservation = mongoose.model('Reservation');
    const activeReservations = await Reservation.countDocuments({
      $or: [
        { startStation: this._id },
        { endStation: this._id }
      ],
      status: { $in: ['pending', 'confirmed', 'active'] }
    });
    
    if (activeReservations > 0) {
      return next(new Error(`Cannot delete station with ${activeReservations} active reservations.`));
    }
    
    logger.info(`Deleting station: ${this.name} (${this._id})`);
    next();
  } catch (error) {
    return next(error);
  }
});

// Create model
const Station = mongoose.model<IStationDocument>('Station', StationSchema);

export default Station;