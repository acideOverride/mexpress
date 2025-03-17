/**
 * Maintenance model
 * Represents bike maintenance and repair records in the Jerome Bikes system
 * Complete implementation with validation, methods, and indexes
 */
import mongoose, { Schema, Document, Query } from 'mongoose';
import { IMaintenanceDocument, MaintenanceType, MaintenanceStatus, BikeStatus } from '../../shared/types/models';
import logger from '../utils/logger';

/**
 * Issue sub-schema for maintenance records
 * Represents individual issues that need to be addressed in a maintenance record
 */
const IssueSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: [true, 'Issue category is required'],
      trim: true,
      validate: {
        validator: function(value: string) {
          // Check if the category is in the valid list
          const validCategories = [
            'brakes', 'drivetrain', 'wheels', 'frame', 'suspension', 
            'electronics', 'controls', 'cosmetic', 'safety', 'other'
          ];
          return validCategories.includes(value.toLowerCase());
        },
        message: 'Issue category must be one of the predefined categories'
      }
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
      minlength: [10, 'Issue description must be at least 10 characters'],
      maxlength: [500, 'Issue description cannot exceed 500 characters']
    },
    severity: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Severity must be low, medium, high, or critical'
      },
      required: [true, 'Issue severity is required'],
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolutionDetails: {
      type: String,
      trim: true,
      validate: {
        validator: function(value: string) {
          // Resolution details are required if the issue is resolved
          return !this.resolved || (this.resolved && value && value.length >= 10);
        },
        message: 'Resolution details are required when issue is marked as resolved'
      }
    },
    resolvedDate: {
      type: Date,
      validate: {
        validator: function(value: Date) {
          return !this.resolved || (this.resolved && value);
        },
        message: 'Resolved date is required when issue is marked as resolved'
      }
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function(value: mongoose.Types.ObjectId) {
          return !this.resolved || (this.resolved && value);
        },
        message: 'Resolver information is required when issue is marked as resolved'
      }
    }
  },
  { _id: false }
);

/**
 * Part sub-schema for maintenance records
 * Represents parts used in a maintenance procedure
 */
const PartSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
      minlength: [2, 'Part name must be at least 2 characters'],
      maxlength: [100, 'Part name cannot exceed 100 characters']
    },
    partNumber: {
      type: String,
      trim: true,
      index: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: function(value: number) {
          return Number.isInteger(value);
        },
        message: 'Quantity must be a whole number'
      }
    },
    cost: {
      type: Number,
      required: [true, 'Part cost is required'],
      min: [0, 'Cost cannot be negative'],
      validate: {
        validator: function(value: number) {
          // Allow up to 2 decimal places for currency
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: 'Cost must have at most 2 decimal places'
      }
    },
    category: {
      type: String,
      enum: {
        values: [
          'brake', 'chain', 'derailleur', 'wheel', 'tire', 'tube', 
          'suspension', 'frame', 'handlebar', 'seat', 'pedal', 
          'gear', 'electronic', 'accessory', 'other'
        ],
        message: 'Part category must be one of the predefined categories'
      }
    },
    isWarranty: {
      type: Boolean,
      default: false
    },
    warrantyDetails: {
      type: String,
      trim: true,
      validate: {
        validator: function(value: string) {
          return !this.isWarranty || (this.isWarranty && value && value.length > 0);
        },
        message: 'Warranty details are required for warranty parts'
      }
    }
  },
  { _id: false }
);

/**
 * Main Maintenance schema
 */
