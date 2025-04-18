const foodTagService = require('../services/foodtagsService');

exports.createFoodTag = async (req, res) => {
    try {
        const foodTag = await foodTagService.create(req.body);
        res.status(201).json({ message: 'Food tag created', foodTag });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllFoodTags = async (req, res) => {
    try {
        const foodTags = await foodTagService.getAll();
        res.status(200).json(foodTags);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getFoodTagById = async (req, res) => {
    try {
        const foodTag = await foodTagService.getById(req.params.id);
        if (!foodTag) return res.status(404).json({ error: 'NotFound', message: 'Food tag not found' });
        res.status(200).json(foodTag);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateFoodTag = async (req, res) => {
    try {
        const foodTag = await foodTagService.update(req.params.id, req.body);
        if (!foodTag) return res.status(404).json({ error: 'NotFound', message: 'Food tag not found' });
        res.status(200).json({ message: 'Food tag updated', foodTag });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteFoodTag = async (req, res) => {
    try {
        const success = await foodTagService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Food tag not found' });
        res.status(200).json({ message: 'Food tag deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};