const morgan = require('morgan');
const logger = require('../utils/logger');

const requestLogger = morgan('combined', {
    stream: logger.stream,
    skip: (req, res) => res.statusCode >= 400 // Skip logging errors, they will be handled by errorLogger
});

module.exports = requestLogger; 