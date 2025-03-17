// Export interfaces
export * from './services/interfaces';
export * from './services/email-error';

// Export services
export { EmailService } from './services/email.service';
export { TemplateManager } from './services/template-manager.service';
export { ResendEmailProvider } from './services/providers/resend-provider.service';
export { ContactFormService, ContactFormData } from './services/contact-form.service';

// Create a factory function for easy initialization
import { EmailService } from './services/email.service';
import { TemplateManager } from './services/template-manager.service';
import { ResendEmailProvider } from './services/providers/resend-provider.service';
import { EmailServiceConfig } from './services/interfaces';

/**
 * Create a new email service instance
 * @param config Email service configuration
 * @returns An initialized email service
 */
export function createEmailService(config: EmailServiceConfig): EmailService {
  const provider = new ResendEmailProvider();
  const templateManager = new TemplateManager();
  return new EmailService(provider, templateManager, config);
}