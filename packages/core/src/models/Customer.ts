import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: IAddress;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String }
}, { _id: false });

const CustomerSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email address!`
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: AddressSchema,
    default: {}
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create index on email for faster lookups
CustomerSchema.index({ email: 1 }, { unique: true });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);