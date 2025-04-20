const express = require('express');
const router = express.Router();
const foodTagController = require('../controllers/foodtagController');

router.post('/', foodTagController.createFoodTag); // POST /api/foodtags
router.get('/', foodTagController.getAllFoodTags); // GET /api/foodtags
router.get('/:id', foodTagController.getFoodTagById); // GET /api/foodtags/:id
router.put('/:id', foodTagController.updateFoodTag); // PUT /api/foodtags/:id
router.delete('/:id', foodTagController.deleteFoodTag); // DELETE /api/foodtags/:id

module.exports = router;
