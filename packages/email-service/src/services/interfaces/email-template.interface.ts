/**
 * Email template configuration
 */
export interface EmailTemplateConfig {
  /** Base directory for templates */
  templatesDir: string;
  /** Supported locales */
  supportedLocales: string[];
  /** Default locale */
  defaultLocale: string;
  /** Whether to cache templates */
  cacheTemplates?: boolean;
  /** The template engine to use */
  templateEngine?: 'handlebars' | 'mustache' | 'ejs' | 'custom';
}

/**
 * Interface for template manager
 */
export interface ITemplateManager {
  /**
   * Initialize the template manager
   * @param config The template configuration
   */
  initialize(config: EmailTemplateConfig): Promise<void>;

  /**
   * Load a template from the template directory
   * @param templateName The name of the template
   * @param locale The locale to use
   * @returns The template content
   */
  loadTemplate(templateName: string, locale?: string): Promise<string>;

  /**
   * Render a template with data
   * @param templateName The name of the template
   * @param data The data to render the template with
   * @param locale The locale to use
   * @returns The rendered template
   */
  renderTemplate(templateName: string, data: Record<string, any>, locale?: string): Promise<string>;

  /**
   * Get a list of available templates
   * @returns Array of template names
   */
  getTemplates(): Promise<string[]>;

  /**
   * Check if a template exists
   * @param templateName The name of the template
   * @param locale The locale to check
   * @returns Whether the template exists
   */
  templateExists(templateName: string, locale?: string): Promise<boolean>;

  /**
   * Validate a template (check for required variables and syntax)
   * @param templateName The name of the template
   * @param locale The locale to check
   * @returns Validation result
   */
  validateTemplate(templateName: string, locale?: string): Promise<TemplateValidationResult>;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  /** Whether the template is valid */
  isValid: boolean;
  /** Template path */
  templatePath?: string;
  /** Validation errors */
  errors?: string[];
  /** Required variables */
  requiredVariables?: string[];
  /** Optional variables */
  optionalVariables?: string[];
}