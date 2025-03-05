import mongoose, { Schema, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import { User } from './user';
import bcrypt from 'bcrypt';

export interface UserDocument extends Omit<User, 'id'>, Document {
    id: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password in queries by default
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String,
        select: false // Don't include refresh token in queries by default
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        immutable: true
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Add text search index with weights for MegaSearch
UserSchema.index({
  email: 'text',
  firstName: 'text',
  lastName: 'text'
}, {
  weights: {
    email: 10,
    firstName: 5,
    lastName: 5
  },
  name: 'UserTextIndex'
});

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(this: UserDocument, next: CallbackWithoutResultAndOptionalError) {
    this.updatedAt = new Date();
    next();
});

// Hash password before saving
UserSchema.pre('save', async function(this: UserDocument, next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password!, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        // Need to select password explicitly since it's not included by default
        const user = await UserModel.findById(this._id).select('+password');
        if (!user?.password) {
            return false;
        }
        return bcrypt.compare(candidatePassword, user.password);
    } catch (error) {
        return false;
    }
};

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);