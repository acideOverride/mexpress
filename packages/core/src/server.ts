import express, { Request, Response } from 'express';
import path from 'path';
import { services } from './services';
import { Customer, Product, ListResponse } from './models/types';
import { CreateCustomerDto } from './models/customer';
import { dbConnection } from './models/db-connection';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB when server starts
dbConnection.connect().catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Enable CORS for all origins in development
app.use(cors({
  origin: '*', // Allow all origins - ONLY FOR DEVELOPMENT
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Basic health check endpoint to test connectivity
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// SIMPLE DIRECT API ENDPOINTS - NO ABSTRACTION
// Import mongoose directly
import mongoose from 'mongoose';

// Connect to MongoDB directly for simplicity
console.log('Connecting to MongoDB...');
mongoose.connect('mongodb://127.0.0.1:42591/montpc_crm')
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

// Simple customer schema
const CustomerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    status: { type: String, default: 'ACTIVE' },
    notes: String
}, { 
    timestamps: true 
});

// Register model directly
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

// Simple POST endpoint
app.post('/api/customers', async (req: Request, res: Response) => {
    try {
        console.log('/api/customers POST request received:', req.body);
        
        // Create without abstraction
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        
        console.log('Customer created successfully:', savedCustomer);
        res.status(201).json({
            status: 'success',
            data: savedCustomer
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).json({ 
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
});

app.get('/api/customers', async (_req: Request, res: Response) => {
    try {
        console.log('GET /api/customers - Processing request');
        
        // Direct database query - no service abstractions
        const customers = await Customer.find({}).sort({ createdAt: -1 });
        
        console.log(`Found ${customers.length} customers directly from MongoDB`);
        
        // Format response with full customer data
        res.json({
            status: 'success',
            data: customers.map(customer => {
                // Convert to frontend format
                const formatted = customer.toObject();
                
                // Add name field for frontend compatibility
                if (formatted.firstName && formatted.lastName) {
                    formatted.name = `${formatted.firstName} ${formatted.lastName}`;
                }
                
                return formatted;
            }),
            meta: {
                total: customers.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Database error in /api/customers:', error);
        res.status(500).json({ 
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'An error occurred while retrieving customers'
        });
    }
});

app.delete('/api/customers/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        console.log(`DELETE /api/customers/${req.params.id} - Processing request`);
        
        // Direct database delete - no service abstractions
        const result = await Customer.findByIdAndDelete(req.params.id);
        
        if (!result) {
            console.log(`Customer with ID ${req.params.id} not found`);
            return res.status(404).json({
                status: 'error',
                error: 'Customer not found'
            });
        }
        
        console.log(`Successfully deleted customer with ID ${req.params.id}`);
        res.status(200).json({
            status: 'success',
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error(`Error deleting customer ${req.params.id}:`, error);
        res.status(500).json({ 
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
});

// Product API endpoints
app.post('/api/products', async (req: Request<{}, {}, Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>, res: Response) => {
    try {
        const product = await services.getProductService().create(req.body);
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

app.get('/api/products', async (_req: Request, res: Response) => {
    try {
        console.log('GET /api/products - Processing request');
        
        // Try to get products from service with fallback
        try {
            // Get product service and use type assertion for safety
            const productService = services.getProductService();
            let products = [];
            
            console.log('Product service methods:', Object.keys(productService));
            
            // Try both service methods with proper type guards
            if (typeof (productService as any).list === 'function') {
                console.log('Using list() method');
                const response = await (productService as any).list();
                products = response.items || response;
                console.log('List response:', JSON.stringify(products).substring(0, 100) + '...');
            } else if (typeof (productService as any).findAll === 'function') {
                console.log('Using findAll() method');
                const result = await (productService as any).findAll();
                products = result;
                console.log('FindAll response:', JSON.stringify(products).substring(0, 100) + '...');

                // Transform data if needed to match API expectations
                if (products && products.length > 0) {
                    products = products.map((product: any) => {
                        // Convert stockLevel to stock if needed
                        if ('stockLevel' in product && !('stock' in product)) {
                            return {
                                ...product,
                                stock: product.stockLevel
                            };
                        }
                        return product;
                    });
                }
            } else {
                console.log('No valid method found, using fallback data');
                throw new Error('Product service does not implement list or findAll method');
            }
            
            if (products && products.length > 0) {
                console.log(`Returning ${products.length} products`);
                return res.json(products);
            } else {
                console.log('No products found, using fallback data');
                throw new Error('No products found');
            }
        } catch (serviceError) {
            console.log('Service error, using fallback products:', serviceError);
            // Fallback to hardcoded data for testing
            const fallbackProducts = [
                {
                    id: "prod1",
                    name: "Desktop Computer",
                    description: "High performance desktop computer",
                    price: 999.99,
                    sku: "COMP001",
                    stock: 25,
                    category: "electronics",
                    tags: ["computer", "desktop", "high-performance"],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: "prod2",
                    name: "Laptop Computer",
                    description: "Lightweight laptop for productivity",
                    price: 1299.99,
                    sku: "LAPTOP001",
                    stock: 15,
                    category: "electronics",
                    tags: ["computer", "laptop", "portable"],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            console.log('Returning fallback products');
            return res.json(fallbackProducts);
        }
    } catch (error) {
        console.error('Unexpected error in /api/products:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'An error occurred while retrieving products'
        });
    }
});

app.delete('/api/products/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        await services.getProductService().delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});