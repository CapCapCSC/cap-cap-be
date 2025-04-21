const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

//PUBLIC
router.get('/', quizController.getAllQuizzes); // Read all
router.get('/:id', quizController.getQuizById); // Read one

//AUTHENTICATED
router.post('/:id/submit', authMiddleware, quizController.submitQuiz); // Submit quiz

//ADMIN
router.put('/:id', authMiddleware, adminMiddleware, quizController.updateQuiz); // Update
router.post('/', authMiddleware, adminMiddleware, quizController.createQuiz); // Create
router.delete('/:id', authMiddleware, adminMiddleware, quizController.deleteQuiz); // Delete

module.exports = router;
