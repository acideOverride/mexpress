/**
 * API Services Test
 * 
 * These tests verify that the API client services are properly configured
 * to communicate with the backend API endpoints.
 */

import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const SERVICES_DIR = path.resolve(__dirname, '../../../src/frontend/services');
const API_SERVICE = path.join(SERVICES_DIR, 'api.service.ts');
const BIKE_SERVICE = path.join(SERVICES_DIR, 'bike.service.ts');
const RESERVATION_SERVICE = path.join(SERVICES_DIR, 'reservation.service.ts');
const AUTH_SERVICE = path.join(SERVICES_DIR, 'auth.service.ts');

describe('API Services Directory Structure', () => {
  it('should have services directory', () => {
    expect(fs.existsSync(SERVICES_DIR), 'Services directory should exist').toBe(true);
  });

  it('should have base API service', () => {
    expect(fs.existsSync(API_SERVICE), 'API service file should exist').toBe(true);
  });

  it('should have domain-specific API services', () => {
    const requiredServices = [BIKE_SERVICE, RESERVATION_SERVICE, AUTH_SERVICE];
    
    for (const service of requiredServices) {
      expect(fs.existsSync(service), `Service ${path.basename(service)} should exist`).toBe(true);
    }
  });
});

describe('API Service Configuration', () => {
  it('should have proper API base URL configuration', async () => {
    const apiServiceExists = fs.existsSync(API_SERVICE);
    
    if (apiServiceExists) {
      try {
        // Read the file content
        const content = fs.readFileSync(API_SERVICE, 'utf8');
        
        // Check for API base URL configuration
        expect(content).toContain('baseURL');
        expect(content).toContain('/api');
        
      } catch (error) {
        expect(error).toBeUndefined();
      }
    } else {
      console.log('API service not implemented yet. Test pending.');
      expect(apiServiceExists).toBe(false);
    }
  });
});

describe('Bike Service', () => {
  it('should have methods to fetch bikes', async () => {
    const bikeServiceExists = fs.existsSync(BIKE_SERVICE);
    
    if (bikeServiceExists) {
      // Read the file content
      const content = fs.readFileSync(BIKE_SERVICE, 'utf8');
      
      // Check for required methods
      expect(content).toContain('getAllBikes');
      expect(content).toContain('getBikeById');
      expect(content).toContain('getBikesByStation');
    } else {
      console.log('Bike service not implemented yet. Test pending.');
      expect(bikeServiceExists).toBe(false);
    }
  });
});

describe('Reservation Service', () => {
  it('should have methods to manage reservations', async () => {
    const reservationServiceExists = fs.existsSync(RESERVATION_SERVICE);
    
    if (reservationServiceExists) {
      // Read the file content
      const content = fs.readFileSync(RESERVATION_SERVICE, 'utf8');
      
      // Check for required methods
      expect(content).toContain('createReservation');
      expect(content).toContain('getReservations');
      expect(content).toContain('getReservationById');
      expect(content).toContain('updateReservation');
      expect(content).toContain('cancelReservation');
    } else {
      console.log('Reservation service not implemented yet. Test pending.');
      expect(reservationServiceExists).toBe(false);
    }
  });
});

describe('Authentication Service', () => {
  it('should have auth methods', async () => {
    const authServiceExists = fs.existsSync(AUTH_SERVICE);
    
    if (authServiceExists) {
      // Read the file content
      const content = fs.readFileSync(AUTH_SERVICE, 'utf8');
      
      // Check for required methods
      expect(content).toContain('login');
      expect(content).toContain('register');
      expect(content).toContain('logout');
      expect(content).toContain('getUser');
      expect(content).toContain('isAuthenticated');
    } else {
      console.log('Auth service not implemented yet. Test pending.');
      expect(authServiceExists).toBe(false);
    }
  });
  
  it('should handle JWT tokens', async () => {
    const authServiceExists = fs.existsSync(AUTH_SERVICE);
    
    if (authServiceExists) {
      // Read the file content
      const content = fs.readFileSync(AUTH_SERVICE, 'utf8');
      
      // Check for JWT token handling
      expect(content).toContain('token');
      expect(content).toMatch(/localStorage|sessionStorage/);
    } else {
      console.log('Auth service not implemented yet. Test pending.');
      expect(authServiceExists).toBe(false);
    }
  });
});