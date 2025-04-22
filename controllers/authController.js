const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'BadRequest', message: 'Email already exists', status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'InternalServerError', message: error.message, status: 500 });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email', status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password', status: 401 });
        }
        const payload = { id: user._id, username: user.username, email: user.email, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: payload,
        });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message, status: 500 });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Unauthorized', message: 'No refresh token provided', status: 401 });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ error: 'Forbidden', message: 'Invalid refresh token', status: 403 });
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Forbidden', message: 'Invalid refresh token', status: 403 });
            }
            const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
            const accessToken = generateAccessToken(payload);
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message, status: 500 });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'BadRequest', message: 'No refresh token provided', status: 400 });
        }
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = '';
            await user.save();
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'InternalServerError', message: error.message, status: 500 });
    }
};
