const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requestLogger = require('../middlewares/requestLogger');

// Apply request logging middleware
router.use(requestLogger);

//PUBLIC
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
