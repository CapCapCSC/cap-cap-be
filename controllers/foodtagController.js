const foodTagService = require('../services/foodTagService');
const logger = require('../utils/logger');

exports.createFoodTag = async (req, res, next) => {
    try {
        logger.info('Creating food tag request received', {
            body: req.body,
        });

        const foodTag = await foodTagService.create(req.body);
        logger.info('Food tag created successfully', {
            foodTagId: foodTag._id,
            name: foodTag.name,
        });

        res.status(201).json({ message: 'Food tag created', foodTag });
    } catch (error) {
        next(error);
    }
};

exports.getAllFoodTags = async (req, res, next) => {
    try {
        logger.info('Get all food tags request received');

        const foodTags = await foodTagService.getAll();
        logger.info('Food tags fetched successfully', {
            count: foodTags.length,
        });

        res.status(200).json(foodTags);
    } catch (error) {
        next(error);
    }
};

exports.getFoodTagById = async (req, res, next) => {
    try {
        logger.info('Get food tag by ID request received', {
            foodTagId: req.params.id,
        });

        const foodTag = await foodTagService.getById(req.params.id);
        logger.info('Food tag fetched successfully', {
            foodTagId: foodTag._id,
            name: foodTag.name,
        });

        res.status(200).json(foodTag);
    } catch (error) {
        next(error);
    }
};

exports.updateFoodTag = async (req, res, next) => {
    try {
        logger.info('Update food tag request received', {
            foodTagId: req.params.id,
            updateData: req.body,
        });

        const foodTag = await foodTagService.update(req.params.id, req.body);
        logger.info('Food tag updated successfully', {
            foodTagId: foodTag._id,
            name: foodTag.name,
        });

        res.status(200).json({ message: 'Food tag updated', foodTag });
    } catch (error) {
        next(error);
    }
};

exports.deleteFoodTag = async (req, res, next) => {
    try {
        logger.info('Delete food tag request received', {
            foodTagId: req.params.id,
        });

        await foodTagService.delete(req.params.id);
        logger.info('Food tag deleted successfully', {
            foodTagId: req.params.id,
        });

        res.status(200).json({ message: 'Food tag deleted' });
    } catch (error) {
        next(error);
    }
};
