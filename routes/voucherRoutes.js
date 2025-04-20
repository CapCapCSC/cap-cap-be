const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

router.post('/', voucherController.createVoucher); // Create
router.get('/', voucherController.getAllVouchers); // Read all
router.get('/:id', voucherController.getVoucherById); // Read one
router.put('/:id', voucherController.updateVoucher); // Update
router.delete('/:id', voucherController.deleteVoucher); // Delete

module.exports = router;