const MaintenanceSchema: Schema = new Schema(
  {
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: 'Bike',
      required: [true, 'Bike reference is required'],
      validate: {
        validator: async function(value: mongoose.Types.ObjectId) {
          try {
            // Check if the bike exists
            const Bike = mongoose.model('Bike');
            const bike = await Bike.findById(value);
            return !!bike;
          } catch (error) {
            return false;
          }
        },
        message: 'Referenced bike does not exist'
      },
      index: true
    },
    maintenanceType: {
      type: String,
      enum: {
        values: Object.values(MaintenanceType),
        message: `Maintenance type must be one of: ${Object.values(MaintenanceType).join(', ')}`
      },
      required: [true, 'Maintenance type is required'],
      index: true
    },
    status: {
      type: String,
      enum: {
        values: Object.values(MaintenanceStatus),
        message: `Status must be one of: ${Object.values(MaintenanceStatus).join(', ')}`
      },
      default: MaintenanceStatus.SCHEDULED,
      index: true
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required'],
      validate: {
        validator: function(value: Date) {
          // For scheduled maintenance, the date should be in the future when created
          if (this.isNew && this.status === MaintenanceStatus.SCHEDULED) {
            return value >= new Date();
          }
          return true;
        },
        message: 'Scheduled date must be in the future for new maintenance records'
      },
      index: true
    },
    completedDate: {
      type: Date,
      validate: {
        validator: function(value: Date) {
          // If status is completed, require completed date
          if (this.status === MaintenanceStatus.COMPLETED) {
            return !!value;
          }
          
          // If completed date is provided, it should be after scheduled date
          if (value && this.scheduledDate) {
            return value >= this.scheduledDate;
          }
          
          return true;
        },
        message: 'Completed date is required for completed maintenance and must be after scheduled date'
      }
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: async function(value: mongoose.Types.ObjectId) {
          // Only validate if a technician is assigned
          if (!value) return true;
          
          try {
            // Check if the user exists and is a technician or maintenance staff
            const User = mongoose.model('User');
            const user = await User.findById(value);
            return !!user && ['technician', 'maintenance', 'staff'].includes(user.role);
          } catch (error) {
            return false;
          }
        },
        message: 'Referenced technician must exist and have appropriate role'
      },
      index: true
    },
    description: {
      type: String,
      required: [true, 'Maintenance description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    issues: {
      type: [IssueSchema],
      default: [],
      validate: {
        validator: function(issues: any[]) {
          // For maintenance records with 'repair' type, there should be at least one issue
          if (this.maintenanceType === MaintenanceType.REPAIR && issues.length === 0) {
            return false;
          }
          return true;
        },
        message: 'At least one issue is required for repair maintenance'
      }
    },
    parts: {
      type: [PartSchema],
      default: []
    },
    laborHours: {
      type: Number,
      min: [0, 'Labor hours cannot be negative'],
      validate: {
        validator: function(value: number) {
          // Labor hours are required for completed maintenance
          if (this.status === MaintenanceStatus.COMPLETED) {
            return value !== undefined && value >= 0;
          }
          return true;
        },
        message: 'Labor hours are required for completed maintenance'
      }
    },
    laborRate: {
      type: Number,
      min: [0, 'Labor rate cannot be negative'],
      default: 50 // Default hourly rate
    },
    laborCost: {
      type: Number,
      min: [0, 'Labor cost cannot be negative'],
      validate: {
        validator: function(value: number) {
          // If both laborCost and laborHours are provided, ensure laborCost is consistent
          if (value !== undefined && this.laborHours !== undefined && this.laborRate !== undefined) {
            const expectedLaborCost = parseFloat((this.laborHours * this.laborRate).toFixed(2));
            return Math.abs(value - expectedLaborCost) < 0.01; // Allow small floating point differences
          }
          return true;
        },
        message: 'Labor cost must be consistent with labor hours and rate'
      }
    },
    totalCost: {
      type: Number,
      min: [0, 'Total cost cannot be negative'],
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Priority must be low, medium, high, or critical'
      },
      default: 'medium'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters']
    },
    recommendations: {
      type: String,
      trim: true,
      maxlength: [1000, 'Recommendations cannot exceed 1000 characters']
    },
    nextMaintenanceDate: {
      type: Date,
      validate: {
        validator: function(value: Date) {
          // Next maintenance date should be after completed date for completed maintenance
          if (this.status === MaintenanceStatus.COMPLETED && value && this.completedDate) {
            return value > this.completedDate;
          }
          return true;
        },
        message: 'Next maintenance date must be after completed date'
      }
    },
    nextMaintenanceType: {
      type: String,
      enum: {
        values: Object.values(MaintenanceType),
        message: `Next maintenance type must be one of: ${Object.values(MaintenanceType).join(', ')}`
      }
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(images: string[]) {
          // Validate that all image URLs have proper format
          return images.every(url => {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          });
        },
        message: 'All images must be valid image URLs'
      },
      maxlength: [10, 'Cannot add more than 10 images']
    },
    mileageBefore: {
      type: Number,
      min: [0, 'Mileage cannot be negative']
    },
    mileageAfter: {
      type: Number,
      min: [0, 'Mileage cannot be negative'],
      validate: {
        validator: function(value: number) {
          // Mileage after should be greater than or equal to mileage before
          if (this.mileageBefore !== undefined && value !== undefined) {
            return value >= this.mileageBefore;
          }
          return true;
        },
        message: 'Mileage after maintenance must be greater than or equal to mileage before'
      }
    },
    procedureFollowed: {
      type: String,
      enum: {
        values: ['standard', 'manufacturer', 'custom'],
        message: 'Procedure followed must be standard, manufacturer, or custom'
      },
      default: 'standard'
    },
    qualityCheck: {
      type: Boolean,
      default: false
    },
    qualityCheckBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function(value: mongoose.Types.ObjectId) {
          // Quality check user is required if quality check is true
          return !this.qualityCheck || (this.qualityCheck && value);
        },
        message: 'Quality checker information is required when quality check is performed'
      }
    },
    qualityCheckDate: {
      type: Date,
      validate: {
        validator: function(value: Date) {
          // Quality check date is required if quality check is true
          return !this.qualityCheck || (this.qualityCheck && value);
        },
        message: 'Quality check date is required when quality check is performed'
      }
    },
    qualityCheckNotes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// --- INDEXES ---

// Named indexes for frequent queries
MaintenanceSchema.index({ bikeId: 1 }, { name: 'idx_maintenance_bike' });
MaintenanceSchema.index({ status: 1 }, { name: 'idx_maintenance_status' });
MaintenanceSchema.index({ maintenanceType: 1 }, { name: 'idx_maintenance_type' });
MaintenanceSchema.index({ scheduledDate: 1 }, { name: 'idx_maintenance_scheduled_date' });
MaintenanceSchema.index({ completedDate: 1 }, { name: 'idx_maintenance_completed_date' });
MaintenanceSchema.index({ technician: 1 }, { name: 'idx_maintenance_technician' });
MaintenanceSchema.index({ 'parts.partNumber': 1 }, { name: 'idx_maintenance_part_number' });

// Compound indexes for common query patterns
MaintenanceSchema.index(
  { bikeId: 1, status: 1 }, 
  { name: 'idx_maintenance_bike_status' }
);
MaintenanceSchema.index(
  { bikeId: 1, scheduledDate: 1 }, 
  { name: 'idx_maintenance_bike_scheduled' }
);
MaintenanceSchema.index(
  { maintenanceType: 1, status: 1 }, 
  { name: 'idx_maintenance_type_status' }
);
MaintenanceSchema.index(
  { technician: 1, status: 1 }, 
  { name: 'idx_maintenance_technician_status' }
);

// Text index for searching
MaintenanceSchema.index(
  { description: 'text', notes: 'text', recommendations: 'text', 'issues.description': 'text' },
  { 
    name: 'idx_maintenance_text_search',
    weights: {
      description: 10,
      'issues.description': 5,
      notes: 3,
      recommendations: 1
    }
  }
);

// --- VIRTUALS ---

