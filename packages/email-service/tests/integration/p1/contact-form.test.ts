import path from 'path';
import { ContactFormService, ContactFormData } from '../../../src/services/contact-form.service';
import { ValidationError } from '../../../src/services/email-error';

describe('Contact Form Integration', () => {
  let emailService: any;
  let contactFormService: ContactFormService;
  let mockSendEmail: jest.Mock;
  
  beforeEach(() => {
    // Create a mock email service with a spy on sendTemplateEmail
    mockSendEmail = jest.fn().mockResolvedValue({
      success: true,
      id: 'mock-email-id'
    });
    
    emailService = {
      sendTemplateEmail: mockSendEmail
    };
    
    // Create the contact form service with the mock email service
    contactFormService = new ContactFormService(emailService);
  });
  
  describe('Contact Form Submission', () => {
    it('should send contact form email with correct template and data', async () => {
      // Valid contact form data
      const formData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        device: 'MacBook',
        message: 'I need help with my laptop repair'
      };
      
      // Submit the contact form
      await contactFormService.submitContactForm(formData);
      
      // Verify email was sent with correct data
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      const emailParams = mockSendEmail.mock.calls[0][0];
      
      // Check basic email parameters
      expect(emailParams.to).toBeDefined();
      expect(emailParams.subject).toMatch(/contact form/i);
      expect(emailParams.templateName).toBe('contact-form');
      
      // Check template data
      expect(emailParams.templateData).toBeDefined();
      expect(emailParams.templateData.name).toBe(formData.name);
      expect(emailParams.templateData.email).toBe(formData.email);
      expect(emailParams.templateData.phone).toBe(formData.phone);
      expect(emailParams.templateData.device).toBe(formData.device);
      expect(emailParams.templateData.message).toBe(formData.message);
      expect(emailParams.templateData.year).toBeDefined();
    });
    
    it('should handle missing optional fields', async () => {
      // Contact form data with only required fields
      const formData: ContactFormData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'This is a test message'
      };
      
      // Submit the contact form
      await contactFormService.submitContactForm(formData);
      
      // Verify email was sent with correct data
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      const emailParams = mockSendEmail.mock.calls[0][0];
      
      // Check template data
      expect(emailParams.templateData.name).toBe(formData.name);
      expect(emailParams.templateData.email).toBe(formData.email);
      expect(emailParams.templateData.message).toBe(formData.message);
      expect(emailParams.templateData.phone).toBeUndefined();
      expect(emailParams.templateData.device).toBeUndefined();
    });
    
    it('should throw error with missing required fields', async () => {
      // Contact form data with missing required fields
      const invalidFormData = {
        name: 'John Doe',
        // Missing email
        message: 'Test message'
      } as ContactFormData;
      
      // Expect the submission to throw an error
      await expect(contactFormService.submitContactForm(invalidFormData))
        .rejects.toThrow(/required/i);
    });
    
    it('should validate email format', async () => {
      // Contact form data with invalid email
      const invalidFormData: ContactFormData = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'Test message'
      };
      
      // Expect the submission to throw an error
      await expect(contactFormService.submitContactForm(invalidFormData))
        .rejects.toThrow(/email/i);
    });
  });
});