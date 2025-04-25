const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
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
router.get('/', cache(CACHE_DURATION), foodController.getAllFoods); // Read all
router.get('/:id', cache(CACHE_DURATION), foodController.getFoodById); // Read one
router.get('/random', cache(CACHE_DURATION), foodController.getRandomFood); // GET /api/foods/random

//ADMIN
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createFoodSchema),
    foodController.createFood,
); // Create
router.put('/:id', clearCache, authMiddleware, adminMiddleware, foodController.updateFood); // Update
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, foodController.deleteFood); // Delete

module.exports = router;
