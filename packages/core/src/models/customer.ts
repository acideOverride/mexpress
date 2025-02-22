import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomer {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICustomerDocument extends ICustomer, Document {
  _id: Types.ObjectId;
}

const customerSchema = new Schema<ICustomerDocument>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email format'
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (value: string) => {
          // Allow only digits and plus sign, minimum 8 digits
          return /^\+?[1-9]\d{7,14}$/.test(value);
        },
        message: 'Invalid phone number format. Must be 8-15 digits with optional + prefix.'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be either active or inactive'
      },
      default: 'active'
    },
    syncStatus: {
      type: String,
      enum: {
        values: ['pending', 'synced', 'failed'],
        message: 'SyncStatus must be pending, synced, or failed'
      },
      default: 'pending'
    }
  },
  {
    // Enable timestamps
    timestamps: {
      createdAt: true,
      updatedAt: true,
      currentTime: () => new Date()
    },
    // Disable version key
    versionKey: false,
    // Enable virtuals in JSON
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);

// Remove duplicate index
customerSchema.index({ email: 1 }, { unique: true, background: true });
customerSchema.index({ phone: 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ syncStatus: 1 });

// Virtual for full name
customerSchema.virtual('fullName').get(function(this: ICustomerDocument) {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware for data cleanup
customerSchema.pre('save', function(next) {
  // Trim all string fields
  if (this.isModified('firstName')) this.firstName = this.firstName.trim();
  if (this.isModified('lastName')) this.lastName = this.lastName.trim();
  if (this.isModified('email')) this.email = this.email.trim().toLowerCase();
  if (this.isModified('phone')) this.phone = this.phone.trim();
  next();
});

export const Customer = mongoose.model<ICustomerDocument>('Customer', customerSchema);