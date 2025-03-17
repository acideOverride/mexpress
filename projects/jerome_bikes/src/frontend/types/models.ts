/**
 * Core model interfaces for Jerome Bikes
 */

// User model
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'staff';
  createdAt: string;
  updatedAt: string;
}

// Bike model
export interface Bike {
  id: string;
  model: string;
  type: string;
  description: string;
  imageUrl: string;
  pricePerHour: number;
  pricePerDay: number;
  status: 'available' | 'reserved' | 'maintenance';
  stationId: string;
  features: string[];
  size: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Station model
export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: [number, number]; // [longitude, latitude]
  openingHour: string;
  closingHour: string;
  isActive: boolean;
  availableBikes: number;
  capacity: number;
}

// Reservation model
export interface Reservation {
  id: string;
  bikeId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  startStationId: string;
  endStationId: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  bike?: Bike;
  startStation?: Station;
  endStation?: Station;
  user?: User;
}

// Maintenance model
export interface Maintenance {
  id: string;
  bikeId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate?: string;
  technicianId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment model
export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  method: 'credit_card' | 'paypal' | 'cash';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// BikeFilter
export interface BikeFilter {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  stationId?: string;
  status?: 'available' | 'reserved' | 'maintenance';
}

// ReservationFilter
export interface ReservationFilter {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  startDate?: string;
  endDate?: string;
  bikeId?: string;
  stationId?: string;
}

// Reservation creation payload
export interface ReservationCreate {
  bikeId: string;
  startDate: string;
  endDate: string;
  startStationId: string;
  endStationId: string;
  paymentMethod?: 'credit_card' | 'paypal' | 'cash';
}

// API error response
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}