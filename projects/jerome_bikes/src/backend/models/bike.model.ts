/**
 * Bike model
 * Represents the bikes available for rental
 */
import mongoose, { Schema } from 'mongoose';
import { IBikeDocument, BikeType, BikeSize, BikeStatus } from '../../shared/types/models';
import { logger } from '../utils/logger';

const SpecificationsSchema: Schema = new Schema(
  {
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      validate: {
        validator: function(v: number) {
          return v === undefined || v === null || v <= 100;
        },
        message: props => `${props.value} kg is too heavy for a bike! Maximum weight should be 100kg.`
      }
    },
    frameType: {
      type: String,
      trim: true,
      enum: {
        values: ['aluminum', 'carbon fiber', 'steel', 'titanium', 'composite'],
        message: '{VALUE} is not a supported frame type'
      }
    },
    suspension: {
      type: String,
      trim: true,
      enum: {
        values: ['none', 'front', 'full', 'micro', 'air'],
        message: '{VALUE} is not a supported suspension type'
      }
    },
    gears: {
      type: Number,
      min: [0, 'Gears cannot be negative'],
      max: [33, 'Maximum gear count is 33'],
      validate: {
        validator: function(v: number) {
          // common gear counts 1, 3, 6, 7, 8, 9, 10, 11, 12, 14, 18, 21, 24, 27, 30, 33
          return v === undefined || v === null || [0, 1, 3, 6, 7, 8, 9, 10, 11, 12, 14, 18, 21, 24, 27, 30, 33].includes(v);
        },
        message: props => `${props.value} is not a standard gear configuration`
      }
    },
    brakeType: {
      type: String,
      trim: true,
      enum: {
        values: ['rim', 'disc-mechanical', 'disc-hydraulic', 'drum', 'coaster'],
        message: '{VALUE} is not a supported brake type'
      }
    },
    wheelSize: {
      type: Number,
      min: [0, 'Wheel size cannot be negative'],
      validate: {
        validator: function(v: number) {
          // common wheel sizes: 12, 16, 20, 24, 26, 27.5, 29, 650b, 700c (expressed in inches)
          return v === undefined || v === null || [12, 16, 20, 24, 26, 27.5, 29, 650/25.4, 700/25.4].includes(v);
        },
        message: props => `${props.value} inches is not a standard wheel size`
      }
    },
    electricRange: {
      type: Number,
      min: [0, 'Electric range cannot be negative'],
      max: [200, 'Maximum electric range is 200km']
    },
  },
  { _id: false }
);

const RatingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for rating'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating value is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: function(v: number) {
          return Number.isInteger(v);
        },
        message: props => `${props.value} is not a valid rating. Ratings must be whole numbers between 1 and 5.`
      }
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function(date: Date) {
          return date <= new Date();
        },
        message: 'Rating date cannot be in the future'
      }
    },
  },
  { _id: false }
);

const BikeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Bike name is required'],
      trim: true,
      minlength: [2, 'Bike name must be at least 2 characters'],
      maxlength: [100, 'Bike name cannot exceed 100 characters']
    },
    type: {
      type: String,
      enum: {
        values: Object.values(BikeType),
        message: '{VALUE} is not a supported bike type'
      },
      required: [true, 'Bike type is required']
    },
    size: {
      type: String,
      enum: {
        values: Object.values(BikeSize),
        message: '{VALUE} is not a supported bike size'
      },
      required: [true, 'Bike size is required']
    },
    modelYear: {
      type: Number,
      required: [true, 'Model year is required'],
      min: [1900, 'Model year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, `Model year cannot exceed ${new Date().getFullYear() + 1}`],
      validate: {
        validator: function(v: number) {
          return Number.isInteger(v);
        },
        message: props => `${props.value} is not a valid year. Year must be a whole number.`
      }
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
      minlength: [2, 'Color name must be at least 2 characters'],
      maxlength: [30, 'Color name cannot exceed 30 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    frameNumber: {
      type: String,
      required: [true, 'Frame number is required'],
      unique: true,
      trim: true,
      minlength: [5, 'Frame number must be at least 5 characters'],
      maxlength: [50, 'Frame number cannot exceed 50 characters'],
      validate: {
        validator: function(v: string) {
          // Frame numbers typically have alphanumeric format
          return /^[A-Za-z0-9-]+$/.test(v);
        },
        message: props => `${props.value} is not a valid frame number format. Only alphanumeric characters and hyphens are allowed.`
      }
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          // Each feature should be reasonably sized
          return v.every(feature => feature.length >= 2 && feature.length <= 50);
        },
        message: 'Each feature must be between 2 and 50 characters'
      }
    },
    specifications: {
      type: SpecificationsSchema,
      default: () => ({}),
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [0, 'Daily rate cannot be negative'],
      max: [1000, 'Daily rate cannot exceed 1000'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative'],
      max: [100, 'Hourly rate cannot exceed 100'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    weeklyRate: {
      type: Number,
      required: [true, 'Weekly rate is required'],
      min: [0, 'Weekly rate cannot be negative'],
      max: [5000, 'Weekly rate cannot exceed 5000'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BikeStatus),
        message: '{VALUE} is not a valid bike status'
      },
      default: BikeStatus.AVAILABLE,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      trim: true,
      enum: {
        values: ['excellent', 'good', 'fair', 'poor', 'needs_repair'],
        message: '{VALUE} is not a valid condition status'
      }
    },
    maintenanceHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Maintenance',
        validate: {
          validator: async function(v: mongoose.Types.ObjectId) {
            try {
              // Check if the maintenance record exists
              const Maintenance = mongoose.model('Maintenance');
              const exists = await Maintenance.exists({ _id: v });
              return exists !== null;
            } catch (error) {
              logger.error(`Error validating maintenance record: ${error}`);
              return false;
            }
          },
          message: 'Referenced maintenance record does not exist'
        }
      },
    ],
    currentLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Current location is required'],
      validate: {
        validator: async function(v: mongoose.Types.ObjectId) {
          try {
            // Check if the station exists
            const Station = mongoose.model('Station');
            const exists = await Station.exists({ _id: v });
            return exists !== null;
          } catch (error) {
            logger.error(`Error validating station: ${error}`);
            return false;
          }
        },
        message: 'Referenced station does not exist'
      }
    },
    imageUrls: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          // Check that each URL is valid
          return v.every(url => {
            try {
              new URL(url);
              return true;
            } catch (error) {
              return false;
            }
          });
        },
        message: 'One or more image URLs are invalid'
      }
    },
    purchaseDate: {
      type: Date,
      validate: {
        validator: function(date: Date) {
          // Purchase date can't be in the future
          return !date || date <= new Date();
        },
        message: 'Purchase date cannot be in the future'
      }
    },
    purchasePrice: {
      type: Number,
      min: [0, 'Purchase price cannot be negative'],
      max: [50000, 'Purchase price cannot exceed 50000'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return v === undefined || v === null || /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    mileage: {
      type: Number,
      default: 0,
      min: [0, 'Mileage cannot be negative'],
      max: [100000, 'Mileage cannot exceed 100000'],
      validate: {
        validator: function(v: number) {
          // Check that it's a number with at most 1 decimal place
          return /^\d+(\.\d)?$/.test(v.toString());
        },
        message: props => `${props.value} is not a valid mileage. Maximum 1 decimal place allowed.`
      }
    },
    ratings: {
      type: [RatingSchema],
      default: [],
    },
    totalRentals: {
      type: Number,
      default: 0,
      min: [0, 'Total rentals cannot be negative'],
      validate: {
        validator: function(v: number) {
          return Number.isInteger(v);
        },
        message: props => `${props.value} is not a valid rental count. Rental count must be a whole number.`
      }
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for frequent queries - aligned with the indexing strategy document
BikeSchema.index({ type: 1 }, { name: 'idx_bike_type' });
BikeSchema.index({ size: 1 }, { name: 'idx_bike_size' });
BikeSchema.index({ status: 1 }, { name: 'idx_bike_status' });
BikeSchema.index({ currentLocation: 1 }, { name: 'idx_bike_location' });
BikeSchema.index({ dailyRate: 1 }, { name: 'idx_bike_daily_rate' });
BikeSchema.index({ 'ratings.rating': 1 }, { name: 'idx_bike_rating' });
BikeSchema.index({ frameNumber: 1 }, { unique: true, name: 'idx_bike_frame_number' });

// Compound index for common query pattern (type + size + status)
BikeSchema.index(
  { type: 1, size: 1, status: 1 },
  { name: 'idx_bike_type_size_status' }
);

// Text index for searching bike names and descriptions
BikeSchema.index(
  { name: 'text', description: 'text', features: 'text' },
  { 
    weights: { name: 10, description: 5, features: 3 },
    name: 'idx_bike_text_search'
  }
);

// Virtuals

// Average rating with precision control
BikeSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) {
    return 0;
  }
  
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  // Round to 1 decimal place
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Full bike name (combines name, type, size)
BikeSchema.virtual('fullName').get(function() {
  return `${this.name} (${this.type}, ${this.size.toUpperCase()})`;
});

// Age of the bike in years
BikeSchema.virtual('ageInYears').get(function() {
  const currentYear = new Date().getFullYear();
  return currentYear - this.modelYear;
});

// Is the bike electric
BikeSchema.virtual('isElectric').get(function() {
  return this.type === BikeType.ELECTRIC;
});

// Depreciated value based on purchase price, age, and condition
BikeSchema.virtual('depreciatedValue').get(function() {
  if (!this.purchasePrice) return null;
  
  const ageYears = this.ageInYears;
  const conditionFactor = {
    'excellent': 0.9,
    'good': 0.7,
    'fair': 0.5,
    'poor': 0.3,
    'needs_repair': 0.1
  }[this.condition] || 0.5;
  
  // Depreciation formula - 15% per year plus condition adjustment
  const depreciationRate = Math.min(0.8, 0.15 * ageYears);
  const value = this.purchasePrice * (1 - depreciationRate) * conditionFactor;
  
  // Ensure the value doesn't go below 10% of the purchase price
  return Math.max(this.purchasePrice * 0.1, Math.round(value * 100) / 100);
});

// Instance Methods

// Update bike status with optional logging and validation
BikeSchema.methods.updateStatus = function(newStatus: BikeStatus, reason?: string): void {
  const oldStatus = this.status;
  
  // Validate status transition
  const invalidTransitions = {
    [BikeStatus.RETIRED]: [BikeStatus.AVAILABLE, BikeStatus.RENTED, BikeStatus.RESERVED],
    [BikeStatus.DAMAGED]: [BikeStatus.AVAILABLE, BikeStatus.RENTED, BikeStatus.RESERVED]
  };
  
  if (invalidTransitions[oldStatus] && invalidTransitions[oldStatus].includes(newStatus)) {
    throw new Error(`Cannot transition from ${oldStatus} to ${newStatus}. Bike requires maintenance first.`);
  }
  
  this.status = newStatus;
  logger.info(`Bike ${this._id} status changed from ${oldStatus} to ${newStatus}${reason ? ': ' + reason : ''}`);
};

// Add rating with validation and duplicate prevention
BikeSchema.methods.addRating = function(userId: string, rating: number, comment?: string): void {
  // Check if user has already rated this bike
  const existingRatingIndex = this.ratings.findIndex(r => r.userId.toString() === userId.toString());
  
  if (existingRatingIndex >= 0) {
    // Update existing rating
    this.ratings[existingRatingIndex] = {
      userId,
      rating,
      comment,
      date: new Date(),
    };
    logger.info(`User ${userId} updated rating for bike ${this._id} to ${rating}★`);
  } else {
    // Add new rating
    this.ratings.push({
      userId,
      rating,
      comment,
      date: new Date(),
    });
    logger.info(`User ${userId} added new rating for bike ${this._id}: ${rating}★`);
  }
};

// Check availability with date range
BikeSchema.methods.isAvailable = function(startDate?: Date, endDate?: Date): boolean {
  // Basic status check
  if (this.status !== BikeStatus.AVAILABLE) {
    return false;
  }
  
  // If no dates provided, just check the status
  if (!startDate || !endDate) {
    return true;
  }
  
  // This would need to check against reservations, which would require a separate DB query
  // This is a placeholder for that functionality
  return true;
};

// Calculate total maintenance costs with detailed breakdown
BikeSchema.methods.getTotalMaintenanceCosts = async function(options?: {
  startDate?: Date;
  endDate?: Date;
  includeLabor?: boolean;
  includeParts?: boolean;
}): Promise<{total: number; labor?: number; parts?: number; count: number}> {
  if (!this.maintenanceHistory.length) {
    return { total: 0, labor: 0, parts: 0, count: 0 };
  }
  
  const defaultOptions = {
    includeLabor: true,
    includeParts: true,
    ...options
  };
  
  // Populate maintenance records
  await this.populate({
    path: 'maintenanceHistory',
    match: {
      ...(options?.startDate && { scheduledDate: { $gte: options.startDate } }),
      ...(options?.endDate && { scheduledDate: { $lte: options.endDate } })
    }
  });
  
  let result = {
    total: 0,
    labor: 0,
    parts: 0,
    count: this.maintenanceHistory.length
  };
  
  for (const record of this.maintenanceHistory) {
    // Skip incomplete records
    if (!record.totalCost) continue;
    
    result.total += record.totalCost;
    
    if (defaultOptions.includeLabor && record.laborCost) {
      result.labor += record.laborCost;
    }
    
    if (defaultOptions.includeParts && record.parts) {
      const partsCost = record.parts.reduce((sum, part) => sum + (part.cost * part.quantity), 0);
      result.parts += partsCost;
    }
  }
  
  // Round all values to 2 decimal places
  result.total = Math.round(result.total * 100) / 100;
  result.labor = Math.round(result.labor * 100) / 100;
  result.parts = Math.round(result.parts * 100) / 100;
  
  return result;
};

// Calculate maintenance efficiency (cost per km)
BikeSchema.methods.getMaintenanceEfficiency = async function(): Promise<number> {
  if (this.mileage === 0) return 0;
  
  const costs = await this.getTotalMaintenanceCosts();
  return Math.round((costs.total / this.mileage) * 100) / 100;
};

// Update bike mileage
BikeSchema.methods.updateMileage = function(additionalKm: number): void {
  if (additionalKm < 0) {
    throw new Error('Cannot reduce bike mileage');
  }
  
  const oldMileage = this.mileage;
  this.mileage += additionalKm;
  logger.info(`Bike ${this._id} mileage updated from ${oldMileage} to ${this.mileage} km`);
};

// Transfer bike to another station
BikeSchema.methods.transferToStation = function(stationId: string, reason?: string): void {
  const oldStationId = this.currentLocation;
  this.currentLocation = stationId;
  logger.info(`Bike ${this._id} transferred from station ${oldStationId} to ${stationId}${reason ? ': ' + reason : ''}`);
};

// Static Methods

// Find available bikes
BikeSchema.statics.findAvailable = function(options?: {
  type?: BikeType | BikeType[];
  size?: BikeSize | BikeSize[];
  minDailyRate?: number;
  maxDailyRate?: number;
  location?: string;
}) {
  const query: any = { status: BikeStatus.AVAILABLE };
  
  if (options?.type) {
    query.type = Array.isArray(options.type) ? { $in: options.type } : options.type;
  }
  
  if (options?.size) {
    query.size = Array.isArray(options.size) ? { $in: options.size } : options.size;
  }
  
  if (options?.minDailyRate !== undefined) {
    query.dailyRate = { ...query.dailyRate, $gte: options.minDailyRate };
  }
  
  if (options?.maxDailyRate !== undefined) {
    query.dailyRate = { ...query.dailyRate, $lte: options.maxDailyRate };
  }
  
  if (options?.location) {
    query.currentLocation = options.location;
  }
  
  return this.find(query);
};

// Find bikes by type and size
BikeSchema.statics.findByTypeAndSize = function(type: BikeType | BikeType[], size: BikeSize | BikeSize[]) {
  const typeCondition = Array.isArray(type) ? { $in: type } : type;
  const sizeCondition = Array.isArray(size) ? { $in: size } : size;
  
  return this.find({ type: typeCondition, size: sizeCondition });
};

// Find bikes needing maintenance based on mileage threshold
BikeSchema.statics.findNeedingMaintenance = function(mileageThreshold: number = 500) {
  return this.find({
    $or: [
      { status: BikeStatus.MAINTENANCE },
      { status: BikeStatus.DAMAGED },
      { mileage: { $gte: mileageThreshold } }
    ]
  }).sort({ mileage: -1 });
};

// Find top-rated bikes
BikeSchema.statics.findTopRated = function(limit: number = 10, minRatings: number = 3) {
  return this.aggregate([
    // Filter to bikes with at least minRatings ratings
    { $match: { 'ratings.0': { $exists: true } } },
    // Add calculated fields
    { $addFields: {
      ratingCount: { $size: '$ratings' },
      ratingSum: { $sum: '$ratings.rating' }
    }},
    // Filter to bikes with at least minRatings
    { $match: { ratingCount: { $gte: minRatings } } },
    // Add average rating field
    { $addFields: {
      averageRating: { $divide: ['$ratingSum', '$ratingCount'] }
    }},
    // Sort by average rating (descending)
    { $sort: { averageRating: -1 } },
    // Limit results
    { $limit: limit }
  ]);
};

// Find underutilized bikes
BikeSchema.statics.findUnderutilized = function(maxRentals: number = 5, daysSinceAdded: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceAdded);
  
  return this.find({
    totalRentals: { $lte: maxRentals },
    createdAt: { $lte: cutoffDate },
    status: { $nin: [BikeStatus.MAINTENANCE, BikeStatus.DAMAGED, BikeStatus.RETIRED] }
  }).sort({ totalRentals: 1 });
};

// Pre-save middleware
BikeSchema.pre('save', function(next) {
  // If this is a new bike (being created for the first time)
  if (this.isNew) {
    logger.info(`Creating new bike: ${this.name} (${this.frameNumber})`);
  } else if (this.isModified()) {
    // Log what fields were modified
    const modifiedPaths = this.modifiedPaths();
    if (modifiedPaths.length > 0) {
      logger.info(`Updating bike ${this._id} (${this.frameNumber}). Modified fields: ${modifiedPaths.join(', ')}`);
    }
  }
  
  // Ensure the bike doesn't have conflicting status
  if (this.status === BikeStatus.AVAILABLE && this.isModified('status')) {
    // Check condition - don't allow damaged bikes to be marked as available
    if (this.condition === 'needs_repair' || this.condition === 'poor') {
      this.status = BikeStatus.MAINTENANCE;
      logger.warn(`Bike ${this._id} marked as MAINTENANCE because of its condition: ${this.condition}`);
    }
  }
  
  next();
});

// Post-save middleware
BikeSchema.post('save', function(doc) {
  // This could trigger notifications or other side effects
  if (doc.isNew) {
    logger.info(`Bike ${doc._id} (${doc.frameNumber}) successfully created at station ${doc.currentLocation}`);
    // Here you might want to update the station's currentBikes array (in a real application)
  }
});

// Pre-remove middleware
BikeSchema.pre('remove', async function(next) {
  try {
    // Check if bike has any active reservations
    const Reservation = mongoose.model('Reservation');
    const activeReservations = await Reservation.countDocuments({
      bikes: this._id, 
      status: { $in: ['pending', 'confirmed', 'active'] }
    });
    
    if (activeReservations > 0) {
      const err = new Error(`Cannot delete bike ${this._id} - it has ${activeReservations} active reservations`);
      return next(err);
    }
    
    logger.info(`Preparing to delete bike ${this._id} (${this.frameNumber})`);
    next();
  } catch (error) {
    next(error);
  }
});

const Bike = mongoose.model<IBikeDocument>('Bike', BikeSchema);

export default Bike;