/**
 * Bike API Routes
 * @swagger
 * tags:
 *   name: Bikes
 *   description: Bike management API
 */
import { Router } from 'express';
import { BikeController } from '../../controllers/bike.controller';
import { validate, ValidationSource } from '../../middleware/validator.middleware';
import { 
  createBikeSchema, 
  updateBikeSchema, 
  getBikesQuerySchema,
  updateBikeStatusSchema,
  addBikeRatingSchema,
  transferBikeSchema,
  updateMileageSchema
} from '../../validators/bike.validators';
import { idParamSchema } from '../../validators/common.validator';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const bikeController = new BikeController();

/**
 * @swagger
 * /api/v1/bikes:
 *   post:
 *     summary: Create a new bike
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBikeRequest'
 *     responses:
 *       201:
 *         description: Bike created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(createBikeSchema),
  bikeController.createBike
);

/**
 * @swagger
 * /api/v1/bikes:
 *   get:
 *     summary: Get all bikes with filtering, pagination, and sorting
 *     tags: [Bikes]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: sort
 *         in: query
 *         description: Sort field and direction (e.g., 'dailyRate:asc,name:desc')
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         description: Filter by bike type(s) (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: size
 *         in: query
 *         description: Filter by bike size(s) (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter by bike status (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: minDailyRate
 *         in: query
 *         description: Minimum daily rate
 *         schema:
 *           type: number
 *       - name: maxDailyRate
 *         in: query
 *         description: Maximum daily rate
 *         schema:
 *           type: number
 *       - name: search
 *         in: query
 *         description: Search term for bike name, description, and features
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bikes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedBikesResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/',
  validate(getBikesQuerySchema, ValidationSource.QUERY),
  bikeController.getBikes
);

/**
 * @swagger
 * /api/v1/bikes/available:
 *   get:
 *     summary: Find available bikes
 *     tags: [Bikes]
 *     parameters:
 *       - name: type
 *         in: query
 *         description: Filter by bike type(s) (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: size
 *         in: query
 *         description: Filter by bike size(s) (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: minDailyRate
 *         in: query
 *         description: Minimum daily rate
 *         schema:
 *           type: number
 *       - name: maxDailyRate
 *         in: query
 *         description: Maximum daily rate
 *         schema:
 *           type: number
 *       - name: location
 *         in: query
 *         description: Filter by station ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available bikes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikesArrayResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/available', bikeController.findAvailableBikes);

/**
 * @swagger
 * /api/v1/bikes/top-rated:
 *   get:
 *     summary: Get top rated bikes
 *     tags: [Bikes]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Maximum number of bikes to return
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: minRatings
 *         in: query
 *         description: Minimum number of ratings required
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: List of top rated bikes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikesArrayResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/top-rated', bikeController.getTopRatedBikes);

/**
 * @swagger
 * /api/v1/bikes/{id}:
 *   get:
 *     summary: Get bike by ID
 *     tags: [Bikes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bike details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/:id',
  validate(idParamSchema, ValidationSource.PARAMS),
  bikeController.getBikeById
);

/**
 * @swagger
 * /api/v1/bikes/{id}:
 *   put:
 *     summary: Update bike by ID
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBikeRequest'
 *     responses:
 *       200:
 *         description: Bike updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put(
  '/:id',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(updateBikeSchema),
  bikeController.updateBike
);

/**
 * @swagger
 * /api/v1/bikes/{id}:
 *   delete:
 *     summary: Delete bike by ID
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bike deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: Bike deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Bike has active reservations
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  '/:id',
  // authenticate,
  // authorize(['admin']),
  validate(idParamSchema, ValidationSource.PARAMS),
  bikeController.deleteBike
);

/**
 * @swagger
 * /api/v1/bikes/{id}/status:
 *   patch:
 *     summary: Update bike status
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBikeStatusRequest'
 *     responses:
 *       200:
 *         description: Bike status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  '/:id/status',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(updateBikeStatusSchema),
  bikeController.updateBikeStatus
);

/**
 * @swagger
 * /api/v1/bikes/{id}/ratings:
 *   post:
 *     summary: Add rating to bike
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *       - name: userId
 *         in: query
 *         description: User ID (for testing only, normally comes from authentication)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddBikeRatingRequest'
 *     responses:
 *       200:
 *         description: Rating added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/:id/ratings',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(addBikeRatingSchema),
  bikeController.addBikeRating
);

/**
 * @swagger
 * /api/v1/bikes/{id}/transfer:
 *   patch:
 *     summary: Transfer bike to another station
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferBikeRequest'
 *     responses:
 *       200:
 *         description: Bike transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  '/:id/transfer',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(transferBikeSchema),
  bikeController.transferBike
);

/**
 * @swagger
 * /api/v1/bikes/{id}/mileage:
 *   patch:
 *     summary: Update bike mileage
 *     tags: [Bikes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMileageRequest'
 *     responses:
 *       200:
 *         description: Bike mileage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BikeResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  '/:id/mileage',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(updateMileageSchema),
  bikeController.updateBikeMileage
);

/**
 * @swagger
 * /api/v1/bikes/{id}/maintenance-costs:
 *   get:
 *     summary: Get maintenance costs for a bike
 *     tags: [Bikes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         description: Start date for filtering
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date for filtering
 *         schema:
 *           type: string
 *           format: date
 *       - name: includeLabor
 *         in: query
 *         description: Include labor costs
 *         schema:
 *           type: boolean
 *           default: true
 *       - name: includeParts
 *         in: query
 *         description: Include parts costs
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Maintenance costs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceCostsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/:id/maintenance-costs',
  validate(idParamSchema, ValidationSource.PARAMS),
  bikeController.getBikeMaintenanceCosts
);

export default router;