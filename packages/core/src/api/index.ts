import express from 'express';
import customerRoutes from './routes/customerRoutes';
import repairTicketRoutes from './routes/repairTicketRoutes';

const router = express.Router();

// API routes
router.use('/customers', customerRoutes);
router.use('/tickets', repairTicketRoutes);

export default router;