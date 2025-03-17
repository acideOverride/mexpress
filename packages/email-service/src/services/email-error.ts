/**
 * Base class for all email-related errors
 */
export class EmailError extends Error {
  /** Error code for categorization */
  code: string;
  /** Error severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Additional context or metadata */
  context?: Record<string, any>;
  /** Whether the error is retryable */
  retryable: boolean;

  /**
   * Create a new EmailError
   * @param message Error message
   * @param code Error code
   * @param severity Error severity
   * @param context Additional context
   * @param retryable Whether the error is retryable
   */
  constructor(
    message: string,
    code: string = 'EMAIL_ERROR',
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>,
    retryable: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.retryable = retryable;

    // Maintain proper stack trace in V8 engines (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to a simple object for serialization
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      context: this.context,
      retryable: this.retryable,
      stack: this.stack
    };
  }
}

/**
 * Error during configuration
 */
export class ConfigurationError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_CONFIG_ERROR', 'high', context, false);
  }
}

/**
 * Error with email provider
 */
export class ProviderError extends EmailError {
  constructor(message: string, context?: Record<string, any>, retryable: boolean = true) {
    super(message, 'EMAIL_PROVIDER_ERROR', 'high', context, retryable);
  }
}

/**
 * Error during authentication with provider
 */
export class AuthenticationError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_AUTH_ERROR', 'critical', context, false);
  }
}

/**
 * Validation error for email parameters
 */
export class ValidationError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_VALIDATION_ERROR', 'medium', context, false);
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_RATE_LIMIT_ERROR', 'high', context, true);
  }
}

/**
 * Template error
 */
export class TemplateError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_TEMPLATE_ERROR', 'medium', context, false);
  }
}

/**
 * Network error during email sending
 */
export class NetworkError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_NETWORK_ERROR', 'high', context, true);
  }
}

/**
 * Attachment error
 */
export class AttachmentError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_ATTACHMENT_ERROR', 'medium', context, false);
  }
}

/**
 * Maximum retry attempts exceeded
 */
export class MaxRetryError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_MAX_RETRY_ERROR', 'high', context, false);
  }
}

/**
 * Unknown/unexpected error
 */
export class UnknownError extends EmailError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'EMAIL_UNKNOWN_ERROR', 'critical', context, false);
  }
}