const logger = require('../utils/logger');
const mongoose = require('mongoose');

const dbLogger = () => {
    // Log database connection events
    mongoose.connection.on('connected', () => {
        logger.info('Database connected', {
            host: mongoose.connection.host,
            port: mongoose.connection.port,
            name: mongoose.connection.name,
        });
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected');
    });

    mongoose.connection.on('error', (err) => {
        logger.error('Database error', {
            error: {
                name: err.name,
                message: err.message,
                stack: err.stack,
            },
        });
    });

    // Log query execution
    mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.info('Database query', {
            collection: collectionName,
            operation: method,
            query: query,
            document: doc,
            timestamp: new Date().toISOString(),
        });
    });

    // Log slow queries
    mongoose.set('slowQuery', {
        threshold: 100, // milliseconds
        callback: (collectionName, method, query, executionTime) => {
            logger.warn('Slow database query', {
                collection: collectionName,
                operation: method,
                query: query,
                executionTime: `${executionTime}ms`,
                timestamp: new Date().toISOString(),
            });
        },
    });

    return (req, res, next) => {
        // Log request timing for database operations
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            if (duration > 100) {
                // Log slow requests
                logger.warn('Slow database request', {
                    path: req.originalUrl,
                    method: req.method,
                    duration: `${duration}ms`,
                    userId: req.user?._id,
                });
            }
        });

        next();
    };
};

module.exports = dbLogger;
