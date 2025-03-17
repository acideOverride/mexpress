import { IEmailService, TemplateEmailParams } from './interfaces';
import { ValidationError } from './email-error';

/**
 * Contact form submission data
 */
export interface ContactFormData {
  /** Contact person name */
  name: string;
  /** Contact email address */
  email: string;
  /** Contact message */
  message: string;
  /** Optional phone number */
  phone?: string;
  /** Optional device type */
  device?: string;
  /** Any additional data */
  [key: string]: any;
}

/**
 * Contact form service for handling form submissions
 */
export class ContactFormService {
  /** Admin notification email address */
  private adminEmail: string;
  /** Admin notification subject prefix */
  private subjectPrefix: string;
  /** Template name for contact form */
  private templateName: string;
  
  /**
   * Create a new contact form service
   * @param emailService Email service for sending notifications
   * @param options Service options
   */
  constructor(
    private emailService: IEmailService,
    options: {
      adminEmail?: string;
      subjectPrefix?: string;
      templateName?: string;
    } = {}
  ) {
    this.adminEmail = options.adminEmail || 'admin@montpc.com';
    this.subjectPrefix = options.subjectPrefix || 'New Contact Form:';
    this.templateName = options.templateName || 'contact-form';
  }
  
  /**
   * Submit a contact form and send notifications
   * @param formData Contact form data
   * @returns Email sending result
   */
  async submitContactForm(formData: ContactFormData) {
    // Validate form data
    this.validateFormData(formData);
    
    // Prepare template data with current year
    const templateData = {
      ...formData,
      year: new Date().getFullYear().toString()
    };
    
    // Create customer name snippet for the subject
    const nameSnippet = formData.name.length > 20 
      ? formData.name.substring(0, 17) + '...'
      : formData.name;
    
    // Send notification email
    const emailParams: TemplateEmailParams = {
      to: this.adminEmail,
      subject: `${this.subjectPrefix} ${nameSnippet}`,
      templateName: this.templateName,
      templateData
    };
    
    return await this.emailService.sendTemplateEmail(emailParams);
  }
  
  /**
   * Validate contact form data
   * @param formData Form data to validate
   * @throws {ValidationError} If data is invalid
   */
  private validateFormData(formData: ContactFormData): void {
    const errors: string[] = [];
    
    // Check required fields
    if (!formData.name || formData.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!formData.email || formData.email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(formData.email)) {
      errors.push('Email format is invalid');
    }
    
    if (!formData.message || formData.message.trim() === '') {
      errors.push('Message is required');
    }
    
    if (errors.length > 0) {
      throw new ValidationError(`Invalid contact form data: ${errors.join(', ')}`, {
        errors,
        formData
      });
    }
  }
  
  /**
   * Check if an email address is valid
   * @param email Email address to validate
   * @returns Whether the email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}