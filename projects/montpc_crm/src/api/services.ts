import axios from 'axios';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Customer service
export const customersService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response;
  },
  
  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response;
  },
  
  create: async (customer: any) => {
    const response = await axios.post(`${API_BASE_URL}/customers`, customer);
    return response;
  },
  
  update: async (id: string, customer: any) => {
    const response = await axios.put(`${API_BASE_URL}/customers/${id}`, customer);
    return response;
  },
  
  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/customers/${id}`);
    return response;
  }
};

// Tickets service
export const ticketsService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/tickets`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  },
  
  create: async (ticket: any) => {
    const response = await axios.post(`${API_BASE_URL}/tickets`, ticket);
    return response.data;
  },
  
  update: async (id: string, ticket: any) => {
    const response = await axios.put(`${API_BASE_URL}/tickets/${id}`, ticket);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await axios.patch(`${API_BASE_URL}/tickets/${id}/status`, { status });
    return response.data;
  }
};

// Products service
export const productsService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  }
};

// Auth service
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`);
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  }
};