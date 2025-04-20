const BadgeService = require('../services/badgeService');

exports.createBadge = async (req, res) => {
    try {
        const badge = await BadgeService.create(req.body);
        res.status(201).json({ message: 'Badge created', badge });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getAllBadges = async (req, res) => {
    try {
        const badges = await BadgeService.getAll(req.query);
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getBadgeById = async (req, res) => {
    try {
        const badge = await BadgeService.getById(req.params.id);
        if (!badge) return res.status(404).json({ error: 'NotFound', message: 'Badge not found' });
        res.status(200).json(badge);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateBadge = async (req, res) => {
    try {
        const badge = await BadgeService.update(req.params.id, req.body);
        if (!badge) return res.status(404).json({ error: 'NotFound', message: 'Badge not found' });
        res.status(200).json({ message: 'Badge updated', badge });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteBadge = async (req, res) => {
    try {
        const success = await BadgeService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'Badge not found' });
        res.status(200).json({ message: 'Badge deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
