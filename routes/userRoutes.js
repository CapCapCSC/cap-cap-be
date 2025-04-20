const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser); // Create
router.get('/:id', userController.getUserById); // Read one
router.put('/:id', userController.updateUser); // Update
router.delete('/:id', userController.deleteUser); // Delete

module.exports = router;
