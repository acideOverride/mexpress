/**
 * Reservation model
 * Represents bike rental reservations
 */
import mongoose, { Schema } from 'mongoose';
import { IReservationDocument, ReservationStatus } from '../../shared/types/models';
import { logger } from '../utils/logger';

const WeatherConditionsSchema: Schema = new Schema(
  {
    forecast: {
      type: String,
      trim: true,
      enum: {
        values: ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy', 'snowy', 'windy', 'foggy'],
        message: '{VALUE} is not a supported weather forecast'
      }
    },
    temperature: {
      type: Number,
      min: [-50, 'Temperature must be at least -50°C'],
      max: [60, 'Temperature cannot exceed 60°C'],
      validate: {
        validator: function(v: number) {
          // Allow only numbers with at most 1 decimal place
          return v === undefined || v === null || /^-?\d+(\.\d)?$/.test(v.toString());
        },
        message: props => `${props.value} is not a valid temperature. Maximum 1 decimal place allowed.`
      }
    },
    precipitation: {
      type: Number,
      min: [0, 'Precipitation cannot be negative'],
      max: [100, 'Precipitation cannot exceed 100%'],
      validate: {
        validator: function(v: number) {
          // Allow only whole numbers or numbers with at most 1 decimal place
          return v === undefined || v === null || /^\d+(\.\d)?$/.test(v.toString());
        },
        message: props => `${props.value} is not a valid precipitation percentage. Maximum 1 decimal place allowed.`
      }
    },
    windSpeed: {
      type: Number,
      min: [0, 'Wind speed cannot be negative'],
      max: [200, 'Wind speed cannot exceed 200 km/h']
    },
    forecastDate: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const AdditionalServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      minlength: [2, 'Service name must be at least 2 characters'],
      maxlength: [50, 'Service name cannot exceed 50 characters'],
      enum: {
        values: [
          'helmet rental', 
          'bike lock', 
          'child seat',
          'basket',
          'phone holder',
          'bike lights',
          'guided tour',
          'gps tracker',
          'roadside assistance',
          'rain gear',
          'storage',
          'bike trailer',
          'custom'
        ],
        message: '{VALUE} is not a supported service type'
      }
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Price cannot be negative'],
      max: [1000, 'Price cannot exceed 1000'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [20, 'Quantity cannot exceed 20'],
      default: 1,
      validate: {
        validator: function(v: number) {
          return Number.isInteger(v);
        },
        message: props => `${props.value} is not a valid quantity. Quantity must be a whole number.`
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    isOptional: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

const InsuranceSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: [true, 'Insurance type is required'],
      trim: true,
      enum: {
        values: ['basic', 'standard', 'premium', 'theft', 'damage', 'liability', 'comprehensive'],
        message: '{VALUE} is not a supported insurance type'
      }
    },
    coverageAmount: {
      type: Number,
      required: [true, 'Coverage amount is required'],
      min: [50, 'Coverage amount must be at least 50'],
      max: [5000, 'Coverage amount cannot exceed 5000'],
      validate: {
        validator: function(v: number) {
          // Allow only whole numbers (integer values)
          return Number.isInteger(v);
        },
        message: props => `${props.value} is not a valid coverage amount. Amount must be a whole number.`
      }
    },
    price: {
      type: Number,
      required: [true, 'Insurance price is required'],
      min: [0, 'Insurance price cannot be negative'],
      max: [500, 'Insurance price cannot exceed 500'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    termsAccepted: {
      type: Boolean,
      default: false,
      validate: {
        validator: function(v: boolean) {
          // Insurance can only be applied if terms are accepted
          return v === true;
        },
        message: 'Insurance terms must be accepted'
      }
    },
    deductible: {
      type: Number,
      min: [0, 'Deductible cannot be negative'],
      max: [1000, 'Deductible cannot exceed 1000'],
      default: 0
    }
  },
  { _id: false }
);

const ReturnDetailsSchema: Schema = new Schema(
  {
    actualReturnDate: {
      type: Date,
      required: [true, 'Actual return date is required'],
      validate: {
        validator: function(this: any, returnDate: Date) {
          // Return date can't be before the reservation start date
          if (this.parent && this.parent.parent) {
            const reservation = this.parent.parent;
            return returnDate >= reservation.startDate;
          }
          return true;
        },
        message: 'Return date cannot be before the reservation start date'
      }
    },
    condition: {
      type: String,
      required: [true, 'Bike condition is required'],
      trim: true,
      enum: {
        values: ['excellent', 'good', 'fair', 'poor', 'damaged'],
        message: '{VALUE} is not a valid condition'
      }
    },
    additionalCharges: {
      type: Number,
      default: 0,
      min: [0, 'Additional charges cannot be negative'],
      max: [5000, 'Additional charges cannot exceed 5000'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    damageReport: {
      type: String,
      trim: true,
      maxlength: [1000, 'Damage report cannot exceed 1000 characters']
    },
    returnLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Station'
    },
    lateReturnHours: {
      type: Number,
      min: [0, 'Late return hours cannot be negative'],
      default: 0,
      validate: {
        validator: function(this: any, hours: number) {
          if (this.parent && this.parent.parent) {
            const reservation = this.parent.parent;
            const actualReturn = this.parent.actualReturnDate;
            
            if (actualReturn && reservation.endDate) {
              // Calculate hours between scheduled and actual return
              const diffMs = actualReturn.getTime() - reservation.endDate.getTime();
              const diffHours = diffMs / (1000 * 60 * 60);
              
              // Verify that lateReturnHours matches the actual difference if return is late
              return diffHours <= 0 || Math.abs(hours - Math.ceil(diffHours)) < 0.1;
            }
          }
          return true;
        },
        message: 'Late return hours does not match the actual late duration'
      }
    },
    feedback: {
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
      }
    }
  },
  { _id: false }
);

const ReservationSchema: Schema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required'],
      validate: {
        validator: async function(v: mongoose.Types.ObjectId) {
          try {
            // Check if the customer exists
            const Customer = mongoose.model('Customer');
            const exists = await Customer.exists({ _id: v });
            return exists !== null;
          } catch (error) {
            logger.error(`Error validating customer: ${error}`);
            return false;
          }
        },
        message: 'Referenced customer does not exist'
      }
    },
    bikes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Bike' }],
      required: [true, 'At least one bike is required'],
      validate: [
        {
          validator: function(bikes: any[]) {
            return bikes.length > 0;
          },
          message: 'At least one bike must be included in the reservation'
        },
        {
          validator: function(bikes: any[]) {
            return bikes.length <= 10;
          },
          message: 'Maximum of 10 bikes allowed per reservation'
        },
        {
          validator: async function(bikes: mongoose.Types.ObjectId[]) {
            try {
              // Check if all bikes exist
              const Bike = mongoose.model('Bike');
              const uniqueBikes = [...new Set(bikes.map(id => id.toString()))];
              
              // Check if the number of unique bikes matches the number of bikes
              if (uniqueBikes.length !== bikes.length) {
                return false; // Duplicate bikes are not allowed
              }
              
              const count = await Bike.countDocuments({ 
                _id: { $in: bikes }
              });
              
              return count === bikes.length;
            } catch (error) {
              logger.error(`Error validating bikes: ${error}`);
              return false;
            }
          },
          message: 'One or more referenced bikes do not exist or are duplicated'
        }
      ]
    },
    startStation: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Start station is required'],
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
        message: 'Referenced start station does not exist'
      }
    },
    endStation: {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      validate: {
        validator: async function(v: mongoose.Types.ObjectId) {
          if (!v) return true; // Optional field
          
          try {
            // Check if the station exists
            const Station = mongoose.model('Station');
            const exists = await Station.exists({ _id: v });
            return exists !== null;
          } catch (error) {
            logger.error(`Error validating end station: ${error}`);
            return false;
          }
        },
        message: 'Referenced end station does not exist'
      }
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      validate: {
        validator: function(startDate: Date) {
          const now = new Date();
          const minStartTime = new Date(now.getTime() - (15 * 60 * 1000)); // Allow 15 minutes in the past for API delay
          return startDate >= minStartTime;
        },
        message: 'Start date must be in the future or very recent (within 15 minutes)'
      }
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(this: any, endDate: Date) {
          // End date must be at least 30 minutes after start date
          const minEndTime = new Date(this.startDate.getTime() + (30 * 60 * 1000));
          return endDate >= minEndTime;
        },
        message: 'End date must be at least 30 minutes after start date'
      }
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ReservationStatus),
        message: '{VALUE} is not a valid reservation status'
      },
      default: ReservationStatus.PENDING,
      required: [true, 'Reservation status is required']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
      max: [10000, 'Total amount cannot exceed 10000'],
      validate: {
        validator: function(v: number) {
          // Check that it has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(v.toString());
        },
        message: props => `${props.value} has too many decimal places. Maximum 2 decimal places allowed.`
      }
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'refunded', 'partial'],
        message: '{VALUE} is not a valid payment status'
      },
      default: 'pending',
      required: [true, 'Payment status is required']
    },
    discountCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Discount code cannot exceed 20 characters'],
      validate: {
        validator: function(code: string) {
          return !code || /^[A-Z0-9_-]{3,20}$/.test(code);
        },
        message: 'Discount code can only contain uppercase letters, numbers, underscores, and hyphens'
      }
    },
    discountAmount: {
      type: Number,
      min: [0, 'Discount amount cannot be negative'],
      max: [5000, 'Discount amount cannot exceed 5000'],
      validate: {
        validator: function(this: any, amount: number) {
          // Discount amount cannot be greater than total amount
          if (amount && this.totalAmount) {
            return amount <= this.totalAmount;
          }
          return true;
        },
        message: 'Discount amount cannot be greater than total amount'
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
      validate: {
        validator: async function(v: mongoose.Types.ObjectId) {
          try {
            // Check if the user exists
            const User = mongoose.model('User');
            const exists = await User.exists({ _id: v });
            return exists !== null;
          } catch (error) {
            logger.error(`Error validating user: ${error}`);
            return false;
          }
        },
        message: 'Referenced user does not exist'
      }
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    weatherConditions: {
      type: WeatherConditionsSchema
    },
    additionalServices: {
      type: [AdditionalServiceSchema],
      default: [],
      validate: {
        validator: function(services: any[]) {
          // Check that there are no duplicate service names
          const names = services.map(s => s.name);
          return names.length === new Set(names).size;
        },
        message: 'Duplicate service names are not allowed'
      }
    },
    specialRequirements: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requirements cannot exceed 500 characters']
    },
    insurance: {
      type: InsuranceSchema
    },
    returnDetails: {
      type: ReturnDetailsSchema,
      validate: {
        validator: function(this: any, returnDetails: any) {
          // Return details are required if status is COMPLETED
          return this.status !== ReservationStatus.COMPLETED || returnDetails;
        },
        message: 'Return details are required for completed reservations'
      }
    },
    cancelReason: {
      type: String,
      trim: true,
      maxlength: [200, 'Cancel reason cannot exceed 200 characters'],
      validate: {
        validator: function(this: any, reason: string) {
          // Reason is required if status is CANCELLED
          return this.status !== ReservationStatus.CANCELLED || reason;
        },
        message: 'Cancel reason is required for cancelled reservations'
      }
    },
    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function(this: any, userId: any) {
          // User ID is required if status is CANCELLED
          return this.status !== ReservationStatus.CANCELLED || userId;
        },
        message: 'User ID is required for cancelled reservations'
      }
    },
    cancelledAt: {
      type: Date,
      validate: {
        validator: function(this: any, date: Date) {
          // Date is required if status is CANCELLED
          return this.status !== ReservationStatus.CANCELLED || date;
        },
        message: 'Cancel date is required for cancelled reservations'
      }
    },
    confirmationCode: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null/undefined values
      validate: {
        validator: function(code: string) {
          return !code || /^[A-Z0-9]{6,10}$/.test(code);
        },
        message: 'Confirmation code must be 6-10 uppercase letters or numbers'
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for frequent queries - aligned with the indexing strategy document
ReservationSchema.index({ customerId: 1 }, { name: 'idx_reservation_customer' });
ReservationSchema.index({ status: 1 }, { name: 'idx_reservation_status' });
ReservationSchema.index({ startDate: 1 }, { name: 'idx_reservation_start_date' });
ReservationSchema.index({ endDate: 1 }, { name: 'idx_reservation_end_date' });
ReservationSchema.index({ startStation: 1 }, { name: 'idx_reservation_start_station' });
ReservationSchema.index({ bikes: 1 }, { name: 'idx_reservation_bikes' });
ReservationSchema.index({ confirmationCode: 1 }, { 
  unique: true, 
  sparse: true, 
  name: 'idx_reservation_confirmation_code' 
});
ReservationSchema.index({ paymentStatus: 1 }, { name: 'idx_reservation_payment_status' });

// Compound indexes for common queries
ReservationSchema.index(
  { 'bikes': 1, 'startDate': 1, 'endDate': 1 }, 
  { name: 'idx_reservation_bike_availability' }
); // For availability checks

ReservationSchema.index(
  { 'customerId': 1, 'status': 1 }, 
  { name: 'idx_reservation_customer_status' }
); // For finding customer's active reservations

ReservationSchema.index(
  { 'startStation': 1, 'startDate': 1 }, 
  { name: 'idx_reservation_station_date' }
); // For station management

// Virtuals

// Virtual for reservation duration in days
ReservationSchema.virtual('durationDays').get(function() {
  const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for reservation duration in hours
ReservationSchema.virtual('durationHours').get(function() {
  const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
});

// Virtual for reservation duration in minutes
ReservationSchema.virtual('durationMinutes').get(function() {
  const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60));
});

// Virtual for whether the reservation is active
ReservationSchema.virtual('isActive').get(function() {
  const now = new Date();
  return (
    this.status === ReservationStatus.ACTIVE ||
    (this.status === ReservationStatus.CONFIRMED &&
      this.startDate <= now &&
      this.endDate >= now)
  );
});

// Virtual for whether the reservation is upcoming
ReservationSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return (
    this.status === ReservationStatus.CONFIRMED &&
    this.startDate > now
  );
});

