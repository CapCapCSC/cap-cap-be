const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
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
 *   name: Food
 *   description: Food management endpoints
 */

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Get all foods with pagination
 *     tags: [Food]
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
 *         description: Comma-separated list of tag IDs
 *     responses:
 *       200:
 *         description: List of foods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
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
router.get('/', cache(CACHE_DURATION), foodController.getAllFoods);

/**
 * @swagger
 * /api/foods/random:
 *   get:
 *     summary: Get random food with related restaurants
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Random food and related restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 food:
 *                   $ref: '#/components/schemas/Food'
 *                 restaurants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: No foods available
 *       500:
 *         description: Server error
 */
router.get('/random', foodController.getRandomFood);
/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: Get food by ID
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID
 *     responses:
 *       200:
 *         description: Food details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       404:
 *         description: Food not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cache(CACHE_DURATION), foodController.getFoodById);

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Create new food (Admin only)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Food name
 *               description:
 *                 type: string
 *                 description: Food description
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ingredients
 *               imgUrl:
 *                 type: string
 *                 description: Image URL
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tag IDs
 *     responses:
 *       201:
 *         description: Food created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 food:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createFoodSchema),
    foodController.createFood,
);

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: Update food (Admin only)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Food name
 *               description:
 *                 type: string
 *                 description: Food description
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ingredients
 *               imgUrl:
 *                 type: string
 *                 description: Image URL
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tag IDs
 *     responses:
 *       200:
 *         description: Food updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 food:
 *                   $ref: '#/components/schemas/Food'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Food not found
 *       500:
 *         description: Server error
 */
router.put('/:id', clearCache, authMiddleware, adminMiddleware, foodController.updateFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   delete:
 *     summary: Delete food (Admin only)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID
 *     responses:
 *       200:
 *         description: Food deleted successfully
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
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Food not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, foodController.deleteFood);

/**
 * @swagger
 * components:
 *   schemas:
 *     Food:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *         imgUrl:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Restaurant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         address:
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
 */

module.exports = router;
