const Redis = require('ioredis');
const logger = require('../utils/logger');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on('connect', () => {
    logger.info('Redis connected successfully');
});

redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

module.exports = redis;