// Virtual for whether the reservation is completed
ReservationSchema.virtual('isCompleted').get(function() {
  return this.status === ReservationStatus.COMPLETED;
});

// Virtual for whether the reservation is cancelled
ReservationSchema.virtual('isCancelled').get(function() {
  return this.status === ReservationStatus.CANCELLED;
});

// Virtual for number of bikes in the reservation
ReservationSchema.virtual('bikeCount').get(function() {
  return this.bikes ? this.bikes.length : 0;
});

// Virtual for whether the reservation has been modified (cancellation, etc.)
ReservationSchema.virtual('isModified').get(function() {
  return this.status !== ReservationStatus.PENDING && 
         this.status !== ReservationStatus.CONFIRMED;
});

// Virtual for formatted confirmation code
ReservationSchema.virtual('formattedConfirmationCode').get(function() {
  if (!this.confirmationCode) return '';
  
  // Format as XXX-XXX if 6 characters, or XXX-XXX-XXXX if longer
  if (this.confirmationCode.length === 6) {
    return `${this.confirmationCode.substring(0, 3)}-${this.confirmationCode.substring(3)}`;
  } else if (this.confirmationCode.length >= 9) {
    return `${this.confirmationCode.substring(0, 3)}-${this.confirmationCode.substring(3, 6)}-${this.confirmationCode.substring(6)}`;
  }
  
  return this.confirmationCode;
});

