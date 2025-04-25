const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
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
 *   name: Quiz
 *   description: Quiz management endpoints
 */

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quiz]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for quiz name or description
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
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
router.get('/', cache(CACHE_DURATION), quizController.getAllQuizzes); // Read all

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cache(CACHE_DURATION), quizController.getQuizById); // Read one

/**
 * @swagger
 * /api/quizzes/{id}/statistics:
 *   get:
 *     summary: Get quiz statistics
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAttempts:
 *                       type: integer
 *                     averageScore:
 *                       type: number
 *                     highestScore:
 *                       type: number
 *                     lowestScore:
 *                       type: number
 *                     totalTimeSpent:
 *                       type: number
 *                     averageTimeSpent:
 *                       type: number
 *                     completionRate:
 *                       type: number
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:id/statistics', cache(CACHE_DURATION), quizController.getQuizStatistics); // Get quiz statistics

/**
 * @swagger
 * /api/quizzes/{id}/start:
 *   post:
 *     summary: Start a quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     quiz:
 *                       $ref: '#/components/schemas/Quiz'
 *                     quizResult:
 *                       $ref: '#/components/schemas/QuizResult'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.post('/:id/start', authMiddleware, quizController.startQuiz); // Start quiz

/**
 * @swagger
 * /api/quizzes/{id}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedAnswer:
 *                       type: string
 *                     timeSpent:
 *                       type: number
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/QuizResult'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.post('/:id/submit', authMiddleware, validate(validator.submitQuizSchema), quizController.submitQuiz); // Submit quiz

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz (Admin only)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
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
    validate(validator.createQuizSchema),
    quizController.createQuiz,
); // Create

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update a quiz (Admin only)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 quiz:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.put(
    '/:id',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.updateQuizSchema),
    quizController.updateQuiz,
); // Update

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz (Admin only)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
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
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, quizController.deleteQuiz); // Delete

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *         dateCreated:
 *           type: string
 *           format: date-time
 *         validUntil:
 *           type: string
 *           format: date-time
 *         timeLimit:
 *           type: number
 *         passingScore:
 *           type: number
 *         rewardBadge:
 *           type: string
 *         rewardVoucher:
 *           type: string
 *         isActive:
 *           type: boolean
 *         statistics:
 *           type: object
 *           properties:
 *             totalAttempts:
 *               type: number
 *             averageScore:
 *               type: number
 *             completionRate:
 *               type: number
 *             averageTimeSpent:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
