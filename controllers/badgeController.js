const BadgeService = require('../services/badgeService');
const logger = require('../utils/logger');

exports.createBadge = async (req, res, next) => {
    try {
        logger.info('Creating badge request received', { 
            body: req.body 
        });
        
        const badge = await BadgeService.create(req.body);
        logger.info('Badge created successfully', { 
            badgeId: badge._id,
            name: badge.name 
        });
        
        res.status(201).json({ message: 'Badge created', badge });
    } catch (error) {
        next(error);
    }
};

exports.getAllBadges = async (req, res, next) => {
    try {
        logger.info('Get all badges request received', { 
            query: req.query 
        });
        
        const badges = await BadgeService.getAll(req.query);
        logger.info('Badges fetched successfully', { 
            count: badges.data.length,
            total: badges.pagination.total 
        });
        
        res.status(200).json(badges);
    } catch (error) {
        next(error);
    }
};

exports.getBadgeById = async (req, res, next) => {
    try {
        logger.info('Get badge by ID request received', { 
            badgeId: req.params.id 
        });
        
        const badge = await BadgeService.getById(req.params.id);
        logger.info('Badge fetched successfully', { 
            badgeId: badge._id,
            name: badge.name 
        });
        
        res.status(200).json(badge);
    } catch (error) {
        next(error);
    }
};

exports.updateBadge = async (req, res, next) => {
    try {
        logger.info('Update badge request received', { 
            badgeId: req.params.id,
            updateData: req.body 
        });
        
        const badge = await BadgeService.update(req.params.id, req.body);
        logger.info('Badge updated successfully', { 
            badgeId: badge._id,
            name: badge.name 
        });
        
        res.status(200).json({ message: 'Badge updated', badge });
    } catch (error) {
        next(error);
    }
};

exports.deleteBadge = async (req, res, next) => {
    try {
        logger.info('Delete badge request received', { 
            badgeId: req.params.id 
        });
        
        await BadgeService.delete(req.params.id);
        logger.info('Badge deleted successfully', { 
            badgeId: req.params.id 
        });
        
        res.status(200).json({ message: 'Badge deleted' });
    } catch (error) {
        next(error);
    }
};
