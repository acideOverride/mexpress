export interface Customer {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  hiboutikId?: string;
  communicationPreferences?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Repair {
  id: number;
  customerId: number;
  deviceType: string;
  issue: string;
  status: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  estimatedCompletion?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
