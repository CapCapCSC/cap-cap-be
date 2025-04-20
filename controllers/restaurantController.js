const RestaurantService = require('../services/restaurantService');

// ...existing code...
exports.createRestaurant = async (req, res) => {
    try {
        const Restaurant = await RestaurantService.create(req.body);
        res.status(201).json({ message: 'Restaurant created', Restaurant });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllRestaurants = async (req, res) => {
    try {
        const Restaurants = await RestaurantService.getAll(req.query);
        res.status(200).json(Restaurants);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const Restaurant = await RestaurantService.getById(req.params.id);
        if (!Restaurant) return res.status(404).json({ error: 'NotFound', message: 'Restaurant not found' });
        res.status(200).json(Restaurant);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const Restaurant = await RestaurantService.update(req.params.id, req.body);
        if (!Restaurant) return res.status(404).json({ error: 'NotFound', message: 'Restaurant not found' });
        res.status(200).json({ message: 'Restaurant updated', Restaurant });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteRestaurant = async (req, res) => {
    try {
        const success = await RestaurantService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Restaurant not found' });
        res.status(200).json({ message: 'Restaurant deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
// ...existing code...
