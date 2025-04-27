const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    try {
        // Log error details
        logger.error('Error occurred', {
            error: {
                name: err.name,
                message: err.message,
                status: err.status || 500,
                stack: err.stack,
            },
            request: {
                path: req.originalUrl,
                method: req.method,
                body: req.body,
                query: req.query,
                params: req.params,
                user: req.user?._id,
            },
        });

        // Handle AppError instances
        if (err instanceof AppError) {
            return res.status(err.status).json({
                status: err.status,
                message: err.message,
                error: err.name,
            });
        }

        // Handle Joi validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                status: 400,
                message: err.message,
                error: 'ValidationError',
            });
        }

        // Handle JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 401,
                message: 'Invalid token',
                error: 'UnauthorizedError',
            });
        }

        // Handle JWT expired errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 401,
                message: 'Token expired',
                error: 'UnauthorizedError',
            });
        }

        // Handle MongoDB duplicate key errors
        if (err.code === 11000) {
            return res.status(400).json({
                status: 400,
                message: 'Duplicate key error',
                error: 'DuplicateKeyError',
            });
        }

        // Handle other errors
        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: 'InternalServerError',
        });
    } catch (error) {
        // If error occurs in error handler, log it and send generic error
        logger.error('Error in error handler', {
            originalError: err,
            handlerError: error,
        });

        return res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: 'InternalServerError',
        });
    }
};

module.exports = errorHandler;
