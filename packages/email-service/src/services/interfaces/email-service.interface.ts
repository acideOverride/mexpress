/**
 * Interface for the main email service
 * Provides common functionality for sending emails across the mExpress ecosystem
 */
export interface IEmailService {
  /**
   * Send an email with the given parameters
   * @param params The email parameters
   * @returns A promise that resolves to the email result
   */
  sendEmail(params: EmailParams): Promise<EmailResult>;

  /**
   * Send an email using a template
   * @param params The template email parameters
   * @returns A promise that resolves to the email result
   */
  sendTemplateEmail(params: TemplateEmailParams): Promise<EmailResult>;

  /**
   * Get available templates
   * @returns A promise that resolves to an array of template names
   */
  getTemplates(): Promise<string[]>;

  /**
   * Get template content for preview or testing
   * @param templateName The name of the template
   * @param locale Optional locale for translation, defaults to 'en'
   * @returns A promise that resolves to the template content
   */
  getTemplateContent(templateName: string, locale?: string): Promise<string>;
}

/**
 * Basic email parameters
 */
export interface EmailParams {
  /** The email address(es) of the recipient(s) */
  to: string | string[];
  /** The subject of the email */
  subject: string;
  /** The HTML content of the email */
  html?: string;
  /** The plain text content of the email */
  text?: string;
  /** The email address of the sender */
  from?: string;
  /** The name of the sender */
  fromName?: string;
  /** The email address for replies */
  replyTo?: string;
  /** Optional CC recipients */
  cc?: string | string[];
  /** Optional BCC recipients */
  bcc?: string | string[];
  /** Optional attachments */
  attachments?: EmailAttachment[];
  /** Optional headers */
  headers?: Record<string, string>;
  /** Optional tags for email categorization */
  tags?: string[];
}

/**
 * Template-based email parameters
 */
export interface TemplateEmailParams extends Omit<EmailParams, 'html' | 'text'> {
  /** The name of the template to use */
  templateName: string;
  /** Optional template data to be injected */
  templateData?: Record<string, any>;
  /** Optional locale for translation, defaults to 'en' */
  locale?: string;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  /** Filename of the attachment */
  filename: string;
  /** Content of the attachment - can be a string, Buffer, or path to a file */
  content: string | Buffer | NodeJS.ReadableStream;
  /** MIME type of the attachment */
  contentType?: string;
  /** Content ID for embedding the attachment in the HTML */
  cid?: string;
}

/**
 * Email send result
 */
export interface EmailResult {
  /** Whether the email was sent successfully */
  success: boolean;
  /** The ID of the email (if provided by the provider) */
  id?: string;
  /** Error message if sending failed */
  error?: string;
  /** Provider-specific response data */
  response?: any;
}