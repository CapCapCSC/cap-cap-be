const RestaurantService = require('../services/restaurantService');
const { createGoogleMapsLink } = require('../utils/googleMaps');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.createRestaurant = async (req, res, next) => {
    try {
        logger.info('Creating new restaurant', {
            name: req.body.name,
            district: req.body.district,
            path: req.path,
            method: req.method,
        });

        const restaurant = await RestaurantService.create(req.body);

        logger.info('Restaurant created successfully', {
            restaurantId: restaurant._id,
            name: restaurant.name,
        });

        res.status(201).json({ message: 'Restaurant created', restaurant });
    } catch (error) {
        logger.error('Error creating restaurant', {
            error: error.message,
            name: req.body.name,
        });
        next(error);
    }
};

exports.getAllRestaurants = async (req, res, next) => {
    try {
        logger.info('Fetching all restaurants', {
            query: req.query,
            path: req.path,
            method: req.method,
        });

        const restaurants = await RestaurantService.getAll(req.query);

        logger.info('Restaurants fetched successfully', {
            count: restaurants.data.length,
            total: restaurants.pagination.total,
        });

        res.status(200).json(restaurants);
    } catch (error) {
        logger.error('Error fetching restaurants', {
            error: error.message,
            query: req.query,
        });
        next(error);
    }
};

exports.getRestaurantById = async (req, res, next) => {
    try {
        logger.info('Fetching restaurant by ID', {
            restaurantId: req.params.id,
            path: req.path,
            method: req.method,
        });

        const restaurant = await RestaurantService.getById(req.params.id);

        logger.info('Restaurant fetched successfully', {
            restaurantId: restaurant._id,
            name: restaurant.name,
        });

        restaurant.locationUrl = createGoogleMapsLink(restaurant.address);
        res.status(200).json(restaurant);
    } catch (error) {
        logger.error('Error fetching restaurant', {
            error: error.message,
            restaurantId: req.params.id,
        });
        next(error);
    }
};

exports.getRandom3Restaurants = async (req, res, next) => {
    try {
        const { district } = req.query;
        if (!district) {
            logger.warn('District is required for random restaurants', {
                path: req.path,
                method: req.method,
            });
            throw new AppError('District is required', 400, 'BadRequest');
        }

        logger.info('Fetching random 3 restaurants', {
            district,
            path: req.path,
            method: req.method,
        });

        const restaurants = await RestaurantService.getRandom3({ district });

        logger.info('Random restaurants fetched successfully', {
            count: restaurants.length,
            district,
        });

        res.status(200).json(restaurants);
    } catch (error) {
        logger.error('Error fetching random restaurants', {
            error: error.message,
            district: req.query.district,
        });
        next(error);
    }
};

exports.updateRestaurant = async (req, res, next) => {
    try {
        logger.info('Updating restaurant', {
            restaurantId: req.params.id,
            updateData: req.body,
            path: req.path,
            method: req.method,
        });

        const restaurant = await RestaurantService.update(req.params.id, req.body);

        logger.info('Restaurant updated successfully', {
            restaurantId: restaurant._id,
            name: restaurant.name,
        });

        res.status(200).json({ message: 'Restaurant updated', restaurant });
    } catch (error) {
        logger.error('Error updating restaurant', {
            error: error.message,
            restaurantId: req.params.id,
        });
        next(error);
    }
};

exports.deleteRestaurant = async (req, res, next) => {
    try {
        logger.info('Deleting restaurant', {
            restaurantId: req.params.id,
            path: req.path,
            method: req.method,
        });

        await RestaurantService.delete(req.params.id);

        logger.info('Restaurant deleted successfully', {
            restaurantId: req.params.id,
        });

        res.status(200).json({ message: 'Restaurant deleted' });
    } catch (error) {
        logger.error('Error deleting restaurant', {
            error: error.message,
            restaurantId: req.params.id,
        });
        next(error);
    }
};
