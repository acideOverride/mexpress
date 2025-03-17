/**
 * Main API router
 * Centralizes all API route management
 */
import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

// Version 1 API routes
router.use('/v1', v1Routes);

// For future API versions
// router.use('/v2', v2Routes);

export default router;