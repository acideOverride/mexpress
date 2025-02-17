import express, { Request, Response } from 'express';
import path from 'path';
import { services } from './services';
import { Customer, Product } from './models/types';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Customer API endpoints
app.post('/api/customers', async (req: Request<{}, {}, Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>, res: Response) => {
    try {
        const customer = await services.getCustomerService().create(req.body);
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

app.get('/api/customers', async (_req: Request, res: Response) => {
    try {
        const customers = await services.getCustomerService().list();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

app.delete('/api/customers/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        await services.getCustomerService().delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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
        const products = await services.getProductService().list();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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