const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
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
router.get('/', cache(CACHE_DURATION), badgeController.getAllBadges); // Read all
router.get('/:id', cache(CACHE_DURATION), badgeController.getBadgeById); // Read one

//ADMIN
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createBadgeSchema),
    badgeController.createBadge,
); // Create
router.put('/:id', clearCache, authMiddleware, adminMiddleware, badgeController.updateBadge); // Update
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, badgeController.deleteBadge); // Delete

module.exports = router;
