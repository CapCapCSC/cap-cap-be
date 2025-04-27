const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const adminMiddleware = (req, res, next) => {
    try {
        logger.info('Checking admin access', {
            userId: req.user?._id,
            path: req.originalUrl,
            method: req.method,
        });

        if (req.user && req.user.role === 'admin') {
            logger.info('Admin access granted', {
                userId: req.user._id,
                path: req.originalUrl,
                method: req.method,
            });
            next();
        } else {
            logger.warn('Admin access denied', {
                userId: req.user?._id,
                path: req.originalUrl,
                method: req.method,
            });
            throw new AppError('Admin access required', 403, 'ForbiddenError');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = adminMiddleware;
