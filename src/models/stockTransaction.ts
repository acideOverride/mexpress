import mongoose, { Schema, Document, Types } from 'mongoose';

export type TransactionType = 'increment' | 'decrement';
export type TransactionReason = 'restock' | 'sale' | 'return' | 'adjustment' | 'loss';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface IStockTransaction {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  type: TransactionType;
  quantity: number;
  reason: TransactionReason;
  userId: Types.ObjectId;
  notes?: string;
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStockTransactionDocument extends IStockTransaction, Document {
  _id: Types.ObjectId;
}

const VALID_TRANSACTION_TYPES: TransactionType[] = ['increment', 'decrement'];
const VALID_TRANSACTION_REASONS: TransactionReason[] = ['restock', 'sale', 'return', 'adjustment', 'loss'];
const VALID_TRANSACTION_STATUSES: TransactionStatus[] = ['pending', 'completed', 'failed'];

const stockTransactionSchema = new Schema<IStockTransactionDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: VALID_TRANSACTION_TYPES,
        message: 'Invalid transaction type. Must be one of: ' + VALID_TRANSACTION_TYPES.join(', ')
      }
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      validate: {
        validator: (value: number) => {
          return value > 0 && Number.isInteger(value);
        },
        message: 'Quantity must be a positive integer'
      }
    },
    reason: {
      type: String,
      required: [true, 'Transaction reason is required'],
      enum: {
        values: VALID_TRANSACTION_REASONS,
        message: 'Invalid transaction reason. Must be one of: ' + VALID_TRANSACTION_REASONS.join(', ')
      }
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: {
        values: VALID_TRANSACTION_STATUSES,
        message: 'Invalid transaction status. Must be one of: ' + VALID_TRANSACTION_STATUSES.join(', ')
      },
      default: 'pending'
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
stockTransactionSchema.index({ productId: 1 });
stockTransactionSchema.index({ type: 1 });
stockTransactionSchema.index({ reason: 1 });
stockTransactionSchema.index({ status: 1 });
stockTransactionSchema.index({ userId: 1 });
stockTransactionSchema.index({ createdAt: 1 });
stockTransactionSchema.index({ updatedAt: 1 });

// Pre-save middleware for data cleanup
stockTransactionSchema.pre('save', function(next) {
  // Trim notes if present
  if (this.isModified('notes') && this.notes) {
    this.notes = this.notes.trim();
  }
  next();
});

export const StockTransaction = mongoose.model<IStockTransactionDocument>('StockTransaction', stockTransactionSchema);