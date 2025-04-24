const Badge = require('../models/badge');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new badge', { 
            name: data.name,
            type: data.type 
        });
        
        const badge = await Badge.create(data);
        logger.info('Badge created successfully', { 
            badgeId: badge._id,
            name: badge.name 
        });
        
        return badge;
    } catch (error) {
        logger.error('Error creating badge', { 
            error: error.message,
            name: data.name 
        });
        throw error;
    }
};

exports.getAll = async (query) => {
    try {
        const { page = 1, limit = 10, tags } = query;
        const filter = tags ? { tags: { $in: tags.split(',') } } : {};

        logger.info('Fetching badges', { 
            page,
            limit,
            tags: tags ? tags.split(',') : 'all'
        });

        const badges = await Badge.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
            
        const total = await Badge.countDocuments(filter);

        logger.info('Badges fetched successfully', { 
            count: badges.length,
            total,
            page,
            limit 
        });

        return { data: badges, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching badges', { 
            error: error.message,
            query 
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching badge by ID', { badgeId: id });
        
        const badge = await Badge.findById(id);
        if (!badge) {
            logger.warn('Badge not found', { badgeId: id });
            throw new AppError('Badge not found', 404, 'NotFound');
        }

        logger.info('Badge fetched successfully', { 
            badgeId: badge._id,
            name: badge.name 
        });
        
        return badge;
    } catch (error) {
        logger.error('Error fetching badge', { 
            error: error.message,
            badgeId: id 
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating badge', { 
            badgeId: id,
            updateData: data 
        });
        
        const badge = await Badge.findByIdAndUpdate(id, data, { new: true });
        if (!badge) {
            logger.warn('Badge not found for update', { badgeId: id });
            throw new AppError('Badge not found', 404, 'NotFound');
        }

        logger.info('Badge updated successfully', { 
            badgeId: badge._id,
            name: badge.name 
        });
        
        return badge;
    } catch (error) {
        logger.error('Error updating badge', { 
            error: error.message,
            badgeId: id 
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting badge', { badgeId: id });
        
        const result = await Badge.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Badge not found for deletion', { badgeId: id });
            throw new AppError('Badge not found', 404, 'NotFound');
        }

        logger.info('Badge deleted successfully', { badgeId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting badge', { 
            error: error.message,
            badgeId: id 
        });
        throw error;
    }
};
