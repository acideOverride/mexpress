import { Resend } from 'resend';
import { 
  IEmailProvider, 
  EmailProviderConfig, 
  ConfigValidationResult, 
  RateLimitStatus 
} from '../interfaces';
import { 
  EmailParams, 
  EmailResult,
  EmailAttachment
} from '../interfaces';
import { 
  AuthenticationError, 
  ConfigurationError, 
  ValidationError,
  NetworkError
} from '../email-error';

/**
 * ResendEmailProvider - Resend.com email service integration
 * 
 * This provider implements the IEmailProvider interface to integrate with Resend.com,
 * a modern email API service. It handles all aspects of email delivery including
 * configuration, rate limiting, validation, and error handling.
 * 
 * Features:
 * - Secure API key handling
 * - Email validation
 * - Rate limiting
 * - Attachment support
 * - Tracking options (opens, clicks)
 * - Templating support via the core email service
 * - Comprehensive error handling
 */
export class ResendEmailProvider implements IEmailProvider {
  private client: Resend | null = null;
  private config: EmailProviderConfig | null = null;
  private initialized = false;
  
  /**
   * Rate limit tracking for throttling email sending
   * This implementation uses client-side tracking that could be enhanced
   * with actual rate limit data from the Resend API if they expose such endpoints
   */
  private rateLimits: RateLimitStatus = {
    isRateLimited: false,
    remaining: {
      minute: 60,
      hour: 1000,
      day: 10000
    },
    reset: {
      minute: new Date(Date.now() + 60000),
      hour: new Date(Date.now() + 3600000),
      day: new Date(Date.now() + 86400000)
    }
  };

  /**
   * Initialize the Resend email provider with configuration
   * 
   * @param config - Provider configuration including API key and sender information
   * @throws {ConfigurationError} If API key or sender email is missing or invalid
   */
  async initialize(config: EmailProviderConfig): Promise<void> {
    this.validateInitialConfig(config);

    this.config = this.applyConfigDefaults(config);

    try {
      this.client = new Resend(config.apiKey);
      this.initialized = true;
    } catch (error) {
      throw new ConfigurationError(`Failed to initialize Resend client: ${(error as Error).message}`, {
        error
      });
    }
  }

