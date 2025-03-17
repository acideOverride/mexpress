import { EmailParams, EmailResult } from './email-service.interface';

/**
 * Email provider configuration options
 */
export interface EmailProviderConfig {
  /** API key for the email provider */
  apiKey: string;
  /** Default sender email */
  defaultSender: string;
  /** Default sender name */
  defaultSenderName?: string;
  /** Default reply-to email */
  defaultReplyTo?: string;
  /** Enable rate limiting */
  enableRateLimiting?: boolean;
  /** Maximum emails per minute */
  maxEmailsPerMinute?: number;
  /** Maximum emails per hour */
  maxEmailsPerHour?: number;
  /** Maximum emails per day */
  maxEmailsPerDay?: number;
  /** Default headers to add to all emails */
  defaultHeaders?: Record<string, string>;
  /** Enable tracking for opens */
  trackOpens?: boolean;
  /** Enable tracking for clicks */
  trackClicks?: boolean;
  /** Number of retry attempts for failed sends */
  retryAttempts?: number;
  /** Delay between retry attempts in milliseconds */
  retryDelay?: number;
  /** Domain verification status */
  domainVerified?: boolean;
  /** Environment (production, staging, development) */
  environment?: 'production' | 'staging' | 'development';
}

/**
 * Interface for email provider implementations
 * This is a pluggable interface for different email providers
 */
export interface IEmailProvider {
  /**
   * Initialize the email provider with configuration
   * @param config Provider configuration
   */
  initialize(config: EmailProviderConfig): Promise<void>;

  /**
   * Send an email through the provider
   * @param params Email parameters
   * @returns Email sending result
   */
  sendEmail(params: EmailParams): Promise<EmailResult>;

  /**
   * Get the provider's rate limit status
   * @returns Current rate limit status
   */
  getRateLimitStatus(): Promise<RateLimitStatus>;

  /**
   * Get the provider name
   */
  getProviderName(): string;

  /**
   * Check if the provider is initialized
   */
  isInitialized(): boolean;

  /**
   * Check if the provider is working correctly
   * @returns Validation result
   */
  validateConfig(): Promise<ConfigValidationResult>;
}

/**
 * Provider rate limit status
 */
export interface RateLimitStatus {
  /** Whether rate limiting is active */
  isRateLimited: boolean;
  /** Remaining emails in the current period */
  remaining?: {
    /** Per minute */
    minute?: number;
    /** Per hour */
    hour?: number;
    /** Per day */
    day?: number;
  };
  /** Reset times for rate limits */
  reset?: {
    /** Minute reset */
    minute?: Date;
    /** Hour reset */
    hour?: Date;
    /** Day reset */
    day?: Date;
  };
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  /** Whether the configuration is valid */
  isValid: boolean;
  /** Validation message */
  message?: string;
  /** Specific validation errors */
  errors?: Record<string, string>;
}