const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

//ADMIN
router.post('/', authMiddleware, adminMiddleware, validate(validator.createQuestionSchema), questionController.createQuestion); // Create
router.get('/', authMiddleware, adminMiddleware, questionController.getAllQuestions); // Read all
router.get('/:id', authMiddleware, adminMiddleware, questionController.getQuestionById); // Read one
router.put('/:id', authMiddleware, adminMiddleware, questionController.updateQuestion); // Update
router.delete('/:id', authMiddleware, adminMiddleware, questionController.deleteQuestion); // Delete

module.exports = router;