// Virtual for whether the reservation can be cancelled
ReservationSchema.virtual('canCancel').get(function() {
  // Can only cancel if status is PENDING or CONFIRMED and start date is in the future
  if (this.status !== ReservationStatus.PENDING && this.status !== ReservationStatus.CONFIRMED) {
    return false;
  }
  
  const now = new Date();
  const hoursTillStart = (this.startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Allow cancellation if more than 2 hours before start time
  return hoursTillStart > 2;
});

// Virtual for whether the reservation can be modified
ReservationSchema.virtual('canModify').get(function() {
  // Same rules as cancellation
  return this.canCancel;
});

// Virtual for total services cost
ReservationSchema.virtual('servicesCost').get(function() {
  if (!this.additionalServices || this.additionalServices.length === 0) {
    return 0;
  }
  
  return this.additionalServices.reduce(
    (total, service) => total + (service.price * service.quantity), 
    0
  );
});

// Virtual for bike details (requires population)
ReservationSchema.virtual('bikeDetails', {
  ref: 'Bike',
  localField: 'bikes',
  foreignField: '_id',
  justOne: false  // Returns an array
});

// Virtual for customer details (requires population)
ReservationSchema.virtual('customerDetails', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true
});

// Virtual for start station details (requires population)
ReservationSchema.virtual('startStationDetails', {
  ref: 'Station',
  localField: 'startStation',
  foreignField: '_id',
  justOne: true
});

