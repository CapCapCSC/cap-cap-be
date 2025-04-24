const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        logger.info('Registration attempt', {
            email,
            username,
        });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('Registration failed - Email exists', { email });
            throw new AppError('Email already exists', 400, 'ValidationError');
        }

        if (!password || typeof password !== 'string') {
            logger.warn('Registration failed - Invalid password format', { email });
            throw new AppError('Invalid password format', 400, 'ValidationError');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });

        logger.info('User registered successfully', {
            userId: user._id,
            email: user.email,
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
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        logger.info('Login attempt', { email });

        const user = await User.findOne({ email }).select('+password').collation({ locale: 'en', strength: 2 }).exec();

        if (!user) {
            logger.warn('Login failed - User not found', { email });
            throw new AppError('Invalid email or password', 401, 'AuthenticationError');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn('Login failed - Invalid password', { email });
            throw new AppError('Invalid email or password', 401, 'AuthenticationError');
        }

        const tokenPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Lưu refresh token vào database
        user.refreshToken = refreshToken;
        await user.save();

        logger.info('Login successful', {
            userId: user._id,
            email: user.email,
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        logger.info('Refresh token attempt');

        if (!refreshToken) {
            logger.warn('Refresh token failed - No token provided');
            throw new AppError('No refresh token provided', 400, 'ValidationError');
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            logger.warn('Refresh token failed - Invalid token');
            throw new AppError('Invalid refresh token', 401, 'AuthenticationError');
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Cập nhật refresh token mới
        user.refreshToken = newRefreshToken;
        await user.save();

        logger.info('Token refreshed successfully', {
            userId: user._id,
        });

        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        logger.info('Logout attempt');

        if (!refreshToken) {
            logger.warn('Logout failed - No token provided');
            throw new AppError('No refresh token provided', 400, 'ValidationError');
        }

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
            logger.info('Logout successful', {
                userId: user._id,
            });
        }

        res.status(200).json({
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
};
