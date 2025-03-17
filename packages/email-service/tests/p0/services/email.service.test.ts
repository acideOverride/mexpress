import { 
  IEmailService, 
  EmailParams, 
  TemplateEmailParams, 
  EmailResult,
  EmailServiceConfig,
  IEmailProvider,
  ITemplateManager
} from '../../../src/services/interfaces';
import { 
  ConfigurationError, 
  ValidationError,
  TemplateError
} from '../../../src/services/email-error';
import { EmailService } from '../../../src/services/email.service';

// Mock provider for testing
class MockEmailProvider implements IEmailProvider {
  apiKey: string = '';
  defaultSender: string = '';
  initialized: boolean = false;
  lastSentParams: any = null;
  returnValue: EmailResult = { success: true, id: 'mock-email-id' };
  shouldFail: boolean = false;
  errorMessage: string = 'Mock provider error';

  initialize(config: any): Promise<void> {
    this.apiKey = config.apiKey;
    this.defaultSender = config.defaultSender;
    this.initialized = true;
    return Promise.resolve();
  }

  sendEmail(params: any): Promise<EmailResult> {
    this.lastSentParams = params;
    
    if (this.shouldFail) {
      return Promise.resolve({
        success: false,
        error: this.errorMessage
      });
    }
    
    return Promise.resolve(this.returnValue);
  }

  getRateLimitStatus(): Promise<any> {
    return Promise.resolve({
      isRateLimited: false,
      remaining: {
        minute: 60,
        hour: 3600,
        day: 10000
      },
      reset: {
        minute: new Date(Date.now() + 60000),
        hour: new Date(Date.now() + 3600000),
        day: new Date(Date.now() + 86400000)
      }
    });
  }

  getProviderName(): string {
    return 'MockProvider';
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  validateConfig(): Promise<any> {
    return Promise.resolve({
      isValid: true,
      message: 'Configuration is valid'
    });
  }
}

// Mock template manager for testing
class MockTemplateManager implements ITemplateManager {
  templates: Record<string, string> = {
    'test-template': '<p>Hello {{name}}!</p>',
    'contact-form': '<p>Contact from {{name}} ({{email}}): {{message}}</p>'
  };
  initialized: boolean = false;
  lastRequestedLocale?: string;
  
  initialize(config: any): Promise<void> {
    this.initialized = true;
    return Promise.resolve();
  }
  
  loadTemplate(templateName: string, locale?: string): Promise<string> {
    this.lastRequestedLocale = locale;
    const template = this.templates[templateName];
    if (!template) {
      return Promise.reject(new TemplateError(`Template ${templateName} not found`));
    }
    return Promise.resolve(template);
  }
  
  renderTemplate(templateName: string, data: Record<string, any>, locale?: string): Promise<string> {
    this.lastRequestedLocale = locale;
    const template = this.templates[templateName];
    if (!template) {
      return Promise.reject(new TemplateError(`Template ${templateName} not found`));
    }
    
    // Simple handlebars-like template replacement
    let rendered = template;
    Object.entries(data).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    
    return Promise.resolve(rendered);
  }
  
  getTemplates(): Promise<string[]> {
    return Promise.resolve(Object.keys(this.templates));
  }
  
  templateExists(templateName: string, locale?: string): Promise<boolean> {
    return Promise.resolve(templateName in this.templates);
  }
  
