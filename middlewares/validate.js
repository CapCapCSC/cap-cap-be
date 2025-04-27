const Joi = require('joi');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const validate = (schema) => {
    return (req, res, next) => {
        try {
            logger.info('Validating request body', {
                path: req.originalUrl,
                method: req.method,
                body: req.body,
            });

            const { error } = schema.validate(req.body);
            if (error) {
                logger.warn('Validation failed', {
                    path: req.originalUrl,
                    method: req.method,
                    error: error.details[0].message,
                });
                throw new AppError(error.details[0].message, 400, 'ValidationError');
            }

            logger.info('Validation successful', {
                path: req.originalUrl,
                method: req.method,
            });

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validate;
