const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/', restaurantController.createRestaurant); // POST /api/restaurant
router.get('/', restaurantController.getAllRestaurants); // GET /api/restaurants
router.get('/:id', restaurantController.getRestaurantById); // GET /api/restaurant/:id
router.get('/random', restaurantController.getRandom3Restaurants); // GET /api/restaurant/random
router.put('/:id', restaurantController.updateRestaurant); // PUT /api/restaurant/:id
router.delete('/:id', restaurantController.deleteRestaurant); // DELETE /api/restaurant/:id

module.exports = router;
