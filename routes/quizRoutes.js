const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.createQuestion); // Create
router.get('/', quizController.getAllQuestions); // Read all
router.get('/:id', quizController.getQuestionById); // Read one
router.put('/:id', quizController.updateQuestion); // Update
router.delete('/:id', quizController.deleteQuestion); // Delete

module.exports = router;
