const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');

//PUBLIC
router.get('/', voucherController.getAllVouchers); // Read all
router.get('/:id', voucherController.getVoucherById); // Read one

//ADMIN
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    validate(validator.createVoucherSchema),
    voucherController.createVoucher,
); // Create
router.put('/:id', authMiddleware, adminMiddleware, voucherController.updateVoucher); // Update
router.delete('/:id', authMiddleware, adminMiddleware, voucherController.deleteVoucher); // Delete

module.exports = router;
