const RestaurantService = require('../services/restaurantService');

exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = await RestaurantService.create(req.body);
        res.status(201).json({ message: 'Restaurant created', restaurant });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantService.getAll(req.query);
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await RestaurantService.getById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'NotFound', message: 'Restaurant not found' });
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getRandom3Restaurants = async (req, res) => {
    try {
        const district = req.params.district;
        if (!district) {
            return res.status(400).json({ error: 'BadRequest', message: 'District is required' });
        }
        const restaurants = await RestaurantService.getRandom3(district);
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await RestaurantService.update(req.params.id, req.body);
        if (!restaurant) return res.status(404).json({ error: 'NotFound', message: 'Restaurant not found' });
        res.status(200).json({ message: 'Restaurant updated', restaurant });
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
