# mExpress Email Service

A flexible, provider-agnostic email service for the mExpress ecosystem. This package provides a unified API for sending emails across all mExpress applications, with built-in support for templates, multiple languages, and project-specific configurations.

## Features

- 📧 **Provider-agnostic design**: Current implementation uses Resend.com, but can be extended to support other providers
- 📝 **Template support**: HTML templates with variable substitution
- 🌐 **Multi-language support**: Templates in multiple languages
- 🔄 **Project-specific configurations**: Different sender identities per project
- 📊 **Comprehensive logging**: Configurable logging levels and handlers
- 🛡️ **Error handling**: Typed errors with detailed information
- 📎 **Attachment support**: Send emails with attachments
- 📈 **Rate limiting**: Prevent abuse with configurable rate limits

## Installation

```bash
npm install @mexpress/email-service
```

## Basic Usage

```typescript
import { 
  EmailService, 
  ResendEmailProvider, 
  TemplateManager 
} from '@mexpress/email-service';

// Create provider
const provider = new ResendEmailProvider();

// Create template manager
const templateManager = new TemplateManager();

// Configure the service
const service = new EmailService(provider, templateManager, {
  provider: {
    apiKey: 'your-resend-api-key',
    defaultSender: 'no-reply@yourdomain.com',
    defaultSenderName: 'Your Company',
    trackOpens: true,
    trackClicks: true
  },
  templates: {
    templatesPath: '/path/to/templates',
    defaultLocale: 'en'
  },
  projectId: 'your-project-id',
  enableLogging: true,
  logLevel: 'info'
});

// Send a simple email
await service.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from mExpress',
  html: '<p>This is a test email</p>'
});

// Send a template email
await service.sendTemplateEmail({
  to: 'recipient@example.com',
  subject: 'Welcome to mExpress',
  templateName: 'welcome',
  templateData: {
    name: 'John Doe',
    activationLink: 'https://yourdomain.com/activate?token=123456'
  },
  locale: 'en'
});
```

## Templates

Templates are HTML files stored in a directory structure like:

```
/templates
  /welcome
    /en.html
    /fr.html
  /password-reset
    /en.html
    /fr.html
```

Templates can include variables with double curly braces:

```html
<h1>Welcome, {{name}}!</h1>
<p>Click <a href="{{activationLink}}">here</a> to activate your account.</p>
```

## Project-Specific Configurations

You can configure different sender identities for different projects:

```typescript
const service = new EmailService(provider, templateManager, {
  // ... other config
  projectSenders: {
    'montpc-crm': {
      senderEmail: 'crm@montpc.com',
      senderName: 'MontPC CRM',
      replyToEmail: 'support@montpc.com',
      defaultTags: ['crm']
    },
    'giandra-photos': {
      senderEmail: 'no-reply@giandraphotos.com',
      senderName: 'Giandra Photos',
      replyToEmail: 'support@giandraphotos.com',
      defaultTags: ['photos']
    }
  }
});
```

## Rate Limiting

The service includes built-in rate limiting to prevent abuse:

```typescript
const provider = new ResendEmailProvider();
await provider.initialize({
  // ... other config
  enableRateLimiting: true,
  maxEmailsPerMinute: 60,
  maxEmailsPerHour: 1000,
  maxEmailsPerDay: 10000
});
```

## Error Handling

The service provides typed errors for different failure scenarios:

- `ConfigurationError`: Invalid configuration
- `ValidationError`: Invalid email parameters
- `TemplateError`: Template not found or invalid
- `AuthenticationError`: API key or authentication issue
- `NetworkError`: Network-related issues
- `ProviderError`: Provider-specific errors

Example:

```typescript
try {
  await service.sendEmail({ /* ... */ });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid email parameters:', error.details);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Failed to send email:', error);
  }
}
```

## Advanced Logging

You can provide a custom logging callback:

```typescript
const service = new EmailService(provider, templateManager, {
  // ... other config
  enableLogging: true,
  logLevel: 'info',
  logCallback: (level, message, context) => {
    // Send to your logging service
    myLoggingService.log(level, message, context);
  }
});
```

## Contact Form Integration

Example of using the email service for a contact form:

```typescript
// Create a contact form service
const contactFormService = {
  async submitContactForm(form: ContactForm): Promise<boolean> {
    try {
      await emailService.sendTemplateEmail({
        to: 'contact@yourdomain.com',
        subject: `Contact Form: ${form.subject}`,
        templateName: 'contact-form',
        templateData: {
          name: form.name,
          email: form.email,
          message: form.message
        }
      });
      
      // Send confirmation to the user
      await emailService.sendTemplateEmail({
        to: form.email,
        subject: 'We received your message',
        templateName: 'contact-form-confirmation',
        templateData: {
          name: form.name
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to process contact form:', error);
      return false;
    }
  }
};
```

## License

MIT