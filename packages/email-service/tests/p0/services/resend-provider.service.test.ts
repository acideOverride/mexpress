import { 
  IEmailProvider, 
  EmailProviderConfig,
  ConfigValidationResult,
  RateLimitStatus
} from '../../../src/services/interfaces';
import { EmailParams, EmailResult } from '../../../src/services/interfaces';
import { 
  AuthenticationError, 
  ConfigurationError, 
  ValidationError 
} from '../../../src/services/email-error';
import { ResendEmailProvider } from '../../../src/services/providers/resend-provider.service';

// Mock for the Resend API client
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        emails: {
          send: jest.fn().mockImplementation(async (params: any) => {
            // Simulate API response
            if (!params) {
              throw new Error('Missing parameters');
            }
            
            if (!params.to || params.to === '') {
              throw new Error('Invalid recipient');
            }
            
            if (!params.subject) {
              throw new Error('Missing subject');
            }
            
            if (!params.html && !params.text) {
              throw new Error('Missing content');
            }
            
            return {
              id: 'mock-email-id',
              from: params.from || 'default@example.com',
              to: params.to,
              created_at: new Date().toISOString()
            };
          })
        }
      };
    })
  };
});

describe('ResendEmailProvider', () => {
  let provider: IEmailProvider;
  
  const validConfig: EmailProviderConfig = {
    apiKey: 'test-api-key',
    defaultSender: 'test@example.com',
    defaultSenderName: 'Test Sender',
    trackOpens: true,
    trackClicks: true
  };
  
  beforeEach(() => {
    provider = new ResendEmailProvider();
    jest.clearAllMocks();
  });
  
  describe('initialize', () => {
    it('should throw error with missing API key', async () => {
      const invalidConfig = { ...validConfig, apiKey: '' };
      
      await expect(provider.initialize(invalidConfig))
        .rejects.toThrow(ConfigurationError);
    });
    
    it('should throw error with missing default sender', async () => {
      const invalidConfig = { ...validConfig, defaultSender: '' };
      
      await expect(provider.initialize(invalidConfig))
        .rejects.toThrow(ConfigurationError);
    });
    
    it('should initialize successfully with valid config', async () => {
      await expect(provider.initialize(validConfig)).resolves.not.toThrow();
      expect(provider.isInitialized()).toBe(true);
    });
  });
  
  describe('sendEmail', () => {
    beforeEach(async () => {
      await provider.initialize(validConfig);
    });
    
    it('should throw error if not initialized', async () => {
      provider = new ResendEmailProvider(); // Create a new uninitialized instance
      
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      await expect(provider.sendEmail(params))
        .rejects.toThrow(ConfigurationError);
    });
    
    it('should throw error with invalid parameters', async () => {
      const invalidParams: EmailParams = {
        to: '',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      await expect(provider.sendEmail(invalidParams))
        .rejects.toThrow(ValidationError);
    });
    
    it('should send email successfully', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
    
    it('should use default sender if not specified', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.response.from).toBe(`${validConfig.defaultSenderName} <${validConfig.defaultSender}>`);
    });
    
    it('should use provided sender if specified', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
        from: 'custom@example.com',
        fromName: 'Custom Sender'
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.response.from).toBe('Custom Sender <custom@example.com>');
    });
    
    it('should handle multiple recipients', async () => {
      const params: EmailParams = {
        to: ['recipient1@example.com', 'recipient2@example.com'],
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
    
    it('should handle attachments', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>',
        attachments: [
          {
            filename: 'test.txt',
            content: 'Test content'
          }
        ]
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
    
    it('should handle both HTML and text content', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML Content</p>',
        text: 'Test plain text content'
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
    
    it('should handle text-only content', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test plain text content'
      };
      
      const result = await provider.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });
  
  describe('getRateLimitStatus', () => {
    beforeEach(async () => {
      await provider.initialize(validConfig);
    });
    
    it('should return rate limit status', async () => {
      const status = await provider.getRateLimitStatus();
      
      expect(status).toBeDefined();
      expect(status.isRateLimited).toBeDefined();
      expect(status.remaining).toBeDefined();
    });
  });
  
  describe('getProviderName', () => {
    it('should return the provider name', () => {
      expect(provider.getProviderName()).toBe('Resend');
    });
  });
  
  describe('validateConfig', () => {
    it('should validate valid configuration', async () => {
      await provider.initialize(validConfig);
      const result = await provider.validateConfig();
      
      expect(result.isValid).toBe(true);
    });
    
    it('should invalidate configuration with missing API key', async () => {
      try {
        // This should throw ConfigurationError during initialization
        await provider.initialize({
          ...validConfig,
          apiKey: ''
        });
      } catch (error) {
        // Expected error, continue with test
      }
      
      const result = await provider.validateConfig();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
    
    it('should invalidate configuration with missing default sender', async () => {
      try {
        // This should throw ConfigurationError during initialization
        await provider.initialize({
          ...validConfig,
          defaultSender: ''
        });
      } catch (error) {
        // Expected error, continue with test
      }
      
      const result = await provider.validateConfig();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});