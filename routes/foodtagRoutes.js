const express = require('express');
const router = express.Router();
const foodTagController = require('../controllers/foodtagController');
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
router.get('/', cache(CACHE_DURATION), foodTagController.getAllFoodTags); // GET /api/foodtags
router.get('/:id', cache(CACHE_DURATION), foodTagController.getFoodTagById); // GET /api/foodtags/:id
//ADMIN
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createFoodTagSchema),
    foodTagController.createFoodTag,
); // POST /api/foodtags
router.put('/:id', clearCache, authMiddleware, adminMiddleware, foodTagController.updateFoodTag); // PUT /api/foodtags/:id
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, foodTagController.deleteFoodTag); // DELETE /api/foodtags/:id

module.exports = router;
