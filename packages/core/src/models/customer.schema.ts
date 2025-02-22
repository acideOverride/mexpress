import mongoose, { Schema, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import { Customer } from './customer';

export interface CustomerDocument extends Omit<Customer, 'id'>, Document {
    id: string; // Override id to be string from Document
}

const AddressSchema = new Schema({
    street: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    city: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 50
    },
    state: { 
        type: String, 
        required: true,
        trim: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2
    },
    zip: { 
        type: String, 
        required: true,
        trim: true,
        match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
    }
});

const CustomerSchema = new Schema<CustomerDocument>({
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/, 'Please enter a valid email']
    },
    phone: { 
        type: String,
        trim: true,
        match: [/^\+?1?\d{9,15}$/, 'Please enter a valid phone number']
    },
    address: { 
        type: AddressSchema,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        immutable: true // Prevent modification after creation
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update the updatedAt timestamp before saving
CustomerSchema.pre('save', function(this: CustomerDocument, next: CallbackWithoutResultAndOptionalError) {
    this.updatedAt = new Date();
    next();
});

// Add compound index for common search patterns
CustomerSchema.index({ name: 1, email: 1 });
CustomerSchema.index({ 'address.city': 1, 'address.state': 1 });
CustomerSchema.index({ phone: 1 });

// Add text search index with weights
CustomerSchema.index({
    name: 'text',
    'address.city': 'text',
    email: 'text',
    phone: 'text'
}, {
    weights: {
        name: 10,
        email: 5,
        phone: 3,
        'address.city': 1
    },
    name: 'TextIndex'
});

// Add virtual for full address
CustomerSchema.virtual('fullAddress').get(function(this: CustomerDocument) {
    const address = this.address;
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
});

// Ensure virtuals are included in JSON
CustomerSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

// Add method to format phone number
CustomerSchema.methods.formatPhone = function(): string {
    if (!this.phone) return '';
    // Remove all non-digits
    const digits = this.phone.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (digits.length === 10) {
        return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    // Format as +X (XXX) XXX-XXXX for international
    if (digits.length === 11) {
        return `+${digits[0]} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
    }
    return this.phone;
};

export const CustomerModel = mongoose.model<CustomerDocument>('Customer', CustomerSchema);