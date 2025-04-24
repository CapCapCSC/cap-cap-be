const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '7d',
    });
};

const generateResetPasswordToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '1h',
    });
}
module.exports = { generateAccessToken, generateRefreshToken, generateResetPasswordToken };
