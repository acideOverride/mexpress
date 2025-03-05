import { Router } from 'express';
import { MegaSearchController } from '../controllers/MegaSearchController';
import { authMiddleware } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rate-limit';

// Create a router instance
const router = Router();
const controller = new MegaSearchController();

/**
 * @route GET /api/v1/megasearch/types
 * @desc Get all available entity types for search
 * @access Private
 */
router.get(
  '/types',
  [authMiddleware],
  controller.getEntityTypes.bind(controller)
);

/**
 * @route POST /api/v1/megasearch
 * @desc Search across all entity types
 * @access Private
 */
router.post(
  '/',
  [
    authMiddleware,
    rateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 requests per minute
      message: 'Too many search requests, please try again later'
    })
  ],
  controller.search.bind(controller)
);

/**
 * @route POST /api/v1/megasearch/typeahead
 * @desc Get typeahead suggestions
 * @access Private
 */
router.post(
  '/typeahead',
  [
    authMiddleware,
    rateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      max: 60, // 60 requests per minute (more allowance for typeahead)
      message: 'Too many typeahead requests, please try again later'
    })
  ],
  controller.typeahead.bind(controller)
);

/**
 * @route POST /api/v1/megasearch/:entityType
 * @desc Search within a specific entity type
 * @access Private
 */
router.post(
  '/:entityType',
  [
    authMiddleware,
    rateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      max: 40, // 40 requests per minute
      message: 'Too many search requests, please try again later'
    })
  ],
  controller.searchEntity.bind(controller)
);

/**
 * @route POST /api/v1/megasearch/cache/clear
 * @desc Clear search cache
 * @access Private (admin)
 */
router.post(
  '/cache/clear',
  [
    authMiddleware,
    // This would typically have additional middleware to check for admin role
    rateLimitMiddleware({
      windowMs: 60 * 1000, // 1 minute
      max: 5, // 5 requests per minute
      message: 'Too many cache clear requests'
    })
  ],
  controller.clearCache.bind(controller)
);

// Initialize the MegaSearch controller during application startup
(async () => {
  try {
    await MegaSearchController.initialize();
    console.log('MegaSearch initialized successfully');
  } catch (error) {
    console.error('Failed to initialize MegaSearch:', error);
  }
})();

export default router;