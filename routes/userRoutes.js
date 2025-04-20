const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser); // Create
router.get('/:id', userController.getuserById); // Read one
router.put('/:id', userController.updateUser); // Update
router.delete('/:id', userController.deleteuser); // Delete

module.exports = router;
