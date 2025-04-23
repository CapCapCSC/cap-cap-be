const FoodService = require('../services/foodService');

exports.createFood = async (req, res) => {
    try {
        const food = await FoodService.create(req.body);
        res.status(201).json({ message: 'Food created', food });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllFoods = async (req, res) => {
    try {
        const foods = await FoodService.getAll(req.query);
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getRandomFood = async (req, res) => {
    try {
        const foods = await FoodService.getAll();
        if (foods.length === 0) return res.status(404).json({ error: 'NotFound', message: 'No foods available' });

        const randomFood = foods[Math.floor(Math.random() * foods.length)];

        const restaurants = await RestaurantService.getAll();
        const relatedRestaurants = restaurants.filter((restaurant) =>
            restaurant.menu.some((item) => item.food.toString() === randomFood._id.toString()),
        );

        res.status(200).json({
            food: randomFood,
            restaurants: relatedRestaurants,
        });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getFoodById = async (req, res) => {
    try {
        const food = await FoodService.getById(req.params.id);
        if (!food) return res.status(404).json({ error: 'NotFound', message: 'Food not found' });
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateFood = async (req, res) => {
    try {
        const food = await FoodService.update(req.params.id, req.body);
        if (!food) return res.status(404).json({ error: 'NotFound', message: 'Food not found' });
        res.status(200).json({ message: 'Food updated', food });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteFood = async (req, res) => {
    try {
        const success = await FoodService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Food not found' });
        res.status(200).json({ message: 'Food deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
