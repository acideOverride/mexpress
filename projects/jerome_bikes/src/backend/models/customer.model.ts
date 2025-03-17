/**
 * Customer model
 * Represents customer profiles with extended information beyond the User model
 */
import mongoose, { Schema } from 'mongoose';
import { ICustomerDocument } from '../../shared/types/models';
import { logger } from '../utils/logger';

const AddressSchema: Schema = new Schema(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      minlength: [3, 'Street address must be at least 3 characters'],
      maxlength: [100, 'Street address cannot exceed 100 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City must be at least 2 characters'],
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      required: [true, 'State/Province is required'],
      trim: true,
      minlength: [2, 'State/Province must be at least 2 characters'],
      maxlength: [50, 'State/Province cannot exceed 50 characters']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          // Basic postal code format validation - can be customized per country
          return /^[A-Za-z0-9\s-]{3,10}$/.test(v);
        },
        message: props => `${props.value} is not a valid postal code`
      }
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      minlength: [2, 'Country must be at least 2 characters'],
      maxlength: [50, 'Country cannot exceed 50 characters']
    },
  },
  { _id: false }
);

const EmergencyContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          // Basic phone number validation (international format)
          return /^[\d\s\(\)\-\+]{7,20}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number`
      }
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      trim: true,
      enum: {
        values: ['family', 'spouse', 'partner', 'friend', 'colleague', 'other'],
        message: '{VALUE} is not a supported relationship type'
      }
    },
  },
  { _id: false }
);

const NotificationPreferencesSchema: Schema = new Schema(
  {
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    push: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const PreferencesSchema: Schema = new Schema(
  {
    bikeTypes: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          // Validate that each bike type is valid
          const validTypes = ['mountain', 'road', 'hybrid', 'electric', 'city', 'kids'];
          return v.every(type => validTypes.includes(type));
        },
        message: 'One or more bike types are invalid'
      }
    },
    bikeSize: {
      type: String,
      trim: true,
      enum: {
        values: ['xs', 's', 'm', 'l', 'xl'],
        message: '{VALUE} is not a supported bike size'
      }
    },
    notificationPreferences: {
      type: NotificationPreferencesSchema,
      default: () => ({
        email: true,
        sms: false,
        push: false
      }),
    },
    preferredPickupStations: {
      type: [Schema.Types.ObjectId],
      ref: 'Station',
      default: []
    },
    preferredRentalDuration: {
      type: String,
      enum: {
        values: ['hourly', 'daily', 'weekly'],
        message: '{VALUE} is not a supported rental duration'
      }
    }
  },
  { _id: false }
);

const PaymentMethodSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: [true, 'Payment method type is required'],
      trim: true,
      enum: {
        values: ['credit', 'debit', 'paypal', 'applepay', 'googlepay', 'other'],
        message: '{VALUE} is not a supported payment method type'
      }
    },
    lastFour: {
      type: String,
      required: [true, 'Last four digits are required'],
      trim: true,
      match: [/^\d{4}$/, 'Last four digits must be exactly 4 digits'],
    },
    expiryDate: {
      type: String,
      required: [true, 'Expiry date is required'],
      trim: true,
      match: [/^\d{2}\/\d{2}$/, 'Expiry date must be in format MM/YY'],
      validate: {
        validator: function(v: string) {
          // Validate expiry date is in the future
          const [month, year] = v.split('/').map(part => parseInt(part, 10));
          const expiryDate = new Date();
          expiryDate.setFullYear(2000 + year, month - 1, 1); // Set to first day of month
          return expiryDate > new Date();
        },
        message: 'Payment method has expired'
      }
    },
    cardholderName: {
      type: String,
      trim: true,
      minlength: [2, 'Cardholder name must be at least 2 characters'],
      maxlength: [100, 'Cardholder name cannot exceed 100 characters']
    },
    billingAddress: {
      type: String,
      trim: true
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: [50, 'Nickname cannot exceed 50 characters']
    }
  },
  { _id: false }
);

const CustomerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
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
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          // Basic phone number validation (international format)
          return /^[\d\s\(\)\-\+]{7,20}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number`
      }
    },
    address: {
      type: AddressSchema,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(date: Date) {
          if (!date) return true; // Optional field
          
          // Must be at least 16 years old and not in the future
          const sixteenYearsAgo = new Date();
          sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
          
          return date <= sixteenYearsAgo && date <= new Date();
        },
        message: 'Customer must be at least 16 years old and date of birth cannot be in the future'
      }
    },
    emergencyContact: {
      type: EmergencyContactSchema,
    },
    preferences: {
      type: PreferencesSchema,
      default: () => ({}),
    },
    paymentMethods: {
      type: [PaymentMethodSchema],
      default: [],
      validate: {
        validator: function(methods: any[]) {
          // Ensure at most one payment method is set as default
          const defaultCount = methods.filter(method => method.isDefault).length;
          return defaultCount <= 1;
        },
        message: 'Only one payment method can be set as default'
      }
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: [0, 'Loyalty points cannot be negative'],
    },
    memberSince: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function(date: Date) {
          return date <= new Date();
        },
        message: 'Member since date cannot be in the future'
      }
    },
    rentalHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        validate: {
          validator: async function(v: mongoose.Types.ObjectId) {
            try {
              // Check if the reservation exists
              const Reservation = mongoose.model('Reservation');
              const exists = await Reservation.exists({ _id: v });
              return exists !== null;
            } catch (error) {
              logger.error(`Error validating reservation: ${error}`);
              return false;
            }
          },
          message: 'Referenced reservation does not exist'
        }
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    verificationStatus: {
      type: String,
      enum: {
        values: ['unverified', 'pending', 'verified', 'rejected'],
        message: '{VALUE} is not a valid verification status'
      },
      default: 'unverified'
    },
    identificationDocuments: [{
      type: {
        type: String,
        enum: {
          values: ['passport', 'drivers_license', 'national_id', 'other'],
          message: '{VALUE} is not a valid identification document type'
        },
        required: true
      },
      documentNumber: {
        type: String,
        trim: true
      },
      expiryDate: {
        type: Date
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for frequent queries - aligned with the indexing strategy document
CustomerSchema.index({ userId: 1 }, { unique: true, name: 'idx_customer_user_id' });
CustomerSchema.index({ phone: 1 }, { name: 'idx_customer_phone' });
CustomerSchema.index({ 'address.postalCode': 1 }, { name: 'idx_customer_postal_code' });
CustomerSchema.index({ loyaltyPoints: -1 }, { name: 'idx_customer_loyalty_points' }); // For loyalty program queries
CustomerSchema.index({ memberSince: 1 }, { name: 'idx_customer_member_since' }); // For membership duration queries
CustomerSchema.index({ verificationStatus: 1 }, { name: 'idx_customer_verification' }); // For finding customers by verification status

// Compound indexes for common queries
CustomerSchema.index(
  { 'preferences.bikeTypes': 1, 'preferences.bikeSize': 1 },
  { name: 'idx_customer_bike_preferences' }
);

// Text index for searching
CustomerSchema.index(
  { notes: 'text' },
  { name: 'idx_customer_text_search' }
);

// Virtuals

// Virtual for user's full information - populated reference to User model
CustomerSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Full name virtual (combines first and last name from User model)
CustomerSchema.virtual('fullName').get(function() {
  if (this.populated('userInfo')) {
    return `${this.userInfo.firstName} ${this.userInfo.lastName}`;
  }
  return undefined;
});

// Email virtual from User model
CustomerSchema.virtual('email').get(function() {
  if (this.populated('userInfo')) {
    return this.userInfo.email;
  }
  return undefined;
});

// Age virtual
CustomerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return undefined;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Membership duration in days
CustomerSchema.virtual('membershipDuration').get(function() {
  const today = new Date();
  const memberSince = new Date(this.memberSince);
  const diffTime = Math.abs(today.getTime() - memberSince.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Loyalty tier based on points and rental history
CustomerSchema.virtual('loyaltyTier').get(function() {
  const pointsThresholds = [
    { tier: 'bronze', threshold: 0 },
    { tier: 'silver', threshold: 100 },
    { tier: 'gold', threshold: 500 },
    { tier: 'platinum', threshold: 1000 }
  ];
  
  const rentalCountBonus = Math.min(500, this.rentalHistory.length * 10);
  const adjustedPoints = this.loyaltyPoints + rentalCountBonus;
  
  for (let i = pointsThresholds.length - 1; i >= 0; i--) {
    if (adjustedPoints >= pointsThresholds[i].threshold) {
      return pointsThresholds[i].tier;
    }
  }
  
  return 'bronze'; // Default tier
});

// Has active rentals
CustomerSchema.virtual('hasActiveRentals').get(async function() {
  try {
    const Reservation = mongoose.model('Reservation');
    const activeCount = await Reservation.countDocuments({
      customerId: this._id,
      status: { $in: ['pending', 'confirmed', 'active'] }
    });
    return activeCount > 0;
  } catch (error) {
    logger.error(`Error checking active rentals: ${error}`);
    return false;
  }
});

// Instance Methods

// Method to add loyalty points
CustomerSchema.methods.addLoyaltyPoints = function(points: number, reason?: string): void {
  if (points <= 0) {
    throw new Error('Points must be positive');
  }
  
  const oldPoints = this.loyaltyPoints;
  this.loyaltyPoints += points;
  
  logger.info(`Customer ${this._id} earned ${points} points: ${oldPoints} → ${this.loyaltyPoints}${reason ? ' - ' + reason : ''}`);
};

// Method to deduct loyalty points
CustomerSchema.methods.deductLoyaltyPoints = function(points: number, reason?: string): boolean {
  if (points <= 0) {
    throw new Error('Points must be positive');
  }
  
  if (this.loyaltyPoints < points) {
    return false; // Not enough points
  }
  
  const oldPoints = this.loyaltyPoints;
  this.loyaltyPoints -= points;
  
  logger.info(`Customer ${this._id} spent ${points} points: ${oldPoints} → ${this.loyaltyPoints}${reason ? ' - ' + reason : ''}`);
  return true;
};

// Method to check if customer has default payment method
CustomerSchema.methods.hasDefaultPaymentMethod = function(): boolean {
  return this.paymentMethods.some((method: any) => method.isDefault);
};

// Method to get rental count
CustomerSchema.methods.getRentalCount = function(): number {
  return this.rentalHistory.length;
};

// Method to add a payment method
CustomerSchema.methods.addPaymentMethod = function(paymentMethod: any, setAsDefault: boolean = false): void {
  // If this should be the default and there's already a default, update existing methods
  if (setAsDefault && this.hasDefaultPaymentMethod()) {
    this.paymentMethods.forEach((method: any) => {
      method.isDefault = false;
    });
  }
  
  // Set default flag based on parameter
  paymentMethod.isDefault = setAsDefault || (!this.hasDefaultPaymentMethod() && this.paymentMethods.length === 0);
  
  // Add the new payment method
  this.paymentMethods.push(paymentMethod);
  logger.info(`Customer ${this._id} added payment method: ${paymentMethod.type} ending in ${paymentMethod.lastFour}`);
};

// Method to remove a payment method
CustomerSchema.methods.removePaymentMethod = function(methodId: string): boolean {
  const initialLength = this.paymentMethods.length;
  const wasDefault = this.paymentMethods.find((m: any) => m._id.toString() === methodId)?.isDefault;
  
  // Remove the payment method
  this.paymentMethods = this.paymentMethods.filter((method: any) => method._id.toString() !== methodId);
  
  // If we removed a method and it was the default, set a new default if there are other methods
  if (this.paymentMethods.length < initialLength && wasDefault && this.paymentMethods.length > 0) {
    this.paymentMethods[0].isDefault = true;
  }
  
  const removed = this.paymentMethods.length < initialLength;
  if (removed) {
    logger.info(`Customer ${this._id} removed payment method: ${methodId}`);
  }
  
  return removed;
};

// Method to check if a customer is eligible for a rental based on age and verification
CustomerSchema.methods.isEligibleForRental = function(): { eligible: boolean; reason?: string } {
  // Check age
  if (this.age && this.age < 18) {
    return { eligible: false, reason: 'Customer must be at least 18 years old' };
  }
  
  // Check verification status
  if (this.verificationStatus !== 'verified') {
    return { eligible: false, reason: 'Customer identity not verified' };
  }
  
  // Check payment methods
  if (!this.hasDefaultPaymentMethod()) {
    return { eligible: false, reason: 'No default payment method' };
  }
  
  return { eligible: true };
};

// Method to add a rental to history
CustomerSchema.methods.addRentalToHistory = function(reservationId: string): void {
  if (!this.rentalHistory.includes(reservationId)) {
    this.rentalHistory.push(reservationId);
    logger.info(`Customer ${this._id} added reservation ${reservationId} to rental history`);
  }
};

// Method to set default payment method
CustomerSchema.methods.setDefaultPaymentMethod = function(methodId: string): boolean {
  const method = this.paymentMethods.find((m: any) => m._id.toString() === methodId);
  if (!method) {
    return false;
  }
  
  // Remove default from all methods
  this.paymentMethods.forEach((m: any) => {
    m.isDefault = false;
  });
  
  // Set the specified method as default
  method.isDefault = true;
  logger.info(`Customer ${this._id} set payment method ${methodId} as default`);
  
  return true;
};

// Static Methods

// Find customers by bike preferences
CustomerSchema.statics.findByBikePreferences = function(bikeType: string, bikeSize?: string) {
  const query: any = { 'preferences.bikeTypes': bikeType };
  
  if (bikeSize) {
    query['preferences.bikeSize'] = bikeSize;
  }
  
  return this.find(query);
};

// Find customers by loyalty tier
CustomerSchema.statics.findByLoyaltyPointsRange = function(minPoints: number, maxPoints?: number) {
  const query: any = { loyaltyPoints: { $gte: minPoints } };
  
  if (maxPoints !== undefined) {
    query.loyaltyPoints.$lte = maxPoints;
  }
  
  return this.find(query).sort({ loyaltyPoints: -1 });
};

// Find customers who haven't rented in a while
CustomerSchema.statics.findInactiveCustomers = function(daysSinceLastRental: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastRental);
  
  return this.aggregate([
    // Join with reservations
    {
      $lookup: {
        from: 'reservations',
        localField: 'rentalHistory',
        foreignField: '_id',
        as: 'reservations'
      }
    },
    // Add field with the most recent reservation date
    {
      $addFields: {
        lastRentalDate: {
          $max: '$reservations.endDate'
        }
      }
    },
    // Filter for customers who haven't rented since the cutoff date or have never rented
    {
      $match: {
        $or: [
          { lastRentalDate: { $lt: cutoffDate } },
          { lastRentalDate: { $exists: false } },
          { rentalHistory: { $size: 0 } }
        ]
      }
    },
    // Sort by last rental date (oldest first)
    {
      $sort: {
        lastRentalDate: 1
      }
    }
  ]);
};

// Find top customers by rental count or spending
CustomerSchema.statics.findTopCustomers = function(limit: number = 10, criteria: 'rentalCount' | 'loyaltyPoints' = 'rentalCount') {
  if (criteria === 'rentalCount') {
    return this.aggregate([
      {
        $addFields: {
          rentalCount: { $size: '$rentalHistory' }
        }
      },
      {
        $sort: { rentalCount: -1 }
      },
      {
        $limit: limit
      }
    ]);
  } else {
    return this.find()
      .sort({ loyaltyPoints: -1 })
      .limit(limit);
  }
};

// Hooks

// When creating a customer, ensure at least one payment method is set as default
CustomerSchema.pre('save', function(next) {
  if (this.isModified('paymentMethods') && this.paymentMethods.length > 0) {
    const hasDefault = this.paymentMethods.some((method: any) => method.isDefault);
    if (!hasDefault) {
      // Set the first payment method as default
      this.paymentMethods[0].isDefault = true;
      logger.info(`Customer ${this._id} - No default payment method set, using first payment method as default`);
    }
  }
  
  // Log customer creation and updates
  if (this.isNew) {
    logger.info(`Creating new customer profile linked to user ${this.userId}`);
  } else if (this.isModified()) {
    const modifiedPaths = this.modifiedPaths();
    if (modifiedPaths.length > 0) {
      logger.info(`Updating customer ${this._id} - Modified fields: ${modifiedPaths.join(', ')}`);
    }
  }
  
  next();
});

// Post save hook for customer
CustomerSchema.post('save', function(doc) {
  if (doc.isNew) {
    logger.info(`Customer ${doc._id} successfully created for user ${doc.userId}`);
  }
});

const Customer = mongoose.model<ICustomerDocument>('Customer', CustomerSchema);

export default Customer;