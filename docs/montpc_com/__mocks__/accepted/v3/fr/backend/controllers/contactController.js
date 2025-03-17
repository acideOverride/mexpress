/**
 * Contact Form Controller
 */

const Joi = require('joi');
const path = require('path');

// Use mock implementation for testing or real implementation in production
let EmailService, ResendEmailProvider, TemplateManager;
try {
  // Try to load the real email service
  ({ EmailService, ResendEmailProvider, TemplateManager } = require('@mexpress/email-service'));
} catch (err) {
  // Fall back to mock implementation for testing
  console.log('Using mock email service for testing');
  ({ EmailService, ResendEmailProvider, TemplateManager } = require('../mockEmailService'));
}

// Form validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'L\'email est requis',
      'string.email': 'Veuillez fournir un email valide'
    }),
  phone: Joi.string().allow('').max(20)
    .messages({
      'string.max': 'Le numéro de téléphone ne peut pas dépasser 20 caractères'
    }),
  device: Joi.string().allow('').max(50)
    .messages({
      'string.max': 'Le type d\'appareil ne peut pas dépasser 50 caractères'
    }),
  message: Joi.string().min(10).max(2000).required()
    .messages({
      'string.empty': 'Le message est requis',
      'string.min': 'Le message doit contenir au moins 10 caractères',
      'string.max': 'Le message ne peut pas dépasser 2000 caractères'
    })
});

// Initialize email service - handle in a try/catch to prevent startup failure
let emailService;
try {
  emailService = new EmailService(
    new ResendEmailProvider(),
    new TemplateManager(),
    {
      provider: {
        apiKey: process.env.RESEND_API_KEY || 'test_api_key',
        defaultSender: process.env.EMAIL_FROM_ADDRESS || 'no-reply@montpc.com',
        defaultSenderName: process.env.EMAIL_FROM_NAME || 'MontPC Support',
        trackOpens: true,
        trackClicks: true
      },
      templates: {
        templatesDir: path.join(__dirname, '../templates'),
        defaultLocale: 'fr',
        supportedLocales: ['fr', 'en'] // Add supported locales
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
    }
  );
} catch (err) {
  console.error('Error initializing email service:', err);
  // We'll create a mock email service for testing
  emailService = {
    sendTemplateEmail: async () => ({
      success: true,
      id: 'mock-email-id-for-testing'
    })
  };
}

/**
 * Submit form controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.submitForm = async (req, res, next) => {
  try {
    // Validate form input
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Erreur de validation du formulaire',
          details: error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
          }))
        }
      });
    }
    
    // Generate a reference ID for the submission
    const reference = `MONT-${Date.now().toString(36).toUpperCase()}`;
    
    // Prepare template data for emails
    const templateData = {
      reference,
      date: new Date().toLocaleString('fr-FR'),
      year: new Date().getFullYear(),
      ...value
    };
    
    try {
      // Send admin notification email
      const adminResult = await emailService.sendTemplateEmail({
        to: process.env.EMAIL_ADMIN_ADDRESS || 'admin@montpc.com',
        subject: `Nouvelle demande de contact: ${reference}`,
        templateName: 'contact-form-admin',
        templateData,
        locale: 'fr', // Use French for admin notifications
        tags: ['admin-notification', 'contact-form']
      });
      
      // Log admin email result
      console.log('Admin notification email result:', adminResult);
      
      // Send customer confirmation email
      const customerResult = await emailService.sendTemplateEmail({
        to: value.email,
        subject: 'Confirmation de votre message - MontPC',
        templateName: 'contact-form-confirmation',
        templateData,
        locale: 'fr', // Default to French, but could be determined by user preference
        tags: ['customer-confirmation', 'contact-form']
      });
      
      // Log customer email result
      console.log('Customer confirmation email result:', customerResult);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending emails:', emailError);
      // We intentionally don't rethrow the error to prevent API failure due to email issues
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Votre message a été reçu. Nous vous contacterons bientôt.',
      reference
    });
    
  } catch (err) {
    console.error('Error in form submission:', err);
    next(err);
  }
};