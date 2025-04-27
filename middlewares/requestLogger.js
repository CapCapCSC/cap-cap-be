const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request details
    logger.info('Incoming request', {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.body,
        query: req.query,
        params: req.params,
        headers: {
            'content-type': req.get('content-type'),
            authorization: req.get('authorization') ? 'Bearer ***' : undefined,
        },
    });

    // Capture response data
    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - start;

        // Log response details
        logger.info('Outgoing response', {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            response: body,
            userId: req.user?._id,
        });

        return originalSend.call(this, body);
    };

    next();
};

module.exports = requestLogger;