// Virtual for days overdue (if not completed and past scheduled date)
MaintenanceSchema.virtual('daysOverdue').get(function(this: IMaintenanceDocument) {
  if (
    this.status === MaintenanceStatus.COMPLETED || 
    this.status === MaintenanceStatus.CANCELLED || 
    this.scheduledDate > new Date()
  ) {
    return 0;
  }
  
  const diffTime = Math.abs(new Date().getTime() - this.scheduledDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for resolved issues count
MaintenanceSchema.virtual('resolvedIssuesCount').get(function() {
  return this.issues.filter((issue: any) => issue.resolved).length;
});

// Virtual for total issues count
MaintenanceSchema.virtual('totalIssuesCount').get(function() {
  return this.issues.length;
});

// Virtual for issue resolution percentage
MaintenanceSchema.virtual('issueResolutionPercentage').get(function() {
  if (!this.issues.length) return 0;
  return Math.round((this.resolvedIssuesCount / this.totalIssuesCount) * 100);
});

// Virtual for maintenance duration in hours
MaintenanceSchema.virtual('durationHours').get(function() {
  if (!this.completedDate || this.status !== MaintenanceStatus.COMPLETED) return null;
  
  const startDate = new Date(this.scheduledDate);
  const endDate = new Date(this.completedDate);
  
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
});

// Virtual for isCritical flag
MaintenanceSchema.virtual('isCritical').get(function() {
  return this.priority === 'critical' || 
    this.issues.some((issue: any) => issue.severity === 'critical');
});

// Virtual for isOverdue flag
MaintenanceSchema.virtual('isOverdue').get(function() {
  return this.daysOverdue > 0;
});

// Virtual for maintenance status display
MaintenanceSchema.virtual('statusDisplay').get(function() {
  if (this.status === MaintenanceStatus.SCHEDULED && this.isOverdue) {
    return 'Overdue';
  }
  
  switch (this.status) {
    case MaintenanceStatus.SCHEDULED:
      return 'Scheduled';
    case MaintenanceStatus.IN_PROGRESS:
      return 'In Progress';
    case MaintenanceStatus.COMPLETED:
      return 'Completed';
    case MaintenanceStatus.CANCELLED:
      return 'Cancelled';
    case MaintenanceStatus.POSTPONED:
      return 'Postponed';
    default:
      return this.status;
  }
});

// Virtual for estimated completion date
MaintenanceSchema.virtual('estimatedCompletionDate').get(function() {
  if (this.status === MaintenanceStatus.COMPLETED) {
    return this.completedDate;
  }
  
  if (this.status === MaintenanceStatus.CANCELLED) {
    return null;
  }
  
  // Standard completion time estimates based on maintenance type
  const estimatedHours: { [key: string]: number } = {
    [MaintenanceType.ROUTINE]: 2,
    [MaintenanceType.INSPECTION]: 1,
    [MaintenanceType.REPAIR]: 4,
    [MaintenanceType.CLEANING]: 1,
    [MaintenanceType.UPGRADE]: 3
  };
  
  // Adjust based on number of issues for repairs
  let additionalHours = 0;
  if (this.maintenanceType === MaintenanceType.REPAIR && this.issues.length > 0) {
    // Add 1 hour per issue beyond the first
    additionalHours = Math.max(0, this.issues.length - 1);
    
    // Add more time for critical issues
    additionalHours += this.issues.filter((issue: any) => 
      issue.severity === 'critical'
    ).length;
  }
  
  const totalHours = estimatedHours[this.maintenanceType] + additionalHours;
  
  // For in-progress maintenance, estimate 8 working hours per day
  if (this.status === MaintenanceStatus.IN_PROGRESS) {
    const now = new Date();
    const estimatedDate = new Date(now);
    estimatedDate.setHours(now.getHours() + totalHours);
    return estimatedDate;
  }
  
  // For scheduled or postponed, use scheduled date plus estimated hours
  const scheduledDate = new Date(this.scheduledDate);
  const estimatedDate = new Date(scheduledDate);
  estimatedDate.setHours(scheduledDate.getHours() + totalHours);
  return estimatedDate;
});

// --- INSTANCE METHODS ---

// Method to calculate total parts cost
MaintenanceSchema.methods.calculatePartsCost = function(): number {
  if (!this.parts || this.parts.length === 0) {
    return 0;
  }
  
  const totalPartsCost = this.parts.reduce((total: number, part: any) => {
    // Only include non-warranty parts in the cost
    if (part.isWarranty) return total;
    return total + (part.cost * part.quantity);
  }, 0);
  
  // Round to 2 decimal places
  return parseFloat(totalPartsCost.toFixed(2));
};

// Method to calculate labor cost
MaintenanceSchema.methods.calculateLaborCost = function(): number {
  if (!this.laborHours) {
    return 0;
  }
  
  const rate = this.laborRate || 50; // Default hourly rate if not specified
  const laborCost = this.laborHours * rate;
  
  // Round to 2 decimal places
  return parseFloat(laborCost.toFixed(2));
};

// Method to calculate total maintenance cost
MaintenanceSchema.methods.calculateTotalCost = function(): number {
  let total = 0;
  
  // Add parts cost
  total += this.calculatePartsCost();
  
  // Add labor cost
  total += this.calculateLaborCost();
  
  // Round to 2 decimal places
  return parseFloat(total.toFixed(2));
};

// Method to update maintenance status with validation
MaintenanceSchema.methods.updateStatus = async function(
  newStatus: MaintenanceStatus, 
  details: { 
    completedDate?: Date; 
    notes?: string;
    laborHours?: number;
    mileageAfter?: number;
    technician?: mongoose.Types.ObjectId;
  } = {}
): Promise<boolean> {
  try {
    const oldStatus = this.status;
    
    // Validate status transition
    const validTransitions: { [key: string]: MaintenanceStatus[] } = {
      [MaintenanceStatus.SCHEDULED]: [
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.POSTPONED,
        MaintenanceStatus.CANCELLED
      ],
      [MaintenanceStatus.IN_PROGRESS]: [
        MaintenanceStatus.COMPLETED,
        MaintenanceStatus.POSTPONED
      ],
      [MaintenanceStatus.POSTPONED]: [
        MaintenanceStatus.SCHEDULED,
        MaintenanceStatus.IN_PROGRESS,
        MaintenanceStatus.CANCELLED
      ],
      [MaintenanceStatus.COMPLETED]: [],
      [MaintenanceStatus.CANCELLED]: [MaintenanceStatus.SCHEDULED]
    };
    
    if (!validTransitions[oldStatus].includes(newStatus)) {
      logger.error(`Invalid maintenance status transition from ${oldStatus} to ${newStatus} for maintenance ${this._id}`);
      return false;
    }
    
    // Update status
    this.status = newStatus;
    
    // Handle status-specific updates
    if (newStatus === MaintenanceStatus.COMPLETED) {
      this.completedDate = details.completedDate || new Date();
      
      if (details.laborHours !== undefined) {
        this.laborHours = details.laborHours;
      } else if (!this.laborHours) {
        // Default to 1 hour if not specified
        this.laborHours = 1;
      }
      
      if (details.mileageAfter !== undefined) {
        this.mileageAfter = details.mileageAfter;
      }
      
      // Calculate costs
      this.laborCost = this.calculateLaborCost();
      this.totalCost = this.calculateTotalCost();
      
      // Update bike status to available
      const Bike = mongoose.model('Bike');
      const bikeUpdate = await Bike.findByIdAndUpdate(
        this.bikeId,
        { status: BikeStatus.AVAILABLE },
        { new: true }
      );
      
      if (!bikeUpdate) {
        logger.warn(`Failed to update bike status to available for bike ${this.bikeId}`);
      }
      
      // If technician not already set, use the one provided in details
      if (!this.technician && details.technician) {
        this.technician = details.technician;
      }
      
      // Resolve all unresolved issues
      this.issues.forEach((issue: any) => {
        if (!issue.resolved) {
          issue.resolved = true;
          issue.resolvedDate = new Date();
          issue.resolvedBy = this.technician;
          issue.resolutionDetails = issue.resolutionDetails || 'Resolved during maintenance completion';
        }
      });
      
      logger.info(`Maintenance ${this._id} for bike ${this.bikeId} completed with total cost $${this.totalCost}`);
    } else if (newStatus === MaintenanceStatus.IN_PROGRESS) {
      // Update bike status to maintenance
      const Bike = mongoose.model('Bike');
      const bikeUpdate = await Bike.findByIdAndUpdate(
        this.bikeId,
        { status: BikeStatus.MAINTENANCE },
        { new: true }
      );
      
      if (!bikeUpdate) {
        logger.warn(`Failed to update bike status to maintenance for bike ${this.bikeId}`);
      }
      
      // Capture mileage before if not already set
      if (!this.mileageBefore && bikeUpdate) {
        this.mileageBefore = bikeUpdate.mileage;
      }
      
      logger.info(`Maintenance ${this._id} for bike ${this.bikeId} marked as in progress`);
    } else if (newStatus === MaintenanceStatus.CANCELLED) {
      // Update bike status to available
      const Bike = mongoose.model('Bike');
      const bikeUpdate = await Bike.findByIdAndUpdate(
        this.bikeId,
        { status: BikeStatus.AVAILABLE },
        { new: true }
      );
      
      if (!bikeUpdate) {
        logger.warn(`Failed to update bike status to available for bike ${this.bikeId}`);
      }
      
      logger.info(`Maintenance ${this._id} for bike ${this.bikeId} cancelled`);
    }
    
    // Add notes if provided
    if (details.notes) {
      this.notes = this.notes 
        ? `${this.notes}\n[${new Date().toISOString()}] Status changed from ${oldStatus} to ${newStatus}: ${details.notes}`
        : `[${new Date().toISOString()}] Status changed from ${oldStatus} to ${newStatus}: ${details.notes}`;
    } else {
      this.notes = this.notes 
        ? `${this.notes}\n[${new Date().toISOString()}] Status changed from ${oldStatus} to ${newStatus}`
        : `[${new Date().toISOString()}] Status changed from ${oldStatus} to ${newStatus}`;
    }
    
    return true;
  } catch (error) {
    logger.error(`Error updating maintenance status: ${error.message}`);
    return false;
  }
};

// Method to add or update an issue
MaintenanceSchema.methods.addIssue = function(
  issue: {
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved?: boolean;
    resolutionDetails?: string;
    resolvedDate?: Date;
    resolvedBy?: mongoose.Types.ObjectId;
  }
): boolean {
  try {
    // Validate required fields
    if (!issue.category || !issue.description || !issue.severity) {
      logger.error('Issue requires category, description, and severity');
      return false;
    }
    
    // Validate category
    const validCategories = [
      'brakes', 'drivetrain', 'wheels', 'frame', 'suspension', 
      'electronics', 'controls', 'cosmetic', 'safety', 'other'
    ];
    
    if (!validCategories.includes(issue.category.toLowerCase())) {
      logger.error(`Invalid issue category: ${issue.category}`);
      return false;
    }
    
    // Validate severity
    const validSeverity = ['low', 'medium', 'high', 'critical'];
    if (!validSeverity.includes(issue.severity)) {
      logger.error(`Invalid issue severity: ${issue.severity}`);
      return false;
    }
    
    // If issue is marked as resolved, ensure resolution details are provided
    if (issue.resolved) {
      if (!issue.resolutionDetails) {
        logger.error('Resolution details are required for resolved issues');
        return false;
      }
      
      if (!issue.resolvedDate) {
        issue.resolvedDate = new Date();
      }
    }
    
    // Add the issue to the issues array
    this.issues.push(issue);
    
    // Update priority if this is a critical issue
    if (issue.severity === 'critical' && this.priority !== 'critical') {
      this.priority = 'critical';
    }
    
    return true;
  } catch (error) {
    logger.error(`Error adding issue: ${error.message}`);
    return false;
  }
};

// Method to resolve an issue
MaintenanceSchema.methods.resolveIssue = function(
  issueIndex: number,
  resolution: {
    resolutionDetails: string;
    resolvedBy: mongoose.Types.ObjectId;
    resolvedDate?: Date;
  }
): boolean {
  try {
    // Validate issue index
    if (issueIndex < 0 || issueIndex >= this.issues.length) {
      logger.error(`Invalid issue index: ${issueIndex}`);
      return false;
    }
    
    // Validate resolution details
    if (!resolution.resolutionDetails) {
      logger.error('Resolution details are required');
      return false;
    }
    
    if (!resolution.resolvedBy) {
      logger.error('Resolver information is required');
      return false;
    }
    
    // Update the issue
    const issue = this.issues[issueIndex];
    issue.resolved = true;
    issue.resolutionDetails = resolution.resolutionDetails;
    issue.resolvedBy = resolution.resolvedBy;
    issue.resolvedDate = resolution.resolvedDate || new Date();
    
    return true;
  } catch (error) {
    logger.error(`Error resolving issue: ${error.message}`);
    return false;
  }
};

// Method to add a part to maintenance
MaintenanceSchema.methods.addPart = function(
  part: {
    name: string;
    partNumber?: string;
    quantity: number;
    cost: number;
    category?: string;
    isWarranty?: boolean;
    warrantyDetails?: string;
  }
): boolean {
  try {
    // Validate required fields
    if (!part.name || part.quantity === undefined || part.cost === undefined) {
      logger.error('Part requires name, quantity, and cost');
      return false;
    }
    
    // Validate quantity
    if (!Number.isInteger(part.quantity) || part.quantity < 1) {
      logger.error(`Invalid quantity: ${part.quantity}`);
      return false;
    }
    
    // Validate cost
    if (part.cost < 0) {
      logger.error(`Invalid cost: ${part.cost}`);
      return false;
    }
    
    // Validate category if provided
    if (part.category) {
      const validCategories = [
        'brake', 'chain', 'derailleur', 'wheel', 'tire', 'tube', 
        'suspension', 'frame', 'handlebar', 'seat', 'pedal', 
        'gear', 'electronic', 'accessory', 'other'
      ];
      
      if (!validCategories.includes(part.category.toLowerCase())) {
        logger.error(`Invalid part category: ${part.category}`);
        return false;
      }
    }
    
    // If part is warranty, ensure warranty details are provided
    if (part.isWarranty && !part.warrantyDetails) {
      logger.error('Warranty details are required for warranty parts');
      return false;
    }
    
    // Add the part to the parts array
    this.parts.push(part);
    
    // Update total cost
    this.totalCost = this.calculateTotalCost();
    
    return true;
  } catch (error) {
    logger.error(`Error adding part: ${error.message}`);
    return false;
  }
};

// Method to assign a technician
MaintenanceSchema.methods.assignTechnician = async function(
  technicianId: mongoose.Types.ObjectId
): Promise<boolean> {
  try {
    if (!technicianId) {
      logger.error('Technician ID is required');
      return false;
    }
    
    // Validate technician
    const User = mongoose.model('User');
    const technician = await User.findById(technicianId);
    
    if (!technician) {
      logger.error(`Technician with ID ${technicianId} not found`);
      return false;
    }
    
    if (!['technician', 'maintenance', 'staff'].includes(technician.role)) {
      logger.error(`User ${technicianId} does not have appropriate role to be assigned as technician`);
      return false;
    }
    
    // Assign technician
    this.technician = technicianId;
    
    // Add a note about the assignment
    this.notes = this.notes 
      ? `${this.notes}\n[${new Date().toISOString()}] Technician assigned: ${technician.firstName} ${technician.lastName}`
      : `[${new Date().toISOString()}] Technician assigned: ${technician.firstName} ${technician.lastName}`;
    
    logger.info(`Technician ${technician.firstName} ${technician.lastName} assigned to maintenance ${this._id}`);
    
    return true;
  } catch (error) {
    logger.error(`Error assigning technician: ${error.message}`);
    return false;
  }
};

// Method to perform quality check
MaintenanceSchema.methods.performQualityCheck = async function(
  checker: mongoose.Types.ObjectId,
  notes?: string
): Promise<boolean> {
  try {
    if (!checker) {
      logger.error('Quality checker ID is required');
      return false;
    }
    
    // Validate checker
    const User = mongoose.model('User');
    const qualityChecker = await User.findById(checker);
    
    if (!qualityChecker) {
      logger.error(`Quality checker with ID ${checker} not found`);
      return false;
    }
    
    // Set quality check fields
    this.qualityCheck = true;
    this.qualityCheckBy = checker;
    this.qualityCheckDate = new Date();
    
    if (notes) {
      this.qualityCheckNotes = notes;
    }
    
    logger.info(`Quality check performed by ${qualityChecker.firstName} ${qualityChecker.lastName} for maintenance ${this._id}`);
    
    return true;
  } catch (error) {
    logger.error(`Error performing quality check: ${error.message}`);
    return false;
  }
};

// Method to set next maintenance
MaintenanceSchema.methods.scheduleNextMaintenance = function(
  nextMaintenanceDate: Date,
  nextMaintenanceType: MaintenanceType
): boolean {
  try {
    if (!nextMaintenanceDate) {
      logger.error('Next maintenance date is required');
      return false;
    }
    
    if (!Object.values(MaintenanceType).includes(nextMaintenanceType)) {
      logger.error(`Invalid next maintenance type: ${nextMaintenanceType}`);
      return false;
    }
    
    // Ensure next maintenance date is in the future
    if (nextMaintenanceDate <= new Date()) {
      logger.error('Next maintenance date must be in the future');
      return false;
    }
    
    // Ensure next maintenance date is after the completed date if this maintenance is completed
    if (this.status === MaintenanceStatus.COMPLETED && this.completedDate) {
      if (nextMaintenanceDate <= this.completedDate) {
        logger.error('Next maintenance date must be after the completed date');
        return false;
      }
    }
    
    // Set next maintenance fields
    this.nextMaintenanceDate = nextMaintenanceDate;
    this.nextMaintenanceType = nextMaintenanceType;
    
    // Add recommendation for next maintenance
    this.recommendations = this.recommendations 
      ? `${this.recommendations}\nNext ${nextMaintenanceType} maintenance recommended on ${nextMaintenanceDate.toLocaleDateString()}.`
      : `Next ${nextMaintenanceType} maintenance recommended on ${nextMaintenanceDate.toLocaleDateString()}.`;
    
    return true;
  } catch (error) {
    logger.error(`Error scheduling next maintenance: ${error.message}`);
    return false;
  }
};

// Method to mark maintenance as completed
MaintenanceSchema.methods.complete = async function(
  details: {
    completedDate?: Date;
    laborHours?: number;
    mileageAfter?: number;
    notes?: string;
    technician?: mongoose.Types.ObjectId;
    recommendations?: string;
    nextMaintenanceDate?: Date;
    nextMaintenanceType?: MaintenanceType;
  } = {}
): Promise<boolean> {
  try {
    const result = await this.updateStatus(
      MaintenanceStatus.COMPLETED,
      {
        completedDate: details.completedDate,
        laborHours: details.laborHours,
        mileageAfter: details.mileageAfter,
        notes: details.notes,
        technician: details.technician
      }
    );
    
    if (!result) {
      return false;
    }
    
    // Set recommendations if provided
    if (details.recommendations) {
      this.recommendations = details.recommendations;
    }
    
    // Schedule next maintenance if provided
    if (details.nextMaintenanceDate && details.nextMaintenanceType) {
      this.scheduleNextMaintenance(details.nextMaintenanceDate, details.nextMaintenanceType);
    } else {
      // Auto-generate next maintenance recommendation based on maintenance type
      const nextDateMonths: { [key: string]: number } = {
        [MaintenanceType.ROUTINE]: 3,
        [MaintenanceType.INSPECTION]: 1,
        [MaintenanceType.REPAIR]: 6,
        [MaintenanceType.CLEANING]: 1,
        [MaintenanceType.UPGRADE]: 12
      };
      
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + nextDateMonths[this.maintenanceType]);
      
      this.nextMaintenanceDate = nextDate;
      this.nextMaintenanceType = MaintenanceType.ROUTINE;
      
      this.recommendations = this.recommendations 
        ? `${this.recommendations}\nNext routine maintenance recommended on ${nextDate.toLocaleDateString()}.`
        : `Next routine maintenance recommended on ${nextDate.toLocaleDateString()}.`;
    }
    
    return true;
  } catch (error) {
    logger.error(`Error completing maintenance: ${error.message}`);
    return false;
  }
};

// --- STATIC METHODS ---

// Static method to find upcoming maintenance
MaintenanceSchema.statics.findUpcoming = function(
  days: number = 7,
  options: {
    bikeId?: mongoose.Types.ObjectId;
    maintenanceType?: MaintenanceType;
    technician?: mongoose.Types.ObjectId;
  } = {}
) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  const query: any = {
    scheduledDate: { $gte: today, $lte: futureDate },
    status: { $in: [MaintenanceStatus.SCHEDULED, MaintenanceStatus.POSTPONED] },
  };
  
  // Apply filters if provided
  if (options.bikeId) {
    query.bikeId = options.bikeId;
  }
  
  if (options.maintenanceType) {
    query.maintenanceType = options.maintenanceType;
  }
  
  if (options.technician) {
    query.technician = options.technician;
  }
  
  return this.find(query)
    .sort('scheduledDate')
    .populate('bikeId', 'name frameNumber type')
    .populate('technician', 'firstName lastName')
    .exec();
};

// Static method to find overdue maintenance
MaintenanceSchema.statics.findOverdue = function(
  options: {
    bikeId?: mongoose.Types.ObjectId;
    maintenanceType?: MaintenanceType;
    technician?: mongoose.Types.ObjectId;
    minDaysOverdue?: number;
  } = {}
) {
  const today = new Date();
  
  const query: any = {
    scheduledDate: { $lt: today },
    status: { $in: [MaintenanceStatus.SCHEDULED, MaintenanceStatus.POSTPONED] },
  };
  
  // Apply filters if provided
  if (options.bikeId) {
    query.bikeId = options.bikeId;
  }
  
  if (options.maintenanceType) {
    query.maintenanceType = options.maintenanceType;
  }
  
  if (options.technician) {
    query.technician = options.technician;
  }
  
  // For filtering by minimum days overdue, we'll do post-query filtering
  const minDaysOverdue = options.minDaysOverdue || 0;
  
  return this.find(query)
    .sort('scheduledDate')
    .populate('bikeId', 'name frameNumber type')
    .populate('technician', 'firstName lastName')
    .then(maintenances => {
      // Filter by minimum days overdue
      if (minDaysOverdue > 0) {
        return maintenances.filter(maintenance => maintenance.daysOverdue >= minDaysOverdue);
      }
      return maintenances;
    });
};

// Static method to find maintenance by bike
MaintenanceSchema.statics.findByBike = function(
  bikeId: mongoose.Types.ObjectId,
  options: {
    status?: MaintenanceStatus | MaintenanceStatus[];
    limit?: number;
    includeCompleted?: boolean;
  } = {}
) {
  if (!bikeId) {
    logger.error('Bike ID is required');
    return Promise.resolve([]);
  }
  
  const query: any = { bikeId };
  
  // Apply status filter
  if (options.status) {
    query.status = Array.isArray(options.status) ? { $in: options.status } : options.status;
  } else if (options.includeCompleted === false) {
    query.status = { $ne: MaintenanceStatus.COMPLETED };
  }
  
  let queryBuilder = this.find(query)
    .sort({ scheduledDate: -1 })
    .populate('bikeId', 'name frameNumber type')
    .populate('technician', 'firstName lastName');
  
  // Apply limit if provided
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  return queryBuilder.exec();
};

// Static method to find maintenance by technician
MaintenanceSchema.statics.findByTechnician = function(
  technicianId: mongoose.Types.ObjectId,
  options: {
    status?: MaintenanceStatus | MaintenanceStatus[];
    limit?: number;
    from?: Date;
    to?: Date;
  } = {}
) {
  if (!technicianId) {
    logger.error('Technician ID is required');
    return Promise.resolve([]);
  }
  
  const query: any = { technician: technicianId };
  
  // Apply status filter
  if (options.status) {
    query.status = Array.isArray(options.status) ? { $in: options.status } : options.status;
  }
  
  // Apply date range filter
  if (options.from || options.to) {
    query.scheduledDate = {};
    
    if (options.from) {
      query.scheduledDate.$gte = options.from;
    }
    
    if (options.to) {
      query.scheduledDate.$lte = options.to;
    }
  }
  
  let queryBuilder = this.find(query)
    .sort({ scheduledDate: -1 })
    .populate('bikeId', 'name frameNumber type');
  
  // Apply limit if provided
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  return queryBuilder.exec();
};

// Static method to find maintenance with specific issue category
MaintenanceSchema.statics.findByIssueCategory = function(
  category: string,
  options: {
    onlyUnresolved?: boolean;
    severity?: string;
    limit?: number;
  } = {}
) {
  if (!category) {
    logger.error('Issue category is required');
    return Promise.resolve([]);
  }
  
  // Build the query with a filter for the issues array
  const query: any = { 'issues.category': category };
  
  // Filter for unresolved issues
  if (options.onlyUnresolved) {
    query['issues'] = {
      $elemMatch: {
        category,
        resolved: false
      }
    };
  }
  
  // Filter by severity
  if (options.severity) {
    if (query['issues']) {
      query['issues'].$elemMatch.severity = options.severity;
    } else {
      query['issues'] = {
        $elemMatch: {
          category,
          severity: options.severity
        }
      };
    }
  }
  
  let queryBuilder = this.find(query)
    .sort({ scheduledDate: -1 })
    .populate('bikeId', 'name frameNumber type')
    .populate('technician', 'firstName lastName');
  
  // Apply limit if provided
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  return queryBuilder.exec();
};

// Static method to find maintenance with used parts
MaintenanceSchema.statics.findByPartUsed = function(
  partName: string,
  options: {
    partNumber?: string;
    minQuantity?: number;
    from?: Date;
    to?: Date;
    limit?: number;
  } = {}
) {
  if (!partName) {
    logger.error('Part name is required');
    return Promise.resolve([]);
  }
  
  // Build the query
  const query: any = { 'parts.name': { $regex: new RegExp(partName, 'i') } };
  
  // Filter by part number if provided
  if (options.partNumber) {
    query['parts.partNumber'] = options.partNumber;
  }
  
  // Filter by minimum quantity if provided
  if (options.minQuantity) {
    query['parts'] = {
      $elemMatch: {
        name: { $regex: new RegExp(partName, 'i') },
        quantity: { $gte: options.minQuantity }
      }
    };
    
    if (options.partNumber) {
      query['parts'].$elemMatch.partNumber = options.partNumber;
    }
  }
  
  // Apply date range filter
  if (options.from || options.to) {
    query.scheduledDate = {};
    
    if (options.from) {
      query.scheduledDate.$gte = options.from;
    }
    
    if (options.to) {
      query.scheduledDate.$lte = options.to;
    }
  }
  
  let queryBuilder = this.find(query)
    .sort({ scheduledDate: -1 })
    .populate('bikeId', 'name frameNumber type');
  
  // Apply limit if provided
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  return queryBuilder.exec();
};

// Static method to get maintenance statistics
MaintenanceSchema.statics.getMaintenanceStats = async function(
  options: {
    from?: Date;
    to?: Date;
    bikeId?: mongoose.Types.ObjectId;
    maintenanceType?: MaintenanceType;
  } = {}
) {
  try {
    // Build date range filter
    const dateFilter: any = {};
    
    if (options.from || options.to) {
      if (options.from) {
        dateFilter.$gte = options.from;
      }
      
      if (options.to) {
        dateFilter.$lte = options.to;
      }
    } else {
      // Default to last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      dateFilter.$gte = sixMonthsAgo;
    }
    
    // Build match stage
    const matchStage: any = {};
    
    if (Object.keys(dateFilter).length > 0) {
      matchStage.scheduledDate = dateFilter;
    }
    
    if (options.bikeId) {
      matchStage.bikeId = options.bikeId;
    }
    
    if (options.maintenanceType) {
      matchStage.maintenanceType = options.maintenanceType;
    }
    
    // Run aggregation for statistics
    const stats = await this.aggregate([
      { $match: matchStage },
      { $group: {
        _id: null,
        totalCount: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, 1, 0] } },
        inProgressCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.IN_PROGRESS] }, 1, 0] } },
        scheduledCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.SCHEDULED] }, 1, 0] } },
        cancelledCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.CANCELLED] }, 1, 0] } },
        postponedCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.POSTPONED] }, 1, 0] } },
        routineCount: { $sum: { $cond: [{ $eq: ['$maintenanceType', MaintenanceType.ROUTINE] }, 1, 0] } },
        repairCount: { $sum: { $cond: [{ $eq: ['$maintenanceType', MaintenanceType.REPAIR] }, 1, 0] } },
        inspectionCount: { $sum: { $cond: [{ $eq: ['$maintenanceType', MaintenanceType.INSPECTION] }, 1, 0] } },
        cleaningCount: { $sum: { $cond: [{ $eq: ['$maintenanceType', MaintenanceType.CLEANING] }, 1, 0] } },
        upgradeCount: { $sum: { $cond: [{ $eq: ['$maintenanceType', MaintenanceType.UPGRADE] }, 1, 0] } },
        totalCost: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$totalCost', 0] } },
        laborCost: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$laborCost', 0] } },
        partsCost: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, { $subtract: ['$totalCost', '$laborCost'] }, 0] } },
        totalLaborHours: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$laborHours', 0] } },
        averageLaborHours: { $avg: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$laborHours', null] } },
        issueCount: { $sum: { $size: '$issues' } },
        resolvedIssueCount: { $sum: { $size: { $filter: { input: '$issues', as: 'issue', cond: '$$issue.resolved' } } } }
      }},
      { $project: {
        _id: 0,
        totalCount: 1,
        completedCount: 1,
        inProgressCount: 1,
        scheduledCount: 1,
        cancelledCount: 1,
        postponedCount: 1,
        routineCount: 1,
        repairCount: 1,
        inspectionCount: 1,
        cleaningCount: 1,
        upgradeCount: 1,
        totalCost: 1,
        laborCost: 1,
        partsCost: 1,
        totalLaborHours: 1,
        averageLaborHours: 1,
        issueCount: 1,
        resolvedIssueCount: 1,
        completionRate: { $multiply: [{ $divide: ['$completedCount', '$totalCount'] }, 100] },
        averageCost: { $cond: [{ $eq: ['$completedCount', 0] }, 0, { $divide: ['$totalCost', '$completedCount'] }] },
        issueResolutionRate: { $cond: [{ $eq: ['$issueCount', 0] }, 100, { $multiply: [{ $divide: ['$resolvedIssueCount', '$issueCount'] }, 100] }] }
      }}
    ]);
    
    // Get monthly breakdown
    const monthlyStats = await this.aggregate([
      { $match: matchStage },
      { $group: {
        _id: { 
          year: { $year: '$scheduledDate' }, 
          month: { $month: '$scheduledDate' } 
        },
        count: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, 1, 0] } },
        totalCost: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$totalCost', 0] } }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
        completedCount: 1,
        totalCost: 1,
        completionRate: { $multiply: [{ $divide: ['$completedCount', '$count'] }, 100] }
      }}
    ]);
    
    // Get maintenance type breakdown
    const typeStats = await this.aggregate([
      { $match: matchStage },
      { $group: {
        _id: '$maintenanceType',
        count: { $sum: 1 },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, 1, 0] } },
        totalCost: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$totalCost', 0] } },
        laborHours: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$laborHours', 0] } }
      }},
      { $project: {
        _id: 0,
        type: '$_id',
        count: 1,
        completedCount: 1,
        totalCost: 1,
        laborHours: 1,
        averageCost: { $cond: [{ $eq: ['$completedCount', 0] }, 0, { $divide: ['$totalCost', '$completedCount'] }] },
        averageLaborHours: { $cond: [{ $eq: ['$completedCount', 0] }, 0, { $divide: ['$laborHours', '$completedCount'] }] }
      }}
    ]);
    
    // Get top bikes by maintenance count
    const topBikes = await this.aggregate([
      { $match: matchStage },
      { $group: {
        _id: '$bikeId',
        count: { $sum: 1 },
        totalCost: { $sum: { $cond: [{ $eq: ['$status', MaintenanceStatus.COMPLETED] }, '$totalCost', 0] } }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'bikes',
        localField: '_id',
        foreignField: '_id',
        as: 'bikeInfo'
      }},
      { $unwind: '$bikeInfo' },
      { $project: {
        _id: 0,
        bikeId: '$_id',
        name: '$bikeInfo.name',
        frameNumber: '$bikeInfo.frameNumber',
        bikeType: '$bikeInfo.type',
        count: 1,
        totalCost: 1,
        averageCost: { $divide: ['$totalCost', '$count'] }
      }}
    ]);
    
    // Get issue category breakdown
    const issueCategoryStats = await this.aggregate([
      { $match: matchStage },
      { $unwind: '$issues' },
      { $group: {
        _id: '$issues.category',
        count: { $sum: 1 },
        resolvedCount: { $sum: { $cond: ['$issues.resolved', 1, 0] } },
        criticalCount: { $sum: { $cond: [{ $eq: ['$issues.severity', 'critical'] }, 1, 0] } }
      }},
      { $project: {
        _id: 0,
        category: '$_id',
        count: 1,
        resolvedCount: 1,
        criticalCount: 1,
        resolutionRate: { $multiply: [{ $divide: ['$resolvedCount', '$count'] }, 100] }
      }},
      { $sort: { count: -1 } }
    ]);
    
    // If no stats found, return empty structure
    const baseStats = stats.length > 0 ? stats[0] : {
      totalCount: 0,
      completedCount: 0,
      inProgressCount: 0,
      scheduledCount: 0,
      cancelledCount: 0,
      postponedCount: 0,
      routineCount: 0,
      repairCount: 0,
      inspectionCount: 0,
      cleaningCount: 0,
      upgradeCount: 0,
      totalCost: 0,
      laborCost: 0,
      partsCost: 0,
      totalLaborHours: 0,
      averageLaborHours: 0,
      issueCount: 0,
      resolvedIssueCount: 0,
      completionRate: 0,
      averageCost: 0,
      issueResolutionRate: 0
    };
    
    return {
      summary: baseStats,
      monthly: monthlyStats,
      byType: typeStats,
      topBikes,
      issueCategories: issueCategoryStats
    };
  } catch (error) {
    logger.error(`Error getting maintenance statistics: ${error.message}`);
    return {
      summary: {},
      monthly: [],
      byType: [],
      topBikes: [],
      issueCategories: []
    };
  }
};

