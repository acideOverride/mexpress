/**
 * Rating model
 * Represents customer ratings for bikes, stations, routes, and services
 */
import mongoose, { Schema } from 'mongoose';
import { IRatingDocument } from '../../shared/types/models';

const ResponseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const RatingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entityType: {
      type: String,
      enum: ['bike', 'station', 'route', 'service'],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'entityType',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    title: {
      type: String,
      trim: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    response: {
      type: ResponseSchema,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only leave one rating per entity
RatingSchema.index({ userId: 1, entityType: 1, entityId: 1 }, { unique: true });

// Indexes for frequent queries
RatingSchema.index({ entityType: 1, entityId: 1 });
RatingSchema.index({ rating: -1 }); // For sorting by highest rating
RatingSchema.index({ createdAt: -1 }); // For sorting by newest

// Virtual for formatted date
RatingSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Virtual to determine if rating has response
RatingSchema.virtual('hasResponse').get(function() {
  return !!this.response;
});

// Virtual to determine if rating has images
RatingSchema.virtual('hasImages').get(function() {
  return this.images && this.images.length > 0;
});

// Static method to get average rating for an entity
RatingSchema.statics.getAverageRating = async function(entityType: string, entityId: mongoose.Types.ObjectId): Promise<number> {
  const result = await this.aggregate([
    { $match: { entityType, entityId } },
    { $group: { _id: null, average: { $avg: '$rating' } } },
  ]);
  
  return result.length > 0 ? result[0].average : 0;
};

// Static method to get rating distribution for an entity
RatingSchema.statics.getRatingDistribution = async function(entityType: string, entityId: mongoose.Types.ObjectId): Promise<any> {
  return this.aggregate([
    { $match: { entityType, entityId } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

// Static method to find recent ratings
RatingSchema.statics.findRecent = function(limit: number = 10) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName');
};

// Static method to find top rated entities
RatingSchema.statics.findTopRated = async function(entityType: string, limit: number = 10) {
  const result = await this.aggregate([
    { $match: { entityType } },
    { $group: { _id: '$entityId', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    { $match: { count: { $gte: 3 } } }, // Require at least 3 ratings
    { $sort: { averageRating: -1 } },
    { $limit: limit },
  ]);
  
  return result;
};

const Rating = mongoose.model<IRatingDocument>('Rating', RatingSchema);

export default Rating;