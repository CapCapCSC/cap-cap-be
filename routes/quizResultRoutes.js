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

// AUTHENTICATED
router.get(
    '/history',
    authMiddleware,
    cache(CACHE_DURATION),
    validate(validator.getQuizHistorySchema),
    quizResultController.getQuizHistory,
);
router.get('/statistics', authMiddleware, cache(CACHE_DURATION), quizResultController.getUserStatistics);
router.get('/result/:resultId', authMiddleware, cache(CACHE_DURATION), quizResultController.getQuizResult);
router.get('/leaderboard/:quizId', authMiddleware, cache(CACHE_DURATION), quizResultController.getQuizLeaderboard);

module.exports = router;
