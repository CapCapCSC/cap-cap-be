const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

// Apply request logger middleware
router.use(requestLogger);

/**
 * @swagger
 * tags:
 *   name: Question
 *   description: Question management endpoints (Admin only)
 */

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create new question (Admin only)
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - correctAnswer
 *               - incorrectAnswer
 *               - relatedFood
 *             properties:
 *               content:
 *                 type: string
 *                 description: Question content
 *               correctAnswer:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of correct answers
 *               incorrectAnswer:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of incorrect answers
 *               relatedFood:
 *                 type: string
 *                 description: ID of the related food
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Question'
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
    authMiddleware,
    adminMiddleware,
    validate(validator.createQuestionSchema),
    questionController.createQuestion,
);

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions (Admin only)
 *     tags: [Question]
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
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
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
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, adminMiddleware, questionController.getAllQuestions);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by ID (Admin only)
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, adminMiddleware, questionController.getQuestionById);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update question (Admin only)
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Question content
 *               correctAnswer:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of correct answers
 *               incorrectAnswer:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of incorrect answers
 *               relatedFood:
 *                 type: string
 *                 description: ID of the related food
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, adminMiddleware, questionController.updateQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete question (Admin only)
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
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
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, adminMiddleware, questionController.deleteQuestion);

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         correctAnswer:
 *           type: array
 *           items:
 *             type: string
 *         incorrectAnswer:
 *           type: array
 *           items:
 *             type: string
 *         relatedFood:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
