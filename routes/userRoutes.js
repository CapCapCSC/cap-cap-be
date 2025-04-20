const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createuser); // Create
router.get('/:id', userController.getuserById); // Read one
router.put('/:id', userController.updateuser); // Update
router.delete('/:id', userController.deleteuser); // Delete

module.exports = router;
