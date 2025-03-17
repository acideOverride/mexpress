import { Document, Types } from 'mongoose';

export enum DeviceType {
  LAPTOP = 'LAPTOP',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  SMARTPHONE = 'SMARTPHONE',
  PRINTER = 'PRINTER',
  SERVER = 'SERVER',
  NETWORKING = 'NETWORKING',
  OTHER = 'OTHER'
}

export enum DeviceStatus {
  WORKING = 'WORKING',
  NEEDS_REPAIR = 'NEEDS_REPAIR',
  UNDER_REPAIR = 'UNDER_REPAIR',
  REPAIRED = 'REPAIRED',
  BEYOND_REPAIR = 'BEYOND_REPAIR'
}

export interface IDevice extends Document {
  customerId: Types.ObjectId;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  status: DeviceStatus;
  specifications?: Record<string, any>;
  purchaseDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeviceDTO {
  _id?: string;
  customerId: string;
  type: DeviceType;
  brand: string;
  model: string;
  serialNumber?: string;
  status: DeviceStatus;
  specifications?: Record<string, any>;
  purchaseDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}