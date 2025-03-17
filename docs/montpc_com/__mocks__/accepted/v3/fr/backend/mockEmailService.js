/**
 * Mock implementation of the @mexpress/email-service package
 * This is used for running tests without the actual package
 */

// Mock implementation for EmailService
const mockSendTemplateEmail = jest.fn().mockResolvedValue({ success: true, id: 'mock-email-id' });

const MockEmailService = jest.fn().mockImplementation(() => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-email-id' }),
  sendTemplateEmail: mockSendTemplateEmail,
  getTemplates: jest.fn().mockResolvedValue(['contact-form-admin', 'contact-form-confirmation']),
  getTemplateContent: jest.fn().mockResolvedValue('<html>Mock template</html>')
}));

// Mock implementation for ResendEmailProvider
const MockResendEmailProvider = jest.fn().mockImplementation(() => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-email-id' }),
  getProviderName: jest.fn().mockReturnValue('ResendEmailProvider')
}));

// Mock implementation for TemplateManager
const MockTemplateManager = jest.fn().mockImplementation(() => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  renderTemplate: jest.fn().mockResolvedValue('<html>Mock rendered template</html>'),
  getTemplates: jest.fn().mockResolvedValue(['contact-form-admin', 'contact-form-confirmation']),
  loadTemplate: jest.fn().mockResolvedValue('<html>Mock template</html>'),
  templateExists: jest.fn().mockResolvedValue(true)
}));

module.exports = {
  EmailService: MockEmailService,
  ResendEmailProvider: MockResendEmailProvider,
  TemplateManager: MockTemplateManager,
  mockSendTemplateEmail
};