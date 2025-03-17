/**
 * Station Routes
 * Defines API endpoints for station management
 */
import express from 'express';
import { StationController } from '../../controllers/station.controller';
import { validate } from '../../middlewares/validate';
import * as stationValidators from '../../validators/station.validators';
// import { authenticate } from '../../middlewares/authenticate';
// import { authorize } from '../../middlewares/authorize';

const router = express.Router();
const stationController = new StationController();

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Station management endpoints
 */

/**
 * @swagger
 * /api/v1/stations:
 *   post:
 *     summary: Create a new station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationCreate'
 *     responses:
 *       201:
 *         description: Station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.createStationSchema),
  stationController.createStation
);

/**
 * @swagger
 * /api/v1/stations:
 *   get:
 *     summary: Get all stations with filtering, pagination, and sorting
 *     tags: [Stations]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/sort'
 *       - name: status
 *         in: query
 *         description: Filter by station status
 *         schema:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: minCapacity
 *         in: query
 *         description: Minimum capacity
 *         schema:
 *           type: integer
 *       - name: maxCapacity
 *         in: query
 *         description: Maximum capacity
 *         schema:
 *           type: integer
 *       - name: amenities
 *         in: query
 *         description: Filter by amenities (comma-separated)
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: Search in name and address
 *         schema:
 *           type: string
 *       - name: hasAvailableBikes
 *         in: query
 *         description: Filter by bike availability
 *         schema:
 *           type: boolean
 *       - name: minAvailableBikes
 *         in: query
 *         description: Minimum number of available bikes
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StationResponse'
 *                 metadata:
 *                   $ref: '#/components/schemas/PaginationMetadata'
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  stationController.getStations
);

/**
 * @swagger
 * /api/v1/stations/advanced-search:
 *   get:
 *     summary: Advanced station search with complex filtering and sorting
 *     tags: [Stations]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - name: proximity
 *         in: query
 *         description: Enable proximity search
 *         schema:
 *           type: boolean
 *       - name: latitude
 *         in: query
 *         description: Latitude for proximity search
 *         schema:
 *           type: number
 *       - name: longitude
 *         in: query
 *         description: Longitude for proximity search
 *         schema:
 *           type: number
 *       - name: radius
 *         in: query
 *         description: Search radius in meters for proximity search
 *         schema:
 *           type: number
 *       - name: openNow
 *         in: query
 *         description: Filter to only stations currently open
 *         schema:
 *           type: boolean
 *       - name: bikeTypes
 *         in: query
 *         description: Filter by bike types (comma-separated)
 *         schema:
 *           type: string
 *       - name: sortByMultiple
 *         in: query
 *         description: Complex sorting with multiple fields (JSON string)
 *         schema:
 *           type: string
 *       - name: savedFilterId
 *         in: query
 *         description: ID of a saved search filter to use
 *         schema:
 *           type: string
 *       - name: saveFilter
 *         in: query
 *         description: Save this search for future use
 *         schema:
 *           type: boolean
 *       - name: filterName
 *         in: query
 *         description: Name for the saved filter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Advanced search results
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get(
  '/advanced-search',
  validate(stationValidators.advancedSearchQuerySchema, 'query'),
  stationController.advancedSearch
);

/**
 * @swagger
 * /api/v1/stations/saved-filters:
 *   get:
 *     summary: Get user's saved search filters
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved search filters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/saved-filters',
  // authenticate,
  stationController.getSavedFilters
);

/**
 * @swagger
 * /api/v1/stations/saved-filters/{filterId}:
 *   delete:
 *     summary: Delete a saved search filter
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: filterId
 *         in: path
 *         required: true
 *         description: Saved filter ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filter deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Filter not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/saved-filters/:filterId',
  // authenticate,
  validate(stationValidators.idParamSchema, 'params'),
  stationController.deleteSavedFilter
);

/**
 * @swagger
 * /api/v1/stations/{id}:
 *   get:
 *     summary: Get station by ID
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Station ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationResponse'
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  validate(stationValidators.idParamSchema, 'params'),
  stationController.getStationById
);

/**
 * @swagger
 * /api/v1/stations/{id}:
 *   put:
 *     summary: Update station by ID
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Station ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StationUpdate'
 *     responses:
 *       200:
 *         description: Station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StationResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  validate(stationValidators.updateStationSchema),
  stationController.updateStation
);

/**
 * @swagger
 * /api/v1/stations/{id}:
 *   delete:
 *     summary: Delete station by ID
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Station ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station not found
 *       409:
 *         description: Conflict (e.g., station has bikes or active reservations)
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  // authenticate,
  // authorize(['admin']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.deleteStation
);

/**
 * @swagger
 * /api/v1/stations/nearest:
 *   get:
 *     summary: Get nearest stations
 *     tags: [Stations]
 *     parameters:
 *       - name: longitude
 *         in: query
 *         description: Longitude coordinate
 *         required: true
 *         schema:
 *           type: number
 *       - name: latitude
 *         in: query
 *         description: Latitude coordinate
 *         required: true
 *         schema:
 *           type: number
 *       - name: maxDistance
 *         in: query
 *         description: Maximum distance in meters (default 5000)
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         description: Maximum number of stations to return (default 10)
 *         schema:
 *           type: integer
 *       - name: minAvailableBikes
 *         in: query
 *         description: Minimum number of available bikes (default 0)
 *         schema:
 *           type: integer
 *       - name: amenities
 *         in: query
 *         description: Required amenities (comma-separated)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of nearest stations
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get(
  '/nearest',
  validate(stationValidators.nearestStationsQuerySchema, 'query'),
  stationController.getNearestStations
);

/**
 * @swagger
 * /api/v1/stations/nearby:
 *   get:
 *     summary: Get nearby stations with dynamic radius options
 *     tags: [Stations]
 *     parameters:
 *       - name: longitude
 *         in: query
 *         description: Longitude coordinate
 *         required: true
 *         schema:
 *           type: number
 *       - name: latitude
 *         in: query
 *         description: Latitude coordinate
 *         required: true
 *         schema:
 *           type: number
 *       - name: radiusSize
 *         in: query
 *         description: Predefined radius size (small=1km, medium=3km, large=5km, custom)
 *         schema:
 *           type: string
 *           enum: [small, medium, large, custom]
 *           default: medium
 *       - name: customRadius
 *         in: query
 *         description: Custom radius in meters (used when radiusSize=custom)
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         description: Maximum number of stations to return (default 20)
 *         schema:
 *           type: integer
 *       - name: bikeType
 *         in: query
 *         description: Filter by bike type
 *         schema:
 *           type: string
 *           enum: [mountain, road, hybrid, electric, city, kids]
 *       - name: includeInactive
 *         in: query
 *         description: Include stations that are inactive or under maintenance
 *         schema:
 *           type: boolean
 *           default: false
 *       - name: minAvailableBikes
 *         in: query
 *         description: Minimum number of available bikes (default 1)
 *         schema:
 *           type: integer
 *       - name: includeRoutes
 *         in: query
 *         description: Include estimated routes to each station
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of nearby stations
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get(
  '/nearby',
  stationController.getNearbyStations
);

/**
 * @swagger
 * /api/v1/stations/route:
 *   get:
 *     summary: Calculate route between two stations
 *     tags: [Stations]
 *     parameters:
 *       - name: fromStationId
 *         in: query
 *         description: Origin station ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: toStationId
 *         in: query
 *         description: Destination station ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: travelMode
 *         in: query
 *         description: Mode of travel
 *         schema:
 *           type: string
 *           enum: [cycling, walking, driving]
 *           default: cycling
 *       - name: includeElevation
 *         in: query
 *         description: Include elevation data in the response
 *         schema:
 *           type: boolean
 *           default: false
 *       - name: avoidHighways
 *         in: query
 *         description: Avoid highways in route calculation
 *         schema:
 *           type: boolean
 *           default: false
 *       - name: avoidTolls
 *         in: query
 *         description: Avoid toll roads in route calculation
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Route details between stations
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/route',
  stationController.calculateRoute
);

/**
 * @swagger
 * /api/v1/stations/available:
 *   get:
 *     summary: Get stations with available bikes
 *     tags: [Stations]
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: minAvailable
 *         in: query
 *         description: Minimum number of available bikes (default 1)
 *         schema:
 *           type: integer
 *       - name: bikeType
 *         in: query
 *         description: Filter by bike type
 *         schema:
 *           type: string
 *           enum: [mountain, road, hybrid, electric, city, kids]
 *     responses:
 *       200:
 *         description: List of stations with available bikes
 *       500:
 *         description: Server error
 */
