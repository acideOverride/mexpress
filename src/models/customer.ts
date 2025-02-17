import { Schema, model, Document, Model, HydratedDocument, CallbackError, Types } from 'mongoose';

export interface ICustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  externalIds: {
    hiboutik?: string;
    ringover?: string;
  };
  verificationStatus: 'verified' | 'pending' | 'error';
  syncStatus: {
    hiboutik: 'synced' | 'pending' | 'error';
    ringover: 'synced' | 'pending' | 'error';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerDocument extends ICustomer, Document {
  _id: Types.ObjectId;
}

export interface ICustomerModel extends Model<ICustomerDocument> {
  // Add any static methods here if needed
}

const customerSchema = new Schema<ICustomerDocument, ICustomerModel>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number in E.164 format'],
      index: true,
    },
    externalIds: {
      hiboutik: {
        type: String,
        sparse: true,
      },
      ringover: {
        type: String,
        sparse: true,
      },
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'error'],
      default: 'pending',
      index: true,
    },
    syncStatus: {
      hiboutik: {
        type: String,
        enum: ['synced', 'pending', 'error'],
        default: 'pending',
      },
      ringover: {
        type: String,
        enum: ['synced', 'pending', 'error'],
        default: 'pending',
      },
    },
  },
  {
    timestamps: true,
    collection: 'customers',
  }
);

// Pre-save middleware for validation
customerSchema.pre('save', async function(next: (err?: CallbackError) => void) {
  if (this.isModified('email')) {
    const CustomerModel = this.constructor as Model<ICustomerDocument>;
    const existingCustomer = await CustomerModel.findOne({ email: this.email }) as ICustomerDocument | null;
    if (existingCustomer && existingCustomer._id.toString() !== this._id.toString()) {
      next(new Error('Email address already exists'));
      return;
    }
  }
  next();
});

// Create compound index for sync status
customerSchema.index({ 'syncStatus.hiboutik': 1, 'syncStatus.ringover': 1 });

export const Customer = model<ICustomerDocument, ICustomerModel>('Customer', customerSchema);