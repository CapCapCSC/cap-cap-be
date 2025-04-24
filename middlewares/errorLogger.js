const logger = require('../utils/logger');

const errorLogger = (err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    logger.error(err.stack);
    next(err);
};

module.exports = errorLogger; 