router.get(
  '/available',
  validate(stationValidators.availableStationsQuerySchema, 'query'),
  stationController.getStationsWithAvailableBikes
);

/**
 * @swagger
 * /api/v1/stations/with-capacity:
 *   get:
 *     summary: Find stations with available capacity
 *     tags: [Stations]
 *     parameters:
 *       - name: minSpots
 *         in: query
 *         description: Minimum available spots (default 1)
 *         schema:
 *           type: integer
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter by station status
 *         schema:
 *           type: string
 *           enum: [active, inactive, maintenance]
 *     responses:
 *       200:
 *         description: List of stations with available capacity
 *       500:
 *         description: Server error
 */
router.get(
  '/with-capacity',
  validate(stationValidators.capacityQuerySchema, 'query'),
  stationController.getStationsWithCapacity
);

/**
 * @swagger
 * /api/v1/stations/capacity-stats:
 *   get:
 *     summary: Get station capacity statistics
 *     tags: [Stations]
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: includeInactive
 *         in: query
 *         description: Include inactive stations
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Capacity statistics
 *       500:
 *         description: Server error
 */
router.get(
  '/capacity-stats',
  stationController.getCapacityStatistics
);

/**
 * @swagger
 * /api/v1/stations/rebalance-recommendations:
 *   get:
 *     summary: Get station rebalancing recommendations
 *     tags: [Stations]
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: urgencyLevel
 *         in: query
 *         description: Filter by urgency level
 *         schema:
 *           type: string
 *           enum: [high, medium, low, all]
 *           default: all
 *       - name: limit
 *         in: query
 *         description: Maximum number of recommendations to return
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Rebalancing recommendations
 *       500:
 *         description: Server error
 */
