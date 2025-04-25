const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResultController');
const authMiddleware = require('../middlewares/authMiddleware');
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
 *   name: QuizResult
 *   description: Quiz result management endpoints
 */

/**
 * @swagger
 * /api/quiz-results/history:
 *   get:
 *     summary: Get user's quiz history
 *     tags: [QuizResult]
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
 *         description: Items per page
 *     responses:
 *       200:
 *         description: User's quiz history
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
 *                     $ref: '#/components/schemas/QuizResult'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
    '/history',
    authMiddleware,
    cache(CACHE_DURATION),
    validate(validator.getQuizHistorySchema),
    quizResultController.getQuizHistory,
);

/**
 * @swagger
 * /api/quiz-results/statistics:
 *   get:
 *     summary: Get user's quiz statistics
 *     tags: [QuizResult]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's quiz statistics
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
 *                     totalQuizzes:
 *                       type: integer
 *                     averageScore:
 *                       type: number
 *                     timeSpent:
 *                       type: number
 *                     completionRate:
 *                       type: number
 *                     highScoreRate:
 *                       type: number
 *                     timeEfficiency:
 *                       type: number
 *                     rewardsEarned:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/statistics', authMiddleware, cache(CACHE_DURATION), quizResultController.getUserStatistics);

/**
 * @swagger
 * /api/quiz-results/result/{resultId}:
 *   get:
 *     summary: Get specific quiz result
 *     tags: [QuizResult]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resultId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz result ID
 *     responses:
 *       200:
 *         description: Quiz result details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/QuizResult'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner of the result
 *       404:
 *         description: Quiz result not found
 *       500:
 *         description: Server error
 */
router.get('/result/:resultId', authMiddleware, cache(CACHE_DURATION), quizResultController.getQuizResult);

/**
 * @swagger
 * /api/quiz-results/leaderboard/{quizId}:
 *   get:
 *     summary: Get quiz leaderboard
 *     tags: [QuizResult]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz leaderboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       score:
 *                         type: number
 *                       timeSpent:
 *                         type: number
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/leaderboard/:quizId', authMiddleware, cache(CACHE_DURATION), quizResultController.getQuizLeaderboard);

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizResult:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         quizId:
 *           type: string
 *         score:
 *           type: number
 *         correctAnswers:
 *           type: integer
 *         totalQuestions:
 *           type: integer
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *               selectedAnswer:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *               timeSpent:
 *                 type: number
 *         startedAt:
 *           type: string
 *           format: date-time
 *         completedAt:
 *           type: string
 *           format: date-time
 *         timeSpent:
 *           type: number
 *         status:
 *           type: string
 *           enum: [in_progress, completed, abandoned]
 *         rewards:
 *           type: object
 *           properties:
 *             badge:
 *               type: string
 *             voucher:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
