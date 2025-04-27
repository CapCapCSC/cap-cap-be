const express = require('express');
const router = express.Router();
const foodTagController = require('../controllers/foodTagController');
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
 *   name: FoodTag
 *   description: Food tag management endpoints
 */

/**
 * @swagger
 * /api/foodtags:
 *   get:
 *     summary: Get all food tags
 *     tags: [FoodTag]
 *     responses:
 *       200:
 *         description: List of food tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FoodTag'
 *       500:
 *         description: Server error
 */
router.get('/', cache(CACHE_DURATION), foodTagController.getAllFoodTags);

/**
 * @swagger
 * /api/foodtags/{id}:
 *   get:
 *     summary: Get food tag by ID
 *     tags: [FoodTag]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food tag ID
 *     responses:
 *       200:
 *         description: Food tag details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodTag'
 *       404:
 *         description: Food tag not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cache(CACHE_DURATION), foodTagController.getFoodTagById);

/**
 * @swagger
 * /api/foodtags:
 *   post:
 *     summary: Create new food tag (Admin only)
 *     tags: [FoodTag]
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
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 description: Food tag name
 *               color:
 *                 type: string
 *                 description: Food tag color (hex code)
 *     responses:
 *       201:
 *         description: Food tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 foodTag:
 *                   $ref: '#/components/schemas/FoodTag'
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
    validate(validator.createFoodTagSchema),
    foodTagController.createFoodTag,
);

/**
 * @swagger
 * /api/foodtags/{id}:
 *   put:
 *     summary: Update food tag (Admin only)
 *     tags: [FoodTag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Food tag name
 *               color:
 *                 type: string
 *                 description: Food tag color (hex code)
 *     responses:
 *       200:
 *         description: Food tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 foodTag:
 *                   $ref: '#/components/schemas/FoodTag'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Food tag not found
 *       500:
 *         description: Server error
 */
router.put('/:id', clearCache, authMiddleware, adminMiddleware, foodTagController.updateFoodTag);

/**
 * @swagger
 * /api/foodtags/{id}:
 *   delete:
 *     summary: Delete food tag (Admin only)
 *     tags: [FoodTag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food tag ID
 *     responses:
 *       200:
 *         description: Food tag deleted successfully
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
 *         description: Food tag not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, foodTagController.deleteFoodTag);

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodTag:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         color:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