router.get(
  '/rebalance-recommendations',
  stationController.getRebalancingRecommendations
);

/**
 * @swagger
 * /api/v1/stations/with-amenities:
 *   get:
 *     summary: Find stations with specific amenities
 *     tags: [Stations]
 *     parameters:
 *       - name: amenities
 *         in: query
 *         required: true
 *         description: Required amenities (comma-separated)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stations with specified amenities
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get(
  '/with-amenities',
  validate(stationValidators.amenitiesQuerySchema, 'query'),
  stationController.getStationsWithAmenities
);

/**
 * @swagger
 * /api/v1/stations/open-now:
 *   get:
 *     summary: Find stations that are currently open
 *     tags: [Stations]
 *     parameters:
 *       - name: date
 *         in: query
 *         description: Date to check (defaults to current date and time)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: includeHolidays
 *         in: query
 *         description: Whether to consider holiday schedules
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: List of currently open stations
 *       500:
 *         description: Server error
 */
router.get(
  '/open-now',
  stationController.getOpenStations
);

/**
 * @swagger
 * /api/v1/stations/usage-statistics:
 *   get:
 *     summary: Get station usage statistics
 *     tags: [Stations]
 *     parameters:
 *       - name: stationId
 *         in: query
 *         description: Specific station ID to get statistics for
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: timeframe
 *         in: query
 *         description: Timeframe for statistics
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: month
 *       - name: includeInactive
 *         in: query
 *         description: Whether to include inactive stations
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Station usage statistics
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/usage-statistics',
  stationController.getStationUsageStatistics
);

/**
 * @swagger
 * /api/v1/stations/popularity-ranking:
 *   get:
 *     summary: Get stations ranked by popularity
 *     tags: [Stations]
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of results to return
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: timeframe
 *         in: query
 *         description: Timeframe for ranking
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: month
 *       - name: includeInactive
 *         in: query
 *         description: Whether to include inactive stations
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Station popularity rankings
 *       500:
 *         description: Server error
 */
router.get(
  '/popularity-ranking',
  stationController.getStationPopularityRanking
);

