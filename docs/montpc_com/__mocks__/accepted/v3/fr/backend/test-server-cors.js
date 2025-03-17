/**
 * MontPC Contact Form API - Test Server with enhanced CORS
 * 
 * A simplified version of the server for testing purposes.
 * This version doesn't use the actual EmailService but simulates it.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const app = express();

// Middleware with detailed CORS settings
app.use((req, res, next) => {
  // Log all incoming requests for debugging
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers));
  
  // Manual CORS handling for maximum compatibility
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Parse JSON bodies
app.use(express.json());

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

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Received form submission:', req.body);
    
    // Validate form input
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      console.log('Validation error:', error);
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
    
    // Log the form submission
    console.log('Form submission processed successfully:');
    console.log('- Name:', value.name);
    console.log('- Email:', value.email);
    console.log('- Phone:', value.phone || 'Not provided');
    console.log('- Device:', value.device || 'Not provided');
    console.log('- Message:', value.message);
    console.log('- Reference:', reference);
    
    // Simulate email sending
    console.log('Simulating email to admin:', process.env.EMAIL_ADMIN_ADDRESS || 'admin@montpc.com');
    console.log('Simulating confirmation email to:', value.email);
    
    // Return success response
    const response = {
      success: true,
      message: 'Votre message a été reçu. Nous vous contacterons bientôt.',
      reference
    };
    
    console.log('Sending response:', response);
    return res.status(200).json(response);
  } catch (err) {
    console.error('Error in form submission:', err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred',
      }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Contact form API is running (Test Server)' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: {
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred',
    }
  });
});

// Define port - using mExpress port allocation standard
const PORT = process.env.PORT || 9701;

// Start server
app.listen(PORT, () => {
  console.log(`Enhanced CORS Test Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
