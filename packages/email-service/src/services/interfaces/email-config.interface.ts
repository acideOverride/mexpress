import { EmailProviderConfig } from './email-provider.interface';
import { EmailTemplateConfig } from './email-template.interface';

/**
 * Email service configuration
 */
export interface EmailServiceConfig {
  /** Email provider configuration */
  provider: EmailProviderConfig;
  /** Email template configuration */
  templates: EmailTemplateConfig;
  /** Project identification for internal tracking */
  projectId: string;
  /** Enable logging */
  enableLogging?: boolean;
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Logging callback */
  logCallback?: (level: string, message: string, context?: any) => void;
  /** Enable strict mode (throw errors on validation failures) */
  strictMode?: boolean;
  /** Email size limit in bytes (default: 10MB) */
  maxEmailSize?: number;
  /** Enable telemetry */
  enableTelemetry?: boolean;
  /** Telemetry callback */
  telemetryCallback?: (eventName: string, data: any) => void;
  /** Project-specific sender configurations */
  projectSenders?: Record<string, ProjectSenderConfig>;
}

/**
 * Project-specific sender configuration
 */
export interface ProjectSenderConfig {
  /** Project identifier */
  projectId: string;
  /** Sender email */
  senderEmail: string;
  /** Sender name */
  senderName?: string;
  /** Reply-to email */
  replyToEmail?: string;
  /** Default headers for this project */
  defaultHeaders?: Record<string, string>;
  /** Default tags for this project */
  defaultTags?: string[];
  /** Rate limits specific to this project */
  rateLimits?: {
    /** Per minute */
    perMinute?: number;
    /** Per hour */
    perHour?: number;
    /** Per day */
    perDay?: number;
  };
}