/**
 * @swagger
 * /api/v1/stations/utilization-report:
 *   get:
 *     summary: Get time-based station utilization report
 *     tags: [Stations]
 *     parameters:
 *       - name: stationId
 *         in: query
 *         description: Specific station ID to get report for
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: timeframe
 *         in: query
 *         description: Timeframe for the report
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: week
 *       - name: resolution
 *         in: query
 *         description: Time resolution for data points
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: hour
 *       - name: includeInactive
 *         in: query
 *         description: Whether to include inactive stations
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Station utilization report
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/utilization-report',
  stationController.getTimeBasedUtilizationReport
);

/**
 * @swagger
 * /api/v1/stations/comparison:
 *   get:
 *     summary: Compare multiple stations across different metrics
 *     tags: [Stations]
 *     parameters:
 *       - name: stationIds
 *         in: query
 *         required: true
 *         description: Comma-separated list of station IDs to compare
 *         schema:
 *           type: string
 *       - name: metrics
 *         in: query
 *         description: Comma-separated list of metrics to compare
 *         schema:
 *           type: string
 *           default: usage,availability,maintenance,revenue
 *       - name: timeframe
 *         in: query
 *         description: Timeframe for comparison
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Station comparison data
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: One or more stations not found
 *       500:
 *         description: Server error
 */
router.get(
  '/comparison',
  stationController.getStationComparisonMetrics
);

/**
 * @swagger
 * /api/v1/stations/performance-score:
 *   get:
 *     summary: Get performance scores for stations
 *     tags: [Stations]
 *     parameters:
 *       - name: stationId
 *         in: query
 *         description: Specific station ID to get score for
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Maximum number of results to return
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: includeFactors
 *         in: query
 *         description: Whether to include detailed factors in the response
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Station performance scores
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/performance-score',
  stationController.getStationPerformanceScore
);

/**
 * @swagger
 * /api/v1/stations/trend-analysis:
 *   get:
 *     summary: Get trend analysis for station metrics over time
 *     tags: [Stations]
 *     parameters:
 *       - name: stationId
 *         in: query
 *         description: Specific station ID to analyze
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: metrics
 *         in: query
 *         description: Comma-separated list of metrics to analyze
 *         schema:
 *           type: string
 *           default: usage,revenue,maintenance
 *       - name: timeframe
 *         in: query
 *         description: Timeframe for analysis
 *         schema:
 *           type: string
 *           enum: [day, week, month, quarter, year]
 *           default: quarter
 *       - name: resolution
 *         in: query
 *         description: Time resolution for data points
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: week
 *     responses:
 *       200:
 *         description: Trend analysis data
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/trend-analysis',
  stationController.getTrendAnalysis
);

/**
 * @swagger
 * /api/v1/stations/custom-schedule:
 *   get:
 *     summary: Get stations with custom schedules
 *     tags: [Stations]
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         description: Filter by schedule type
 *         schema:
 *           type: string
 *           enum: [holiday, exception, custom, all]
 *           default: all
 *     responses:
 *       200:
 *         description: List of stations with custom schedules
 *       500:
 *         description: Server error
 */
router.get(
  '/custom-schedule',
  stationController.getStationsWithCustomSchedule
);

/**
 * @swagger
 * /api/v1/stations/upcoming-maintenance:
 *   get:
 *     summary: Get upcoming maintenance across stations
 *     tags: [Stations]
 *     parameters:
 *       - name: days
 *         in: query
 *         description: Number of days to look ahead (default 30)
 *         schema:
 *           type: integer
 *           default: 30
 *       - name: type
 *         in: query
 *         description: Filter by maintenance type
 *         schema:
 *           type: string
 *       - name: city
 *         in: query
 *         description: Filter by city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of upcoming maintenance
 *       500:
 *         description: Server error
 */
router.get(
  '/upcoming-maintenance',
  stationController.getUpcomingMaintenance
);

/**
 * @swagger
 * /api/v1/stations/by-city/{city}:
 *   get:
 *     summary: Get stations by city
 *     tags: [Stations]
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         description: City name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stations in specified city
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Server error
 */
