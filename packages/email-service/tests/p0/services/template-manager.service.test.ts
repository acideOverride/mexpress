import { 
  ITemplateManager, 
  EmailTemplateConfig,
  TemplateValidationResult
} from '../../../src/services/interfaces';
import { TemplateError, ConfigurationError } from '../../../src/services/email-error';
import path from 'path';
import fs from 'fs-extra';
import Handlebars from 'handlebars';

// Create mocks before we import the module
jest.mock('fs-extra');
jest.mock('handlebars');

// Define mock implementations
const fsExtraMock = fs as jest.Mocked<typeof fs>;
const handlebarsMock = Handlebars as jest.Mocked<typeof Handlebars>;

// Import after mocks
import { TemplateManager } from '../../../src/services/template-manager.service';

describe('TemplateManager', () => {
  let templateManager: ITemplateManager;
  
  const validConfig: EmailTemplateConfig = {
    templatesDir: '/path/to/templates',
    supportedLocales: ['en', 'fr'],
    defaultLocale: 'en',
    cacheTemplates: true
  };

  // Setup mock templates
  const mockTemplates: Record<string, string> = {
    '/path/to/templates/contact-form/en.html': `
      <html>
        <body>
          <h1>New Contact Form Submission</h1>
          <p>Name: {{name}}</p>
          <p>Email: {{email}}</p>
          {{#if phone}}
          <p>Phone: {{phone}}</p>
          {{/if}}
          <p>Message: {{message}}</p>
        </body>
      </html>
    `,
    '/path/to/templates/contact-form/fr.html': `
      <html>
        <body>
          <h1>Nouveau formulaire de contact</h1>
          <p>Nom: {{name}}</p>
          <p>Email: {{email}}</p>
          {{#if phone}}
          <p>Téléphone: {{phone}}</p>
          {{/if}}
          <p>Message: {{message}}</p>
        </body>
      </html>
    `
  };
  
  // Mock template render function
  const mockRender = (template: string, data: Record<string, any>) => {
    let result = template;
    // Replace variables
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key]);
    }
    // Handle conditionals (very simplified)
    const ifRegex = /{{#if\s+([^}]*)}}\s*([\s\S]*?)\s*{{\/if}}/g;
    result = result.replace(ifRegex, (match: string, condition: string, content: string) => {
      return data[condition] ? content : '';
    });
    return result;
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup fs-extra mock implementations
    fsExtraMock.pathExists.mockImplementation((filepath: string) => {
      if (filepath === '/non-existent-directory') {
        return Promise.resolve(false);
      }
      if (filepath === '/path/to/templates') {
        return Promise.resolve(true);
      }
      return Promise.resolve(mockTemplates[filepath as keyof typeof mockTemplates] !== undefined);
    });
    
    fsExtraMock.readFile.mockImplementation((filepath: string, encoding: string) => {
      const templatePath = filepath as keyof typeof mockTemplates;
      if (mockTemplates[templatePath]) {
        return Promise.resolve(mockTemplates[templatePath]);
      }
      return Promise.reject(new Error(`File not found: ${filepath}`));
    });
    
    fsExtraMock.readdir.mockImplementation((dirpath: string) => {
      if (dirpath === '/path/to/templates') {
        return Promise.resolve(['contact-form']);
      }
      return Promise.reject(new Error(`Directory not found: ${dirpath}`));
    });
    
    fsExtraMock.stat.mockImplementation((filepath: string) => {
      return Promise.resolve({
        isDirectory: () => filepath.includes('/path/to/templates/contact-form')
      });
    });
    
    // Setup Handlebars mock implementations
    handlebarsMock.compile.mockImplementation((template: string) => {
      return (data: Record<string, any>) => mockRender(template, data);
    });
  });
  
  beforeEach(async () => {
    templateManager = new TemplateManager();
    await templateManager.initialize(validConfig);
  });
  
  describe('initialize', () => {
    it('should throw error with invalid templates directory', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(false);
      
      const newTemplateManager = new TemplateManager();
      const invalidConfig = { 
        ...validConfig, 
        templatesDir: '/non-existent-directory' 
      };
      
      await expect(newTemplateManager.initialize(invalidConfig))
        .rejects.toThrow(ConfigurationError);
    });
    
    it('should initialize successfully with valid config', async () => {
      const newTemplateManager = new TemplateManager();
      await expect(newTemplateManager.initialize(validConfig))
        .resolves.not.toThrow();
    });
  });
  
  describe('loadTemplate', () => {
    it('should load existing template with default locale', async () => {
      const template = await templateManager.loadTemplate('contact-form');
      
      expect(template).toBeDefined();
      expect(fsExtraMock.readFile).toHaveBeenCalled();
      expect(template).toContain('Name: {{name}}');
      expect(template).toContain('Email: {{email}}');
    });
    
    it('should throw error for non-existent template', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(false); // No template exists
      fsExtraMock.pathExists.mockResolvedValueOnce(false); // No fallback exists
      
      await expect(templateManager.loadTemplate('non-existent-template'))
        .rejects.toThrow(TemplateError);
    });
    
    it('should use default locale if specified locale is not supported', async () => {
      // First call is for the requested locale (de), which fails
      fsExtraMock.pathExists.mockResolvedValueOnce(false);
      // Second call is for the default locale (en), which succeeds
      fsExtraMock.pathExists.mockResolvedValueOnce(true);
      fsExtraMock.readFile.mockResolvedValueOnce(mockTemplates['/path/to/templates/contact-form/en.html']);
      
      const template = await templateManager.loadTemplate('contact-form', 'de');
      
      expect(template).toBeDefined();
      expect(template).toContain('New Contact Form Submission');
    });
  });
  
  describe('renderTemplate', () => {
    it('should render template with data', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'This is a test message'
      };
      
      fsExtraMock.pathExists.mockResolvedValueOnce(true);
      fsExtraMock.readFile.mockResolvedValueOnce(mockTemplates['/path/to/templates/contact-form/en.html']);
      
      const rendered = await templateManager.renderTemplate('contact-form', data);
      
      expect(rendered).toBeDefined();
      expect(rendered).toContain('John Doe');
      expect(rendered).toContain('john@example.com');
      expect(rendered).toContain('123-456-7890');
      expect(rendered).toContain('This is a test message');
    });
    
    it('should handle conditional sections', async () => {
      const dataWithPhone = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        message: 'Test message'
      };
      
      const dataWithoutPhone = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Another test'
      };
      
      // First call for dataWithPhone
      fsExtraMock.pathExists.mockResolvedValueOnce(true);
      fsExtraMock.readFile.mockResolvedValueOnce(mockTemplates['/path/to/templates/contact-form/en.html']);
      
      // Second call for dataWithoutPhone
      fsExtraMock.pathExists.mockResolvedValueOnce(true);
      fsExtraMock.readFile.mockResolvedValueOnce(mockTemplates['/path/to/templates/contact-form/en.html']);
      
      const renderedWithPhone = await templateManager.renderTemplate('contact-form', dataWithPhone);
      const renderedWithoutPhone = await templateManager.renderTemplate('contact-form', dataWithoutPhone);
      
      expect(renderedWithPhone).toContain('Phone:');
      expect(renderedWithoutPhone).not.toContain('Phone:');
    });
    
    it('should throw error for non-existent template', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(false); // No template exists
      fsExtraMock.pathExists.mockResolvedValueOnce(false); // No fallback exists
      
      await expect(templateManager.renderTemplate('non-existent-template', {}))
        .rejects.toThrow(TemplateError);
    });
  });
  
  describe('getTemplates', () => {
    it('should return list of available templates', async () => {
      fsExtraMock.readdir.mockResolvedValueOnce(['contact-form']);
      fsExtraMock.stat.mockResolvedValueOnce({
        isDirectory: () => true
      });
      
      const templates = await templateManager.getTemplates();
      
      expect(templates).toBeInstanceOf(Array);
      expect(templates).toContain('contact-form');
      expect(fsExtraMock.readdir).toHaveBeenCalledWith('/path/to/templates');
    });
  });
  
  describe('templateExists', () => {
    it('should return true for existing template', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(true);
      
      const exists = await templateManager.templateExists('contact-form');
      
      expect(exists).toBe(true);
      expect(fsExtraMock.pathExists).toHaveBeenCalled();
    });
    
    it('should return false for non-existent template', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(false);
      
      const exists = await templateManager.templateExists('non-existent-template');
      
      expect(exists).toBe(false);
      expect(fsExtraMock.pathExists).toHaveBeenCalled();
    });
  });
  
  describe('validateTemplate', () => {
    it('should validate existing template', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(true);
      fsExtraMock.readFile.mockResolvedValueOnce(mockTemplates['/path/to/templates/contact-form/en.html']);
      
      const result = await templateManager.validateTemplate('contact-form');
      
      expect(result.isValid).toBe(true);
      expect(result.requiredVariables).toContain('name');
      expect(result.requiredVariables).toContain('email');
      expect(result.requiredVariables).toContain('message');
    });
    
    it('should return invalid result for non-existent template', async () => {
      fsExtraMock.pathExists.mockResolvedValueOnce(false);
      
      const result = await templateManager.validateTemplate('non-existent-template');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});