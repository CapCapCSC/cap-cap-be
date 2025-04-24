const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Authentication failed - No token provided', {
                path: req.originalUrl,
                method: req.method
            });
            throw new AppError('No token provided', 401, 'AuthenticationError');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            
            const user = await User.findById(decoded.id);
            if (!user) {
                logger.warn('Authentication failed - User not found', {
                    userId: decoded.id,
                    path: req.originalUrl,
                    method: req.method
                });
                throw new AppError('User not found', 401, 'AuthenticationError');
            }

            // Log successful authentication
            logger.info('User authenticated', {
                userId: user._id,
                path: req.originalUrl,
                method: req.method
            });

            req.user = user;
            next();
        } catch (err) {
            logger.warn('Authentication failed - Invalid token', {
                error: err.message,
                path: req.originalUrl,
                method: req.method
            });
            throw new AppError('Invalid token', 401, 'AuthenticationError');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;