  /**
   * Send an email through the Resend provider
   * 
   * @param params - Email parameters including recipients, subject, and content
   * @returns Email sending result with success status and provider response
   * @throws {ConfigurationError} If provider is not initialized
   * @throws {ValidationError} If email parameters are invalid
   * @throws {AuthenticationError} If authentication with Resend fails
   * @throws {NetworkError} If a network error occurs during sending
   */
  async sendEmail(params: EmailParams): Promise<EmailResult> {
    this.ensureInitialized();
    this.validateEmailParams(params);

    // Check rate limits if enabled
    if (this.config?.enableRateLimiting) {
      const rateLimitStatus = await this.getRateLimitStatus();
      if (rateLimitStatus.isRateLimited) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          response: rateLimitStatus
        };
      }
    }

    try {
      const request = this.prepareEmailRequest(params);
      const response = await this.client!.emails.send(request);

      // Update rate limits
      this.updateRateLimits();

      return {
        success: true,
        id: response.id,
        response: response
      };
    } catch (error) {
      return this.handleSendError(error);
    }
  }

  /**
   * Get the provider's rate limit status
   * 
   * @returns Current rate limit status including remaining capacity and reset times
   */
  async getRateLimitStatus(): Promise<RateLimitStatus> {
    const now = new Date();
    
    // Check if any limit has been reached
    const isMinuteLimited = this.isLimitReached('minute', now);
    const isHourLimited = this.isLimitReached('hour', now);
    const isDayLimited = this.isLimitReached('day', now);

    this.rateLimits.isRateLimited = Boolean(isMinuteLimited || isHourLimited || isDayLimited);

    return this.rateLimits;
  }

  /**
   * Get the provider name
   * 
   * @returns The provider name "Resend"
   */
  getProviderName(): string {
    return 'Resend';
  }

  /**
   * Check if the provider is initialized
   * 
   * @returns Whether the provider is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if the provider configuration is valid
   * 
   * @returns Validation result with status and any error messages
   */
  async validateConfig(): Promise<ConfigValidationResult> {
    if (!this.initialized || !this.config) {
      return {
        isValid: false,
        message: 'Provider is not initialized',
        errors: {
          initialization: 'Provider is not initialized'
        }
      };
    }

    const errors: Record<string, string> = {};

    if (!this.config.apiKey || this.config.apiKey.trim() === '') {
      errors.apiKey = 'API key is required';
    }

    if (!this.config.defaultSender || this.config.defaultSender.trim() === '') {
      errors.defaultSender = 'Default sender email is required';
    } else if (!this.isValidEmail(this.config.defaultSender)) {
      errors.defaultSender = 'Default sender email is invalid';
    }

    if (Object.keys(errors).length > 0) {
      return {
        isValid: false,
        message: 'Invalid configuration',
        errors
      };
    }

    // We could perform a lightweight API call here to validate the credentials
    // For now, we'll assume the configuration is valid if it passes the basic checks
    return {
      isValid: true,
      message: 'Configuration is valid'
    };
  }

  /**
   * Validate initial configuration parameters
   * 
   * @param config - Configuration to validate
   * @throws {ConfigurationError} If configuration is invalid
   */
  private validateInitialConfig(config: EmailProviderConfig): void {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new ConfigurationError('API key is required');
    }

    if (!config.defaultSender || config.defaultSender.trim() === '') {
      throw new ConfigurationError('Default sender email is required');
    }

    if (!this.isValidEmail(config.defaultSender)) {
      throw new ConfigurationError('Default sender email is invalid');
    }
  }

  /**
   * Apply default values to configuration
   * 
   * @param config - Base configuration
   * @returns Configuration with defaults applied
   */
  private applyConfigDefaults(config: EmailProviderConfig): EmailProviderConfig {
    return {
      ...config,
      enableRateLimiting: config.enableRateLimiting !== false, // Default to true
      maxEmailsPerMinute: config.maxEmailsPerMinute || 60,
      maxEmailsPerHour: config.maxEmailsPerHour || 1000,
      maxEmailsPerDay: config.maxEmailsPerDay || 10000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
      trackOpens: config.trackOpens !== false, // Default to true
      trackClicks: config.trackClicks !== false, // Default to true
      environment: config.environment || 'production'
    };
  }

  /**
   * Ensure the provider is initialized before use
   * 
   * @throws {ConfigurationError} If provider is not initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.client || !this.config) {
      throw new ConfigurationError('Resend provider is not initialized');
    }
  }

  /**
   * Prepare email request for the Resend API
   * 
   * @param params - Email parameters
   * @returns Formatted request for Resend API
   */
  private prepareEmailRequest(params: EmailParams): any {
    const from = this.formatSender(
      params.from || this.config!.defaultSender,
      params.fromName || this.config!.defaultSenderName
    );

    const replyTo = params.replyTo || this.config!.defaultReplyTo;

    // Base request properties
    const request: any = {
      from,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      // Ensure either html or text is provided (text is required by Resend)
      text: params.text || (params.html ? this.htmlToPlainText(params.html) : ''),
      headers: { ...this.config!.defaultHeaders, ...params.headers },
    };
    
    // Add HTML if provided
    if (params.html) {
      request.html = params.html;
    }
    
    // Add reply-to if provided
    if (replyTo) {
      request.reply_to = replyTo;
    }

    // Add optional properties
    this.addRecipients(request, params);
    this.addAttachments(request, params);
    this.addTags(request, params);
    this.addTrackingOptions(request);

    return request;
  }
  
  /**
   * Convert HTML to plain text (simple version for fallback)
   * 
   * @param html - HTML content to convert
   * @returns Plain text version
   */
  private htmlToPlainText(html: string): string {
    // This is a very simplified conversion
    // In a production environment, you would use a proper HTML-to-text converter
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /**
   * Add CC and BCC recipients to request
   * 
   * @param request - Request object to modify
   * @param params - Email parameters
   */
  private addRecipients(request: Record<string, any>, params: EmailParams): void {
    if (params.cc) {
      request.cc = Array.isArray(params.cc) ? params.cc : [params.cc];
    }

    if (params.bcc) {
      request.bcc = Array.isArray(params.bcc) ? params.bcc : [params.bcc];
    }
  }

  /**
   * Add attachments to request if provided
   * 
   * @param request - Request object to modify
   * @param params - Email parameters
   */
  private addAttachments(request: Record<string, any>, params: EmailParams): void {
    if (params.attachments && params.attachments.length > 0) {
      request.attachments = this.formatAttachments(params.attachments);
    }
  }

  /**
   * Add tags to request if provided
   * 
   * @param request - Request object to modify
   * @param params - Email parameters
   */
  private addTags(request: Record<string, any>, params: EmailParams): void {
    if (params.tags && params.tags.length > 0) {
      request.tags = params.tags.map(tag => ({ name: tag }));
    }
  }

  /**
   * Add tracking options to request
   * 
   * @param request - Request object to modify
   */
  private addTrackingOptions(request: Record<string, any>): void {
    if (this.config!.trackOpens !== undefined) {
      request.track_opens = this.config!.trackOpens;
    }

    if (this.config!.trackClicks !== undefined) {
      request.track_clicks = this.config!.trackClicks;
    }
  }

  /**
   * Handle errors from email sending
   * 
   * @param error - Error from Resend API
   * @returns Formatted error result or throws typed error
   * @throws {AuthenticationError} For authentication failures
   * @throws {NetworkError} For network issues
   */
  private handleSendError(error: unknown): EmailResult {
    const errorMessage = (error as Error).message;
    
    // Handle different types of errors
    if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
      throw new AuthenticationError(`Authentication failed with Resend: ${errorMessage}`);
    } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      throw new NetworkError(`Network error with Resend: ${errorMessage}`);
    } else {
      return {
        success: false,
        error: `Failed to send email: ${errorMessage}`,
        response: error
      };
    }
  }

  /**
   * Validate email parameters
   * 
   * @param params - Email parameters to validate
   * @throws {ValidationError} If parameters are invalid
   */
  private validateEmailParams(params: EmailParams): void {
    const errors: string[] = [];

    // Validate recipients
    this.validateRecipients(params, errors);
    
    // Validate basic requirements
    if (!params.subject || params.subject.trim() === '') {
      errors.push('Subject is required');
    }

    if (!params.html && !params.text) {
      errors.push('Either HTML or text content is required');
    }

    // Validate additional email addresses
    if (params.from && !this.isValidEmail(params.from)) {
      errors.push(`Invalid sender email: ${params.from}`);
    }

    if (params.replyTo && !this.isValidEmail(params.replyTo)) {
      errors.push(`Invalid reply-to email: ${params.replyTo}`);
    }

    // Throw if any validation errors
    if (errors.length > 0) {
      throw new ValidationError(`Invalid email parameters: ${errors.join(', ')}`, {
        errors,
        params
      });
    }
  }

  /**
   * Validate email recipients (to, cc, bcc)
   * 
   * @param params - Email parameters
   * @param errors - Array to add errors to
   */
  private validateRecipients(params: EmailParams, errors: string[]): void {
    // Validate primary recipients
    if (!params.to || (Array.isArray(params.to) && params.to.length === 0)) {
      errors.push('Recipient email is required');
    } else {
      // Validate all recipient emails
      const recipients = Array.isArray(params.to) ? params.to : [params.to];
      recipients.forEach(recipient => {
        if (!this.isValidEmail(recipient)) {
          errors.push(`Invalid recipient email: ${recipient}`);
        }
      });
    }

    // Validate CC recipients if provided
    if (params.cc) {
      const ccRecipients = Array.isArray(params.cc) ? params.cc : [params.cc];
      ccRecipients.forEach(recipient => {
        if (!this.isValidEmail(recipient)) {
          errors.push(`Invalid CC recipient email: ${recipient}`);
        }
      });
    }

    // Validate BCC recipients if provided
    if (params.bcc) {
      const bccRecipients = Array.isArray(params.bcc) ? params.bcc : [params.bcc];
      bccRecipients.forEach(recipient => {
        if (!this.isValidEmail(recipient)) {
          errors.push(`Invalid BCC recipient email: ${recipient}`);
        }
      });
    }
  }

  /**
   * Check if a specific rate limit has been reached
   * 
   * @param type - Type of limit (minute, hour, day)
   * @param now - Current time
   * @returns Whether the limit has been reached
   */
  private isLimitReached(type: 'minute' | 'hour' | 'day', now: Date): boolean {
    return (
      this.rateLimits.remaining?.[type] === 0 && 
      this.rateLimits.reset?.[type] !== undefined && 
      this.rateLimits.reset[type]! > now
    );
  }

  /**
   * Update rate limits after sending an email
   * Updates both the remaining counts and resets timeframes if needed
   */
  private updateRateLimits(): void {
    const now = new Date();

    // Decrement rate limits
    this.decrementRateLimits();
    
    // Reset rate limits if needed
    this.resetRateLimitsIfNeeded(now);
  }

  /**
   * Decrement remaining email counts for all rate limit types
   */
  private decrementRateLimits(): void {
    if (this.rateLimits.remaining) {
      Object.keys(this.rateLimits.remaining).forEach(key => {
        const typedKey = key as 'minute' | 'hour' | 'day';
        if (this.rateLimits.remaining![typedKey] !== undefined) {
          this.rateLimits.remaining![typedKey] = Math.max(0, this.rateLimits.remaining![typedKey]! - 1);
        }
      });
    }
  }

  /**
   * Reset rate limits if their time period has passed
   * 
   * @param now - Current time
   */
  private resetRateLimitsIfNeeded(now: Date): void {
    if (!this.rateLimits.reset || !this.config) return;

    const resetMap = {
      minute: { limit: this.config.maxEmailsPerMinute, ms: 60000 },
      hour: { limit: this.config.maxEmailsPerHour, ms: 3600000 },
      day: { limit: this.config.maxEmailsPerDay, ms: 86400000 }
    };

    Object.entries(resetMap).forEach(([key, { limit, ms }]) => {
      const typedKey = key as 'minute' | 'hour' | 'day';
      if (
        this.rateLimits.reset?.[typedKey] &&
        this.rateLimits.reset[typedKey]! <= now
      ) {
        this.rateLimits.remaining![typedKey] = limit!;
        this.rateLimits.reset[typedKey] = new Date(now.getTime() + ms);
      }
    });
  }

  /**
   * Format sender with name and email
   * 
   * @param email - Sender email
   * @param name - Optional sender name
   * @returns Formatted sender string
   */
  private formatSender(email: string, name?: string): string {
    if (!name) {
      return email;
    }
    return `${name} <${email}>`;
  }

  /**
   * Format attachments for Resend API
   * 
   * @param attachments - Attachments to format
   * @returns Formatted attachments for the API
   */
  private formatAttachments(attachments: EmailAttachment[]): any[] {
    return attachments.map(attachment => {
      let content = attachment.content;
      
      // Convert string content to Buffer if needed
      if (typeof content === 'string') {
        content = Buffer.from(content);
      }
      
      return {
        filename: attachment.filename,
        content: content,
        content_type: attachment.contentType,
        content_id: attachment.cid
      };
    });
  }

  /**
   * Check if an email address is valid
   * 
   * @param email - Email address to validate
   * @returns Whether the email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}