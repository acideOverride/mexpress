/**
 * Contact Form API Routes
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

/**
 * @route   POST /api/contact
 * @desc    Submit contact form data
 * @access  Public
 */
router.post('/contact', contactController.submitForm);

module.exports = router;