  validateTemplate(templateName: string, locale?: string): Promise<any> {
    if (!(templateName in this.templates)) {
      return Promise.resolve({
        isValid: false,
        errors: [`Template ${templateName} not found`]
      });
    }
    
    return Promise.resolve({
      isValid: true,
      requiredVariables: ['name'],
      optionalVariables: ['email', 'message']
    });
  }
}

describe('EmailService', () => {
  let emailService: IEmailService;
  let mockProvider: MockEmailProvider;
  let mockTemplateManager: MockTemplateManager;
  
  const validConfig: EmailServiceConfig = {
    provider: {
      apiKey: 'test-api-key',
      defaultSender: 'test@example.com',
      defaultSenderName: 'Test Sender'
    },
    templates: {
      templatesDir: '/path/to/templates',
      supportedLocales: ['en', 'fr'],
      defaultLocale: 'en'
    },
    projectId: 'test-project',
    projectSenders: {
      'montpc-crm': {
        projectId: 'montpc-crm',
        senderEmail: 'crm@montpc.com',
        senderName: 'MontPC CRM'
      },
      'giandra-photos': {
        projectId: 'giandra-photos',
        senderEmail: 'photos@giandra.com',
        senderName: 'Giandra Photos'
      }
    }
  };
  
  beforeEach(() => {
    mockProvider = new MockEmailProvider();
    mockTemplateManager = new MockTemplateManager();
    emailService = new EmailService(mockProvider, mockTemplateManager, validConfig);
  });
  
  describe('sendEmail', () => {
    it('should throw error for invalid email parameters', async () => {
      const invalidParams: EmailParams = {
        to: '',
        subject: 'Test Subject'
      };
      
      await expect(emailService.sendEmail(invalidParams))
        .rejects.toThrow(ValidationError);
    });
    
    it('should send email successfully', async () => {
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      const result = await emailService.sendEmail(params);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
    
    it('should use project-specific sender if projectId is provided', async () => {
      // Set the test config to use montpc-crm projectId
      const testConfig = {
        ...validConfig,
        projectId: 'montpc-crm'
      };
      
      // Create a new email service instance with this config
      const projectEmailService = new EmailService(mockProvider, mockTemplateManager, testConfig);
      
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      const result = await projectEmailService.sendEmail(params);
      
      expect(result.success).toBe(true);
      expect(mockProvider.lastSentParams.from).toBe('crm@montpc.com');
    });
    
    it('should handle error from email provider', async () => {
      mockProvider.shouldFail = true;
      
      const params: EmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Content</p>'
      };
      
      const result = await emailService.sendEmail(params);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('sendTemplateEmail', () => {
    it('should throw error for non-existent template', async () => {
      const params: TemplateEmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        templateName: 'non-existent-template',
        templateData: { name: 'Test User' }
      };
      
      await expect(emailService.sendTemplateEmail(params))
        .rejects.toThrow(TemplateError);
    });
    
    it('should send template email successfully', async () => {
      const params: TemplateEmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        templateName: 'contact-form',
        templateData: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test message'
        }
      };
      
      const result = await emailService.sendTemplateEmail(params);
      
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(mockProvider.lastSentParams.html).toContain('Test User');
      expect(mockProvider.lastSentParams.html).toContain('test@example.com');
      expect(mockProvider.lastSentParams.html).toContain('This is a test message');
    });
    
    it('should use specified locale if provided', async () => {
      const params: TemplateEmailParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        templateName: 'contact-form',
        templateData: { name: 'Test User' },
        locale: 'fr'
      };
      
      await emailService.sendTemplateEmail(params);
      
      // Verify that the template manager was asked for the French version
      expect(mockTemplateManager.lastRequestedLocale).toBe('fr');
    });
  });
  
  describe('getTemplates', () => {
    it('should return the list of available templates', async () => {
      const templates = await emailService.getTemplates();
      
      expect(templates).toBeInstanceOf(Array);
      expect(templates).toContain('contact-form');
      expect(templates).toContain('test-template');
    });
  });
  
  describe('getTemplateContent', () => {
    it('should return template content for a valid template', async () => {
      const content = await emailService.getTemplateContent('contact-form');
      
      expect(content).toBeDefined();
      expect(content).toContain('{{name}}');
      expect(content).toContain('{{email}}');
      expect(content).toContain('{{message}}');
    });
    
    it('should throw error for non-existent template', async () => {
      await expect(emailService.getTemplateContent('non-existent-template'))
        .rejects.toThrow(TemplateError);
    });
    
    it('should use specified locale if provided', async () => {
      await emailService.getTemplateContent('contact-form', 'fr');
      
      // Verify that the template manager was asked for the French version
      expect(mockTemplateManager.lastRequestedLocale).toBe('fr');
    });
  });
});