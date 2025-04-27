const UserService = require('../services/userService');
const logger = require('../utils/logger');
const { uploadAvatar } = require('../controllers/uploadController');

exports.createUser = async (req, res, next) => {
    try {
        logger.info('Creating new user request received', {
            body: { ...req.body, password: '[REDACTED]' },
        });
        const user = await UserService.create(req.body);
        logger.info('User created successfully', { userId: user._id });
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        logger.info('Get user by ID request received', { userId: req.params.id });
        const user = await UserService.getById(req.params.id);
        logger.info('User fetched successfully', { userId: user._id });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        logger.info('Update user request received', {
            userId: req.params.id,
            updateData: { ...req.body, password: req.body.password ? '[REDACTED]' : undefined },
        });
        const user = await UserService.update(req.params.id, req.body);
        logger.info('User updated successfully', { userId: user._id });
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        logger.info('Delete user request received', { userId: req.params.id });
        await UserService.delete(req.params.id);
        logger.info('User deleted successfully', { userId: req.params.id });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

exports.changeAvatar = async (req, res, next) => {
    try {
        logger.info('Change avatar request received', {
            userId: req.params.id,
        });
        const result = await uploadAvatar(req, res);
        if (!result) {
            logger.warn('Avatar upload failed', { userId: req.params.id });
            return res.status(400).json({ message: 'Avatar upload failed' });
        }
        const user = await UserService.changeAvatar(req.params.id, result.secure_url);
        logger.info('Avatar changed successfully', { userId: user._id });
        res.status(200).json({ message: 'Avatar changed', user });
    } catch (error) {
        next(error);
    }
};

exports.addBadge = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { badgeId } = req.body;

        logger.info('Add badge to user request received', {
            userId: id,
            badgeId,
        });

        const user = await UserService.addBadge(id, badgeId);
        logger.info('Badge added to user successfully', {
            userId: id,
            badgeId,
        });

        res.status(200).json({ message: 'Badge added to user', user });
    } catch (error) {
        next(error);
    }
};

exports.addVoucher = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { voucherId } = req.body;

        logger.info('Add voucher to user request received', {
            userId: id,
            voucherId,
        });

        const user = await UserService.addVoucher(id, voucherId);
        logger.info('Voucher added to user successfully', {
            userId: id,
            voucherId,
        });

        res.status(200).json({ message: 'Voucher added to user', user });
    } catch (error) {
        next(error);
    }
};
