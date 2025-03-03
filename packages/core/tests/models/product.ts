import mongoose, { Schema, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  sku: string;
  category: string;
  categories?: Types.ObjectId[];
  tags?: string[];
  stockLevel: number;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends IProduct, Document {
  _id: Types.ObjectId;
}

const VALID_CATEGORIES = [
  'electronics',
  'clothing',
  'books',
  'home',
  'sports',
  'toys',
  'food',
  'health',
  'beauty',
  'automotive'
];

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      validate: {
        validator: (value: number) => {
          // Check if positive and has maximum 2 decimal places
          return value > 0 && /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: 'Price must be positive with maximum 2 decimal places'
      }
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: (value: string) => {
          return /^[A-Z0-9]+$/.test(value);
        },
        message: 'SKU must be alphanumeric'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: VALID_CATEGORIES,
        message: 'Invalid category. Must be one of: ' + VALID_CATEGORIES.join(', ')
      }
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }],
    tags: {
      type: [String],
      validate: {
        validator: (value: string[]) => {
          return value.every(tag => tag.length > 0 && tag.length <= 20);
        },
        message: 'Each tag must be between 1 and 20 characters'
      }
    },
    stockLevel: {
      type: Number,
      required: [true, 'Stock level is required'],
      validate: {
        validator: (value: number) => {
          return value >= 0 && Number.isInteger(value);
        },
        message: 'Stock level must be a non-negative integer'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'Status must be either active or inactive'
      },
      default: 'active'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);

// Indexes for performance
productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ status: 1 });
productSchema.index({ stockLevel: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: 1 });
productSchema.index({ updatedAt: 1 });

// Event emitter for product events
export const productEvents = new EventEmitter();

// Pre-save middleware for data cleanup
productSchema.pre('save', function(next) {
  // Trim all string fields
  if (this.isModified('name')) this.name = this.name.trim();
  if (this.isModified('description') && this.description) {
    this.description = this.description.trim();
  }
  if (this.isModified('sku')) this.sku = this.sku.trim().toUpperCase();
  if (this.isModified('tags')) {
    this.tags = this.tags?.map(tag => tag.trim());
  }
  next();
});

// Post-save hook to emit events
productSchema.post('save', function(doc) {
  if (doc.__v === 0) {
    // New product
    productEvents.emit('created', {
      productId: doc._id,
      sku: doc.sku,
      status: doc.status,
      timestamp: new Date()
    });
  } else {
    // Updated product
    productEvents.emit('updated', {
      productId: doc._id,
      changes: this.getChanges(),
      timestamp: new Date()
    });
  }
});

// Post-update hook for category assignments
productSchema.post('findOneAndUpdate', function(doc) {
  if (doc && this._update && this._update.$push && this._update.$push.categories) {
    const categoryId = this._update.$push.categories;
    productEvents.emit('category_assigned', {
      productId: doc._id,
      categoryId: categoryId,
      timestamp: new Date()
    });
  }
});

// Helper method to get changes (used in post hooks)
productSchema.methods.getChanges = function() {
  const modifiedPaths = this.modifiedPaths();
  const changes: Record<string, any> = {};
  
  modifiedPaths.forEach(path => {
    changes[path] = this.get(path);
  });
  
  return changes;
};

export const Product = mongoose.model<IProductDocument>('Product', productSchema);