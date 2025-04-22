const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

//AUTHENTICATED
router.get('/:id', authMiddleware, userController.getUserById); // Read one

//ADMIN
router.post('/', authMiddleware, adminMiddleware, userController.createUser); // Create
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser); // Update
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser); // Delete
router.post('/:id/badge', authMiddleware, adminMiddleware, userController.addBadge); // Add badge
router.post('/:id/voucher', authMiddleware, adminMiddleware, userController.addVoucher); // Add voucher

module.exports = router;