// Virtual for end station details (requires population)
ReservationSchema.virtual('endStationDetails', {
  ref: 'Station',
  localField: 'endStation',
  foreignField: '_id',
  justOne: true
});

// Instance Methods

// Method to calculate total price
ReservationSchema.methods.calculateTotalPrice = async function(): Promise<number> {
  if (!this.populated('bikes')) {
    await this.populate('bikes');
  }
  
  let total = 0;
  const durationDays = this.durationDays;
  
  // Calculate bike rental costs based on duration
  for (const bike of this.bikes) {
    // For short rentals (under a day), use hourly rate
    if (durationDays < 1) {
      total += bike.hourlyRate * Math.ceil(this.durationHours);
    } 
    // For long rentals (7+ days), use weekly rate
    else if (durationDays >= 7) {
      const weeks = Math.ceil(durationDays / 7);
      total += bike.weeklyRate * weeks;
    } 
    // For rentals 1-6 days, use daily rate
    else {
      total += bike.dailyRate * durationDays;
    }
  }
  
  // Add additional services
  if (this.additionalServices && this.additionalServices.length > 0) {
    for (const service of this.additionalServices) {
      total += service.price * service.quantity;
    }
  }
  
  // Add insurance
  if (this.insurance) {
    total += this.insurance.price;
  }
  
  // Apply discount
  if (this.discountAmount) {
    total -= this.discountAmount;
  }
  
  // Add late return charges if applicable
  if (this.returnDetails && this.returnDetails.additionalCharges) {
    total += this.returnDetails.additionalCharges;
  }
  
  // Ensure total never goes below zero
  return Math.max(0, parseFloat(total.toFixed(2)));
};

