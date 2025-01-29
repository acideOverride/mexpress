import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { z } from 'zod';
import { db } from './db/memory';
import { seedDatabase } from './db/seed';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(express.json());

// Validation schemas
const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1)
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Customer routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const data = CustomerSchema.parse(req.body);
    const customer = await db.createCustomer(data);
    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Failed to create customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const customer = await db.getCustomerById(id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

const PORT = process.env.PORT || 3005;

async function start() {
  try {
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
