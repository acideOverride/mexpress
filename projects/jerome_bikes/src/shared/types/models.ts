/**
 * Shared type definitions for database models
 * These types are used across both frontend and backend
 */

import { Document } from 'mongoose';

// User types

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  STAFF = 'staff',
  MAINTENANCE = 'maintenance',
}

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

// Customer types

export interface ICustomer {
  userId: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth?: Date;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    bikeTypes: string[];
    bikeSize: string;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  paymentMethods?: {
    type: string;
    lastFour: string;
    expiryDate: string;
    isDefault: boolean;
  }[];
  loyaltyPoints: number;
  memberSince: Date;
  rentalHistory: string[]; // Array of reservation IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerDocument extends ICustomer, Document {}

// Bike types

export enum BikeType {
  MOUNTAIN = 'mountain',
  ROAD = 'road',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  CITY = 'city',
  KIDS = 'kids',
}

export enum BikeSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
}

export enum BikeStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
  DAMAGED = 'damaged',
  RETIRED = 'retired',
}

export interface IBike {
  name: string;
  type: BikeType;
  size: BikeSize;
  modelYear: number;
  color: string;
  description: string;
  frameNumber: string;
  features: string[];
  specifications?: {
    weight?: number;
    frameType?: string;
    suspension?: string;
    gears?: number;
    brakeType?: string;
    wheelSize?: number;
    electricRange?: number;
  };
  dailyRate: number;
  hourlyRate: number;
  weeklyRate: number;
  status: BikeStatus;
  condition: string;
  maintenanceHistory: string[]; // Array of maintenance record IDs
  currentLocation: string; // Station ID or geolocation
  imageUrls: string[];
  purchaseDate?: Date;
  purchasePrice?: number;
  mileage: number;
  ratings: {
    userId: string;
    rating: number;
    comment?: string;
    date: Date;
  }[];
  totalRentals: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBikeDocument extends IBike, Document {}

// Station types

export interface IStation {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  capacity: number;
  currentBikes: string[]; // Array of bike IDs
  status: 'active' | 'inactive' | 'maintenance';
  amenities: string[];
  openingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  contactPhone?: string;
  isAccessControlled: boolean;
  accessMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStationDocument extends IStation, Document {}

// Reservation types

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show',
}

export interface IReservation {
  customerId: string;
  bikes: string[]; // Array of bike IDs
  startStation: string; // Station ID
  endStation?: string; // Station ID (may be different for one-way trips)
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial';
  discountCode?: string;
  discountAmount?: number;
  createdBy: string; // User ID
  notes?: string;
  weatherConditions?: {
    forecast: string;
    temperature: number;
    precipitation: number;
  };
  additionalServices?: {
    name: string;
    price: number;
    quantity: number;
  }[];
  specialRequirements?: string;
  insurance?: {
    type: string;
    coverageAmount: number;
    price: number;
  };
  returnDetails?: {
    actualReturnDate: Date;
    condition: string;
    additionalCharges: number;
    notes: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IReservationDocument extends IReservation, Document {}

// Maintenance types

export enum MaintenanceType {
  ROUTINE = 'routine',
  REPAIR = 'repair',
  INSPECTION = 'inspection',
  CLEANING = 'cleaning',
  UPGRADE = 'upgrade',
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
}

export interface IMaintenance {
  bikeId: string;
  maintenanceType: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: Date;
  completedDate?: Date;
  technician?: string; // User ID
  description: string;
  issues: {
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
  }[];
  parts?: {
    name: string;
    quantity: number;
    cost: number;
  }[];
  laborHours?: number;
  laborCost?: number;
  totalCost?: number;
  notes?: string;
  recommendations?: string;
  nextMaintenanceDate?: Date;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaintenanceDocument extends IMaintenance, Document {}

// Rating types

export interface IRating {
  userId: string;
  entityType: 'bike' | 'station' | 'route' | 'service';
  entityId: string;
  rating: number; // 1-5
  title?: string;
  comment?: string;
  images?: string[];
  response?: {
    userId: string;
    comment: string;
    date: Date;
  };
  isVerified: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRatingDocument extends IRating, Document {}

// Route types

export interface IRoute {
  name: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  distance: number; // in kilometers
  estimatedTime: number; // in minutes
  elevation: number; // in meters
  path: {
    type: string;
    coordinates: [number, number][]; // Array of [longitude, latitude] pairs
  };
  startPoint: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    name: string;
  };
  endPoint: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    name: string;
  };
  waypoints: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    name: string;
    description?: string;
  }[];
  pointsOfInterest: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    name: string;
    description?: string;
    category: string;
  }[];
  terrain: string[];
  bestSeasons: string[];
  tags: string[];
  imageUrls: string[];
  createdBy: string; // User ID
  isPublic: boolean;
  ratings: {
    userId: string;
    rating: number;
    comment?: string;
    date: Date;
  }[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRouteDocument extends IRoute, Document {}