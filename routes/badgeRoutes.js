const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');

router.post('/', badgeController.createBadge); // Create
router.get('/', badgeController.getAllBadges); // Read all
router.get('/:id', badgeController.getBadgeById); // Read one
router.put('/:id', badgeController.updateBadge); // Update
router.delete('/:id', badgeController.deleteBadge); // Delete

module.exports = router;
