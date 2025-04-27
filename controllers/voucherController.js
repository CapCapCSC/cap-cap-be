const VoucherService = require('../services/voucherService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.createVoucher = async (req, res, next) => {
    try {
        logger.info('Creating new voucher', {
            code: req.body.code,
            discount: req.body.discount,
            path: req.path,
            method: req.method,
        });

        const voucher = await VoucherService.create(req.body);

        logger.info('Voucher created successfully', {
            voucherId: voucher._id,
            code: voucher.code,
        });

        res.status(201).json({ message: 'Voucher created', voucher });
    } catch (error) {
        logger.error('Error creating voucher', {
            error: error.message,
            code: req.body.code,
        });
        next(error);
    }
};

exports.getAllVouchers = async (req, res, next) => {
    try {
        logger.info('Fetching all vouchers', {
            query: req.query,
            path: req.path,
            method: req.method,
        });

        const vouchers = await VoucherService.getAll(req.query);

        logger.info('Vouchers fetched successfully', {
            count: vouchers.data.length,
            total: vouchers.pagination.total,
        });

        res.status(200).json(vouchers);
    } catch (error) {
        logger.error('Error fetching vouchers', {
            error: error.message,
            query: req.query,
        });
        next(error);
    }
};

exports.getVoucherById = async (req, res, next) => {
    try {
        logger.info('Fetching voucher by ID', {
            voucherId: req.params.id,
            path: req.path,
            method: req.method,
        });

        const voucher = await VoucherService.getById(req.params.id);

        logger.info('Voucher fetched successfully', {
            voucherId: voucher._id,
            code: voucher.code,
        });

        res.status(200).json(voucher);
    } catch (error) {
        logger.error('Error fetching voucher', {
            error: error.message,
            voucherId: req.params.id,
        });
        next(error);
    }
};

exports.updateVoucher = async (req, res, next) => {
    try {
        logger.info('Updating voucher', {
            voucherId: req.params.id,
            updateData: req.body,
            path: req.path,
            method: req.method,
        });

        const voucher = await VoucherService.update(req.params.id, req.body);

        logger.info('Voucher updated successfully', {
            voucherId: voucher._id,
            code: voucher.code,
        });

        res.status(200).json({ message: 'Voucher updated', voucher });
    } catch (error) {
        logger.error('Error updating voucher', {
            error: error.message,
            voucherId: req.params.id,
        });
        next(error);
    }
};

exports.deleteVoucher = async (req, res, next) => {
    try {
        logger.info('Deleting voucher', {
            voucherId: req.params.id,
            path: req.path,
            method: req.method,
        });

        await VoucherService.delete(req.params.id);

        logger.info('Voucher deleted successfully', {
            voucherId: req.params.id,
        });

        res.status(200).json({ message: 'Voucher deleted' });
    } catch (error) {
        logger.error('Error deleting voucher', {
            error: error.message,
            voucherId: req.params.id,
        });
        next(error);
    }
};
