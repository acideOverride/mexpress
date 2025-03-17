/**
 * Customer API Routes
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management API
 */
import { Router } from 'express';
import { CustomerController } from '../../controllers/customer.controller';
import { validate, ValidationSource } from '../../middleware/validator.middleware';
import { 
  createCustomerSchema, 
  updateCustomerSchema, 
  loyaltyPointsSchema,
  addPaymentMethodSchema,
  verificationStatusSchema,
  updatePreferencesSchema,
  getCustomersQuerySchema
} from '../../validators/customer.validators';
import { idParamSchema } from '../../validators/common.validator';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const customerController = new CustomerController();

/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerRequest'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  validate(createCustomerSchema),
  customerController.createCustomer
);

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Get all customers with filtering, pagination, and sorting
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - name: sort
 *         in: query
 *         description: Sort field and direction (e.g., 'loyaltyPoints:desc,memberSince:asc')
 *         schema:
 *           type: string
 *       - name: minLoyaltyPoints
 *         in: query
 *         description: Minimum loyalty points
 *         schema:
 *           type: number
 *       - name: maxLoyaltyPoints
 *         in: query
 *         description: Maximum loyalty points
 *         schema:
 *           type: number
 *       - name: verificationStatus
 *         in: query
 *         description: Filter by verification status (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: bikeTypes
 *         in: query
 *         description: Filter by preferred bike types (comma-separated for multiple)
 *         schema:
 *           type: string
 *       - name: bikeSize
 *         in: query
 *         description: Filter by preferred bike size
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search term for notes and location
 *         schema:
 *           type: string
 *       - name: phone
 *         in: query
 *         description: Filter by phone number (partial match)
 *         schema:
 *           type: string
 *       - name: postalCode
 *         in: query
 *         description: Filter by postal code
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: Filter by city (partial match)
 *         schema:
 *           type: string
 *       - name: country
 *         in: query
 *         description: Filter by country (partial match)
 *         schema:
 *           type: string
 *       - name: hasPendingVerification
 *         in: query
 *         description: Filter by pending verification status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCustomersResponse'
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
  validate(getCustomersQuerySchema, ValidationSource.QUERY),
  customerController.getCustomers
);

/**
 * @swagger
 * /api/v1/customers/top:
 *   get:
 *     summary: Get top customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Maximum number of customers to return
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: criteria
 *         in: query
 *         description: Criteria to sort by
 *         schema:
 *           type: string
 *           enum: [rentalCount, loyaltyPoints]
 *           default: rentalCount
 *     responses:
 *       200:
 *         description: List of top customers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomersArrayResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/top',
  // authenticate,
  // authorize(['admin', 'staff']),
  customerController.getTopCustomers
);

/**
 * @swagger
 * /api/v1/customers/inactive:
 *   get:
 *     summary: Get inactive customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: days
 *         in: query
 *         description: Days since last rental
 *         schema:
 *           type: integer
 *           default: 90
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: List of inactive customers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCustomersResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/inactive',
  // authenticate,
  // authorize(['admin', 'staff']),
  customerController.getInactiveCustomers
);

/**
 * @swagger
 * /api/v1/customers/user/{userId}:
 *   get:
 *     summary: Get customer by user ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  '/user/:userId',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS, 'userId'),
  customerController.getCustomerByUserId
);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  customerController.getCustomerById
);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   put:
 *     summary: Update customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCustomerRequest'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(updateCustomerSchema),
  customerController.updateCustomer
);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     summary: Delete customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
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
 *                       example: Customer deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         description: Conflict - Customer has active reservations
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  '/:id',
  // authenticate,
  // authorize(['admin']),
  validate(idParamSchema, ValidationSource.PARAMS),
  customerController.deleteCustomer
);

/**
 * @swagger
 * /api/v1/customers/{id}/loyalty-points:
 *   post:
 *     summary: Add loyalty points to customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyPointsRequest'
 *     responses:
 *       200:
 *         description: Loyalty points added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  '/:id/loyalty-points',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(loyaltyPointsSchema),
  customerController.addLoyaltyPoints
);

/**
 * @swagger
 * /api/v1/customers/{id}/deduct-points:
 *   post:
 *     summary: Deduct loyalty points from customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoyaltyPointsRequest'
 *     responses:
 *       200:
 *         description: Loyalty points deducted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeductPointsResponse'
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
  '/:id/deduct-points',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(loyaltyPointsSchema),
  customerController.deductLoyaltyPoints
);

/**
 * @swagger
 * /api/v1/customers/{id}/payment-methods:
 *   post:
 *     summary: Add payment method to customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPaymentMethodRequest'
 *     responses:
 *       200:
 *         description: Payment method added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  '/:id/payment-methods',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(addPaymentMethodSchema),
  customerController.addPaymentMethod
);

/**
 * @swagger
 * /api/v1/customers/{id}/payment-methods/{methodId}:
 *   delete:
 *     summary: Remove payment method from customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *       - name: methodId
 *         in: path
 *         required: true
 *         description: Payment method ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment method removed successfully
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
 *                       example: Payment method removed successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete(
  '/:id/payment-methods/:methodId',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(idParamSchema, ValidationSource.PARAMS, 'methodId'),
  customerController.removePaymentMethod
);

/**
 * @swagger
 * /api/v1/customers/{id}/payment-methods/{methodId}/default:
 *   patch:
 *     summary: Set default payment method
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *       - name: methodId
 *         in: path
 *         required: true
 *         description: Payment method ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default payment method set successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  '/:id/payment-methods/:methodId/default',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(idParamSchema, ValidationSource.PARAMS, 'methodId'),
  customerController.setDefaultPaymentMethod
);

/**
 * @swagger
 * /api/v1/customers/{id}/verification:
 *   patch:
 *     summary: Update customer verification status
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationStatusRequest'
 *     responses:
 *       200:
 *         description: Verification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  '/:id/verification',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(verificationStatusSchema),
  customerController.updateVerificationStatus
);

/**
 * @swagger
 * /api/v1/customers/{id}/rental-history:
 *   get:
 *     summary: Get customer's rental history
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Rental history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedReservationsResponse'
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
  '/:id/rental-history',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  customerController.getRentalHistory
);

/**
 * @swagger
 * /api/v1/customers/{id}/preferences:
 *   patch:
 *     summary: Update customer preferences
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePreferencesRequest'
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
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
  '/:id/preferences',
  // authenticate,
  validate(idParamSchema, ValidationSource.PARAMS),
  validate(updatePreferencesSchema),
  customerController.updatePreferences
);

export default router;