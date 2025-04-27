const Food = require('../models/food');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new food', {
            name: data.name,
            tags: data.tags,
        });

        const food = await Food.create(data);
        logger.info('Food created successfully', {
            foodId: food._id,
            name: food.name,
        });

        return food;
    } catch (error) {
        logger.error('Error creating food', {
            error: error.message,
            name: data.name,
        });
        throw error;
    }
};

exports.getAll = async (query) => {
    try {
        const { page = 1, limit = 10, tags } = query;
        const filter = tags ? { tags: { $in: tags.split(',') } } : {};

        logger.info('Fetching foods', {
            page,
            limit,
            tags: tags ? tags.split(',') : 'all',
        });

        const foods = await Food.find(filter)
            .populate('tags')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Food.countDocuments(filter);

        logger.info('Foods fetched successfully', {
            count: foods.length,
            total,
            page,
            limit,
        });

        return { data: foods, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching foods', {
            error: error.message,
            query,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching food by ID', { foodId: id });

        const food = await Food.findById(id).populate('tags');
        if (!food) {
            logger.warn('Food not found', { foodId: id });
            throw new AppError('Food not found', 404, 'NotFound');
        }

        logger.info('Food fetched successfully', {
            foodId: food._id,
            name: food.name,
        });

        return food;
    } catch (error) {
        logger.error('Error fetching food', {
            error: error.message,
            foodId: id,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating food', {
            foodId: id,
            updateData: data,
        });

        const food = await Food.findByIdAndUpdate(id, data, { new: true });
        if (!food) {
            logger.warn('Food not found for update', { foodId: id });
            throw new AppError('Food not found', 404, 'NotFound');
        }

        logger.info('Food updated successfully', {
            foodId: food._id,
            name: food.name,
        });

        return food;
    } catch (error) {
        logger.error('Error updating food', {
            error: error.message,
            foodId: id,
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting food', { foodId: id });

        const result = await Food.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Food not found for deletion', { foodId: id });
            throw new AppError('Food not found', 404, 'NotFound');
        }

        logger.info('Food deleted successfully', { foodId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting food', {
            error: error.message,
            foodId: id,
        });
        throw error;
    }
};

exports.getRandom = async () => {
    try {
        logger.info('Fetching random food');

        // First check if there are any foods in the database
        const count = await Food.countDocuments();

        if (count === 0) {
            return null;
        }

        const randomFood = await Food.aggregate([{ $sample: { size: 1 } }]);

        if (!randomFood || randomFood.length === 0) {
            logger.warn('No foods available for random selection');
            return null;
        }

        const food = randomFood[0];
        logger.info('Random food selected', {
            foodId: food._id,
            name: food.name,
        });

        return food;
    } catch (error) {
        console.error('FoodService.getRandom: Error:', error);
        logger.error('Error fetching random food', {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};
