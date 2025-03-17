/**
 * Authentication Validation Schemas
 * Joi validation schemas for authentication requests
 */
import Joi from 'joi';
import { UserRole } from '../../../shared/types/models';
import { emailSchema, passwordSchema, phoneNumberSchema } from './common.validator';

// User registration validation
export const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required',
  }),
  role: Joi.string().valid(...Object.values(UserRole)).default(UserRole.CUSTOMER),
  phone: phoneNumberSchema,
}).options({ stripUnknown: true });

// Login validation
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
}).options({ stripUnknown: true });

// Refresh token validation
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().messages({
    'any.required': 'Refresh token is required',
  }),
}).options({ stripUnknown: true });

// Forgot password validation
export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
}).options({ stripUnknown: true });

// Reset password validation
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required',
  }),
  newPassword: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords must match',
    'any.required': 'Password confirmation is required',
  }),
}).options({ stripUnknown: true });

// Change password validation
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords must match',
    'any.required': 'Password confirmation is required',
  }),
}).options({ stripUnknown: true });

// Update profile validation
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
  }),
  lastName: Joi.string().min(2).max(50).messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
  }),
  profile: Joi.object({
    phone: phoneNumberSchema,
    address: Joi.object({
      street: Joi.string().max(100),
      city: Joi.string().max(50),
      state: Joi.string().max(50),
      postalCode: Joi.string().max(20),
      country: Joi.string().max(50),
    }),
    dateOfBirth: Joi.date().iso().max('now'),
    emergencyContact: Joi.object({
      name: Joi.string().max(100),
      phone: phoneNumberSchema,
      relationship: Joi.string().max(50),
    }),
    preferences: Joi.object({
      bikeTypes: Joi.array().items(Joi.string()),
      bikeSize: Joi.string(),
      notificationPreferences: Joi.object({
        email: Joi.boolean(),
        sms: Joi.boolean(),
        push: Joi.boolean(),
      }),
    }),
  }),
}).options({ stripUnknown: true });