const UserService = require('../services/userService');

// ...existing code...
exports.createUser = async (req, res) => {
    try {
        const User = await UserService.create(req.body);
        res.status(201).json({ message: 'User created', User });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const User = await UserService.getById(req.params.id);
        if (!User) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json(User);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const User = await UserService.update(req.params.id, req.body);
        if (!User) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json({ message: 'User updated', User });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const success = await UserService.delete(req.params.id);
        if (!success) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};
// ...existing code...
