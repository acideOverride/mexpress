import express from 'express';
import customerRoutes from './routes/customerRoutes';
import repairTicketRoutes from './routes/repairTicketRoutes';
import megaSearchRoutes from './routes/megasearch.routes';

const router = express.Router();

// API routes
router.use('/customers', customerRoutes);
router.use('/tickets', repairTicketRoutes);
router.use('/megasearch', megaSearchRoutes);

export default router;