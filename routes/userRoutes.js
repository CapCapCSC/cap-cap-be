const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');
const requestLogger = require('../middlewares/requestLogger');

// Apply request logging middleware
router.use(requestLogger);

//AUTHENTICATED
router.get('/:id', authMiddleware, userController.getUserById); // Read one

//ADMIN
router.post('/', authMiddleware, adminMiddleware, validate(validator.createUserSchema), userController.createUser); // Create
router.put('/:id', authMiddleware, adminMiddleware, validate(validator.updateUserSchema), userController.updateUser); // Update
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser); // Delete
router.post('/:id/badge', authMiddleware, adminMiddleware, userController.addBadge); // Add badge
router.post('/:id/voucher', authMiddleware, adminMiddleware, userController.addVoucher); // Add voucher

module.exports = router;
