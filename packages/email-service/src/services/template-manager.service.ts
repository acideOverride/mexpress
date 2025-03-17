import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';
import { ITemplateManager, EmailTemplateConfig, TemplateValidationResult } from './interfaces';
import { ConfigurationError, TemplateError } from './email-error';

/**
 * Template manager implementation
 * Handles loading, rendering, and managing email templates
 */
export class TemplateManager implements ITemplateManager {
  private config: EmailTemplateConfig | null = null;
  private templates: Map<string, Map<string, string>> = new Map();
  private compiledTemplates: Map<string, Map<string, Handlebars.TemplateDelegate>> = new Map();
  private initialized = false;

  /**
   * Initialize the template manager
   * @param config The template configuration
   */
  async initialize(config: EmailTemplateConfig): Promise<void> {
    if (!config.templatesDir) {
      throw new ConfigurationError('Template directory is required');
    }

    if (!config.supportedLocales || config.supportedLocales.length === 0) {
      throw new ConfigurationError('At least one supported locale is required');
    }

    if (!config.defaultLocale) {
      throw new ConfigurationError('Default locale is required');
    }

    // Verify that the template directory exists
    try {
      const exists = await fs.pathExists(config.templatesDir);
      if (!exists) {
        throw new ConfigurationError(`Template directory ${config.templatesDir} does not exist`, {
          templatesDir: config.templatesDir
        });
      }
    } catch (error) {
      throw new ConfigurationError(`Error accessing template directory: ${(error as Error).message}`, {
        templatesDir: config.templatesDir,
        error
      });
    }

    this.config = {
      ...config,
      cacheTemplates: config.cacheTemplates !== false, // Default to true
      templateEngine: config.templateEngine || 'handlebars'
    };

    // Register Handlebars helpers
    this.registerHandlebarsHelpers();

    // Pre-load templates if caching is enabled
    if (this.config.cacheTemplates) {
      const templates = await this.getTemplates();
      for (const templateName of templates) {
        for (const locale of this.config.supportedLocales) {
          try {
            // Skip if template doesn't exist for this locale
            if (await this.templateExists(templateName, locale)) {
              await this.loadTemplate(templateName, locale);
            }
          } catch (error) {
            // Skip if there's an error loading this specific template
            console.warn(`Could not pre-load template ${templateName} for locale ${locale}:`, error);
          }
        }
      }
    }

    this.initialized = true;
  }

  /**
   * Load a template from the template directory
   * @param templateName The name of the template
   * @param locale The locale to use
   * @returns The template content
   */
  async loadTemplate(templateName: string, locale?: string): Promise<string> {
    this.checkInitialized();

    const resolvedLocale = this.resolveLocale(locale);
    const cachedTemplate = this.getCachedTemplate(templateName, resolvedLocale);
    if (cachedTemplate) {
      return cachedTemplate;
    }

    const templatePath = this.getTemplatePath(templateName, resolvedLocale);

    try {
      // Check if template exists
      const exists = await fs.pathExists(templatePath);
      if (!exists) {
        // If locale-specific template doesn't exist and it's not the default locale,
        // try the default locale as a fallback
        if (resolvedLocale !== this.config!.defaultLocale) {
          return this.loadTemplate(templateName, this.config!.defaultLocale);
        }

        throw new TemplateError(`Template ${templateName} not found for locale ${resolvedLocale}`, {
          templateName,
          locale: resolvedLocale,
          templatePath
        });
      }

      const templateContent = await fs.readFile(templatePath, 'utf8');
      if (this.config!.cacheTemplates) {
        this.cacheTemplate(templateName, resolvedLocale, templateContent);
      }

      return templateContent;
    } catch (error) {
      if (error instanceof TemplateError) {
        throw error;
      }

      throw new TemplateError(`Error loading template ${templateName} for locale ${resolvedLocale}: ${(error as Error).message}`, {
        templateName,
        locale: resolvedLocale,
        templatePath,
        error
      });
    }
  }

  /**
   * Render a template with data
   * @param templateName The name of the template
   * @param data The data to render the template with
   * @param locale The locale to use
   * @returns The rendered template
   */
  async renderTemplate(templateName: string, data: Record<string, any>, locale?: string): Promise<string> {
    this.checkInitialized();
    
    const resolvedLocale = this.resolveLocale(locale);
    
    try {
      // Use the compile function based on the configured template engine
      const compileFunction = await this.getCompileFunction(templateName, resolvedLocale);
      return compileFunction(data);
    } catch (error) {
      throw new TemplateError(`Error rendering template ${templateName} for locale ${resolvedLocale}: ${(error as Error).message}`, {
        templateName,
        locale: resolvedLocale,
        data,
        error
      });
    }
  }

  /**
   * Get a list of available templates
   * @returns Array of template names
   */
  async getTemplates(): Promise<string[]> {
    this.checkInitialized();

    try {
      const templateDirs = await fs.readdir(this.config!.templatesDir);
      const result: string[] = [];
      
      // Use a for loop since we need to await inside the loop
      for (const dir of templateDirs) {
        const stat = await fs.stat(path.join(this.config!.templatesDir, dir));
        if (stat.isDirectory()) {
          result.push(dir);
        }
      }
      
      return result;
    } catch (error) {
      throw new TemplateError(`Error getting templates: ${(error as Error).message}`, {
        templatesDir: this.config!.templatesDir,
        error
      });
    }
  }