// Static method to create maintenance record for bike
MaintenanceSchema.statics.scheduleForBike = async function(
  maintenanceData: {
    bikeId: mongoose.Types.ObjectId;
    maintenanceType: MaintenanceType;
    scheduledDate: Date;
    description: string;
    technician?: mongoose.Types.ObjectId;
    issues?: Array<{
      category: string;
      description: string;
      severity: string;
    }>;
    priority?: string;
  }
): Promise<IMaintenanceDocument | null> {
  try {
    // Validate required fields
    if (!maintenanceData.bikeId || !maintenanceData.maintenanceType || !maintenanceData.scheduledDate || !maintenanceData.description) {
      logger.error('Missing required fields for maintenance scheduling');
      return null;
    }
    
    // Check if bike exists
    const Bike = mongoose.model('Bike');
    const bike = await Bike.findById(maintenanceData.bikeId);
    
    if (!bike) {
      logger.error(`Bike with ID ${maintenanceData.bikeId} not found`);
      return null;
    }
    
    // Create maintenance record
    const maintenance = new this({
      bikeId: maintenanceData.bikeId,
      maintenanceType: maintenanceData.maintenanceType,
      scheduledDate: maintenanceData.scheduledDate,
      description: maintenanceData.description,
      status: MaintenanceStatus.SCHEDULED,
      technician: maintenanceData.technician,
      priority: maintenanceData.priority || 'medium'
    });
    
    // Add issues if provided
    if (maintenanceData.issues && maintenanceData.issues.length > 0) {
      // Determine if there's a critical issue to update priority
      const hasCriticalIssue = maintenanceData.issues.some(issue => issue.severity === 'critical');
      
      if (hasCriticalIssue) {
        maintenance.priority = 'critical';
      }
      
      maintenance.issues = maintenanceData.issues;
    }
    
    // If it's a repair, set bike status to maintenance
    if (maintenanceData.maintenanceType === MaintenanceType.REPAIR) {
      await Bike.findByIdAndUpdate(
        maintenanceData.bikeId,
        { status: BikeStatus.MAINTENANCE }
      );
    }
    
    // Save the maintenance record
    await maintenance.save();
    
    logger.info(`Scheduled ${maintenanceData.maintenanceType} maintenance for bike ${bike.name} (${bike._id}) on ${maintenanceData.scheduledDate.toLocaleDateString()}`);
    
    return maintenance;
  } catch (error) {
    logger.error(`Error scheduling maintenance: ${error.message}`);
    return null;
  }
};

