const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const validator = require('../middlewares/validationSchemas');
const validate = require('../middlewares/validate');
const { cache, clearCache } = require('../middlewares/cache');

const CACHE_DURATION = 3600; // 1 hour
// Apply request logger middleware
router.use(requestLogger);

//PUBLIC
router.get('/', cache(CACHE_DURATION), voucherController.getAllVouchers); // Read all
router.get('/:id', cache(CACHE_DURATION), voucherController.getVoucherById); // Read one

//ADMIN
router.post(
    '/',
    clearCache,
    authMiddleware,
    adminMiddleware,
    validate(validator.createVoucherSchema),
    voucherController.createVoucher,
); // Create
router.put('/:id', clearCache, authMiddleware, adminMiddleware, voucherController.updateVoucher); // Update
router.delete('/:id', clearCache, authMiddleware, adminMiddleware, voucherController.deleteVoucher); // Delete

module.exports = router;
