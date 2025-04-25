const redis = require('../config/redis');
const logger = require('../utils/logger');

const cache = (duration) => {
    return async (req, res, next) => {
        try {
            // Tạo cache key dựa trên URL và query parameters
            const key = `cache:${req.originalUrl || req.url}`;

            // Kiểm tra cache
            const cachedData = await redis.get(key);

            if (cachedData) {
                logger.info('Cache hit', { key });
                return res.json(JSON.parse(cachedData));
            }

            // Lưu response gốc
            const originalJson = res.json;

            // Override res.json để cache response
            res.json = (body) => {
                // Cache response với thời gian hết hạn
                redis.setex(key, duration, JSON.stringify(body));
                logger.info('Cache miss - data cached', { key, duration });

                // Gọi hàm json gốc
                return originalJson.call(res, body);
            };

            next();
        } catch (error) {
            logger.error('Cache middleware error:', error);
            next();
        }
    };
};

// Middleware để xóa cache
const clearCache = async (req, res, next) => {
    try {
        // Xóa tất cả cache liên quan đến route
        const pattern = `cache:${req.baseUrl}*`;
        const keys = await redis.keys(pattern);

        if (keys.length > 0) {
            await redis.del(keys);
            logger.info('Cache cleared', { pattern, keys });
        }

        next();
    } catch (error) {
        logger.error('Clear cache error:', error);
        next();
    }
};

module.exports = {
    cache,
    clearCache,
};
