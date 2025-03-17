/**
 * Test Helpers
 * Utility functions for API testing
 */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { env } from '../../../shared/config/env';

/**
 * Generate MongoDB ObjectId
 * @returns New ObjectId as string
 */
export const generateObjectId = (): string => {
  return new mongoose.Types.ObjectId().toString();
};

/**
 * Generate valid JWT token for testing
 * @param payload Token payload (defaults to test user)
 * @param expiresIn Token expiration time (default: 1 hour)
 * @returns JWT token
 */
export const generateToken = (
  payload: any = { id: generateObjectId(), role: 'user' },
  expiresIn: string = '1h'
): string => {
  return jwt.sign(payload, env.jwt.secret, { expiresIn });
};

/**
 * Generate invalid JWT token for testing
 * @returns Invalid JWT token
 */
export const generateInvalidToken = (): string => {
  return 'invalid-token';
};

/**
 * Create test authorization headers
 * @param role User role (default: user)
 * @returns Headers object with Authorization
 */
export const authHeaders = (role: string = 'user'): { Authorization: string } => {
  const token = generateToken({ id: generateObjectId(), role });
  return { Authorization: `Bearer ${token}` };
};

/**
 * Wait for a specified time
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the wait
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generate random test data
 * @param prefix Prefix for the data (default: 'test')
 * @returns Random string
 */
export const generateRandomData = (prefix: string = 'test'): string => {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
};