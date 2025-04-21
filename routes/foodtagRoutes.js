const express = require('express');
const router = express.Router();
const foodTagController = require('../controllers/foodtagController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

//PUBLIC
router.get('/', foodTagController.getAllFoodTags); // GET /api/foodtags
router.get('/:id', foodTagController.getFoodTagById); // GET /api/foodtags/:id
//ADMIN
router.post('/', authMiddleware, adminMiddleware, foodTagController.createFoodTag); // POST /api/foodtags
router.put('/:id', authMiddleware, adminMiddleware, foodTagController.updateFoodTag); // PUT /api/foodtags/:id
router.delete('/:id', authMiddleware, adminMiddleware, foodTagController.deleteFoodTag); // DELETE /api/foodtags/:id

module.exports = router;
