const Restaurant = require('../models/restaurant');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.create = async (data) => {
    try {
        logger.info('Creating new restaurant', {
            name: data.name,
            district: data.district,
            tags: data.tags,
        });

        const restaurant = await Restaurant.create(data);

        logger.info('Restaurant created successfully', {
            restaurantId: restaurant._id,
            name: restaurant.name,
        });

        return restaurant;
    } catch (error) {
        logger.error('Error creating restaurant', {
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

        logger.info('Fetching restaurants', {
            page,
            limit,
            tags: tags ? tags.split(',') : 'all',
        });

        const restaurants = await Restaurant.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Restaurant.countDocuments(filter);

        logger.info('Restaurants fetched successfully', {
            count: restaurants.length,
            total,
            page,
            limit,
        });

        return { data: restaurants, pagination: { page, limit, total } };
    } catch (error) {
        logger.error('Error fetching restaurants', {
            error: error.message,
            query,
        });
        throw error;
    }
};

exports.getById = async (id) => {
    try {
        logger.info('Fetching restaurant by ID', { restaurantId: id });

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            logger.warn('Restaurant not found', { restaurantId: id });
            throw new AppError('Restaurant not found', 404, 'NotFound');
        }

        logger.info('Restaurant fetched successfully', {
            restaurantId: restaurant._id,
            name: restaurant.name,
        });

        return restaurant;
    } catch (error) {
        logger.error('Error fetching restaurant', {
            error: error.message,
            restaurantId: id,
        });
        throw error;
    }
};

exports.getRandom3 = async (filters) => {
    try {
        logger.info('Fetching random 3 restaurants', {
            districtId: filters.districtId,
        });

        const matchStage = {};
        if (filters.districtId) {
            matchStage.districtId = filters.districtId;
        }

        const restaurants = await Restaurant.aggregate([{ $match: matchStage }, { $sample: { size: 3 } }]);

        if (!restaurants || restaurants.length === 0) {
            logger.warn('No restaurants found for random selection', {
                districtId: filters.districtId,
            });
            return [];
        }

        logger.info('Random restaurants fetched successfully', {
            count: restaurants.length,
            districtId: filters.districtId,
        });

        return restaurants;
    } catch (error) {
        logger.error('Error fetching random restaurants', {
            error: error.message,
            filters,
        });
        throw error;
    }
};

exports.update = async (id, data) => {
    try {
        logger.info('Updating restaurant', {
            restaurantId: id,
            updateData: data,
        });

        const restaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true });
        if (!restaurant) {
            logger.warn('Restaurant not found for update', { restaurantId: id });
            throw new AppError('Restaurant not found', 404, 'NotFound');
        }

        logger.info('Restaurant updated successfully', {
            restaurantId: restaurant._id,
            name: restaurant.name,
        });

        return restaurant;
    } catch (error) {
        logger.error('Error updating restaurant', {
            error: error.message,
            restaurantId: id,
        });
        throw error;
    }
};

exports.delete = async (id) => {
    try {
        logger.info('Deleting restaurant', { restaurantId: id });

        const result = await Restaurant.findByIdAndDelete(id);
        if (!result) {
            logger.warn('Restaurant not found for deletion', { restaurantId: id });
            throw new AppError('Restaurant not found', 404, 'NotFound');
        }

        logger.info('Restaurant deleted successfully', { restaurantId: id });
        return true;
    } catch (error) {
        logger.error('Error deleting restaurant', {
            error: error.message,
            restaurantId: id,
        });
        throw error;
    }
};

exports.getByFoodId = async (foodId) => {
    try {
        console.log('RestaurantService.getByFoodId: Starting with foodId:', foodId);
        logger.info('Fetching restaurants by food ID', { foodId });

        console.log('RestaurantService.getByFoodId: Calling Restaurant.find');
        const restaurants = await Restaurant.find({
            'menu.food': foodId,
        }).select('name address menu');
        console.log('RestaurantService.getByFoodId: Restaurant.find result:', restaurants);

        logger.info('Restaurants fetched successfully', {
            count: restaurants.length,
            foodId,
        });

        return restaurants;
    } catch (error) {
        console.error('RestaurantService.getByFoodId: Error:', error);
        logger.error('Error fetching restaurants by food ID', {
            error: error.message,
            stack: error.stack,
            foodId,
        });
        throw error;
    }
};
