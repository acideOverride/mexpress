import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { repairTicketRoutes } from './routes/repairTicket.routes';

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(cors());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/repair-tickets', repairTicketRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/montpc_crm';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  const isConnected = await connectToDatabase();
  if (!isConnected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`API Server running at http://localhost:${port}/api`);
    console.log('Server is ready');
  });

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    console.log('Server stopped');
    process.exit(0);
  });
};

// Export app for testing
export { app, startServer };

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}