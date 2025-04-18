const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.post('/', foodController.createFood); // Create
router.get('/', foodController.getAllFoods); // Read all
router.get('/:id', foodController.getFoodById); // Read one
router.put('/:id', foodController.updateFood); // Update
router.delete('/:id', foodController.deleteFood); // Delete

module.exports = router;