const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');
const { cache, clearCache } = require('../middlewares/cache');

const CACHE_DURATION = 3600; // 1 hour
// Apply request logger middleware
router.use(requestLogger);

/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: Restaurant management endpoints
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurant]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter restaurants
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/', cache(CACHE_DURATION), restaurantController.getAllRestaurants); // Read all

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cache(CACHE_DURATION), restaurantController.getRestaurantById); // Read one

/**
 * @swagger
 * /api/restaurants/random:
 *   get:
 *     summary: Get 3 random restaurants
 *     tags: [Restaurant]
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: District to filter restaurants
 *     responses:
 *       200:
 *         description: List of random restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: District is required
 *       500:
 *         description: Server error
 */
router.get('/random', cache(CACHE_DURATION), restaurantController.getRandom3Restaurants); // Get random 3 restaurants

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant (Admin only)
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 restaurant:
 *                   $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createRestaurantSchema),
    restaurantController.createRestaurant,
); // Create

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant (Admin only)
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 restaurant:
 *                   $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.put(
    '/:id',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.updateRestaurantSchema),
    restaurantController.updateRestaurant,
); // Update

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant (Admin only)
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, restaurantController.deleteRestaurant); // Delete

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         menu:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               food:
 *                 type: string
 *               price:
 *                 type: number
 *         imageUrl:
 *           type: string
 *         address:
 *           type: string
 *         districtId:
 *           type: string
 *         locationUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
