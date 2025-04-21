const UserService = require('../services/userService');

exports.createUser = async (req, res) => {
    try {
        const user = await UserService.create(req.body);
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await UserService.getById(req.params.id);
        if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await UserService.update(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json({ message: 'User updated', user });
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

exports.addBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const { badgeId } = req.body;
        
        const user = await UserService.addBadge(id, badgeId);
        if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json({ message: 'Badge added to user', user });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
}

exports.addVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const { voucherId } = req.body;
        
        const user = await UserService.addVoucher(id, voucherId);
        if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.status(200).json({ message: 'Voucher added to user', user });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message });
    }
}
