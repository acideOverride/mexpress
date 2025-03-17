/**
 * API v1 Routes
 * Assembles all version 1 API routes
 */
import { Router } from 'express';

// Import route modules
import bikeRoutes from './bike.routes';
import customerRoutes from './customer.routes';
import reservationRoutes from './reservation.routes';
import stationRoutes from './station.routes';
import maintenanceRoutes from './maintenance.routes';
import authRoutes from './auth.routes';

const router = Router();

// API Documentation route
router.get('/', (req, res) => {
  res.json({
    message: 'Jerome Bikes API v1',
    documentation: '/api/docs',
    version: '1.0.0',
    endpoints: [
      '/api/v1/bikes',
      '/api/v1/customers', 
      '/api/v1/reservations',
      '/api/v1/stations',
      '/api/v1/maintenance',
      '/api/v1/auth'
    ]
  });
});

// Mount route modules
router.use('/bikes', bikeRoutes);
router.use('/customers', customerRoutes);
router.use('/reservations', reservationRoutes);
router.use('/stations', stationRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/auth', authRoutes);

export default router;