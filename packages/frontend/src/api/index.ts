import axios from 'axios';
import { Customer, Repair } from '../types';

const api = axios.create({
  baseURL: '/api'
});

export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers').then(res => res.data),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`).then(res => res.data),
  create: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Customer>('/customers', customer).then(res => res.data),
};

export const repairApi = {
  getAll: () => api.get<Repair[]>('/repairs').then(res => res.data),
  create: (repair: Omit<Repair, 'id' | 'createdAt' | 'updatedAt' | 'status'>) =>
    api.post<Repair>('/repairs', repair).then(res => res.data),
  updateStatus: (id: number, status: string) =>
    api.patch<Repair>(`/repairs/${id}/status`, { status }).then(res => res.data),
};
