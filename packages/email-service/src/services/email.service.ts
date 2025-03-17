import {
  IEmailService,
  IEmailProvider,
  ITemplateManager,
  EmailParams,
  TemplateEmailParams,
  EmailResult,
  EmailServiceConfig
} from './interfaces';
import {
  ConfigurationError,
  ValidationError,
  TemplateError,
  UnknownError
} from './email-error';

/**
 * EmailService - Core email service for the mExpress ecosystem
 * 
 * This service provides centralized functionality for sending emails across
 * all mExpress projects, with support for different email providers,
 * template rendering, project-specific settings, and comprehensive logging.
 * 
 * Key features:
 * - Provider-agnostic design (works with any IEmailProvider implementation)
 * - Template-based emails with variable substitution
 * - Multi-language support
 * - Project-specific sender identities and settings
 * - Comprehensive error handling
 * - Configurable logging
 */
export class EmailService implements IEmailService {
  private provider: IEmailProvider;
  private templateManager: ITemplateManager;
  private config: EmailServiceConfig;
  private initialized = false;
  
  /**
   * Create a new EmailService instance
   * 
   * @param provider - Email provider implementation (e.g., ResendEmailProvider)
   * @param templateManager - Template manager for rendering HTML templates
   * @param config - Email service configuration
   */
  constructor(
    provider: IEmailProvider,
    templateManager: ITemplateManager,
    config: EmailServiceConfig
  ) {
    this.provider = provider;
    this.templateManager = templateManager;
    this.config = config;
    
    // Initialize the service asynchronously
    this.initialize().catch(error => {
      this.logError('Failed to initialize email service', error);
      throw new ConfigurationError('Failed to initialize email service', {
        error: error instanceof Error ? error.message : String(error)
      });
    });
  }
  
