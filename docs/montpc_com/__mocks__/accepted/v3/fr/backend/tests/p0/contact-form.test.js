/**
 * Contact Form API Tests
 */

const request = require('supertest');
const app = require('../../server');

// Mock the email service
jest.mock('@mexpress/email-service', () => {
  // Mock implementation of EmailService
  const mockSendTemplateEmail = jest.fn().mockResolvedValue({ success: true, id: 'mock-email-id' });
  
  const MockEmailService = jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-email-id' }),
    sendTemplateEmail: mockSendTemplateEmail,
    getTemplates: jest.fn().mockResolvedValue(['contact-form-admin', 'contact-form-confirmation']),
    getTemplateContent: jest.fn().mockResolvedValue('<html>Mock template</html>')
  }));
  
  const MockResendEmailProvider = jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-email-id' }),
    getProviderName: jest.fn().mockReturnValue('ResendEmailProvider')
  }));
  
  const MockTemplateManager = jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    renderTemplate: jest.fn().mockResolvedValue('<html>Mock rendered template</html>'),
    getTemplates: jest.fn().mockResolvedValue(['contact-form-admin', 'contact-form-confirmation']),
    loadTemplate: jest.fn().mockResolvedValue('<html>Mock template</html>'),
    templateExists: jest.fn().mockResolvedValue(true)
  }));
  
  return {
    EmailService: MockEmailService,
    ResendEmailProvider: MockResendEmailProvider,
    TemplateManager: MockTemplateManager,
    mockSendTemplateEmail // Export for test access
  };
});

describe('Contact Form API', () => {
  
  describe('POST /api/contact', () => {
    
    test('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name' }),
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'message' })
        ])
      );
    });
    
    test('should validate email format', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          message: 'This is a test message that is long enough to be valid'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' })
        ])
      );
    });
    
    test('should validate message length', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Too short'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'message' })
        ])
      );
    });
    
    test('should accept valid form submission and send emails', async () => {
      // Access the mock function
      const { mockSendTemplateEmail } = require('@mexpress/email-service');
      
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '123-456-7890',
          device: 'iPhone',
          message: 'This is a test message that is long enough to be valid'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.reference).toBeTruthy();
      
      // Verify that sendTemplateEmail was called exactly twice (admin + customer)
      expect(mockSendTemplateEmail).toHaveBeenCalledTimes(2);
      
      // Verify admin email
      expect(mockSendTemplateEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          templateName: 'contact-form-admin',
          locale: 'fr'
        })
      );
      
      // Verify customer email
      expect(mockSendTemplateEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          templateName: 'contact-form-confirmation',
          locale: 'fr'
        })
      );
    });
    
    test('should handle email service errors gracefully', async () => {
      // Access the mock function and make it reject for this test
      const { mockSendTemplateEmail } = require('@mexpress/email-service');
      mockSendTemplateEmail.mockRejectedValueOnce(new Error('Test email error'));
      
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '123-456-7890',
          device: 'iPhone',
          message: 'This is a test message that is long enough to be valid'
        });
      
      // Should still return success even though email failed
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.reference).toBeTruthy();
    });
  });
  
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
  
});