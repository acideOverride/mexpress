/**
 * Reservation API Routes
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management API
 */
import { Router } from 'express';
import { ReservationController } from '../../controllers/reservation.controller';
import { validate, ValidationSource } from '../../middleware/validator.middleware';
import { 
  createReservationSchema,
  updateReservationSchema,
  cancelReservationSchema,
  updateReservationStatusSchema,
  completeReservationSchema,
  addServiceSchema,
  insuranceSchema,
  discountSchema,
  availabilityQuerySchema,
  getReservationsQuerySchema
} from '../../validators/reservation.validators';
import { idParamSchema } from '../../validators/common.validator';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const reservationController = new ReservationController();

/**
 * @swagger
 * /api/v1/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationRequest'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         description: Conflict - Bikes not available for the selected dates
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  // authenticate,
  validate(createReservationSchema),
  reservationController.createReservation
);

/**
 * @swagger
 * /api/v1/reservations:
 *   get:
 *     summary: Get all reservations with filtering, pagination, and sorting
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: sort
 *         in: query
 *         description: Sort field and direction (e.g., 'startDate:desc,totalAmount:asc')
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter by reservation status (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: startDateFrom
 *         in: query
 *         description: Filter by start date (minimum)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: startDateTo
 *         in: query
 *         description: Filter by start date (maximum)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDateFrom
 *         in: query
 *         description: Filter by end date (minimum)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDateTo
 *         in: query
 *         description: Filter by end date (maximum)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: customerId
 *         in: query
 *         description: Filter by customer ID
 *         schema:
 *           type: string
 *       - name: bikeId
 *         in: query
 *         description: Filter by bike ID
 *         schema:
 *           type: string
 *       - name: stationId
 *         in: query
 *         description: Filter by station ID (start or end)
 *         schema:
 *           type: string
 *       - name: includeCompleted
 *         in: query
 *         description: Include completed reservations
 *         schema:
 *           type: boolean
 *       - name: includeCancelled
 *         in: query
 *         description: Include cancelled reservations
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(getReservationsQuerySchema, ValidationSource.QUERY),
  reservationController.getReservations
);

/**
 * @swagger
 * /api/v1/reservations/availability:
 *   get:
 *     summary: Check bike availability for a date range
 *     tags: [Reservations]
 *     parameters:
 *       - name: bikeIds
 *         in: query
 *         required: true
 *         description: Comma-separated bike IDs
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         required: true
 *         description: Start date
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDate
 *         in: query
 *         required: true
 *         description: End date
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: excludeReservationId
 *         in: query
 *         description: Reservation ID to exclude from availability check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/availability',
  validate(availabilityQuerySchema, ValidationSource.QUERY),
  reservationController.checkAvailability
);

/**
 * @swagger
 * /api/v1/reservations/active:
 *   get:
 *     summary: Get active reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: List of active reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/active',
  // authenticate,
  // authorize(['admin', 'staff']),
  reservationController.getActiveReservations
);

/**
 * @swagger
 * /api/v1/reservations/upcoming:
 *   get:
 *     summary: Get upcoming reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: hoursAhead
 *         in: query
 *         description: Hours ahead to look for upcoming reservations
 *         schema:
 *           type: integer
 *           default: 24
 *     responses:
 *       200:
 *         description: List of upcoming reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/upcoming',
  // authenticate,
  // authorize(['admin', 'staff']),
  reservationController.getUpcomingReservations
);

/**
 * @swagger
 * /api/v1/reservations/overdue:
 *   get:
 *     summary: Get overdue reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: List of overdue reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/overdue',
  // authenticate,
  // authorize(['admin', 'staff']),
  reservationController.getOverdueReservations
);

/**
 * @swagger
 * /api/v1/reservations/customer/{customerId}:
 *   get:
 *     summary: Get customer's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: List of customer's reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/customer/:customerId',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS, 'customerId'),
  reservationController.getCustomerReservations
);

/**
 * @swagger
 * /api/v1/reservations/bike/{bikeId}:
 *   get:
 *     summary: Get bike's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bikeId
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: List of bike's reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/bike/:bikeId',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS, 'bikeId'),
  reservationController.getBikeReservations
);

/**
 * @swagger
 * /api/v1/reservations/station/{stationId}:
 *   get:
 *     summary: Get station's reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: stationId
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: upcoming
 *         in: query
 *         description: Return only upcoming reservations
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of station's reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/station/:stationId',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS, 'stationId'),
  reservationController.getStationReservations
);

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/:id',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  reservationController.getReservationById
);

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   put:
 *     summary: Update reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReservationRequest'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot update reservation with current status or bikes not available
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put(
  '/:id',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(updateReservationSchema),
  reservationController.updateReservation
);

/**
 * @swagger
 * /api/v1/reservations/{id}/cancel:
 *   patch:
 *     summary: Cancel reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelReservationRequest'
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot cancel reservation with current status
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  '/:id/cancel',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(cancelReservationSchema),
  reservationController.cancelReservation
);

/**
 * @swagger
 * /api/v1/reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Reservation status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
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
  validate(updateReservationStatusSchema),
  reservationController.updateReservationStatus
);

/**
 * @swagger
 * /api/v1/reservations/{id}/complete:
 *   patch:
 *     summary: Complete reservation and process return
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteReservationRequest'
 *     responses:
 *       200:
 *         description: Reservation completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot complete reservation with current status
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  '/:id/complete',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(completeReservationSchema),
  reservationController.completeReservation
);

/**
 * @swagger
 * /api/v1/reservations/{id}/services:
 *   post:
 *     summary: Add additional service to reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddServiceRequest'
 *     responses:
 *       200:
 *         description: Service added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot add service to reservation with current status
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/:id/services',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(addServiceSchema),
  reservationController.addService
);

/**
 * @swagger
 * /api/v1/reservations/{id}/services/{serviceName}:
 *   delete:
 *     summary: Remove additional service from reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *       - name: serviceName
 *         in: path
 *         required: true
 *         description: Service name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot remove service from reservation with current status
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  '/:id/services/:serviceName',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  reservationController.removeService
);

/**
 * @swagger
 * /api/v1/reservations/{id}/insurance:
 *   post:
 *     summary: Apply insurance to reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsuranceRequest'
 *     responses:
 *       200:
 *         description: Insurance applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot apply insurance to reservation with current status
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/:id/insurance',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(insuranceSchema),
  reservationController.applyInsurance
);

/**
 * @swagger
 * /api/v1/reservations/{id}/discount:
 *   post:
 *     summary: Apply discount to reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reservation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DiscountRequest'
 *     responses:
 *       200:
 *         description: Discount applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Cannot apply discount to reservation with current status
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/:id/discount',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(discountSchema),
  reservationController.applyDiscount
);

export default router;