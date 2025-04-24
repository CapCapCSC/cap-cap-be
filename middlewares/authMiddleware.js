const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const authMiddleware = async (req, res, next) => {
    try {
        logger.info('Checking authentication', {
            path: req.originalUrl,
            method: req.method,
        });

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            logger.warn('No token provided', {
                path: req.originalUrl,
                method: req.method,
            });
            throw new AppError('No token provided', 401, 'UnauthorizedError');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            logger.warn('User not found', {
                path: req.originalUrl,
                method: req.method,
                userId: decoded.userId,
            });
            throw new AppError('User not found', 401, 'UnauthorizedError');
        }

        req.user = user;
        logger.info('Authentication successful', {
            path: req.originalUrl,
            method: req.method,
            userId: user._id,
        });
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid token', {
                path: req.originalUrl,
                method: req.method,
                error: error.message,
            });
            throw new AppError('Invalid token', 401, 'UnauthorizedError');
        }
        if (error.name === 'TokenExpiredError') {
            logger.warn('Token expired', {
                path: req.originalUrl,
                method: req.method,
            });
            throw new AppError('Token expired', 401, 'UnauthorizedError');
        }
        next(error);
    }
};

module.exports = authMiddleware;
