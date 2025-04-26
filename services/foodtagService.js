const FoodTag = require('../models/foodTag');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new food tag', {
            name: data.name,
            description: data.description,
        });

        const foodTag = await FoodTag.create(data);
        logger.info('Food tag created successfully', {
            foodTagId: foodTag._id,
            name: foodTag.name,
        });

        return foodTag;
    } catch (error) {
        logger.error('Error creating food tag', {
            error: error.message,
            name: data.name,
        });
        throw error;
    }
};

exports.getAll = async () => {
    try {
        logger.info('Fetching all food tags');

        const foodTags = await FoodTag.find();
        logger.info('Food tags fetched successfully', {
            count: foodTags.length,
        });

        return foodTags;
    } catch (error) {
        logger.error('Error fetching food tags', {
            error: error.message,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching food tag by ID', { foodTagId: id });

        const foodTag = await FoodTag.findById(id);
        if (!foodTag) {
            logger.warn('Food tag not found', { foodTagId: id });
            throw new AppError('Food tag not found', 404, 'NotFound');
        }

        logger.info('Food tag fetched successfully', {
            foodTagId: foodTag._id,
            name: foodTag.name,
        });

        return foodTag;
    } catch (error) {
        logger.error('Error fetching food tag', {
            error: error.message,
            foodTagId: id,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating food tag', {
            foodTagId: id,
            updateData: data,
        });

        const foodTag = await FoodTag.findByIdAndUpdate(id, data, { new: true });
        if (!foodTag) {
            logger.warn('Food tag not found for update', { foodTagId: id });
            throw new AppError('Food tag not found', 404, 'NotFound');
        }

        logger.info('Food tag updated successfully', {
            foodTagId: foodTag._id,
            name: foodTag.name,
        });

        return foodTag;
    } catch (error) {
        logger.error('Error updating food tag', {
            error: error.message,
            foodTagId: id,
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting food tag', { foodTagId: id });

        const result = await FoodTag.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Food tag not found for deletion', { foodTagId: id });
            throw new AppError('Food tag not found', 404, 'NotFound');
        }

        logger.info('Food tag deleted successfully', { foodTagId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting food tag', {
            error: error.message,
            foodTagId: id,
        });
        throw error;
    }
};
