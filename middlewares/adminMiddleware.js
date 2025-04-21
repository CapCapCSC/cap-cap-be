const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden', message: 'Admin access required', status: 403 });
    }
};

module.exports = adminMiddleware;
