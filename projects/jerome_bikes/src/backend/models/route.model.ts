/**
 * Route model
 * Represents bike routes with waypoints, ratings, and difficulty levels
 */
import mongoose, { Schema } from 'mongoose';
import { IRouteDocument } from '../../shared/types/models';

const GeoPointSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const NamedGeoPointSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const POISchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const RouteSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard', 'expert'],
      required: true,
    },
    distance: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedTime: {
      type: Number,
      required: true,
      min: 0,
    },
    elevation: {
      type: Number,
      required: true,
    },
    path: {
      type: {
        type: String,
        enum: ['LineString'],
        default: 'LineString',
        required: true,
      },
      coordinates: {
        type: [[Number]], // Array of [longitude, latitude] pairs
        required: true,
      },
    },
    startPoint: {
      type: NamedGeoPointSchema,
      required: true,
    },
    endPoint: {
      type: NamedGeoPointSchema,
      required: true,
    },
    waypoints: {
      type: [NamedGeoPointSchema],
      default: [],
    },
    pointsOfInterest: {
      type: [POISchema],
      default: [],
    },
    terrain: {
      type: [String],
      default: [],
    },
    bestSeasons: {
      type: [String],
      enum: ['spring', 'summer', 'fall', 'winter'],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    ratings: {
      type: [RatingSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial indexes
RouteSchema.index({ path: '2dsphere' });
RouteSchema.index({ startPoint: '2dsphere' });
RouteSchema.index({ endPoint: '2dsphere' });
RouteSchema.index({ 'pointsOfInterest': '2dsphere' });

// Indexes for frequent queries
RouteSchema.index({ difficulty: 1 });
RouteSchema.index({ distance: 1 });
RouteSchema.index({ averageRating: -1 });
RouteSchema.index({ terrain: 1 });
RouteSchema.index({ tags: 1 });
RouteSchema.index({ isPublic: 1 });
RouteSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search

// Virtual for route popularity (based on ratings count)
RouteSchema.virtual('popularity').get(function() {
  return this.ratings.length;
});

// Method to calculate average rating
RouteSchema.methods.calculateAverageRating = function(): number {
  if (this.ratings.length === 0) {
    return 0;
  }
  
  const sum = this.ratings.reduce((acc: number, cur: any) => acc + cur.rating, 0);
  return sum / this.ratings.length;
};

// Method to add rating
RouteSchema.methods.addRating = function(userId: string, rating: number, comment?: string): void {
  // Check if user has already rated this route
  const existingRatingIndex = this.ratings.findIndex(
    (r: any) => r.userId.toString() === userId.toString()
  );
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    this.ratings[existingRatingIndex].rating = rating;
    this.ratings[existingRatingIndex].comment = comment;
    this.ratings[existingRatingIndex].date = new Date();
  } else {
    // Add new rating
    this.ratings.push({
      userId,
      rating,
      comment,
      date: new Date(),
    });
  }
  
  // Update average rating
  this.averageRating = this.calculateAverageRating();
};

// Pre-save hook to update average rating
RouteSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.averageRating = this.calculateAverageRating();
  }
  next();
});

// Static method to find routes near a location
RouteSchema.statics.findNear = function(longitude: number, latitude: number, maxDistance: number = 10000) {
  return this.find({
    isPublic: true,
    startPoint: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance, // in meters
      },
    },
  });
};

// Static method to find routes by difficulty
RouteSchema.statics.findByDifficulty = function(difficulty: string) {
  return this.find({
    isPublic: true,
    difficulty,
  });
};

// Static method to find routes by terrain type
RouteSchema.statics.findByTerrain = function(terrain: string) {
  return this.find({
    isPublic: true,
    terrain: terrain,
  });
};

// Static method to find top rated routes
RouteSchema.statics.findTopRated = function(limit: number = 10) {
  return this.find({
    isPublic: true,
    averageRating: { $gt: 0 },
  })
    .sort({ averageRating: -1, 'ratings.length': -1 })
    .limit(limit);
};

const Route = mongoose.model<IRouteDocument>('Route', RouteSchema);

export default Route;