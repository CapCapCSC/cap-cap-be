const Voucher = require('../models/voucher');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new voucher', {
            code: data.code,
            discount: data.discount,
            expiryDate: data.expiryDate,
        });

        const voucher = await Voucher.create(data);

        logger.info('Voucher created successfully', {
            voucherId: voucher._id,
            code: voucher.code,
        });

        return voucher;
    } catch (error) {
        logger.error('Error creating voucher', {
            error: error.message,
            code: data.code,
        });
        throw error;
    }
};

exports.getAll = async (query) => {
    try {
        const { page = 1, limit = 10, tags } = query;
        const filter = tags ? { tags: { $in: tags.split(',') } } : {};

        logger.info('Fetching vouchers', {
            page,
            limit,
            tags: tags ? tags.split(',') : 'all',
        });

        const vouchers = await Voucher.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Voucher.countDocuments(filter);

        logger.info('Vouchers fetched successfully', {
            count: vouchers.length,
            total,
            page,
            limit,
        });

        return { data: vouchers, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching vouchers', {
            error: error.message,
            query,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching voucher by ID', { voucherId: id });

        const voucher = await Voucher.findById(id);
        if (!voucher) {
            logger.warn('Voucher not found', { voucherId: id });
            throw new AppError('Voucher not found', 404, 'NotFound');
        }

        logger.info('Voucher fetched successfully', {
            voucherId: voucher._id,
            code: voucher.code,
        });

        return voucher;
    } catch (error) {
        logger.error('Error fetching voucher', {
            error: error.message,
            voucherId: id,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating voucher', {
            voucherId: id,
            updateData: data,
        });

        const voucher = await Voucher.findByIdAndUpdate(id, data, { new: true });
        if (!voucher) {
            logger.warn('Voucher not found for update', { voucherId: id });
            throw new AppError('Voucher not found', 404, 'NotFound');
        }

        logger.info('Voucher updated successfully', {
            voucherId: voucher._id,
            code: voucher.code,
        });

        return voucher;
    } catch (error) {
        logger.error('Error updating voucher', {
            error: error.message,
            voucherId: id,
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting voucher', { voucherId: id });

        const result = await Voucher.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Voucher not found for deletion', { voucherId: id });
            throw new AppError('Voucher not found', 404, 'NotFound');
        }

        logger.info('Voucher deleted successfully', { voucherId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting voucher', {
            error: error.message,
            voucherId: id,
        });
        throw error;
    }
};