// Method to update reservation status with logging
ReservationSchema.methods.updateStatus = function(
  newStatus: ReservationStatus, 
  options?: { 
    reason?: string;
    userId?: string; 
    returnDetails?: any;
  }
): void {
  const oldStatus = this.status;
  
  // Validate the status transition
  const validTransitions: Record<ReservationStatus, ReservationStatus[]> = {
    [ReservationStatus.PENDING]: [
      ReservationStatus.CONFIRMED, 
      ReservationStatus.CANCELLED,
      ReservationStatus.NO_SHOW
    ],
    [ReservationStatus.CONFIRMED]: [
      ReservationStatus.ACTIVE, 
      ReservationStatus.CANCELLED,
      ReservationStatus.NO_SHOW
    ],
    [ReservationStatus.ACTIVE]: [
      ReservationStatus.COMPLETED, 
      ReservationStatus.CANCELLED
    ],
    [ReservationStatus.COMPLETED]: [], // Terminal state
    [ReservationStatus.CANCELLED]: [], // Terminal state
    [ReservationStatus.NO_SHOW]: []    // Terminal state
  };
  
  // Check if the transition is valid
  if (!validTransitions[oldStatus].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
  }
  
  this.status = newStatus;
  
  // Record cancel details
  if (newStatus === ReservationStatus.CANCELLED) {
    this.cancelReason = options?.reason || 'No reason provided';
    this.cancelledBy = options?.userId;
    this.cancelledAt = new Date();
  }
  
  // If completing reservation, add return details
  if (newStatus === ReservationStatus.COMPLETED) {
    if (options?.returnDetails) {
      this.returnDetails = options.returnDetails;
    } else if (!this.returnDetails) {
      this.returnDetails = {
        actualReturnDate: new Date(),
        condition: 'good',
        additionalCharges: 0,
        notes: 'Returned on time in good condition',
      };
    }
  }
  
  logger.info(`Reservation ${this._id} status changed from ${oldStatus} to ${newStatus}${options?.reason ? ': ' + options.reason : ''}`);
};

