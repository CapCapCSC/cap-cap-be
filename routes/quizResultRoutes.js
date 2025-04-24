const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResultController');
const authMiddleware = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

// Apply request logger middleware
router.use(requestLogger);

// AUTHENTICATED
router.get('/history', authMiddleware, validate(validator.getQuizHistorySchema), quizResultController.getQuizHistory);
router.get('/statistics', authMiddleware, quizResultController.getUserStatistics);
router.get('/result/:resultId', authMiddleware, quizResultController.getQuizResult);
router.get('/leaderboard/:quizId', authMiddleware, quizResultController.getQuizLeaderboard);

module.exports = router;
