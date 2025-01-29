import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { db } from './db/memory';
import { seedDatabase } from './db/seed';
import { z } from 'zod';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Try different ports if the default is in use
async function findAvailablePort(startPort: number): Promise<number> {
  const maxPort = startPort + 10;
  let port = startPort;

  while (port < maxPort) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          server.close();
          resolve(port);
        });
        server.on('error', () => reject());
      });
      return port;
    } catch {
      port++;
    }
  }
  throw new Error('No available ports found');
}

async function start() {
  try {
    // Seed the database with test data
    await seedDatabase();
    
    // Find an available port starting from 3002
    const port = await findAvailablePort(3002);
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