// Method to add an additional service
ReservationSchema.methods.addService = function(service: {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  isOptional?: boolean;
}): void {
  if (!this.additionalServices) {
    this.additionalServices = [];
  }
  
  // Check if service already exists
  const existingIndex = this.additionalServices.findIndex(s => s.name === service.name);
  
  if (existingIndex >= 0) {
    // Update existing service
    this.additionalServices[existingIndex] = {
      ...this.additionalServices[existingIndex],
      ...service
    };
  } else {
    // Add new service
    this.additionalServices.push(service);
  }
  
  logger.info(`Service "${service.name}" added to reservation ${this._id}`);
};

// Method to remove an additional service
ReservationSchema.methods.removeService = function(serviceName: string): boolean {
  if (!this.additionalServices || this.additionalServices.length === 0) {
    return false;
  }
  
  const initialLength = this.additionalServices.length;
  this.additionalServices = this.additionalServices.filter(
    service => service.name !== serviceName
  );
  
  const removed = this.additionalServices.length < initialLength;
  
  if (removed) {
    logger.info(`Service "${serviceName}" removed from reservation ${this._id}`);
  }
  
  return removed;
};

// Method to apply insurance
ReservationSchema.methods.applyInsurance = function(insurance: {
  type: string;
  coverageAmount: number;
  price: number;
  description?: string;
  termsAccepted: boolean;
  deductible?: number;
}): void {
  if (!insurance.termsAccepted) {
    throw new Error('Insurance terms must be accepted');
  }
  
  this.insurance = insurance;
  logger.info(`Insurance "${insurance.type}" added to reservation ${this._id}`);
};

// Method to apply a discount
ReservationSchema.methods.applyDiscount = function(
  code: string, 
  amount: number
): void {
  if (amount <= 0) {
    throw new Error('Discount amount must be positive');
  }
  
  this.discountCode = code.toUpperCase();
  this.discountAmount = amount;
  
  logger.info(`Discount ${code} for ${amount} applied to reservation ${this._id}`);
};

// Method to generate a confirmation code
ReservationSchema.methods.generateConfirmationCode = function(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  this.confirmationCode = result;
  return result;
};

// Method to check if bikes need to be returned
ReservationSchema.methods.needsReturn = function(): boolean {
  if (this.status !== ReservationStatus.ACTIVE) {
    return false;
  }
  
  const now = new Date();
  return now >= this.endDate;
};

// Static Methods

// Method to check if the bikes are available
ReservationSchema.statics.areBikesAvailable = async function(
  bikeIds: string[],
  startDate: Date,
  endDate: Date,
  excludeReservationId?: string
): Promise<boolean> {
  const query: any = {
    bikes: { $in: bikeIds },
    status: { $nin: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.NO_SHOW] },
    $or: [
      // Overlapping reservations
      { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      { startDate: { $gte: startDate, $lt: endDate } },
      { endDate: { $gt: startDate, $lte: endDate } },
    ],
  };
  
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }
  
  const count = await this.countDocuments(query);
  return count === 0;
};

// Check bike availability and return conflicting reservations
ReservationSchema.statics.checkBikeAvailability = async function(
  bikeIds: string[],
  startDate: Date,
  endDate: Date,
  excludeReservationId?: string
): Promise<{ available: boolean; conflicts?: any[] }> {
  const query: any = {
    bikes: { $in: bikeIds },
    status: { $nin: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.NO_SHOW] },
    $or: [
      // Overlapping reservations
      { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      { startDate: { $gte: startDate, $lt: endDate } },
      { endDate: { $gt: startDate, $lte: endDate } },
    ],
  };
  
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }
  
  const conflicts = await this.find(query)
    .select('_id startDate endDate bikes status')
    .populate('bikes', 'name type size frameNumber')
    .lean();
  
  return {
    available: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
};

