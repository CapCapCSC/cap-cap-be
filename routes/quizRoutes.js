const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

// Apply request logger middleware
router.use(requestLogger);

//PUBLIC
router.get('/', quizController.getAllQuizzes); // Read all
router.get('/:id', quizController.getQuizById); // Read one

//AUTHENTICATED
router.post('/:id/start', authMiddleware, quizController.startQuiz); // Start quiz
router.post('/:id/submit', authMiddleware, quizController.submitQuiz); // Submit quiz

//ADMIN
router.post('/', authMiddleware, adminMiddleware, validate(validator.createQuizSchema), quizController.createQuiz); // Create
router.put('/:id', authMiddleware, adminMiddleware, quizController.updateQuiz); // Update
router.delete('/:id', authMiddleware, adminMiddleware, quizController.deleteQuiz); // Delete

module.exports = router;