router.get(
  '/by-city/:city',
  validate(stationValidators.cityParamSchema, 'params'),
  stationController.getStationsByCity
);

/**
 * @swagger
 * /api/v1/stations/{id}/available-bike-types:
 *   get:
 *     summary: Get available bike types at a station
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of available bike types with counts
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/available-bike-types',
  validate(stationValidators.idParamSchema, 'params'),
  stationController.getAvailableBikeTypes
);

/**
 * @swagger
 * /api/v1/stations/{id}/available-bikes:
 *   get:
 *     summary: Find available bikes at a station
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         description: Bike type
 *         schema:
 *           type: string
 *           enum: [mountain, road, hybrid, electric, city, kids]
 *       - name: size
 *         in: query
 *         description: Bike size
 *         schema:
 *           type: string
 *           enum: [xs, s, m, l, xl]
 *     responses:
 *       200:
 *         description: List of available bikes at the station
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/available-bikes',
  validate(stationValidators.idParamSchema, 'params'),
  validate(stationValidators.availableBikesQuerySchema, 'query'),
  stationController.getAvailableBikes
);

/**
 * @swagger
 * /api/v1/stations/{id}/schedule:
 *   get:
 *     summary: Get station schedule
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: includeHolidays
 *         in: query
 *         description: Include holiday schedules
 *         schema:
 *           type: boolean
 *           default: true
 *       - name: includeExceptions
 *         in: query
 *         description: Include special exceptions
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Station schedule information
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/schedule',
  validate(stationValidators.idParamSchema, 'params'),
  stationController.getStationSchedule
);

/**
 * @swagger
 * /api/v1/stations/{id}/schedule:
 *   put:
 *     summary: Update station schedule
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weeklySchedule:
 *                 type: object
 *                 description: Weekly operating hours
 *               holidaySchedule:
 *                 type: array
 *                 description: Holiday schedule
 *                 items:
 *                   type: object
 *               specialExceptions:
 *                 type: array
 *                 description: Special schedule exceptions
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/schedule',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.updateStationSchedule
);

/**
 * @swagger
 * /api/v1/stations/{id}/open-status:
 *   get:
 *     summary: Get open hours status for a specific date
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         description: Date to check (defaults to current date and time)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Station open status information
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/open-status',
  validate(stationValidators.idParamSchema, 'params'),
  stationController.getStationOpenStatus
);

/**
 * @swagger
 * /api/v1/stations/{id}/maintenance:
 *   get:
 *     summary: Get station maintenance history
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: includeUpcoming
 *         in: query
 *         description: Include upcoming maintenance
 *         schema:
 *           type: boolean
 *           default: true
 *       - name: includeCompleted
 *         in: query
 *         description: Include completed maintenance
 *         schema:
 *           type: boolean
 *           default: true
 *       - name: limit
 *         in: query
 *         description: Maximum number of records to return
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Maintenance history
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/maintenance',
  validate(stationValidators.idParamSchema, 'params'),
  stationController.getMaintenanceHistory
);

/**
 * @swagger
 * /api/v1/stations/{id}/maintenance:
 *   post:
 *     summary: Schedule station maintenance
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - maintenanceType
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of maintenance
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of maintenance
 *               maintenanceType:
 *                 type: string
 *                 description: Type of maintenance
 *               description:
 *                 type: string
 *                 description: Description of maintenance
 *               technician:
 *                 type: string
 *                 description: Technician assigned
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 default: medium
 *                 description: Priority level
 *               notifyUsers:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to notify users
 *     responses:
 *       200:
 *         description: Maintenance scheduled successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/maintenance',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.scheduleMaintenance
);

/**
 * @swagger
 * /api/v1/stations/{id}/maintenance/{maintenanceId}:
 *   put:
 *     summary: Update maintenance record
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: maintenanceId
 *         in: path
 *         required: true
 *         description: Maintenance ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               maintenanceType:
 *                 type: string
 *               description:
 *                 type: string
 *               technician:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *               status:
 *                 type: string
 *                 enum: [scheduled, in-progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Maintenance record updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Station or maintenance record not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/maintenance/:maintenanceId',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.updateMaintenanceRecord
);

/**
 * @swagger
 * /api/v1/stations/{id}/maintenance/{maintenanceId}/complete:
 *   post:
 *     summary: Complete maintenance task
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: maintenanceId
 *         in: path
 *         required: true
 *         description: Maintenance ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completionNotes:
 *                 type: string
 *                 description: Notes about the completed maintenance
 *               partsReplaced:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of parts replaced
 *               completedByTechnician:
 *                 type: string
 *                 description: Technician who completed the maintenance
 *               actualEndDate:
 *                 type: string
 *                 format: date-time
 *                 description: Actual end date (defaults to current time)
 *     responses:
 *       200:
 *         description: Maintenance task completed successfully
 *       400:
 *         description: Invalid request or already completed
 *       404:
 *         description: Station or maintenance record not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/maintenance/:maintenanceId/complete',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.completeMaintenanceTask
);

/**
 * @swagger
 * /api/v1/stations/{id}/emergency-maintenance:
 *   post:
 *     summary: Create emergency maintenance notification
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - issue
 *             properties:
 *               issue:
 *                 type: string
 *                 description: Description of the emergency issue
 *               estimatedResolutionTime:
 *                 type: string
 *                 format: date-time
 *                 description: Estimated resolution time
 *               reportedBy:
 *                 type: string
 *                 description: Person reporting the issue
 *               shouldCloseStation:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to close the station for maintenance
 *     responses:
 *       200:
 *         description: Emergency maintenance created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/emergency-maintenance',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.createEmergencyMaintenance
);

/**
 * @swagger
 * /api/v1/stations/{id}/bikes:
 *   post:
 *     summary: Add a bike to a station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bikeId
 *             properties:
 *               bikeId:
 *                 type: string
 *                 description: Bike ID to add
 *     responses:
 *       200:
 *         description: Bike added successfully
 *       400:
 *         description: Invalid request or operation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station or bike not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/bikes',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  validate(stationValidators.addBikeSchema),
  stationController.addBike
);

/**
 * @swagger
 * /api/v1/stations/{id}/bikes/{bikeId}:
 *   delete:
 *     summary: Remove a bike from a station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: bikeId
 *         in: path
 *         required: true
 *         description: Bike ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bike removed successfully
 *       400:
 *         description: Invalid request or operation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station or bike not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id/bikes/:bikeId',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  validate(stationValidators.bikeIdParamSchema, 'params'),
  stationController.removeBike
);

/**
 * @swagger
 * /api/v1/stations/{id}/status:
 *   patch:
 *     summary: Update station status
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *                 description: New status
 *               reason:
 *                 type: string
 *                 description: Reason for status change
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/status',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  validate(stationValidators.updateStatusSchema),
  stationController.updateStatus
);

/**
 * @swagger
 * /api/v1/stations/{id}/capacity-forecast:
 *   get:
 *     summary: Get capacity forecasting for a station
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *       - name: period
 *         in: query
 *         description: Forecast period
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *       - name: resolution
 *         in: query
 *         description: Time resolution for the forecast
 *         schema:
 *           type: string
 *           enum: [hour, day]
 *           default: hour
 *     responses:
 *       200:
 *         description: Capacity forecast data
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id/capacity-forecast',
  validate(stationValidators.idParamSchema, 'params'),
  stationController.getCapacityForecast
);

/**
 * @swagger
 * /api/v1/stations/{id}/capacity-thresholds:
 *   post:
 *     summary: Set capacity thresholds for alerts
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lowThreshold:
 *                 type: number
 *                 description: Low capacity threshold percentage (0-100)
 *                 minimum: 0
 *                 maximum: 100
 *               highThreshold:
 *                 type: number
 *                 description: High capacity threshold percentage (0-100)
 *                 minimum: 0
 *                 maximum: 100
 *               alertEnabled:
 *                 type: boolean
 *                 description: Whether alerts are enabled for this station
 *     responses:
 *       200:
 *         description: Capacity thresholds updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Station not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/capacity-thresholds',
  // authenticate,
  // authorize(['admin', 'staff']),
  validate(stationValidators.idParamSchema, 'params'),
  stationController.setCapacityThresholds
);

export default router;