  /**
   * Send an email with the given parameters
   * 
   * @param params - The email parameters including recipients, subject, and content
   * @returns A promise that resolves to the email result
   * @throws {ValidationError} If the email parameters are invalid
   */
  async sendEmail(params: EmailParams): Promise<EmailResult> {
    try {
      this.validateEmailParams(params);
      
      const finalParams = this.applyProjectSettings(params);
      
      this.logEmailRequest(finalParams);
      
      const result = await this.provider.sendEmail(finalParams);
      
      this.logEmailResult(result, finalParams);
      
      return result;
    } catch (error) {
      this.logError('Error sending email', error);
      
      // Rethrow validation errors directly
      if (error instanceof ValidationError) {
        throw error;
      }
      
      // Return a failure result for other errors
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Send an email using a template
   * 
   * @param params - The template email parameters
   * @returns A promise that resolves to the email result
   * @throws {ValidationError} If the email parameters are invalid
   * @throws {TemplateError} If the template does not exist or cannot be rendered
   */
  async sendTemplateEmail(params: TemplateEmailParams): Promise<EmailResult> {
    try {
      this.validateTemplateEmailParams(params);
      
      await this.ensureTemplateExists(params.templateName, params.locale);
      
      const html = await this.templateManager.renderTemplate(
        params.templateName,
        params.templateData || {},
        params.locale
      );
      
      // Create email params with the rendered HTML
      const emailParams: EmailParams = {
        ...params,
        html
      };
      
      return this.sendEmail(emailParams);
    } catch (error) {
      this.logError('Error sending template email', error);
      
      // Rethrow template and validation errors directly
      if (error instanceof TemplateError || error instanceof ValidationError) {
        throw error;
      }
      
      // Return a failure result for other errors
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Get available templates
   * 
   * @returns A promise that resolves to an array of template names
   * @throws {TemplateError} If templates cannot be retrieved
   */
  async getTemplates(): Promise<string[]> {
    try {
      return await this.templateManager.getTemplates();
    } catch (error) {
      this.logError('Error getting templates', error);
      throw new TemplateError('Failed to get templates', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Get template content for preview or testing
   * 
   * @param templateName - The name of the template
   * @param locale - Optional locale for translation, defaults to 'en'
   * @returns A promise that resolves to the template content
   * @throws {TemplateError} If the template does not exist or cannot be loaded
   */
  async getTemplateContent(templateName: string, locale?: string): Promise<string> {
    try {
      await this.ensureTemplateExists(templateName, locale);
      return await this.templateManager.loadTemplate(templateName, locale);
    } catch (error) {
      this.logError('Error getting template content', error);
      
      if (error instanceof TemplateError) {
        throw error;
      }
      
      throw new TemplateError(`Failed to get template content for ${templateName}`, {
        templateName,
        locale,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  /**
   * Initialize the email service
   * Sets up the provider and template manager with configuration
   * 
   * @returns A promise that resolves when initialization is complete
   * @throws {ConfigurationError} If configuration is invalid
   */
  private async initialize(): Promise<void> {
    this.validateConfig();
    
    await Promise.all([
      this.provider.initialize(this.config.provider),
      this.templateManager.initialize(this.config.templates)
    ]);
    
    this.initialized = true;
    
    this.log('info', 'Email service initialized successfully', {
      provider: this.provider.getProviderName(),
      projectId: this.config.projectId
    });
  }
  
  /**
   * Validate email service configuration
   * 
   * @throws {ConfigurationError} If the configuration is invalid
   */
  private validateConfig(): void {
    if (!this.config) {
      throw new ConfigurationError('Email service configuration is required');
    }
    
    const requiredFields = [
      { field: 'provider', message: 'Email provider configuration is required' },
      { field: 'templates', message: 'Email templates configuration is required' },
      { field: 'projectId', message: 'Project ID is required' }
    ];
    
    for (const { field, message } of requiredFields) {
      if (!this.config[field as keyof EmailServiceConfig]) {
        throw new ConfigurationError(message);
      }
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
    
    if (!params.to || (Array.isArray(params.to) && params.to.length === 0)) {
      errors.push('Recipient email is required');
    }
    
    if (!params.subject || params.subject.trim() === '') {
      errors.push('Subject is required');
    }
    
    if (!params.html && !params.text) {
      errors.push('Either HTML or text content is required');
    }
    
    if (errors.length > 0) {
      throw new ValidationError(`Invalid email parameters: ${errors.join(', ')}`, {
        errors,
        params
      });
    }
  }
  
  /**
   * Validate template email parameters
   * 
   * @param params - Template email parameters to validate
   * @throws {ValidationError} If parameters are invalid
   */
  private validateTemplateEmailParams(params: TemplateEmailParams): void {
    const errors: string[] = [];
    
    if (!params.to || (Array.isArray(params.to) && params.to.length === 0)) {
      errors.push('Recipient email is required');
    }
    
    if (!params.subject || params.subject.trim() === '') {
      errors.push('Subject is required');
    }
    
    if (!params.templateName || params.templateName.trim() === '') {
      errors.push('Template name is required');
    }
    
    if (errors.length > 0) {
      throw new ValidationError(`Invalid template email parameters: ${errors.join(', ')}`, {
        errors,
        params
      });
    }
  }
  
  /**
   * Ensure a template exists
   * 
   * @param templateName - The name of the template
   * @param locale - Optional locale
   * @throws {TemplateError} If the template does not exist
   */
  private async ensureTemplateExists(templateName: string, locale?: string): Promise<void> {
    const templateExists = await this.templateManager.templateExists(templateName, locale);
    if (!templateExists) {
      throw new TemplateError(`Template ${templateName} does not exist`, {
        templateName,
        locale
      });
    }
  }
  
  /**
   * Apply project-specific settings to email parameters
   * 
   * @param params - Email parameters
   * @returns Updated email parameters with project settings applied
   */
  private applyProjectSettings(params: EmailParams): EmailParams {
    const updatedParams = { ...params };
    
    // Skip if from address is explicitly provided or no project senders configured
    if (params.from || !this.config.projectSenders) {
      return updatedParams;
    }
    
    const projectSender = this.config.projectSenders[this.config.projectId];
    if (!projectSender) {
      return updatedParams;
    }
    
    // Apply project-specific sender settings
    updatedParams.from = projectSender.senderEmail;
    
    // Apply optional project-specific settings
    if (!params.fromName && projectSender.senderName) {
      updatedParams.fromName = projectSender.senderName;
    }
    
    if (!params.replyTo && projectSender.replyToEmail) {
      updatedParams.replyTo = projectSender.replyToEmail;
    }
    
    // Merge headers and tags if available
    this.mergeProjectHeaders(updatedParams, projectSender);
    this.mergeProjectTags(updatedParams, projectSender);
    
    return updatedParams;
  }
  
  /**
   * Merge project-specific headers with email headers
   * 
   * @param params - Email parameters to modify
   * @param projectSender - Project sender configuration
   */
  private mergeProjectHeaders(params: EmailParams, projectSender: any): void {
    if (projectSender.defaultHeaders) {
      params.headers = {
        ...projectSender.defaultHeaders,
        ...params.headers
      };
    }
  }
  
  /**
   * Merge project-specific tags with email tags
   * 
   * @param params - Email parameters to modify
   * @param projectSender - Project sender configuration
   */
  private mergeProjectTags(params: EmailParams, projectSender: any): void {
    if (projectSender.defaultTags) {
      params.tags = [
        ...(projectSender.defaultTags || []),
        ...(params.tags || [])
      ];
    }
  }
  
  /**
   * Log an email request
   * 
   * @param params - Email parameters
   */
  private logEmailRequest(params: EmailParams): void {
    this.log('info', 'Sending email', {
      to: params.to,
      subject: params.subject,
      from: params.from
    });
  }
  
  /**
   * Log an email sending result
   * 
   * @param result - Email sending result
   * @param params - Email parameters
   */
  private logEmailResult(result: EmailResult, params: EmailParams): void {
    if (result.success) {
      this.log('info', 'Email sent successfully', {
        id: result.id,
        to: params.to
      });
    } else {
      this.log('error', 'Failed to send email', {
        error: result.error,
        to: params.to
      });
    }
  }
  
  /**
   * Log a message with the configured logger
   * 
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   */
  private log(level: string, message: string, context?: any): void {
    if (!this.config.enableLogging) {
      return;
    }
    
    // Skip logging if the level is not enabled
    if (this.shouldSkipLogging(level)) {
      return;
    }
    
    // Use custom logger if provided
    if (this.config.logCallback) {
      this.config.logCallback(level, message, context);
      return;
    }
    
    // Default logging to console
    const logContext = this.createLogContext(context);
    console.log(`[${level.toUpperCase()}] ${message}`, logContext);
  }
  
  /**
   * Determine if logging should be skipped based on configured log level
   * 
   * @param level - Log level to check
   * @returns Whether logging should be skipped
   */
  private shouldSkipLogging(level: string): boolean {
    return (
      (this.config.logLevel === 'error' && level !== 'error') ||
      (this.config.logLevel === 'warn' && (level !== 'error' && level !== 'warn')) ||
      (this.config.logLevel === 'info' && level === 'debug')
    );
  }
  
  /**
   * Create context object for logging
   * 
   * @param context - Additional context to include
   * @returns Complete log context object
   */
  private createLogContext(context?: any): Record<string, any> {
    return {
      timestamp: new Date().toISOString(),
      projectId: this.config.projectId,
      provider: this.provider.getProviderName(),
      ...context
    };
  }
  
  /**
   * Log an error with context
   * 
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: unknown): void {
    const errorObj = error instanceof Error ? error : new UnknownError(String(error));
    
    this.log('error', message, {
      error: errorObj.message,
      stack: errorObj.stack,
      name: errorObj.name
    });
  }
}