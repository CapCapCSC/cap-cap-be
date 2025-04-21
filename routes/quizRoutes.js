const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.createQuiz); // Create
router.get('/', quizController.getAllQuizzes); // Read all
router.get('/:id', quizController.getQuizById); // Read one
router.put('/:id', quizController.updateQuiz); // Update
router.delete('/:id', quizController.deleteQuiz); // Delete

router.post('/:id/submit', quizController.submitQuiz); // Submit quiz

module.exports = router;
