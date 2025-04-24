const logger = require('../utils/logger');

const errorLogger = (err, req, res, next) => {
    // Log error details
    logger.error('Error occurred', {
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
            status: err.status || 500,
        },
        request: {
            method: req.method,
            path: req.originalUrl,
            body: req.body,
            query: req.query,
            params: req.params,
            headers: {
                'content-type': req.get('content-type'),
                authorization: req.get('authorization') ? 'Bearer ***' : undefined,
            },
        },
        user: req.user?._id,
        timestamp: new Date().toISOString(),
    });

    next(err);
};

module.exports = errorLogger;