// --- MIDDLEWARES / HOOKS ---

// Pre-save middleware to update calculated fields
MaintenanceSchema.pre('save', function(next) {
  try {
    // Calculate labor cost if not set
    if (this.isModified('laborHours') && this.laborHours !== undefined && !this.laborCost) {
      const rate = this.laborRate || 50; // Default rate if not specified
      this.laborCost = parseFloat((this.laborHours * rate).toFixed(2));
    }
    
    // Calculate total cost when parts or labor changes
    if (
      this.isModified('parts') ||
      this.isModified('laborCost') ||
      this.isModified('laborHours')
    ) {
      this.totalCost = this.calculateTotalCost();
    }
    
    // If status is changing to completed, set completed date
    if (
      this.isModified('status') &&
      this.status === MaintenanceStatus.COMPLETED &&
      !this.completedDate
    ) {
      this.completedDate = new Date();
      
      // All issues should be resolved with completion
      if (this.issues && this.issues.length > 0) {
        this.issues.forEach((issue: any) => {
          if (!issue.resolved) {
            issue.resolved = true;
            issue.resolvedDate = new Date();
            
            if (!issue.resolutionDetails) {
              issue.resolutionDetails = 'Resolved during maintenance completion';
            }
          }
        });
      }
    }
    
    // Log status changes
    if (this.isModified('status')) {
      const oldStatus = this.isNew ? 'NEW' : this._modifiedPaths.includes('status') ? this.get('status', String, { getters: false }) : this.status;
      const newStatus = this.status;
      
      logger.info(`Maintenance ${this._id || 'new'} status changed from ${oldStatus} to ${newStatus} for bike ${this.bikeId}`);
    }
    
    next();
  } catch (error) {
    logger.error(`Error in pre-save middleware: ${error.message}`);
    next(error);
  }
});

// Post-save hook to perform actions after saving
MaintenanceSchema.post('save', async function(doc, next) {
  try {
    // If this is a new record, check if we need to schedule next maintenance
    if (doc.isNew) {
      logger.info(`Created new ${doc.maintenanceType} maintenance record ${doc._id} for bike ${doc.bikeId}`);
    }
    
    next();
  } catch (error) {
    logger.error(`Error in post-save middleware: ${error.message}`);
    next(error);
  }
});

// Create model
const Maintenance = mongoose.model<IMaintenanceDocument>('Maintenance', MaintenanceSchema);

export default Maintenance;