// Static method to find active reservations
ReservationSchema.statics.findActive = function() {
  const now = new Date();
  return this.find({
    status: { $in: [ReservationStatus.CONFIRMED, ReservationStatus.ACTIVE] },
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
};

// Static method to find upcoming reservations
ReservationSchema.statics.findUpcoming = function(hoursAhead: number = 24) {
  const now = new Date();
  const future = new Date(now.getTime() + (hoursAhead * 60 * 60 * 1000));
  
  return this.find({
    status: ReservationStatus.CONFIRMED,
    startDate: { $gt: now, $lte: future }
  }).sort({ startDate: 1 });
};

// Static method to find overdue reservations
ReservationSchema.statics.findOverdue = function() {
  const now = new Date();
  return this.find({
    status: ReservationStatus.ACTIVE,
    endDate: { $lt: now }
  }).sort({ endDate: 1 });
};

// Static method to find reservations by date range
ReservationSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    $or: [
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
    ],
  }).sort({ startDate: 1 });
};

// Static method to find reservations for a specific bike
ReservationSchema.statics.findForBike = function(bikeId: string) {
  return this.find({
    bikes: bikeId,
    status: { $ne: ReservationStatus.CANCELLED }
  }).sort({ startDate: -1 });
};

// Static method to find reservations for a customer
ReservationSchema.statics.findForCustomer = function(customerId: string, limit: number = 10) {
  return this.find({
    customerId: customerId
  })
  .sort({ startDate: -1 })
  .limit(limit);
};

// Static method to find reservations by station
ReservationSchema.statics.findByStation = function(stationId: string, upcoming: boolean = true) {
  const now = new Date();
  const query: any = {
    $or: [
      { startStation: stationId },
      { endStation: stationId }
    ]
  };
  
  if (upcoming) {
    query.startDate = { $gte: now };
  }
  
  return this.find(query).sort({ startDate: 1 });
};

// Static method to find reservations that need attention (overdue, about to start, etc.)
ReservationSchema.statics.findNeedingAttention = async function() {
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours from now
  const overdueThreshold = new Date(now.getTime() - (1 * 60 * 60 * 1000)); // 1 hour ago
  
  const overdue = await this.find({
    status: ReservationStatus.ACTIVE,
    endDate: { $lt: now }
  }).sort({ endDate: 1 });
  
  const startingSoon = await this.find({
    status: ReservationStatus.CONFIRMED,
    startDate: { $gt: now, $lte: soonThreshold }
  }).sort({ startDate: 1 });
  
  const notStarted = await this.find({
    status: ReservationStatus.CONFIRMED,
    startDate: { $lt: overdueThreshold }
  }).sort({ startDate: 1 });
  
  return {
    overdue,
    startingSoon,
    notStarted
  };
};

// Hooks

// Pre-save middleware
ReservationSchema.pre('save', async function(next) {
  try {
    // Generate confirmation code for confirmed reservations if not already set
    if (this.isModified('status') && 
        this.status === ReservationStatus.CONFIRMED && 
        !this.confirmationCode) {
      this.generateConfirmationCode();
    }
    
    // If total amount is being modified, recalculate it
    if ((this.isModified('bikes') || 
         this.isModified('startDate') || 
         this.isModified('endDate') || 
         this.isModified('additionalServices') || 
         this.isModified('insurance') || 
         this.isModified('discountAmount') ||
         this.isModified('returnDetails.additionalCharges')) &&
        !this.isModified('totalAmount')) {
      this.totalAmount = await this.calculateTotalPrice();
    }
    
    // Log new reservation creation
    if (this.isNew) {
      logger.info(`New reservation created for customer ${this.customerId} with ${this.bikes.length} bikes from ${this.startDate.toISOString()} to ${this.endDate.toISOString()}`);
    } else if (this.isModified()) {
      const modifiedPaths = this.modifiedPaths();
      if (modifiedPaths.length > 0) {
        logger.info(`Reservation ${this._id} updated - Modified fields: ${modifiedPaths.join(', ')}`);
      }
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

const Reservation = mongoose.model<IReservationDocument>('Reservation', ReservationSchema);

export default Reservation;