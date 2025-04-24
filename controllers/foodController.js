const FoodService = require('../services/foodService');
const RestaurantService = require('../services/restaurantService');
const logger = require('../utils/logger');

exports.createFood = async (req, res, next) => {
    try {
        logger.info('Creating food request received', { 
            body: req.body 
        });
        
        const food = await FoodService.create(req.body);
        logger.info('Food created successfully', { 
            foodId: food._id,
            name: food.name 
        });
        
        res.status(201).json({ message: 'Food created', food });
    } catch (error) {
        next(error);
    }
};

exports.getAllFoods = async (req, res, next) => {
    try {
        logger.info('Get all foods request received', { 
            query: req.query 
        });
        
        const foods = await FoodService.getAll(req.query);
        logger.info('Foods fetched successfully', { 
            count: foods.data.length,
            total: foods.pagination.total 
        });
        
        res.status(200).json(foods);
    } catch (error) {
        next(error);
    }
};

exports.getRandomFood = async (req, res, next) => {
    try {
        logger.info('Get random food request received');
        
        const foods = await FoodService.getAll();
        if (foods.data.length === 0) {
            logger.warn('No foods available for random selection');
            throw new AppError('No foods available', 404, 'NotFound');
        }

        const randomFood = foods.data[Math.floor(Math.random() * foods.data.length)];
        logger.info('Random food selected', { 
            foodId: randomFood._id,
            name: randomFood.name 
        });

        const restaurants = await RestaurantService.getAll();
        const relatedRestaurants = restaurants.filter((restaurant) =>
            restaurant.menu.some((item) => item.food.toString() === randomFood._id.toString())
        );

        logger.info('Related restaurants found', { 
            count: relatedRestaurants.length 
        });

        res.status(200).json({
            food: randomFood,
            restaurants: relatedRestaurants,
        });
    } catch (error) {
        next(error);
    }
};

exports.getFoodById = async (req, res, next) => {
    try {
        logger.info('Get food by ID request received', { 
            foodId: req.params.id 
        });
        
        const food = await FoodService.getById(req.params.id);
        logger.info('Food fetched successfully', { 
            foodId: food._id,
            name: food.name 
        });
        
        res.status(200).json(food);
    } catch (error) {
        next(error);
    }
};

exports.updateFood = async (req, res, next) => {
    try {
        logger.info('Update food request received', { 
            foodId: req.params.id,
            updateData: req.body 
        });
        
        const food = await FoodService.update(req.params.id, req.body);
        logger.info('Food updated successfully', { 
            foodId: food._id,
            name: food.name 
        });
        
        res.status(200).json({ message: 'Food updated', food });
    } catch (error) {
        next(error);
    }
};

exports.deleteFood = async (req, res, next) => {
    try {
        logger.info('Delete food request received', { 
            foodId: req.params.id 
        });
        
        await FoodService.delete(req.params.id);
        logger.info('Food deleted successfully', { 
            foodId: req.params.id 
        });
        
        res.status(200).json({ message: 'Food deleted' });
    } catch (error) {
        next(error);
    }
};
