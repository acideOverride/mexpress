import express from 'express';
import customerRoutes from './routes/customerRoutes';
import repairTicketRoutes from './routes/repairTicketRoutes';
import megaSearchRoutes from './routes/megasearch.routes';
import { standardizeResponseMiddleware } from './api-response-standardizer';

const router = express.Router();

// Apply the standardized response middleware to all API routes
router.use(standardizeResponseMiddleware);

// API routes
router.use('/customers', customerRoutes);
router.use('/tickets', repairTicketRoutes);
router.use('/megasearch', megaSearchRoutes);

export default router;