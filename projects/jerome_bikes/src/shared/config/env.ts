/**
 * Environment configuration for Jerome Bikes application
 * Loads and validates environment variables
 */
import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define validation schema for environment variables
const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    FRONTEND_URL: Joi.string().required(),
    
    // Database
    MONGODB_URI: Joi.string().required().description('MongoDB connection URI'),
    REDIS_URL: Joi.string().required().description('Redis connection URL'),
    
    // Authentication
    JWT_SECRET: Joi.string().required().min(10),
    JWT_EXPIRATION: Joi.string().default('24h'),
    REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),
    
    // External APIs
    WEATHER_API_KEY: Joi.string().allow('').default(''),
    MAPPING_API_KEY: Joi.string().allow('').default(''),
    PAYMENT_API_KEY: Joi.string().allow('').default(''),
    
    // Logging
    LOG_LEVEL: Joi.string()
      .valid('error', 'warn', 'info', 'http', 'debug')
      .default('info'),
    LOG_FORMAT: Joi.string().valid('dev', 'combined').default('dev'),
    
    // Email
    SMTP_HOST: Joi.string().allow('').default(''),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().allow('').default(''),
    SMTP_PASS: Joi.string().allow('').default(''),
    EMAIL_FROM: Joi.string().allow('').default(''),
    
    // SMS
    SMS_PROVIDER_API_KEY: Joi.string().allow('').default(''),
    
    // Feature Flags
    ENABLE_RECOMMENDATIONS: Joi.boolean().default(false),
    ENABLE_WEATHER_INTEGRATION: Joi.boolean().default(false),
    ENABLE_MAINTENANCE_ALERTS: Joi.boolean().default(false),
  })
  .unknown();

// Validate environment variables
const { value: envVars, error } = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

/**
 * Environment configuration object
 */
export const env = {
  env: envVars.NODE_ENV,
  isDevelopment: envVars.NODE_ENV === 'development',
  isProduction: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',
  port: envVars.PORT,
  frontendUrl: envVars.FRONTEND_URL,
  
  db: {
    mongodb: {
      uri: envVars.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    redis: {
      url: envVars.REDIS_URL,
    },
  },
  
  jwt: {
    secret: envVars.JWT_SECRET,
    expiration: envVars.JWT_EXPIRATION,
    refreshExpiration: envVars.REFRESH_TOKEN_EXPIRATION,
  },
  
  externalApis: {
    weather: {
      apiKey: envVars.WEATHER_API_KEY,
    },
    mapping: {
      apiKey: envVars.MAPPING_API_KEY,
    },
    payment: {
      apiKey: envVars.PAYMENT_API_KEY,
    },
  },
  
  logging: {
    level: envVars.LOG_LEVEL,
    format: envVars.LOG_FORMAT,
  },
  
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USER,
        pass: envVars.SMTP_PASS,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  
  sms: {
    apiKey: envVars.SMS_PROVIDER_API_KEY,
  },
  
  features: {
    enableRecommendations: envVars.ENABLE_RECOMMENDATIONS,
    enableWeatherIntegration: envVars.ENABLE_WEATHER_INTEGRATION,
    enableMaintenanceAlerts: envVars.ENABLE_MAINTENANCE_ALERTS,
  },
};

export default env;