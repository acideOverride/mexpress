/**
 * MontPC Contact Form API
 * 
 * This is the entry point for the contact form API server.
 * It will run on port 9701 as per mExpress port allocation standards.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://montpc.com', 'https://www.montpc.com', 'http://localhost:5173', 'http://localhost:3000', 'file://'],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api', contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Contact form API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Contact form API running on port ${PORT}`);
  });
}

module.exports = app; // For testing