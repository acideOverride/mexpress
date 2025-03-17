# MontPC.com Contact Form Email Integration Checklist

> **IMPORTANT**: This is a small, focused implementation checklist that connects the existing Contact Form Backend (tracked in `CHECKLIST.md`) with the newly implemented Email Service component (TASK-MEXP-082). This checklist exists outside the general AMTC workflow due to its focused scope.

## Current Status

- **Integration Start Date**: 2025-03-17
- **Expected Completion**: 2025-03-24
- **Priority**: Medium
- **Related Tasks**: 
  - TASK-MEXP-082 (Email Service Component) - ✅ Completed
  - TASK-MONT-001 (Contact Form Backend) - ✅ 100% Complete

## Implementation Checklist

### Phase 1: Components Assessment

- [x] Email Service implementation with Resend.com provider (TASK-MEXP-082)
- [x] Contact form API endpoint implementation (100% complete in TASK-MONT-001)
- [x] Contact form UI ready in production site

### Phase 2: Integration Planning

- [x] Review existing code:
  - [x] Analyze current contact form controller (`controllers/contactController.js`)
  - [x] Identify email sending logic to replace with EmailService
  - [x] Review form validation logic for compatibility

- [x] Configure environment:
  - [x] Update .env file with Resend API key configuration
  - [x] Set up project-specific email configuration for MontPC.com
  - [x] Ensure correct port configurations (9701 for API, 9002 for Email Service)

### Phase 3: Email Service Integration

- [x] Update contact form controller:
  ```javascript
  // Replace Nodemailer implementation with EmailService
  const { EmailService, ResendEmailProvider, TemplateManager } = require('@mexpress/email-service');
  
  // Initialize email service
  const emailService = new EmailService(
    new ResendEmailProvider(),
    new TemplateManager(),
    {
      provider: {
        apiKey: process.env.RESEND_API_KEY,
        defaultSender: process.env.EMAIL_FROM_ADDRESS || 'no-reply@montpc.com',
        defaultSenderName: process.env.EMAIL_FROM_NAME || 'MontPC Support',
        trackOpens: true,
        trackClicks: true
      },
      templates: {
        templatesDir: path.join(__dirname, '../templates'),
        defaultLocale: 'fr'
      },
      projectId: 'montpc-com',
      enableLogging: true
    }
  );
  ```

- [x] Create email templates:
  - [x] Admin notification template with all form fields
  - [x] Customer confirmation template
  - [x] Set up both in FR/EN languages

- [x] Implement sending logic:
  - [x] Replace Nodemailer send with EmailService.sendTemplateEmail
  - [x] Add customer confirmation email logic
  - [x] Implement error handling and retries

### Phase 4: Testing

- [x] Unit tests:
  - [x] Update existing tests to mock EmailService
  - [x] Add tests for customer confirmation emails

- [x] Manual testing:
  - [x] Submit test forms with monitoring
  - [x] Verify both admin and customer emails
  - [x] Test error handling scenarios

### Phase 5: Finalization

- [x] Update documentation:
  - [x] Update MODULE_CHECKLIST.md to mark email integration complete
  - [x] Document configuration for production deployment

- [ ] Final deployment:
  - [ ] Deploy updated contact form backend
  - [ ] Set up monitoring for email deliverability

## Implementation Details

### Email Template Structure
```
/templates
  /contact-form-admin
    /en.html
    /fr.html
  /contact-form-confirmation
    /en.html
    /fr.html
```

### Configuration Reference
```javascript
// Email service configuration
const emailServiceConfig = {
  provider: {
    apiKey: process.env.RESEND_API_KEY,
    defaultSender: process.env.EMAIL_FROM_ADDRESS || 'no-reply@montpc.com',
    defaultSenderName: process.env.EMAIL_FROM_NAME || 'MontPC Support',
    trackOpens: true,
    trackClicks: true
  },
  templates: {
    templatesDir: path.join(__dirname, '../templates'),
    defaultLocale: 'fr'
  },
  projectId: 'montpc-com',
  projectSenders: {
    'montpc-com': {
      senderEmail: process.env.EMAIL_FROM_ADDRESS || 'no-reply@montpc.com',
      senderName: process.env.EMAIL_FROM_NAME || 'MontPC Support',
      replyToEmail: 'contact@montpc.com',
      defaultTags: ['contact-form', 'website']
    }
  },
  enableLogging: true,
  logLevel: 'info'
};
```

## Implementation Notes

### Completed Integration Features

1. **Email Templates**:
   - Created four email templates (admin/customer in both FR/EN)
   - Used responsive HTML with styling compatible with email clients
   - Added conditional sections for optional fields
   - Included reference number tracking in both emails

2. **EmailService Integration**:
   - Integrated the Resend.com provider from the shared email service
   - Set up proper error handling to prevent API failures if email sending fails
   - Implemented both admin notification and customer confirmation emails
   - Added proper environment variable fallbacks for flexibility

3. **Testing**:
   - Created comprehensive mocks for the email service to enable testing
   - Added specific tests for email sending functionality
   - Added specific test for error handling

4. **Configuration**:
   - Created .env.example with all required variables
   - Added appropriate documentation for deployment
   - Ensured proper port configuration (9701 for API, 9002 for Email Service)

### Deployment Steps

1. Install the shared email service package:
   ```
   npm install @mexpress/email-service
   ```

2. Set up environment variables:
   ```
   RESEND_API_KEY=re_YOUR_RESEND_API_KEY
   EMAIL_ADMIN_ADDRESS=admin@montpc.com
   EMAIL_FROM_ADDRESS=no-reply@montpc.com
   EMAIL_FROM_NAME=MontPC Support
   ```

3. Ensure template directory is properly copied to the production server

4. Monitor initial email deliverability using Resend.com dashboard

## Resources

- Email Service Documentation: `/opt/mExpress/packages/email-service/README.md`
- Contact Form Backend: `/opt/mExpress/docs/montpc_com/__mocks__/accepted/v3/fr/CHECKLIST.md`
- Component Registry: `/opt/mExpress/docs/mexpress/COMPONENT_REGISTRY.md`

## Notes

- This integration connects the separate implementations:
  1. The existing Contact Form Backend (TASK-MONT-001)
  2. The newly completed Email Service (TASK-MEXP-082)
- Email templates follow the standards in COMPONENT_REGISTRY.md
- All customer data is handled according to privacy policy
- Email sending failures are isolated to prevent affecting the rest of the application
- Template changes can be made without code changes
- Port 9701 is already assigned for the contact form API
- Port 9002 is already assigned for the shared email service