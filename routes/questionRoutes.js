const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/', questionController.createQuestion); // Create
router.get('/', questionController.getAllQuestions); // Read all
router.get('/:id', questionController.getQuestionById); // Read one
router.put('/:id', questionController.updateQuestion); // Update
router.delete('/:id', questionController.deleteQuestion); // Delete

module.exports = router;
