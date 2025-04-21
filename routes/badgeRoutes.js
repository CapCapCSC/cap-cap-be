const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

//PUBLIC
router.get('/', badgeController.getAllBadges); // Read all
router.get('/:id', badgeController.getBadgeById); // Read one

//ADMIN
router.post('/', authMiddleware, adminMiddleware, badgeController.createBadge); // Create
router.put('/:id', authMiddleware, adminMiddleware, badgeController.updateBadge); // Update
router.delete('/:id', authMiddleware, adminMiddleware, badgeController.deleteBadge); // Delete

module.exports = router;
