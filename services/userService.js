const User = require('../models/user');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const userService = {
    async create(userData) {
        try {
            logger.info('Creating new user', { email: userData.email });

            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                logger.warn('User already exists', { email: userData.email });
                throw new AppError('User already exists', 400, 'ValidationError');
            }

            // Create user (password will be hashed by model's pre-save middleware)
            const user = await User.create(userData);

            logger.info('User created successfully', { userId: user._id });
            return user;
        } catch (error) {
            logger.error('Error creating user', { error: error.message, email: userData.email });
            throw error;
        }
    },

    getById: async (id) => {
        try {
            logger.info('Fetching user by ID', { userId: id });
            const user = await User.findById(id).select('username vouchers badges');
            if (!user) {
                logger.warn('User not found', { userId: id });
                return null;
            }
            logger.info('User fetched successfully', { userId: id });
            return user;
        } catch (error) {
            logger.error('Error fetching user', {
                error: error.message,
                userId: id,
            });
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            logger.info('Updating user', { userId: id });
            const user = await User.findByIdAndUpdate(id, data, { new: true });
            if (!user) {
                logger.warn('User not found for update', { userId: id });
                return null;
            }
            logger.info('User updated successfully', { userId: id });
            return user;
        } catch (error) {
            logger.error('Error updating user', {
                error: error.message,
                userId: id,
            });
            throw error;
        }
    },

    delete: async (id) => {
        try {
            logger.info('Deleting user', { userId: id });
            const result = await User.findByIdAndDelete(id);
            if (!result) {
                logger.warn('User not found for deletion', { userId: id });
                return false;
            }
            logger.info('User deleted successfully', { userId: id });
            return true;
        } catch (error) {
            logger.error('Error deleting user', {
                error: error.message,
                userId: id,
            });
            throw error;
        }
    },

    changeAvatar: async (userId, avatar) => {
        try {
            logger.info('Changing user avatar', { userId });
            const user = await User.findByIdAndUpdate(
                userId,
                { avatar },
                { new: true },
            ).select('_id avatar');

            if (!user) {
                logger.warn('User not found when changing avatar', { userId });
                throw new AppError('User not found', 404, 'NotFound');
            }

            logger.info('User avatar changed successfully', { userId });
            return user;
        }catch (error) {
            logger.error('Error changing user avatar', {
                error: error.message,
                userId,
            });
            throw error;
        }
    },

    addBadge: async (userId, badgeId) => {
        try {
            logger.info('Adding badge to user', { userId, badgeId });
            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { badges: badgeId } },
                { new: true },
            ).populate('badges');

            if (!user) {
                logger.warn('User not found when adding badge', { userId });
                throw new AppError('User not found', 404, 'NotFound');
            }

            logger.info('Badge added to user successfully', { userId, badgeId });
            return user;
        } catch (error) {
            logger.error('Error adding badge to user', {
                error: error.message,
                userId,
                badgeId,
            });
            throw error;
        }
    },

    addVoucher: async (userId, voucherId) => {
        try {
            logger.info('Adding voucher to user', { userId, voucherId });
            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { vouchers: voucherId } },
                { new: true },
            ).populate('vouchers');

            if (!user) {
                logger.warn('User not found when adding voucher', { userId });
                throw new AppError('User not found', 404, 'NotFound');
            }

            logger.info('Voucher added to user successfully', { userId, voucherId });
            return user;
        } catch (error) {
            logger.error('Error adding voucher to user', {
                error: error.message,
                userId,
                voucherId,
            });
            throw error;
        }
    },
};

module.exports = userService;
