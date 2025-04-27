const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');
const { cache, clearCache } = require('../middlewares/cache');

const CACHE_DURATION = 3600; // 1 hour

/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Badge management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Badge:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the badge
 *         name:
 *           type: string
 *           description: The name of the badge
 *         iconUrl:
 *           type: string
 *           description: URL to the badge's icon
 *         description:
 *           type: string
 *           description: The description of the badge
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the badge was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the badge was last updated
 */

// Apply request logger middleware
router.use(requestLogger);

/**
 * @swagger
 * /api/badges:
 *   get:
 *     summary: Get all badges
 *     tags: [Badges]
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
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of badges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/', cache(CACHE_DURATION), badgeController.getAllBadges);

/**
 * @swagger
 * /api/badges/{id}:
 *   get:
 *     summary: Get a badge by id
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Badge id
 *     responses:
 *       200:
 *         description: Badge details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Badge'
 *       404:
 *         description: Badge not found
 */
router.get('/:id', cache(CACHE_DURATION), badgeController.getBadgeById);

/**
 * @swagger
 * /api/badges:
 *   post:
 *     summary: Create a new badge
 *     tags: [Badges]
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
 *                 description: Name of the badge
 *               iconUrl:
 *                 type: string
 *                 description: URL to the badge's icon
 *               description:
 *                 type: string
 *                 description: The description of the badge
 *     responses:
 *       201:
 *         description: Badge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 badge:
 *                   $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createBadgeSchema),
    badgeController.createBadge,
);

/**
 * @swagger
 * /api/badges/{id}:
 *   put:
 *     summary: Update a badge
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Badge id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the badge
 *               iconUrl:
 *                 type: string
 *                 description: URL to the badge's icon
 *               description:
 *                 type: string
 *                 description: The description of the badge
 *     responses:
 *       200:
 *         description: Badge updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 badge:
 *                   $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Badge not found
 */
router.put('/:id', clearCache, authMiddleware, adminMiddleware, badgeController.updateBadge);

/**
 * @swagger
 * /api/badges/{id}:
 *   delete:
 *     summary: Delete a badge
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Badge id
 *     responses:
 *       200:
 *         description: Badge deleted successfully
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
 *         description: Forbidden (not admin)
 *       404:
 *         description: Badge not found
 */
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, badgeController.deleteBadge);

module.exports = router;