  /**
   * Check if a template exists
   * @param templateName The name of the template
   * @param locale The locale to check
   * @returns Whether the template exists
   */
  async templateExists(templateName: string, locale?: string): Promise<boolean> {
    this.checkInitialized();
    
    const resolvedLocale = this.resolveLocale(locale);
    const templatePath = this.getTemplatePath(templateName, resolvedLocale);

    try {
      return await fs.pathExists(templatePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate a template (check for required variables and syntax)
   * @param templateName The name of the template
   * @param locale The locale to check
   * @returns Validation result
   */
  async validateTemplate(templateName: string, locale?: string): Promise<TemplateValidationResult> {
    this.checkInitialized();
    
    const resolvedLocale = this.resolveLocale(locale);
    const templatePath = this.getTemplatePath(templateName, resolvedLocale);

    try {
      // Check if template exists
      const exists = await fs.pathExists(templatePath);
      if (!exists) {
        return {
          isValid: false,
          errors: [`Template ${templateName} not found for locale ${resolvedLocale}`],
          templatePath
        };
      }

      const templateContent = await fs.readFile(templatePath, 'utf8');
      
      // Try to compile the template to check for syntax errors
      try {
        Handlebars.compile(templateContent);
      } catch (error) {
        return {
          isValid: false,
          errors: [`Syntax error in template: ${(error as Error).message}`],
          templatePath
        };
      }

      // Analyze template to find required variables
      const variableRegex = /{{([^#/][^}]*)}}/g;
      const conditionRegex = /{{#if\s+([^}]*)}}/g;
      
      const requiredVariables = new Set<string>();
      const optionalVariables = new Set<string>();
      
      let match;
      while ((match = variableRegex.exec(templateContent)) !== null) {
        const varName = match[1].trim();
        if (!varName.includes(' ') && !varName.startsWith('@')) {
          requiredVariables.add(varName);
        }
      }
      
      while ((match = conditionRegex.exec(templateContent)) !== null) {
        const varName = match[1].trim();
        if (requiredVariables.has(varName)) {
          requiredVariables.delete(varName);
        }
        optionalVariables.add(varName);
      }

      return {
        isValid: true,
        templatePath,
        requiredVariables: Array.from(requiredVariables),
        optionalVariables: Array.from(optionalVariables)
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Error validating template: ${(error as Error).message}`],
        templatePath
      };
    }
  }

  /**
   * Check if the template manager is initialized
   * @throws {ConfigurationError} If the template manager is not initialized
   */
  private checkInitialized(): void {
    if (!this.initialized || !this.config) {
      throw new ConfigurationError('Template manager is not initialized');
    }
  }

  /**
   * Resolve the locale, using the default if not provided or not supported
   * @param locale The requested locale
   * @returns The resolved locale
   */
  private resolveLocale(locale?: string): string {
    if (!locale) {
      return this.config!.defaultLocale;
    }

    if (this.config!.supportedLocales.includes(locale)) {
      return locale;
    }

    return this.config!.defaultLocale;
  }

  /**
   * Get the full path to a template file
   * @param templateName The name of the template
   * @param locale The locale
   * @returns The full template path
   */
  private getTemplatePath(templateName: string, locale: string): string {
    return path.join(this.config!.templatesDir, templateName, `${locale}.html`);
  }

  /**
   * Get a template from the cache
   * @param templateName The name of the template
   * @param locale The locale
   * @returns The template content, or undefined if not cached
   */
  private getCachedTemplate(templateName: string, locale: string): string | undefined {
    if (!this.config!.cacheTemplates) {
      return undefined;
    }

    const templateCache = this.templates.get(templateName);
    if (!templateCache) {
      return undefined;
    }

    return templateCache.get(locale);
  }

  /**
   * Cache a template
   * @param templateName The name of the template
   * @param locale The locale
   * @param content The template content
   */
  private cacheTemplate(templateName: string, locale: string, content: string): void {
    if (!this.templates.has(templateName)) {
      this.templates.set(templateName, new Map());
    }

    const templateCache = this.templates.get(templateName)!;
    templateCache.set(locale, content);
  }

  /**
   * Get a compile function for a template
   * @param templateName The name of the template
   * @param locale The locale
   * @returns The compile function
   */
  private async getCompileFunction(templateName: string, locale: string): Promise<(data: Record<string, any>) => string> {
    if (this.config!.cacheTemplates) {
      // Check if we have a cached compiled template
      const compiledCache = this.compiledTemplates.get(templateName);
      if (compiledCache && compiledCache.has(locale)) {
        return compiledCache.get(locale)!;
      }
    }

    // Load the template content
    const templateContent = await this.loadTemplate(templateName, locale);

    // Compile the template based on the template engine
    const compiledTemplate = Handlebars.compile(templateContent);

    // Cache the compiled template if caching is enabled
    if (this.config!.cacheTemplates) {
      if (!this.compiledTemplates.has(templateName)) {
        this.compiledTemplates.set(templateName, new Map());
      }
      const compiledCache = this.compiledTemplates.get(templateName)!;
      compiledCache.set(locale, compiledTemplate);
    }

    return compiledTemplate;
  }

  /**
   * Register Handlebars helpers
   */
  private registerHandlebarsHelpers(): void {
    // Register #if helper that allows checking for existence
    Handlebars.registerHelper('if', function(this: any, conditional, options) {
      if (conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    // Register #each helper for iterating over arrays
    Handlebars.registerHelper('each', function(this: any, context, options) {
      if (!context || context.length === 0) {
        return options.inverse(this);
      }
      
      let result = '';
      for (let i = 0; i < context.length; i++) {
        result += options.fn(context[i]);
      }
      return result;
    });

    // Register #with helper for scoping
    Handlebars.registerHelper('with', function(this: any, context, options) {
      if (!context) {
        return options.inverse(this);
      }
      return options.fn(context);
    });
  }
}