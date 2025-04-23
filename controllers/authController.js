const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Email already exists',
            });
        }

        if (!password || typeof password !== 'string') {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Invalid password format',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'user',
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
        } catch (createError) {
            if (createError.code === 11000) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Email already exists',
                });
            }
            throw createError;
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Email already exists',
            });
        }
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password').collation({ locale: 'en', strength: 2 }).exec();

        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid email or password',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison:', {
            input: password,
            stored: user.password,
            match: isMatch,
        });

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid email or password',
            });
        }

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });

        res.status(200).json({
            accessToken,
            userId: user._id,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
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
