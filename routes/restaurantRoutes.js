const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');
const { cache, clearCache } = require('../middlewares/cache');

const CACHE_DURATION = 3600; // 1 hour
// Apply request logger middleware
router.use(requestLogger);

//PUBLIC
router.get('/', cache(CACHE_DURATION), restaurantController.getAllRestaurants); // GET /api/restaurants
router.get('/:id', cache(CACHE_DURATION), restaurantController.getRestaurantById); // GET /api/restaurant/:id
router.get('/random', cache(CACHE_DURATION), restaurantController.getRandom3Restaurants); // GET /api/restaurant/random

//ADMIN
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createRestaurantSchema),
    restaurantController.createRestaurant,
); // POST /api/restaurant
router.put('/:id', clearCache, authMiddleware, adminMiddleware, restaurantController.updateRestaurant); // PUT /api/restaurant/:id
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, restaurantController.deleteRestaurant); // DELETE /api/restaurant/:id

module.exports = router;
