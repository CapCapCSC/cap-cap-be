const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

// Apply request logger middleware
router.use(requestLogger);

//PUBLIC
router.get('/', restaurantController.getAllRestaurants); // GET /api/restaurants
router.get('/:id', restaurantController.getRestaurantById); // GET /api/restaurant/:id
router.get('/random', restaurantController.getRandom3Restaurants); // GET /api/restaurant/random

//ADMIN
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    validate(validator.createRestaurantSchema),
    restaurantController.createRestaurant,
); // POST /api/restaurant
router.put('/:id', authMiddleware, adminMiddleware, restaurantController.updateRestaurant); // PUT /api/restaurant/:id
router.delete('/:id', authMiddleware, adminMiddleware, restaurantController.deleteRestaurant); // DELETE /api/restaurant/:id

module.exports = router;
