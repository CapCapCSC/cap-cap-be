const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

//PUBLIC
router.get('/', foodController.getAllFoods); // Read all
router.get('/:id', foodController.getFoodById); // Read one

//ADMIN
router.post('/', authMiddleware, adminMiddleware, foodController.createFood); // Create
router.put('/:id', authMiddleware, adminMiddleware, foodController.updateFood); // Update
router.delete('/:id', authMiddleware, adminMiddleware, foodController.deleteFood); // Delete

module.exports = router;
