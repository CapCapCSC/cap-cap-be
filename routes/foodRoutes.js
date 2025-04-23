const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

//PUBLIC
router.get('/', foodController.getAllFoods); // Read all
router.get('/:id', foodController.getFoodById); // Read one
router.get('/random', foodController.getRandomFood); // GET /api/foods/random

//ADMIN
router.post('/', authMiddleware, adminMiddleware, validate(validator.createFoodSchema), foodController.createFood); // Create
router.put('/:id', authMiddleware, adminMiddleware, foodController.updateFood); // Update
router.delete('/:id', authMiddleware, adminMiddleware, foodController.deleteFood); // Delete

module.exports = router;
