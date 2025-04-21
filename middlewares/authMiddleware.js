const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'No token provided', status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'User not found', status: 401 });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token', status: 401 });
    }
};

module.exports = authMiddleware;
