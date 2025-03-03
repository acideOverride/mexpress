import mongoose, { Schema, Document, Types } from 'mongoose';
import { EventEmitter } from 'events';

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  _id: Types.ObjectId;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters long'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        },
        message: 'Slug must be URL-friendly: lowercase, alphanumeric with hyphens only'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    isActive: {
      type: Boolean,
      default: true
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
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ name: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });

// Pre-save middleware
categorySchema.pre('save', function(next) {
  // Ensure slug is derived from name if not provided
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  next();
});

// Event emitter for category events
export const categoryEvents = new EventEmitter();

// Post-save hook to emit events
categorySchema.post('save', function(doc) {
  if (doc.__v === 0) {
    // New category
    categoryEvents.emit('created', {
      categoryId: doc._id,
      slug: doc.slug,
      timestamp: new Date()
    });
  } else {
    // Updated category
    categoryEvents.emit('updated', {
      categoryId: doc._id,
      changes: this.getChanges(),
      timestamp: new Date()
    });
  }
});

// Helper method to get changes (used in post hooks)
categorySchema.methods.getChanges = function() {
  const modifiedPaths = this.modifiedPaths();
  const changes: Record<string, any> = {};
  
  modifiedPaths.forEach(path => {
    changes[path] = this.get(path);
  });
  
  return changes;
};

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);