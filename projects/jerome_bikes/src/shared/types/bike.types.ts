/**
 * Shared type definitions for Bike entities
 */

export enum BikeType {
  MOUNTAIN = 'mountain',
  ROAD = 'road',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  CITY = 'city',
  KIDS = 'kids'
}

export enum BikeSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl'
}

export enum BikeStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved'
}

export interface Bike {
  id: string;
  name: string;
  type: BikeType;
  size: BikeSize;
  color: string;
  frameNumber: string;
  dailyRate: number;
  hourlyRate: number;
  weeklyRate: number;
  status: BikeStatus;
  location: string;
  description: string;
  features: string[];
  imageUrls: string[];
  ratings: BikeRating[];
  maintenanceHistory: MaintenanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BikeRating {
  userId: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface MaintenanceRecord {
  id: string;
  date: Date;
  description: string;
  technician: string;
  cost: number;
  notes: string;
}

export interface BikeFilterOptions {
  type?: BikeType;
  size?: BikeSize;
  minDailyRate?: number;
  maxDailyRate?: number;
  status?: BikeStatus;
  location?: string;
  availableFrom?: Date;
  availableTo?: Date;
}