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

//PUBLIC
router.get('/', cache(CACHE_DURATION), quizController.getAllQuizzes); // Read all
router.get('/:id', cache(CACHE_DURATION), quizController.getQuizById); // Read one
router.get('/:id/statistics', cache(CACHE_DURATION), quizController.getQuizStatistics); // Get quiz statistics

//AUTHENTICATED
router.post('/:id/start', authMiddleware, quizController.startQuiz); // Start quiz
router.post('/:id/submit', authMiddleware, validate(validator.submitQuizSchema), quizController.submitQuiz); // Submit quiz

//ADMIN
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createQuizSchema),
    quizController.createQuiz,
); // Create
router.put(
    '/:id',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.updateQuizSchema),
    quizController.updateQuiz,
); // Update
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, quizController.deleteQuiz); // Delete

module.exports = router;
