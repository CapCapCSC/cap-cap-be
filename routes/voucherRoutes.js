const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
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
 *   name: Voucher
 *   description: Voucher management endpoints
 */

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new voucher (Admin only)
 *     tags: [Voucher]
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
 *               - validUntil
 *               - applicableRestaurants
 *               - discountValue
 *             properties:
 *               name:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               applicableRestaurants:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Restaurant ID
 *               discountValue:
 *                 type: number
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 voucher:
 *                   $ref: '#/components/schemas/Voucher'
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
    validate(validator.createVoucherSchema),
    voucherController.createVoucher,
);

/**
 * @swagger
 * /api/vouchers:
 *   get:
 *     summary: Get all vouchers with pagination and filtering
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter by
 *     responses:
 *       200:
 *         description: List of vouchers with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Voucher'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, cache(CACHE_DURATION), voucherController.getAllVouchers);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     summary: Get voucher by ID
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID
 *     responses:
 *       200:
 *         description: Voucher details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, cache(CACHE_DURATION), voucherController.getVoucherById);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     summary: Update voucher (Admin only)
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *               applicableRestaurants:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Restaurant ID
 *               discountValue:
 *                 type: number
 *               used:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Voucher updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 voucher:
 *                   $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Voucher not found
 *       500:
 *         description: Server error
 */
router.put(
    '/:id',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.updateVoucherSchema),
    voucherController.updateVoucher,
);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   delete:
 *     summary: Delete voucher (Admin only)
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Voucher ID
 *     responses:
 *       200:
 *         description: Voucher deleted successfully
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
 *         description: Voucher not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, voucherController.deleteVoucher);

/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         validUntil:
 *           type: string
 *           format: date-time
 *         applicableRestaurants:
 *           type: array
 *           items:
 *             type: string
 *             description: Restaurant ID
 *         discountValue:
 *           type: number
 *         used:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
