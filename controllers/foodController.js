const FoodService = require('../services/foodService');

// ...existing code...
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
// ...existing code...